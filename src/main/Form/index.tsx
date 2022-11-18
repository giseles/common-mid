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
import { LooseObject } from "../../index"
import { getFlatData } from "../../_utils"

const { Item } = Form
const { Option } = Select

interface Props {
  formProps: { className?: string; [key: string]: any } // 表单属性
  formRules: LooseObject // 表单验证规则
  formList: {
    label: string
    name: string
    type?: any
    [key: string]: any
  }[] // 表单描述
  initialValues: LooseObject // 表单数据
  componentProps: {
    BaseUpload: any
    Message: any
    Encrypt: any
    RichText: any
  } // 组件
  formHandle: {
    monitorList: string[]
    setFormValue: object
    getFormValue: (vs: string, values: object) => void
  } // 特殊操作
  btnProps: {
    submitName: string
    returnName: string
    isShowReturn: boolean
    loading: boolean
    setLoading: (value: boolean) => void
    onBack: () => void
    onSubmit: (value: object) => void
  } // 按钮信息(名称、显示、loading、提交等)
  children?: any // 子元素
}

/**
 * @name  表单
 * @param  {Props} 配置项
 * @example
 * <MidForm
    formRules={formRules}
    componentProps={componentProps}
    formProps={formProps}
    btnProps={btnProps}
    {...restProps}
  />
 */

export const MidForm = memo((props: Props) => {
  const {
    formProps,
    formRules,
    formList,
    initialValues = {},
    componentProps: { BaseUpload, Encrypt, RichText },
    formHandle: { monitorList = [], setFormValue = {}, getFormValue = null },
    btnProps
  } = props

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
    !isNil(setFormValue) && form.setFieldsValue(setFormValue)
  }, [setFormValue])

  const onValuesChange = (vs: any, values: any) => {
    btnProps.loading && btnProps.setLoading(false)
    monitorList &&
      getFormValue &&
      monitorList.includes(Object.keys(vs)[0]) &&
      getFormValue(Object.keys(vs)[0], values)
  }

  const onFinish = (values: any) => {
    btnProps.setLoading(true)
    const flatForm = getFlatData(formList)
    Object.keys(values).forEach((key) => {
      const value = values[key]
      const formProps = flatForm[key] || {}
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
        case "confirmPassword":
          delete values[key]
          break
        case "newPassword":
          if (values[key]) values[key] = Encrypt(value)
          break
        case "richText":
          values[key] = value.toHTML ? value.toHTML() : value
          break
        case "upload":
          const title =
            document.getElementsByClassName("ant-upload-list-item-name")[0] // @ts-ignore
              ?.innerText || undefined
          values.fileName = title
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
        case "confirmPassword":
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
              {...item.property}
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
          ele = <Input.TextArea allowClear placeholder={placeholder} rows={2} />
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
              disabledDate={item.disabledDate && disabledDate}
            />
          )
          break
        case "timeRange":
          ele = (
            <TimePicker.RangePicker
              // @ts-ignore
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
        case "diy":
          ele = item.show
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
