import React, { memo } from "react"
import { Card } from "antd"

interface Props {
  children?: any // 内容
  [key: string]: any // 参数
}

/**
 * @name  卡片
 * @param  {Props} 配置项
 * @example
 * <MidCard className={styles.wrap} {...props} />
 */
export const MidCard = memo((props: Props) => {
  const { children, ...rest } = props
  return <Card {...rest}>{children}</Card>
})
