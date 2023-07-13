import React, { memo, useState } from "react"
import { Space, Table } from "antd"
import { useDeepCompareEffect } from "common-hook"
import { isNil } from "common-screw"

const toTablePer = (permissionList: any, tableBtnList: any) => {
  const per: any = []
  tableBtnList &&
    Object.keys(tableBtnList).forEach((key) => {
      if (permissionList.hasOwnProperty(key)) {
        per.push(key)
      }
    })
  return per
}
const DEFAULT_LANG_LIST = {
  "zh-CN": {
    TOTAL: (value: any) => `共 ${value} 条记录`,
    SELECT_TIP: (value: any) => `已选择 ${value} 项数据`
  },
  "en-US": {
    TOTAL: (value: any) => `Total ${value} items`,
    SELECT_TIP: (value: any) => `Selected ${value} items`
  }
}

export const MidTable = memo((props: any) => {
  const {
    language,
    langList = DEFAULT_LANG_LIST,
    className,
    Button,
    columns,
    onHandle,
    tableBtnList,
    permissionList,
    btnProps = {},
    pageProps = { showPage: true, props: {} },
    selectionProps = { isShow: false },
    toHref,
    ...restProps
  } = props
  const [col, setCol] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // 默认第一个语言包
  const [LANG, setLANG] = useState(langList[Object.keys(langList)[0]])

  useDeepCompareEffect(() => {
    // 语言国际化 ,如果没有对应语言包，默认第一个语言包
    const list = Object.keys(langList)
    const e = language && list.includes(language) ? language : list[0]
    setLANG(langList[e])
  }, [langList, language])

  useDeepCompareEffect(() => {
    // 修改表格列表
    if (columns.length === 0) return
    let col: any = []

    columns.forEach((item: any) => {
      const { label, name, hide, ...rest } = item
      !hide &&
        col.push({
          title: label,
          dataIndex: name,
          key: name,
          ...rest
        })
    })

    const lastOne = col.length - 1
    if (col[lastOne].dataIndex !== "operate") {
      // 表格中最后一列不是operate
      setCol(col)
      return
    }
    const tablePermission = toTablePer(permissionList, tableBtnList)
    if (isNil(tablePermission)) {
      // 表格无操作权限
      col.pop()
      setCol(col)
      return
    }

    const render = (_: any, item: any) => {
      const btnList = columns[columns.length - 1].btnList // 自定义按钮
      const specialList: any = []
      const special = btnList?.map((btnItem: any) => {
        if (btnItem.hide) return null
        specialList.push(btnItem.type)
        return (
          <Button
            key={btnItem.type}
            {...btnProps}
            disabled={
              btnItem.disabledIsShow &&
              item[btnItem.disabledIsShow.key] !== btnItem.disabledIsShow.value
            }
            onClick={() => btnItem.onClick(btnItem.type, item)}
            name={btnItem.name}
            {...btnItem.btnProps}
          />
        )
      })
      const res = tablePermission.map((type: any) => {
        if (!specialList.includes(type)) {
          const value = tableBtnList[type]

          const disabled = value.toDisable?.(item) || false
          const name = value.name || value.toName?.(item)

          return (
            <Button
              key={type}
              disabled={disabled}
              {...btnProps}
              href={toHref[type] && toHref[type](item)}
              onClick={() => onHandle(type, item)}
              name={name}
              {...value.btnProps}
            />
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
    col[lastOne] = {
      width: 50,
      render,
      fixed: "right",
      ...col[lastOne]
    }
    setCol(col)
  }, [permissionList, columns, tableBtnList, toHref])

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
            name={selectionProps.name}
          />

          <span style={{ marginLeft: 8 }}>
            {selectedRowKeys.length > 0 &&
              LANG.SELECT_TIP(selectedRowKeys.length)}
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
            showTotal: (total: any) => LANG.TOTAL(total),
            current: pageProps.current,
            pageSize: pageProps.pageSize,
            total: pageProps.total,
            ...pageProps
          }
        }
        columns={col}
        rowKey={(record) => record.id}
        scroll={{ x: true }}
        rowSelection={selectionProps.isShow && rowSelection}
        {...restProps}
      />
    </div>
  )
})
