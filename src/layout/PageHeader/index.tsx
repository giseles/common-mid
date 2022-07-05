import React, { memo } from "react"
import { PageHeader } from "antd"
import "antd/es/page-header/style"

export const MidPageHeader = memo((props) => {
  const {
    title,
    subTitle,
    backUrl,
    extra,
    avatar,
    border,
    style,
    userOnBack = null,
    className
  } = props

  const onBack = () => {
    if (typeof backUrl === "function") backUrl()
  }

  return (
    <PageHeader
      className={className}
      onBack={userOnBack || (backUrl && onBack)}
      title={title}
      subTitle={subTitle}
      extra={extra}
      avatar={avatar}
      style={style}
    />
  )
})
