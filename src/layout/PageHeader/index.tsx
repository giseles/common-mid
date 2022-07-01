// @ts-ignore
import React, { memo } from "react"
// @ts-ignore
import { PageHeader as AntdPageHeader } from "antd"

export const PageHeader = ({ ...props }) => {
  const {
    title,
    subTitle,
    backUrl,
    extra,
    avatar,
    border,
    style,
    userOnBack = null
  } = props

  const onBack = () => {
    if (typeof backUrl === "function") backUrl()
  }

  return (
    <AntdPageHeader
      onBack={userOnBack || (backUrl && onBack)}
      title={title}
      subTitle={subTitle}
      extra={extra}
      avatar={avatar}
      style={style}
    />
  )
}

// export default memo(PageHeader)
