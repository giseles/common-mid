// @ts-ignore
import React from "react"
// @ts-ignore
import { Descriptions, Tooltip } from "antd"
// @ts-ignore
import { isNil } from "common-screw"

const DescTable = (props: any) => {
  const { column, dataSource, descProps } = props
  return (
    <Descriptions {...descProps}>
      {column.map((item: any, index: number) => {
        const { dataIndex, render, icon, ...rest } = item
        let label = item.label
        if (icon)
          label = (
            <div>
              {icon}
              {label}
            </div>
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

export default DescTable
