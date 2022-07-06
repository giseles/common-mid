import React, { memo } from "react"
import { PageHeader } from "antd"
import "antd/es/page-header/style"

export const MidPageHeader = memo((props) => {
  const { title, subTitle, backUrl, extra, avatar, style, className, onBack } =
    props

  return (
    <PageHeader
      className={className}
      onBack={backUrl && onBack}
      title={title}
      subTitle={subTitle}
      extra={extra}
      avatar={avatar}
      style={style}
    />
  )
})
