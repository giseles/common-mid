import React, { memo } from "react"
import { Button } from "antd"
import { isNil } from "common-screw"

export const MidBtnGroup = memo((props: any) => {
  const { className, list, children, property } = props
  return (
    <Button.Group className={className} {...property}>
      {!isNil(list) &&
        list.map((item: any, index: any) => {
          const { type, isHide = false } = item
          if (type === "btn") {
            return (
              !isHide && (
                <Button
                  key={index}
                  icon={item.icon}
                  onClick={item.onClick}
                  {...item.property}
                >
                  {item.name}
                </Button>
              )
            )
          } else {
            return !isHide && item.content
          }
        })}
      {children}
    </Button.Group>
  )
})
