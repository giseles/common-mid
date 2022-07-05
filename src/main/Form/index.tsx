import React, { useState, useEffect, memo, useRef } from "react"
import { Form, Input, Button, Space, Select, DatePicker } from "antd"
import moment from "moment"
import useDeepCompareEffect from "use-deep-compare-effect"
import { LooseObject } from "common-screw"
import "antd/es/form/style"

const { Item } = Form
const { Option } = Select

export const MidForm = memo(({ ...props }) => {
  const {
    className,
    Encrypt,
    type,
    initialValues = {},
    mustValues = null,
    formList,
    formLayout,
    onSubmit,
    onBack,
    loading,
    setLoading,
    showReturn = true,
    cancelText = "返回",
    propChangeValue = false,
    propChangeValueHandle,
    permissionList,
    MidMediaUpload,
    MidImgCrop,
    confirm
  } = props
  // @ts-ignore
  const [formValues, setFormValues] = useState<LooseObject>(initialValues)

  const FormRef: any = useRef(null)
  const [form] = Form.useForm()

  let id = type === "edit" ? initialValues.id : 0
  if (type === "edit" && initialValues.time) {
    initialValues.time = moment(initialValues.time)
  }

  useEffect(() => {
    FormRef && FormRef.current && FormRef.current.resetFields()
  }, [id])
  useDeepCompareEffect(() => {}, [initialValues])

  const onFinish = (values: any) => {
    setLoading(true)
    values = { ...values }
    if (type === "edit" && initialValues.id) {
      values.id = initialValues.id
    } else if (type === "edit" && initialValues.dvcId) {
      values.dvcId = initialValues.dvcId
      values.editType = initialValues.editType
    }

    if (values["time"]) {
      values["time"] = values["time"].format("YYYY-MM-DD HH:mm:ss")
    }

    if (
      values["password"] &&
      values["passwordAgain"] &&
      values["password"] !== values["passwordAgain"]
    ) {
      confirm({
        msg: "error",
        data: "两次密码不一致,请检查后再提交"
      })
      setLoading(false)
      return
    }
    if (values["password"]) {
      values.password = Encrypt(values.password)
    }
    if (values["oldPassword"]) {
      values.oldPassword = Encrypt(values.oldPassword)
    }
    delete values.passwordAgain

    onSubmit(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
  }

  const disabledDate = (current: any) => {
    return current < moment().subtract(1, "day")
  }

  const typeRules: any = {
    name: [
      { required: true },
      { min: 6, max: 26 },
      {
        pattern: /^(?!\d*$)[a-zA-Z\d]*$/,
        message: "请输入字母数字组合或纯字母"
      }
    ],
    password: [
      { required: true },
      { min: 6, max: 26 },
      {
        pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/,
        message: "请输入数字和字母组合"
      }
    ],
    newPassword: [
      { min: 6, max: 26 },
      {
        pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/,
        message: "请输入数字和字母组合"
      }
    ],
    select: [{ required: true }],
    time: [],
    dateAndTime: [
      { required: true },
      {
        validator: (rule: any, value: any) => {
          if (value && value < moment().endOf("minute")) {
            return Promise.reject("时间已过")
          }
          return Promise.resolve()
        }
      }
    ],
    file: [{ required: true }],
    color: [{ required: true }],
    belong: [{ required: true }],
    cascader: [{ required: true }],
    fileUrl: [{ required: true }],
    imgCrop: [{ required: true }],
    image: [],
    media: [],
    remark: [{ max: 100 }],
    telephone: [
      { required: true },
      { pattern: /^1\d{10}$/, message: "请输入正确的电话" }
    ],
    email: [
      {
        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: "请输入正确的邮箱"
      }
    ],
    unRequired: [],
    selectNoRequired: [],
    undefined: [{ required: true }]
  }
  const toItem = (itemProps: any, child: any) => {
    return <Item {...itemProps}>{child}</Item>
  }
  const onValuesChange = (vs: any, values: any) => {
    loading && setLoading(false)

    setFormValues(values)
    if (propChangeValue && Object.keys(vs).includes(propChangeValue)) {
      propChangeValueHandle(values)
    }
  }

  return (
    <Form
      className={className}
      name="basic"
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 12 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      size="large"
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      ref={FormRef}
    >
      {formList &&
        formList.map((item: any) => {
          let { type, placeholder = `请输入${item.label}` } = item
          const itemProps = {
            key: item.name,
            label: item.label,
            name: item.name,
            rules: item.rules
              ? [...typeRules[type], ...item.rules]
              : typeRules[type]
          }
          let pickPlaceholder = `请选择${item.label}`
          if (type === "password" || type === "newPassword") {
            if (type === "newPassword")
              placeholder = placeholder + "，若不修改 请留空"
            return toItem(
              itemProps,
              <Input.Password
                placeholder={placeholder}
                autoComplete="new-password"
              />
            )
          } else if (type === "select" || type === "selectNoRequired") {
            const optionList = item.optionList || []
            const keyValue = item.keyValue || ["id", "value"]
            if (item.isHide) {
              return ""
            }

            const returnItem = (
              <Item {...itemProps}>
                <Select
                  placeholder={pickPlaceholder}
                  allowClear
                  disabled={item.disabled}
                  onChange={(e) => {
                    item.onChange && item.onChange(e)
                    item.clearValue &&
                      form.setFieldsValue({ [item.clearValue]: "" })
                  }}
                >
                  {optionList.map((r: any) => {
                    // if (dependencies && current && r[type] !== current) return ''
                    return (
                      <Option key={r[keyValue[0]]} value={r[keyValue[0]]}>
                        {r[keyValue[1]]}
                      </Option>
                    )
                  })}
                </Select>
              </Item>
            )
            if (item.dependencies) {
              const dependencies = item.dependencies
              return formValues[dependencies.name] === dependencies.value
                ? returnItem
                : null
            }
            return returnItem
          } else if (type === "remark") {
            return toItem(
              itemProps,
              <Input.TextArea allowClear placeholder={placeholder} />
            )
          } else if (type === "disabled") {
            return toItem(
              itemProps,
              <Input placeholder={placeholder} disabled />
            )
          } else if (type === "time") {
            const returnItem = toItem(
              itemProps,
              <DatePicker
                // showTime
                placeholder={pickPlaceholder}
                format="YYYY-MM-DD"
                // disabledDate={disabledDate}
                style={{ width: "100%" }}
              />
            )
            if (item.dependencies) {
              const dependencies = item.dependencies
              return (
                formValues[dependencies.name] === dependencies.value &&
                returnItem
              )
            }
            return returnItem
          } else if (type === "dateAndTime") {
            const returnItem = toItem(
              itemProps,
              <DatePicker
                showTime
                placeholder={pickPlaceholder}
                disabledDate={disabledDate}
              />
            )
            if (item.dependencies) {
              const dependencies = item.dependencies
              return formValues[dependencies.name] &&
                formValues[dependencies.name] === dependencies.value
                ? returnItem
                : null
            }
            return returnItem
          } else if (type === "image") {
            return toItem(
              itemProps,
              <MidMediaUpload
                type="image"
                limits={item.limits}
                extra={item.extra}
              />
            )
          } else if (type === "media") {
            if (item.dependencies) {
              const dependencies = item.dependencies
              return (
                formValues[dependencies.name] === dependencies.value &&
                toItem(
                  itemProps,
                  <MidMediaUpload
                    type={item.mediaType}
                    limits={item.limits}
                    extra={item.extra}
                  />
                )
              )
            }
          } else if (type === "fileUrl") {
            if (item.dependencies) {
              const dependencies = item.dependencies
              return (
                formValues[dependencies.name] === dependencies.value &&
                toItem(
                  itemProps,
                  <MidMediaUpload
                    type="file"
                    limits={item.limits}
                    extra={item.extra}
                  />
                )
              )
            }
          } else if (type === "imgCrop") {
            return item.isHide
              ? null
              : toItem(
                  itemProps,
                  <MidImgCrop limits={item.limits} tip={item.tip} />
                )
          } else {
            const returnItem = toItem(
              itemProps,
              <Input
                allowClear
                placeholder={placeholder}
                onChange={(e) => item.onChange && item.onChange(e.target.value)}
              />
            )
            if (item.dependencies) {
              const dependencies = item.dependencies
              return formValues[dependencies.name] === dependencies.value
                ? returnItem
                : ""
            }
            return returnItem
          }
        })}

      {props.children}
      <Item wrapperCol={{ span: 16 }}>
        <Space size="large">
          {showReturn && <Button onClick={onBack}>{cancelText}</Button>}
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </Space>
      </Item>
    </Form>
  )
})
