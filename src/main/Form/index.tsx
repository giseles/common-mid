import React, { useState, memo, useRef } from "react"
import { Form, Input, Button, Select, DatePicker, Cascader } from "antd"
import { useDeepCompareEffect } from "common-hook"
import moment from "moment"
import "antd/es/form/style"
import { getFlatData } from "../../_utils"

const { Item } = Form
const { Option } = Select

export const MidForm = memo((props: any) => {
  const {
    initialValues = {},
    formList,
    formRules,
    formProps,
    componentProps,
    btnProps = {
      submitName: "提交",
      returnName: "返回",
      isShowReturn: true
    }
  } = props
  const { BaseUpload, Encrypt } = componentProps

  const [renderItem, setRenderItem] = useState(<></>)
  const FormRef: any = useRef(null)
  const [form] = Form.useForm()

  useDeepCompareEffect(() => {
    FormRef && FormRef.current && FormRef.current.resetFields()
  }, [initialValues])

  useDeepCompareEffect(() => {
    setRenderItem(toRenderItem(formList))
  }, [formList])

  const onFinish = (values: any) => {
    btnProps.setLoading(true)
    const flatForm = getFlatData(formList)
    Object.keys(values).forEach((key) => {
      console.log(key)
      const value = values[key]
      const formValue = flatForm[key]
      const type = formValue.type
      switch (type) {
        case "date":
          values[key] = value.format("YYYY-MM-DD")
          break
        case "dateAndTime":
          values[key] = value.format("YYYY-MM-DD HH:mm:ss")
          break
        case "password":
        case "passwordAgain":
          values[key] = Encrypt(value)
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
    return current < moment().subtract(1, "day")
  }

  const onValuesChange = (vs: any, values: any) => {
    btnProps.loading && btnProps.setLoading(false)
  }

  const toRenderItem = (formList: any) => {
    return formList?.map((item: any) => {
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
              onChange={(e) => {
                item.onChange && item.onChange(e)
              }}
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
              style={{ width: "100%" }}
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
          ele = <Cascader options={item.optionList} />
          break
        default:
          ele = (
            <Input
              allowClear
              placeholder={placeholder}
              onChange={(e) => item.onChange && item.onChange(e.target.value)}
            />
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
