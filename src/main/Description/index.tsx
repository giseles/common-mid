import React from "react"
import { Descriptions, Tooltip } from "antd"
import { isNil } from "common-screw"
import "antd/es/descriptions/style"
import "antd/es/tooltip/style"

/**
 * @name  描述列表
 * @param  {Object} 配置项
 * @example
 * <MidDescription {...props} className={styles.wrap} />)
 */
export const MidDescription = (props: any) => {
  const { column, dataSource, descProps, className } = props
  return (
    <Descriptions {...descProps} className={className}>
      {column.map((item: any, index: number) => {
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
