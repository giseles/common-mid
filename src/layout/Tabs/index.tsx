import React, { memo } from "react"
import { Tabs } from "antd"

interface Props {
  [key: string]: any // 参数
}

/**
 * @name  标签页
 * @param  {Props} 配置项
 * @example
 * <MidTabs className={styles.wrap} {...props} />
 */
export const MidTabs = memo((props: Props) => <Tabs {...props} />)
