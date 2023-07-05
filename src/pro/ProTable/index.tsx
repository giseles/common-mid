import React, { memo } from "react"

/**
 * @name  高阶表格
 * @param  {Object} 配置项
 * @example
 * <MidProTable
    componentProps={componentProps}
    searchProps={searchProps}
    tableProps={tableProps}
    searchCardProps={searchCardProps}
    tableCardProps={tableCardProps}
   />
 */
export const ProTable = memo((props: any) => {
  const {
    componentProps,
    searchProps,
    tableProps,
    searchCardProps,
    tableCardProps
  } = props
  const { Card, Table, Search } = componentProps
  return (
    <>
      {searchProps.search && (
        <Card {...searchCardProps}>
          <Search {...searchProps} />
        </Card>
      )}
      <Card {...tableCardProps}>
        <Table {...tableProps} />
      </Card>
    </>
  )
})
