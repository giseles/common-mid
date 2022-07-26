import React, { useCallback, memo } from "react"

export const ProForm = memo((props: any) => {
  const {
    className,
    componentProps,
    headerProps,
    formProps,
    onSubmit,
    onBack,
    setLoading
  } = props
  const { Header, Form } = componentProps
  // const { title, subTitle, backInfo } = headerProps
  // const { initialValues, formList, returnName, loading } = formProps

  return (
    <div className={className}>
      {headerProps.subTitle && <Header {...headerProps} />}
      <Form
        {...formProps}
        onSubmit={useCallback((data: any) => onSubmit(data), [onSubmit])}
        onBack={onBack}
        setLoading={useCallback((data: any) => setLoading(data), [setLoading])}
      >
        {props.children}
      </Form>
    </div>
  )
})
