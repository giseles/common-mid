import React, { memo, useRef, useState } from "react"
import {
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Spin,
  TimePicker
} from "antd"
import { useDeepCompareEffect } from "common-hook"
import { getFlatData } from "common-mid"
import {
  LooseObject,
  isArray,
  isNil,
  isObject,
  toEnumArray
} from "common-screw"

// 生成 Select 和 Radio 的 options 属性
const toOptions = (optionList: any) => {
  if (isNil(optionList)) {
    return []
  } else if (isArray(optionList) && (optionList[0].id || optionList[0].value)) {
    let options: any = []
    optionList.forEach((item: any) => {
      options.push({ label: item.value, value: item.id })
    })
    return options
  } else if (isArray(optionList) && optionList[0].label) {
    return optionList
  } else if (isObject(optionList)) {
    return toEnumArray(optionList, "value", "label")
  }
}

const { Item } = Form

interface Props {
  language?: string // 语言
  langList?: any // 语言包
  formProps: { className?: string; spinning?: boolean; [key: string]: any } // 表单属性
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
    Button: any
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
}

const DEFAULT_LANG_LIST = {
  "zh-CN": {
    PLEASE_INPUT: (value: any) => `请输入${value}`,
    PLEASE_SELECT: (value: any) => `请选择${value}`
  },
  "en-US": {
    PLEASE_INPUT: (value: any) => `Please enter ${value}`,
    PLEASE_SELECT: (value: any) => `Please select ${value}`
  }
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
    language,
    langList = DEFAULT_LANG_LIST,
    formProps: { spinning = false, ...formProps },
    formRules,
    formList,
    initialValues = {},
    componentProps: { BaseUpload, Encrypt, RichText, Button },
    formHandle: { monitorList = [], setFormValue = {}, getFormValue = null },
    btnProps
  } = props

  const [renderItem, setRenderItem] = useState(<></>)
  const [LANG, setLANG] = useState(langList[Object.keys(langList)[0]]) // 默认第一个语言包
  const FormRef: any = useRef(null)
  const [form] = Form.useForm()

  useDeepCompareEffect(() => {
    // 语言国际化 ,如果没有对应语言包，默认第一个语言包
    const list = Object.keys(langList)
    const e = language && list.includes(language) ? language : list[0]
    setLANG(langList[e])
  }, [langList, language])

  useDeepCompareEffect(() => {
    FormRef && FormRef.current && FormRef.current.resetFields()
  }, [initialValues])

  useDeepCompareEffect(() => {
    setRenderItem(toRenderItem(formList))
  }, [formList, LANG])

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
        case "time":
          values[key] = value.format("HH:mm:ss")
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
          values.fileName = value?.name || undefined
          values[key] = value?.path || value
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
    return formList?.map((item: any, index) => {
      if (item.hide) return null
      let {
        type,
        name,
        label,
        rules = [],
        placeholder = LANG.PLEASE_INPUT(item.label), // 提示语 请输入
        optionList = null,
        property, // 自定义属性
        itemProperty // FormItem属性
      } = item

      const itemProps = {
        key: index,
        label,
        name,
        rules: [...(formRules[type] || []), ...rules],
        ...itemProperty
      }
      let ele: any = <></>
      let pickPlaceholder = LANG.PLEASE_SELECT(item.label) // 提示语 请选择

      // Select 和 Radio options
      let options: any = toOptions(optionList)

      switch (type) {
        case "select":
        case "selectNoRequired":
          ele = (
            <Select
              placeholder={pickPlaceholder}
              allowClear
              options={options}
              disabled={item.disabled}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              showSearch={options.length > 10}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              {...property}
            />
          )

          break
        case "radio":
          ele = <Radio.Group options={options} {...property} />
          break
        case "password":
        case "newPassword":
        case "confirmPassword":
          ele = (
            <Input.Password
              placeholder={placeholder}
              autoComplete="new-password"
              {...property}
            />
          )
          break

        case "remark":
          ele = (
            <Input.TextArea
              allowClear
              placeholder={placeholder}
              rows={2}
              {...property}
            />
          )
          break
        case "date":
          ele = (
            <DatePicker
              placeholder={pickPlaceholder}
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              style={{ width: "100%" }}
              {...property}
            />
          )
          break
        case "dateAndTime":
          ele = (
            <DatePicker
              showTime
              placeholder={pickPlaceholder}
              disabledDate={item.disabledDate && disabledDate}
              {...property}
            />
          )
          break
        case "time":
          ele = (
            <TimePicker
              // @ts-ignore
              style={{ width: "100%" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              {...property}
            />
          )
          break
        case "timeRange":
          ele = (
            <TimePicker.RangePicker
              // @ts-ignore
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              {...property}
            />
          )
          break
        case "upload":
          ele = (
            <BaseUpload
              type={item.uploadType}
              limits={item.limits}
              tip={item.tip}
              {...property}
            />
          )
          break
        case "cascader":
          ele = (
            <Cascader
              options={item.optionList}
              placeholder={pickPlaceholder}
              changeOnSelect={item.changeOnSelect || false}
              // @ts-ignore
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              {...property}
            />
          )
          break
        case "richText":
          ele = <RichText language={language} {...property} />
          break
        case "diy":
          ele = item.show
          break
        case "inputNumber":
          ele = (
            <InputNumber allowClear placeholder={placeholder} {...property} />
          )
          break
        default:
          const { maxLength = 0 } = item
          if (maxLength) {
            ele = (
              <Input
                showCount
                maxLength={maxLength}
                placeholder={placeholder}
                {...property}
              />
            )
          } else {
            ele = <Input allowClear placeholder={placeholder} {...property} />
          }
      }
      return <Item {...itemProps}>{ele}</Item>
    })
  }
  return (
    <Spin spinning={spinning}>
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
        <Item style={{ textAlign: "center" }}>
          <Space size="large">
            {btnProps.isShowReturn && (
              <Button
                type="formReturn"
                onClick={btnProps.onBack}
                name={btnProps.returnName}
              />
            )}
            <Button
              type="formSubmit"
              htmlType="submit"
              loading={btnProps.loading}
              name={btnProps.submitName}
            />
          </Space>
        </Item>
      </Form>
    </Spin>
  )
})
