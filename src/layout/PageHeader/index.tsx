import React, { memo } from "react"
import { PageHeader } from "antd"
import "antd/es/page-header/style"

export const MidPageHeader = memo((props: any) => {
  const { onBack, isShowBack = true, ...restProps } = props
  //   const { title, subTitle, extra, avatar, style, className, onBack, isShowBack = true } = props

  return <PageHeader onBack={isShowBack && onBack} {...restProps} />
})
