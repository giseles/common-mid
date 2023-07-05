import React, { memo } from "react"

/**
 * @name  高阶表单
 * @param  {Object} 配置项
 * @example
 * <MidProForm
      componentProps={componentProps}
      headerProps={headerProps}
      formProps={formProps} 
   />  
 */
export const ProForm = memo((props: any) => {
  const { componentProps, headerProps, formProps } = props
  const { Header, Form } = componentProps
  return (
    <>
      {headerProps.subTitle && <Header {...headerProps} />}
      <Form {...formProps} />
    </>
  )
})
