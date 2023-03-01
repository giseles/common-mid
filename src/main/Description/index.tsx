import React from "react"
import { Descriptions, Tooltip } from "antd"
import { isNil } from "common-screw"
import { LooseObject } from "../../index"
// import "antd/es/descriptions/style"
// import "antd/es/tooltip/style"

interface Props {
  className?: string // class名称
  descProps?: LooseObject // 描述列表属性
  column: {
    label: string
    dataIndex: string
    icon?: any
    render?: any
    [key: string]: any
  }[] // 内容的描述(名称、图标等)
  dataSource: LooseObject // 内容的数据
  title?: string // 标题
  extra?: any // 操作区域
}

/**
 * @name  描述列表
 * @param  {Props} 配置项
 * @example
 * <MidDescription {...props} className={styles.wrap} />)
 */
export const MidDescription = (props: Props) => {
  const { column, dataSource, descProps, className } = props
  return (
    <Descriptions {...descProps} className={className}>
      {column.map((item: any, index: number) => {
        if (item.hide) return null
        const { dataIndex, render, icon, ...rest } = item
        let label = icon ? (
          <>
            {icon}
            {item.label}
          </>
        ) : (
          item.label
        )

        const content = render
          ? render(dataSource[dataIndex], dataSource)
          : dataSource[dataIndex]
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
  )
}
