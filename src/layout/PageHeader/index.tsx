import React, { memo } from "react"
import { PageHeader } from "antd"
// import "antd/es/page-header/style"

interface Props {
  className?: string // class名称
  onBack?: any // 返回按钮的点击事件
  title: string // 主标题
  subTitle?: string // 副标题
  extra?: any // 操作区
  avatar?: any // 标题栏旁的头像
  style?: any // 样式
  tags?: any // title旁的tag
}

/**
 * @name  页头
 * @param  {Props} 配置项
 * @example
 * <MidPageHeader
    {...restProps}
    className={border ? styles.header : styles.headerNoBorder}
    onBack={onBack || commonBack}
  />
 */
export const MidPageHeader = memo((props: Props) => <PageHeader {...props} />)
