// @ts-ignore
import React from "react"
// @ts-ignore
import { Descriptions, Tooltip } from "antd"
// @ts-ignore
import { isNil } from "common-screw"
import "antd/es/descriptions/style"
import "antd/es/tooltip/style"

export const MidDescTable = (props: any) => {
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

        const show = render
          ? render(dataSource[dataIndex], dataSource)
          : dataSource[dataIndex]
        return (
          <Descriptions.Item key={index} {...rest} label={label}>
            {!isNil(show) && show.length > 6 ? (
              <Tooltip title={show} placement="topLeft">
                {show}
              </Tooltip>
            ) : (
              show
            )}
          </Descriptions.Item>
        )
      })}
    </Descriptions>
  )
}
