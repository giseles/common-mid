import React, { memo, useState } from "react"
import { Button, Table, Space } from "antd"
import { useDeepCompareEffect } from "common-hook"
import { isNil } from "common-screw"
import "antd/es/table/style"

export const MidTable = memo((props: any) => {
  const {
    className,
    columns,
    onHandle,
    tableBtnList,
    permissionList,
    btnProps = {},
    pageProps = { showPage: true },
    selectionProps = { isShow: false },
    ...restProps
  } = props
  const [newColumns, setNewColumns] = useState(columns)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  useDeepCompareEffect(() => {
    // 修改表格列表
    if (columns.length === 0) return
    let newColumns: any = []

    columns.forEach((item: any) => {
      !item.hide && newColumns.push(item)
    })

    if (columns[columns.length - 1].key !== "operate") {
      // 表格中最后一列key不为operate
      setNewColumns(newColumns)
      return
    }
    const tablePermission = toTablePer(permissionList, tableBtnList)
    if (isNil(tablePermission)) {
      // 表格无操作权限
      newColumns.pop()
      setNewColumns(newColumns)
      return
    }

    const render = (_: any, item: any) => {
      const btnList = columns[columns.length - 1].btnList
      const specialList: any = []
      const special = btnList?.map((btnItem: any) => {
        specialList.push(btnItem.type)
        return (
          <Button
            key={btnItem.type}
            {...btnProps}
            {...btnItem.btnProps}
            onClick={() => btnItem.onClick(btnItem.type, item)}
          >
            {btnItem.name}
          </Button>
        )
      })
      const res = tablePermission.map((type: any) => {
        if (!specialList.includes(type)) {
          const value = tableBtnList[type]
          let name = ""
          let disabled = false

          switch (value.type) {
            case "able":
              name =
                item[value.key] === value.ableValue
                  ? value.ableName
                  : value.disAbleName
              break
            case "revoke":
              name = value.name
              disabled = value.isEqual
                ? item[value.key] === value.value
                : item[value.key] !== value.value
              break
            default:
              name = value.name
          }
          return (
            <Button
              key={type}
              disabled={disabled}
              {...btnProps}
              {...value.btnProps}
              onClick={() => onHandle(type, item)}
            >
              {name}
            </Button>
          )
        }
        return null
      })
      return (
        <Space>
          {special}
          {res}
        </Space>
      )
    }
    newColumns[newColumns.length - 1] = {
      width: 50,
      render,
      fixed: "right",
      ...newColumns[newColumns.length - 1]
    }
    setNewColumns(newColumns)
  }, [permissionList, columns, tableBtnList])

  const toTablePer = (permissionList: any, tableBtnList: any) => {
    const per: any = []
    tableBtnList &&
      Object.keys(permissionList).forEach((key) => {
        if (tableBtnList.hasOwnProperty(key)) {
          per.push(key)
        }
      })
    return per
  }
  useDeepCompareEffect(() => {
    // 清空全选数据
    selectionProps.isShow && setSelectedRowKeys([])
  }, [restProps.dataSource, selectionProps.isShow])

  const rowSelection = {
    // 全选属性
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record: any) => ({
      disabled: tableBtnList["revoke"].isEqual
        ? record[tableBtnList["revoke"].key] === tableBtnList["revoke"].value
        : record[tableBtnList["revoke"].key] !== tableBtnList["revoke"].value
    })
  }

  return (
    <div className={className}>
      {selectionProps.isShow && (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            disabled={selectedRowKeys.length <= 0}
            onClick={() => {
              selectionProps.onHandle(selectedRowKeys)
            }}
          >
            {selectionProps.name}
          </Button>
          <span style={{ marginLeft: 8 }}>
            {selectedRowKeys.length > 0
              ? `已选择 ${selectedRowKeys.length} 项数据`
              : ""}
          </span>
        </div>
      )}

      <Table
        bordered
        pagination={
          pageProps.showPage && {
            defaultCurrent: 1,
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: any) => `共 ${total} 条记录`,
            current: pageProps.current,
            pageSize: pageProps.pageSize,
            total: pageProps.total
          }
        }
        columns={newColumns}
        rowKey={(record) => record.id}
        scroll={{ x: true }}
        rowSelection={selectionProps.isShow && rowSelection}
        {...restProps}
      />
    </div>
  )
})
