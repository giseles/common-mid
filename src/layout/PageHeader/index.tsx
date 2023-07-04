import React, { memo } from "react"
import { Space, Button } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"

interface Props {
  className?: string // class名称
  style?: any // 样式
  title: string // 主标题
  subTitle?: string // 副标题
  href?: any // 返回链接
  extra?: any // 操作区
}

/**
 * @name  页头
 * @param  {Props} 配置项
 * @example
 * <MidPageHeader
      className={styles.wrap}
      style={style}
      title={title}
      href={href}
      subTitle={subTitle}
      extra={extra}
    />
 */
export const MidPageHeader = memo((props: Props) => {
  const { className, style, title, subTitle, href, extra } = props
  return (
    <div className={className} style={style}>
      <Space size="small">
        {href && (
          <Button type="text" icon={<ArrowLeftOutlined />} href={href} />
        )}
        {title}
        {subTitle && <span>{subTitle}</span>}
      </Space>
      {extra}
    </div>
  )
})
