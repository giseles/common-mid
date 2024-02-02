import React, { useState } from "react"
import { Descriptions, Spin, Tooltip } from "antd"
import { useDeepCompareEffect } from "common-hook"
import { getObjKey, isNil } from "common-screw"

interface Props {
  className?: string // class名称
  dataSource: { [key: string]: any } // 内容的数据
  spinning?: boolean // 加载中
  nullShow?: string // 对象属性不存在返回值 '-'
  property?: {
    column?: number // 一行的数量
    bordered?: boolean // 边框
    colon?: boolean // 冒号
    title?: string // 标题
    extra?: any // 操作区域
    [key: string]: any
  } // 描述列表属性
  column: {
    label: string
    name: string
    icon?: any
    optionList?: any
    render?: any
    [key: string]: any
  }[] // 内容的描述(名称、图标等)
}

/**
 * @name  描述列表
 * @param  {Props} 配置项
 * @example
 * <MidDescription {...props} className={styles.wrap} />)
 */
export const MidDescription = (props: Props) => {
  const {
    nullShow = "-",
    column = [],
    dataSource,
    property,
    className,
    spinning = false
  } = props
  const [items, setItems] = useState([])

  useDeepCompareEffect(() => {
    const items: any = []
    for (let i = 0, len = column.length; i < len; i++) {
      const item = column[i]
      const {
        label,
        name,
        render,
        icon = null,
        optionList,
        hide = false,
        ...rest
      } = item
      if (hide) continue
      const value = dataSource[name]
      const itemLabel = (
        <>
          {icon}
          {label}
        </>
      )

      let _ = value
      if (optionList) {
        _ = getObjKey(optionList, value, nullShow)
      } else if (render) {
        _ = render(value, dataSource)
      }

      if (isNil(_) || _ === nullShow) {
        _ = nullShow
      } else {
        _ = (
          <Tooltip title={_} placement="topLeft">
            {_}
          </Tooltip>
        )
      }

      items.push({
        key: name,
        label: itemLabel,
        children: _,
        ...rest
      })
    }

    setItems(items)
  }, [dataSource, column, nullShow])

  return (
    <Spin spinning={spinning}>
      <Descriptions {...property} className={className} items={items} />
    </Spin>
  )
}
