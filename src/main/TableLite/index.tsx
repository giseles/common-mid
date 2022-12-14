import React, { memo, useState } from "react"
import { Button, Table, Space } from "antd"
import { useDeepCompareEffect } from "common-hook"
import { isNil } from "common-screw"
import "antd/es/table/style"

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
    TOTAL: (value: any) => `共 ${value} 条记录`
  },
  "en-US": {
    TOTAL: (value: any) => `Total ${value} items`
  }
}

export const MidTableLite = memo((props: any) => {
  const {
    language,
    langList = DEFAULT_LANG_LIST,
    className,
    columns,
    onHandle,
    tableBtnList,
    permissionList,
    btnProps = {},
    pageProps = { showPage: true },
    ...restProps
  } = props
  const [newColumns, setNewColumns] = useState(columns)

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
            {...btnItem.btnProps}
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
              onClick={() => onHandle(type, item)}
              {...value.btnProps}
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

  return (
    <div className={className}>
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
            total: pageProps.total
          }
        }
        columns={newColumns}
        rowKey={(record) => record.id}
        scroll={{ x: true }}
        {...restProps}
      />
    </div>
  )
})
