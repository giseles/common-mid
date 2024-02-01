import React, { memo, useState } from "react"
import { Tree } from "antd"
import { useDeepCompareEffect } from "common-hook"
import { isNil } from "common-screw"

interface Props {
  value?: any // 已选中树节点
  treeData?: any // treeNodes数据
  onChange?: any // 选中后回调
  checkable?: boolean // 复选框
  disabled?: boolean // 禁用
}

/**
 * @name  树形控件
 * @param  {Props} 配置
 * @example
 * <MidTree
    value={value}
    treeData={list}
    onChange={children} 
  />
 */
export const MidTree = memo((props: Props) => {
  const {
    value = [],
    treeData = [],
    onChange,
    checkable = true,
    disabled = false
  } = props

  const [expandedKeys, setExpandedKeys] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState([])

  useDeepCompareEffect(() => {
    setExpandedKeys(value)
  }, [value])

  const toCheck = (_) => {
    !disabled && onChange && onChange(_)
  }
  const toSelect = (_) => {
    !disabled && setSelectedKeys(_)
  }

  return (
    !isNil(treeData) &&
    expandedKeys && (
      <Tree
        rootStyle={{ width: "100%", height: 300, overflowY: "auto" }}
        treeData={treeData}
        checkable={checkable}
        checkedKeys={value}
        defaultExpandedKeys={expandedKeys}
        autoExpandParent={true}
        selectedKeys={selectedKeys}
        onCheck={toCheck}
        onSelect={toSelect}
      />
    )
  )
})
