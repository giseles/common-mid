import React, { memo, useState } from "react"
import { Button, Table, Space } from "antd"
import useDeepCompareEffect from "use-deep-compare-effect"
import { toEnumArray } from "common-screw"
import "antd/es/table/style"

export const MidTable = memo((props: { [x: string]: any }) => {
  const {
    className,
    current,
    pageSize,
    total,
    columns,
    onHandle,
    selection,
    onHandleAll,
    showPage = true,
    permissionList,
    BUTTON_LIST,
    ...restProps
  } = props
  const [newColumns, setNewColumns] = useState(columns)
  useDeepCompareEffect(() => {
    // console.log('修改表格列表');
    if (columns.length === 0) return
    let newColumns: any = [...columns]
    if (columns[columns.length - 1].key !== "operate") {
      setNewColumns(newColumns)
      return
    }
    const list = { ...permissionList }
    const buttonList = toEnumArray(list || {})
    let btnNum: any = 1
    const render = (_: any, item: any) => {
      const res = buttonList.map((data: any) => {
        const type = data.id
        if (type === "able") {
          btnNum++
          return (
            <Button
              key={type}
              type="primary"
              size="small"
              onClick={() => onHandle(type, item)}
            >
              {item.state === 0 ? "禁用" : "启用"}
            </Button>
          )
        } else if (BUTTON_LIST.hasOwnProperty(type)) {
          btnNum++
          return (
            <Button
              key={type}
              type="primary"
              size="small"
              onClick={() => onHandle(type, item)}
            >
              {BUTTON_LIST[type]}
            </Button>
          )
        } else return null
      })
      return <Space>{res}</Space>
    }
    // console.log(render)
    newColumns[newColumns.length - 1].render = render
    newColumns[newColumns.length - 1].width = btnNum * 80
    setNewColumns(newColumns)
  }, [permissionList, columns])

  return (
    <Table
      className={className}
      bordered
      pagination={{
        defaultCurrent: 1,
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: any) => `共 ${total} 条记录`,
        current,
        pageSize,
        total
      }}
      columns={newColumns}
      rowKey={(record: any) => record.id}
      scroll={{ x: true }}
      {...restProps}
    />
  )
})
