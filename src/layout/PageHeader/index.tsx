import React, { memo } from "react"
import { PageHeader } from "antd"
import "antd/es/page-header/style"

/**
 * @name  页头
 * @param  {Object} 配置项
 * @example
 * <MidPageHeader
    {...restProps}
    className={border ? styles.header : styles.headerNoBorder}
    onBack={onBack || commonBack}
    isShowBack={backInfo || onBack}
  />
 */
export const MidPageHeader = memo((props: any) => {
  const { onBack, isShowBack = true, ...restProps } = props
  //   const { title, subTitle, extra, avatar, style, className} = restProps

  return <PageHeader onBack={isShowBack && onBack} {...restProps} />
})
