// @ts-ignore
import React, { useState, memo, useEffect } from "react"
// @ts-ignore
import { useSelector } from "dva"
// @ts-ignore
import useDeepCompareEffect from "use-deep-compare-effect"
// @ts-ignore
import { isNil } from "common-screw"
// @ts-ignore
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Cascader,
  Checkbox,
  Button
  // @ts-ignore
} from "antd"
// @ts-ignore
import { SearchOutlined, PlusOutlined } from "@ant-design/icons"

interface InputProps {
  name?: string | string[]
  type?: any
  hide?: boolean
  valueEnum?: any[]
  selectCompose?: any
  checkboxChildren?: any
  itemProps?: any
}
export interface SearchProps {
  searchText?: string | "查询"
  resetText?: string | "重置"
  onChange?: (values: object) => void
  search?: Array<InputProps>
  add?: string
  addClick?: any
  addBtn?: any
  addHandle?: any
  btnGroup?: any
  style?: any
}

// 扁平化search
const getFlatSearch = (search: any[] | undefined) => {
  let keys: any = {}
  let composeKeys: any = {}
  if (search) {
    search.forEach((item) => {
      const name = String(item.name)
      keys[name] = { ...item }
      if (item.selectCompose) {
        composeKeys[item.selectCompose.name] = { ...item.selectCompose }
        Object.assign(keys, getFlatSearch([item.selectCompose])[0])
      }
    })
  }
  return [keys, composeKeys]
}

const Search = memo((props: SearchProps) => {
  const { permissionList } = useSelector((_: any) => _.common)
  const [disabledKeys, setDisable] = useState({})
  const [belongInfo, setBelongInfo] = useState({})
  const {
    search,
    onChange,
    addBtn = null,
    addHandle,
    btnGroup = null,
    style = {}
  } = props
  const [form] = Form.useForm()
  useDeepCompareEffect(() => {
    const subs = getFlatSearch(search)[1]
    let disabledKeys: any = {}
    Object.keys(subs).forEach((i) => {
      if (subs[i].itemProps?.hasOwnProperty("defaultDisabled")) {
        disabledKeys[i] = subs[i].itemProps
      } else {
        disabledKeys[i] = false
      }
    })
    setDisable(disabledKeys)
  }, [search])

  const getSelect = ({ valueEnum, itemProps, onChange }: any) => {
    return (
      <Select
        placeholder="请选择"
        allowClear
        onChange={onChange || onValuesChange}
        {...itemProps}
      >
        <Select.Option key="" value="">
          {`${itemProps.placeholder} - 全部`}
        </Select.Option>
        {(valueEnum || []).map((data: any) => (
          <Select.Option key={data.id} value={data.id}>
            {data.value}
          </Select.Option>
        ))}
      </Select>
    )
  }

  const formInputRender = (item: InputProps) => {
    let elem: any = <></>
    const {
      name,
      type,
      valueEnum,
      checkboxChildren,
      selectCompose,
      itemProps
    } = item
    const { defaultValue, ...restProps } = itemProps
    if (type === "text") {
      if (valueEnum) {
        if (selectCompose) {
          return (
            <Row>
              <Col>
                {wrapFormItem({
                  defaultValue,
                  name,
                  checkboxChildren,
                  dom: getSelect({
                    valueEnum,
                    itemProps: restProps,
                    onChange: (value: any) => {
                      setDisable({
                        ...disabledKeys,
                        [selectCompose.name]: value === undefined
                      })
                      const subValue = form.getFieldValue(
                        String(selectCompose.name)
                      )
                      if (value === undefined) {
                        form.setFieldsValue({
                          [String(selectCompose.name)]: undefined
                        })
                      }
                      if (subValue) {
                        onValuesChange()
                      }
                    }
                  })
                })}
              </Col>
              <Col>
                {renderFormColItem({
                  ...selectCompose,
                  itemProps: {
                    ...selectCompose.itemProps
                    // disabled: disabledKeys[selectCompose.name],
                  }
                })}
              </Col>
            </Row>
          )
        }
        elem = getSelect({
          valueEnum,
          itemProps: restProps,
          onChange: onValuesChange
        })
      } else if (checkboxChildren) {
        elem = <Checkbox>{checkboxChildren}</Checkbox>
      } else {
        elem = (
          <Input
            placeholder="关键字"
            allowClear
            onChange={({ target }: any) => {
              !target.value && onValuesChange()
            }}
            prefix={
              <SearchOutlined
                className="site-form-item-icon"
                style={{ color: "#3082F9" }}
              />
            }
            onPressEnter={onValuesChange}
            {...restProps}
          />
        )
      }
    }
    if (type === "dateRange") {
      elem = (
        <DatePicker.RangePicker
          onChange={onValuesChange}
          placeholder={["开始时间", "结束时间"]}
          {...restProps}
        />
      )
    }
    if (type === "monthRange") {
      elem = (
        <DatePicker.MonthPicker
          onChange={onValuesChange}
          placeholder="请选择"
          {...restProps}
        />
      )
    }
    if (type === "cascader") {
      elem = (
        <Cascader
          onChange={onValuesChange}
          placeholder="请选择"
          {...restProps}
        />
      )
    }
    return wrapFormItem({ defaultValue, name, checkboxChildren, dom: elem })
  }
  const onChangeBelong = (value: any) => {
    setBelongInfo(value)
  }
  useEffect(() => {
    if (!isNil(belongInfo)) {
      onValuesChange()
    }
  }, [belongInfo])
  const wrapFormItem = ({ defaultValue, name, checkboxChildren, dom }: any) => {
    return (
      <Form.Item
        initialValue={defaultValue}
        name={String(name)}
        valuePropName={checkboxChildren ? "checked" : "value"}
      >
        {dom}
      </Form.Item>
    )
  }

  const renderFormColItem = (item: InputProps) => {
    const dom = formInputRender(item)
    if (!dom) {
      return null
    }
    return dom
  }

  const renderItem = () => {
    return (
      search?.map((item, index) => {
        const { hide = false } = item
        return hide ? null : <Col key={index}>{renderFormColItem(item)}</Col>
      }) || []
    )
  }

  // 表单数据处理
  const handleFields = (values: { [x: string]: any }) => {
    let result: any = { ...belongInfo }
    const searchData = getFlatSearch(search)[0]
    Object.keys(values).forEach((name) => {
      const item = searchData[name]
      const type = item.type
      const itemValue = values[name]

      if (["dateRange", "monthRange", "cascader"].indexOf(type) === -1) {
        result[name] = itemValue
        return
      }
      // 日期
      if (type === "dateRange") {
        if (Array.isArray(itemValue) && itemValue.length === 2) {
          result[item.name[0]] = itemValue[0].format("YYYY-MM-DD") + " 00:00:00"
          result[item.name[1]] = itemValue[1].format("YYYY-MM-DD") + " 23:59:59"
        } else {
          // 没有值时，也要保留表单key
          result[item.name[0]] = undefined
          result[item.name[1]] = undefined
        }
        return
      }
      if (type === "monthRange") {
        if (Array.isArray(itemValue) && itemValue.length === 2) {
          result[item.name[0]] = itemValue[0].format("YYYY-MM")
          result[item.name[1]] = itemValue[1].format("YYYY-MM")
        } else {
          // 没有值时，也要保留表单key
          result[item.name[0]] = undefined
          result[item.name[1]] = undefined
        }
        return
      }
      if (type === "cascader") {
        // 取最后一个国标码
        result[name] =
          Array.isArray(itemValue) && itemValue.length > 0
            ? itemValue[itemValue.length - 1]
            : undefined
      }
    })
    return result
  }

  const onValuesChange = () => {
    const values = form.getFieldsValue()
    if (onChange) {
      onChange(handleFields(values))
    }
  }

  return (
    <>
      <Form autoComplete="off" form={form}>
        <Row gutter={24} justify="start">
          {renderItem()}
        </Row>

        {btnGroup}
      </Form>
      {addBtn && (
        <Button onClick={addHandle} icon={<PlusOutlined />}>
          {addBtn}
        </Button>
      )}
      {props.add && (
        <Button
          onClick={() => props.addClick("add", null)}
          icon={<PlusOutlined />}
        >
          {props.add}
        </Button>
      )}
    </>
  )
})

export default Search
