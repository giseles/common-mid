// @ts-ignore
import React, { memo } from "react"
// @ts-ignore
import { PageHeader as AntdPageHeader } from "antd"
import "antd/es/pageHeader/style"

export const PageHeader = memo((props) => {
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
    <AntdPageHeader
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
