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
const toOptions = (optionList: any, placeholder: any) => {
  const all = { value: "", label: placeholder + " - 全部" }
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

interface InputProps {
  name?: string | string[]
  type?: any
  hide?: boolean
  valueEnum?: any[]
  itemProps?: any
  optionList?: Object
}
interface SearchProps {
  searchText?: string | "查询"
  resetText?: string | "重置"
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

/**
 * @name  搜索栏
 * @param  {Object} 配置项
 * @example
 * <MidSearch className={styles.section} addProps={addProps} searchIcon={searchIcon} {...props} />
 */
export const MidSearch = memo((props: SearchProps) => {
  const {
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
  useDeepCompareEffect(() => {
    // 渲染search
    const content: any = search?.map((item: any, index: any) => {
      const { hide = false } = item
      return !hide && <Col key={index}>{formInputRender(item)}</Col>
    })
    setRenderItem(content)
  }, [search])

  const formInputRender = (item: InputProps) => {
    let elem: any = <></>
    const { name, type, valueEnum, optionList, itemProps } = item
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
            placeholder="请选择"
            options={toOptions(options, itemProps.placeholder)}
            allowClear
            onChange={onValuesChange}
            {...itemProps}
          />
        )
        break
      case "search":
        elem = (
          <Input
            placeholder="关键字"
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
            placeholder={["开始时间", "结束时间"]}
            {...restProps}
          />
        )
        break
      case "monthRange":
        elem = (
          <DatePicker.MonthPicker
            onChange={onValuesChange}
            placeholder="请选择"
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
            placeholder="请选择"
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
