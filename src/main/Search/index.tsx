import React, { useState, memo } from "react"
import { useDeepCompareEffect } from "common-hook"
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Cascader,
  Button
} from "antd"
import { isArray, isNil, isObject, toEnumArray } from "common-screw"
import { getFlatData } from "../../_utils"

// 生成 Select 的 options 属性
const toOptions = (optionList: any, placeholder: any, allTip: any) => {
  const all = { value: "", label: `${placeholder} - ${allTip}` }
  if (isNil(optionList)) {
    return []
  } else if (isArray(optionList) && (optionList[0].id || optionList[0].value)) {
    let options: any = []
    options.push(all)
    optionList.forEach((item: any) => {
      options.push({ label: item.value, value: item.id })
    })
    return options
  } else if (isArray(optionList) && optionList[0].label) {
    return [all, ...optionList]
  } else if (isObject(optionList)) {
    return [all, ...toEnumArray(optionList, "value", "label")]
  }
}

const toOptionsV2 = (
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
  title?: string
  name?: string | string[]
  type?: any
  hide?: boolean
  valueEnum?: any[]
  itemProps?: any
  optionList?: object
}
interface SearchProps {
  language?: string // 语言
  langList?: any // 语言包
  onChange?: (values: object) => void
  search?: Array<InputProps>
  add?: string
  addClick?: any
  addBtn?: any
  addHandle?: any
  style?: any
  className?: any
  addProps?: any
  children?: any
  searchIcon?: any
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
 * <MidSearch className={styles.section} addProps={addProps} searchIcon={searchIcon} {...props} />
 */
export const MidSearch = memo((props: SearchProps) => {
  const {
    language,
    langList = DEFAULT_LANG_LIST,
    search,
    onChange,
    className,
    style = {},
    children,
    searchIcon,
    addProps
  } = props
  const [form] = Form.useForm()
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
    // 渲染search
    const content: any = search?.map((item: any, index: any) => {
      const { hide = false } = item
      return !hide && <Col key={index}>{formInputRender(item)}</Col>
    })
    setRenderItem(content)
  }, [search, LANG])

  const formInputRender = (item: InputProps) => {
    let elem: any = <></>
    const { name, type, valueEnum, optionList, title, itemProps = {} } = item
    const { defaultValue, ...restProps } = itemProps
    // 后续可删
    let newType = type
    if (type === "text") {
      newType = valueEnum ? "select" : "search"
    }
    switch (newType) {
      case "select":
        const options = optionList || valueEnum
        elem = (
          <Select
            placeholder={title}
            options={toOptions(
              options,
              title || itemProps.placeholder,
              LANG.ALL_TIP
            )}
            allowClear
            onChange={onValuesChange}
            {...itemProps}
          />
        )
        break
      case "selectMul":
        elem = (
          <Select
            placeholder={title}
            options={toOptionsV2(
              optionList,
              title || itemProps.placeholder,
              LANG.ALL_TIP,
              false
            )}
            mode="multiple"
            allowClear
            onChange={onValuesChange}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            {...itemProps}
          />
        )
        break
      case "search":
        elem = (
          <Input
            placeholder={title}
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
            {...restProps}
          />
        )
        break
      case "dateRangeNoTime":
        elem = (
          <DatePicker.RangePicker
            onChange={onValuesChange}
            placeholder={[LANG.TIME_START, LANG.TIME_END]}
            {...restProps}
          />
        )
        break
      case "monthRange":
        elem = (
          <DatePicker.MonthPicker
            onChange={onValuesChange}
            placeholder={title}
            showTime={false}
            {...restProps}
          />
        )
        break
      case "cascader":
        elem = (
          <Cascader
            options={valueEnum}
            changeOnSelect
            onChange={onValuesChange}
            placeholder={title}
            {...restProps}
          />
        )
        break
      default:
    }

    return (
      <Form.Item initialValue={defaultValue} name={String(name)}>
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
          const { valueName } = item
          valueName.forEach((childItem: any, childIndex: any) => {
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
    <section className={className} style={style}>
      <Form autoComplete="off" form={form}>
        <Row gutter={24} justify="start">
          {renderItem}
        </Row>
        {children}
      </Form>
      {/* 添加按钮 */}
      {addProps.isShow && (
        <Button onClick={addProps.onClick} icon={addProps.icon}>
          {addProps.name}
        </Button>
      )}
    </section>
  )
})
