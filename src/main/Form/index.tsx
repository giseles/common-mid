import React, { useState, memo, useRef } from "react"
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Cascader,
  TimePicker
} from "antd"
import { useDeepCompareEffect } from "common-hook"
import { isNil } from "common-screw"
import "antd/es/form/style"
import { getFlatData } from "../../_utils"

const { Item } = Form
const { Option } = Select

/**
 * @name  表单
 * @param  {Object} 配置项
 * @example
 * <MidForm
    formRules={formRules}
    componentProps={componentProps}
    formProps={formProps}
    btnProps={btnProps}
    {...restProps}
  />
 */
export const MidForm = memo((props: any) => {
  const {
    initialValues = {},
    formList,
    formRules,
    formProps,
    componentProps,
    formHandle,
    btnProps = {
      submitName: "提交",
      returnName: "返回",
      isShowReturn: true
    }
  } = props
  const { BaseUpload, Encrypt, RichText } = componentProps
  const { setValue = null, targetName = null, valuesChange = null } = formHandle

  const [renderItem, setRenderItem] = useState(<></>)
  const FormRef: any = useRef(null)
  const [form] = Form.useForm()

  useDeepCompareEffect(() => {
    FormRef && FormRef.current && FormRef.current.resetFields()
  }, [initialValues])

  useDeepCompareEffect(() => {
    setRenderItem(toRenderItem(formList))
  }, [formList])
  useDeepCompareEffect(() => {
    !isNil(setValue) && form.setFieldsValue(setValue)
  }, [formHandle])

  const onValuesChange = (vs: any, values: any) => {
    btnProps.loading && btnProps.setLoading(false)
    targetName &&
      valuesChange &&
      targetName.includes(Object.keys(vs)[0]) &&
      valuesChange(Object.keys(vs)[0], values)
  }

  const onFinish = (values: any) => {
    btnProps.setLoading(true)
    const flatForm = getFlatData(formList)
    Object.keys(values).forEach((key) => {
      const value = values[key]
      const formProps = flatForm[key]
      const type = formProps.type
      switch (type) {
        case "date":
          values[key] = value.format("YYYY-MM-DD")
          break
        case "dateAndTime":
          values[key] = value.format("YYYY-MM-DD HH:mm:ss")
          break
        case "timeRange":
          values[key] = [
            value[0].format("HH:mm:ss"),
            value[1].format("HH:mm:ss")
          ]
          break
        case "password":
        case "passwordAgain":
          values[key] = Encrypt(value)
          break
        case "richText":
          values[key] = value.toHTML ? value.toHTML() : value
          break
        case "cascader":
          // 级联选择
          const { valueName } = formProps
          if (valueName) {
            valueName.forEach((childItem: any, childIndex: any) => {
              values[childItem] = value?.[childIndex] || undefined
            })
            delete values[key]
          }
          break
        default:
      }
    })
    btnProps.onSubmit(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
  }

  const disabledDate = (current: any) => {
    return current < new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  }

  const toRenderItem = (formList: any) => {
    return formList?.map((item: any) => {
      if (item.hide) return null
      let { type, rules = [], placeholder = `请输入${item.label}` } = item

      const itemProps = {
        key: item.name,
        label: item.label,
        name: item.name,
        rules: [...(formRules[type] || []), ...rules]
      }
      let ele: any = <></>
      let pickPlaceholder = `请选择${item.label}`

      switch (type) {
        case "password":
        case "newPassword":
          if (type === "newPassword")
            placeholder = placeholder + "，若不修改 请留空"
          ele = (
            <Input.Password
              placeholder={placeholder}
              autoComplete="new-password"
            />
          )

          break
        case "select":
        case "selectNoRequired":
          const optionList = item.optionList || []
          const keyValue = item.keyValue || ["id", "value"]
          ele = (
            <Select
              placeholder={pickPlaceholder}
              allowClear
              disabled={item.disabled}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {optionList.map((r: any) => {
                return (
                  <Option key={r[keyValue[0]]} value={r[keyValue[0]]}>
                    {r[keyValue[1]]}
                  </Option>
                )
              })}
            </Select>
          )

          break
        case "remark":
          ele = <Input.TextArea allowClear placeholder={placeholder} />
          break
        case "date":
          ele = (
            <DatePicker
              placeholder={pickPlaceholder}
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              style={{ width: "100%" }}
            />
          )
          break
        case "dateAndTime":
          ele = (
            <DatePicker
              showTime
              placeholder={pickPlaceholder}
              disabledDate={disabledDate}
            />
          )
          break
        case "timeRange":
          // @ts-ignore
          ele = (
            <TimePicker.RangePicker
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          )
          break
        case "upload":
          ele = (
            <BaseUpload
              type={item.uploadType}
              limits={item.limits}
              tip={item.tip}
            />
          )
          break
        case "cascader":
          ele = (
            <Cascader
              options={item.optionList}
              changeOnSelect={item.changeOnSelect || false}
              // @ts-ignore
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          )
          break
        case "richText":
          ele = <RichText />
          break
        default:
          ele = (
            <Input allowClear placeholder={placeholder} {...item.property} />
          )
      }
      return <Item {...itemProps}>{ele}</Item>
    })
  }
  return (
    <Form
      form={form}
      ref={FormRef}
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      {...formProps}
    >
      {renderItem}
      {props.children}
      <Item
        style={{ textAlign: "center" }}
        wrapperCol={{
          span: formProps.labelCol.span + formProps.wrapperCol.span
        }}
      >
        {btnProps.isShowReturn && (
          <Button onClick={btnProps.onBack}>{btnProps.returnName}</Button>
        )}
        <Button type="primary" htmlType="submit" loading={btnProps.loading}>
          {btnProps.submitName}
        </Button>
      </Item>
    </Form>
  )
})
