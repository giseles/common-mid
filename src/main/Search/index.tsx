import React, { memo, useRef, useState } from "react"
import { Cascader, DatePicker, Form, Input, Select } from "antd"
import { useDeepCompareEffect } from "common-hook"
import { getFlatData } from "common-mid"
import { isArray, isNil, isObject, toEnumArray } from "common-screw"

// 生成 Select 的 options 属性

const toOptions = (
  optionList: any,
  placeholder: any,
  allTip: any,
  isAll: boolean = true
) => {
  const arr: any = []
  isAll && arr.push({ value: "", label: `${placeholder} - ${allTip}` })
  if (isNil(optionList)) {
    return []
  } else if (
    isArray(optionList) &&
    optionList[0].label &&
    optionList[0].value
  ) {
    arr.push(...optionList)
  } else if (isObject(optionList)) {
    arr.push(...toEnumArray(optionList, "value", "label"))
  }
  return arr
}

interface InputProps {
  label?: string
  name?: string | string[]
  type?: any
  hide?: boolean
  itemProps?: any
  optionList?: any
}
interface SearchProps {
  language?: string // 语言
  langList?: any // 语言包
  onChange?: (values: object) => void
  search?: Array<InputProps>
  style?: any
  className?: any
  initialValues?: any
  children?: any
  searchIcon?: any
  itemStyle?: any
  extra?: any
}

const DEFAULT_LANG_LIST = {
  "zh-CN": {
    ALL_TIP: "全部",
    TIME_START: "开始时间",
    TIME_END: "结束时间"
  },
  "en-US": {
    ALL_TIP: "All",
    TIME_START: "Start Time",
    TIME_END: "End Time"
  }
}
/**
 * @name  搜索栏
 * @param  {Object} 配置项
 * @example
 * <MidSearch className={styles.section} searchIcon={searchIcon} {...props} />
 */
export const MidSearch = memo((props: SearchProps) => {
  const {
    language,
    langList = DEFAULT_LANG_LIST,
    search,
    onChange,
    className,
    style = {},
    initialValues = {},
    searchIcon,
    itemStyle,
    extra
  } = props
  const [form] = Form.useForm()
  const FormRef: any = useRef(null)

  const [renderItem, setRenderItem] = useState(<></>)

  // 默认第一个语言包
  const [LANG, setLANG] = useState(langList[Object.keys(langList)[0]])
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
    // 渲染search
    const content: any = search?.map((item: any, index: any) => {
      const { hide = false } = item
      return !hide && formInputRender(item, itemStyle, index)
    })
    setRenderItem(content)
  }, [search, LANG, itemStyle])

  const formInputRender = (item: InputProps, itemStyle, index) => {
    let elem: any = <></>
    const { name, type, optionList, label, itemProps = {} } = item
    const { defaultValue, ...restProps } = itemProps
    switch (type) {
      case "select":
        elem = (
          <Select
            placeholder={label}
            options={toOptions(optionList, label, LANG.ALL_TIP)}
            allowClear
            onChange={onValuesChange}
            {...restProps}
          />
        )
        break
      case "selectMul":
        elem = (
          <Select
            placeholder={label}
            options={toOptions(optionList, label, LANG.ALL_TIP, false)}
            mode="multiple"
            allowClear
            onChange={onValuesChange}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            {...restProps}
          />
        )
        break
      case "search":
        elem = (
          <Input
            placeholder={label}
            allowClear
            onChange={({ target }) => {
              !target.value && onValuesChange()
            }}
            prefix={searchIcon}
            onPressEnter={onValuesChange}
            {...restProps}
          />
        )
        break

      case "dateRange":
        elem = (
          <DatePicker.RangePicker
            onChange={onValuesChange}
            placeholder={[LANG.TIME_START, LANG.TIME_END]}
            style={{ width: "100%" }}
            {...restProps}
          />
        )
        break
      case "dateRangeNoTime":
        elem = (
          <DatePicker.RangePicker
            onChange={onValuesChange}
            placeholder={[LANG.TIME_START, LANG.TIME_END]}
            style={{ width: "100%" }}
            {...restProps}
          />
        )
        break
      case "monthRange":
        elem = (
          <DatePicker.MonthPicker
            onChange={onValuesChange}
            placeholder={label}
            showTime={false}
            style={{ width: "100%" }}
            {...restProps}
          />
        )
        break
      case "cascader":
        elem = (
          <Cascader
            options={optionList}
            changeOnSelect
            onChange={onValuesChange}
            placeholder={label}
            {...restProps}
          />
        )
        break
      default:
    }
    return (
      <Form.Item name={String(name)} key={index} style={itemStyle}>
        {elem}
      </Form.Item>
    )
  }

  // 表单数据处理
  const handleFields = (values: { [x: string]: any }) => {
    let result: any = {}
    const searchData = getFlatData(search)
    Object.keys(values).forEach((name) => {
      const item = searchData[name]
      const type = item.type
      const itemValue = values[name]
      switch (type) {
        case "dateRange":
          // 日期
          if (Array.isArray(itemValue) && itemValue.length === 2) {
            result[item.name[0]] =
              itemValue[0].format("YYYY-MM-DD") + " 00:00:00"
            result[item.name[1]] =
              itemValue[1].format("YYYY-MM-DD") + " 23:59:59"
          } else {
            // 没有值时，也要保留表单key
            result[item.name[0]] = undefined
            result[item.name[1]] = undefined
          }
          break
        case "dateRangeNoTime":
          // 日期 无时间
          if (Array.isArray(itemValue) && itemValue.length === 2) {
            result[item.name[0]] = itemValue[0].format("YYYY-MM-DD")
            result[item.name[1]] = itemValue[1].format("YYYY-MM-DD")
          } else {
            // 没有值时，也要保留表单key
            result[item.name[0]] = undefined
            result[item.name[1]] = undefined
          }
          break
        case "monthRange":
          if (Array.isArray(itemValue) && itemValue.length === 2) {
            result[item.name[0]] = itemValue[0].format("YYYY-MM")
            result[item.name[1]] = itemValue[1].format("YYYY-MM")
          } else {
            // 没有值时，也要保留表单key
            result[item.name[0]] = undefined
            result[item.name[1]] = undefined
          }
          break
        case "cascader":
          // 级联选择
          item.name?.forEach((childItem: any, childIndex: any) => {
            result[childItem] = itemValue?.[childIndex] || undefined
          })
          break
        default:
          result[name] = itemValue
      }
    })
    return result
  }

  const onValuesChange = () => {
    const values = form.getFieldsValue()
    onChange && onChange(handleFields(values))
  }

  return (
    <div className={className} style={style}>
      <Form
        autoComplete="off"
        layout="inline"
        initialValues={initialValues}
        ref={FormRef}
        form={form}
      >
        {renderItem}
      </Form>
      {/* 右侧操作区域 */}
      {extra}
    </div>
  )
})
