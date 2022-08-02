import React, { memo } from "react"
import { Button } from "antd"
import { isNil } from "common-screw"

/**
 * @name  按钮群组
 * @param  {Object} config MidBtnGroup 配置
 * @example
 * <MidBtnGroup
    className={styles.group}
    list={list}
    children={children}
    property={{ size: 'large' }}
  />
 */
export const MidBtnGroup = memo((props: any) => {
  const { className, list, children, property } = props
  return (
    <Button.Group className={className} {...property}>
      {!isNil(list) &&
        list.map((item: any, index: any) => {
          const { type, hide = false } = item
          if (type === "btn") {
            return (
              !hide && (
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
            return !hide && item.content
          }
        })}
      {children}
    </Button.Group>
  )
})
