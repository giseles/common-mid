import React from "react"
import { Descriptions, Tooltip, Spin } from "antd"
import { isNil } from "common-screw"

interface Props {
  className?: string // class名称
  dataSource: { [key: string]: any } // 内容的数据
  spinning?: boolean // 加载中
  property?: {
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
    column = [],
    dataSource,
    property,
    className,
    spinning = false
  } = props
  return (
    <Spin spinning={spinning}>
      <Descriptions {...property} className={className}>
        {column.map((item: any, index: number) => {
          if (item.hide) return null
          const { name, render, icon, ...rest } = item
          let label = icon ? (
            <>
              {icon}
              {item.label}
            </>
          ) : (
            item.label
          )

          const content = render
            ? render(dataSource[name], dataSource)
            : dataSource[name]
          return (
            <Descriptions.Item key={index} {...rest} label={label}>
              {!isNil(content) && content.length > 6 ? (
                <Tooltip title={content} placement="topLeft">
                  {content}
                </Tooltip>
              ) : (
                content
              )}
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    </Spin>
  )
}
