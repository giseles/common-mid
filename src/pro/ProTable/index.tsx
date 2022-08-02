import React, { useCallback, memo } from "react"

/**
 * @name  高阶表格
 * @param  {Object} 配置项
 * @example
 * <ProTable
      componentProps={componentProps}
      searchProps={searchProps}
      tableProps={tableProps}
      searchChange={useCallback(
        (value: any) => onSearch({ ...value, page: 1, pageSize: searchParams.pageSize }),[])}
      searchHandle={useCallback(onHandle, [])}
      tableChange={useCallback(
        ({ current, pageSize }: any) => onSearch({ page: current, pageSize }),[])}
      tableHandle={useCallback((type: any, item: any) => onHandle(type, item), [])}
    />
 */
export const ProTable = memo((props: any) => {
  const {
    className,
    componentProps,
    searchProps,
    tableProps,
    searchChange,
    searchHandle,
    tableChange,
    tableHandle
  } = props
  const { Table, Search } = componentProps
  // const { search, add } = searchProps
  // const { columns, loading, dataSource, current, pageSize, total } = tableProps

  return (
    <div className={className}>
      {searchProps.search && (
        <Search
          {...searchProps}
          onChange={useCallback(searchChange, [])}
          addClick={useCallback(searchHandle, [])}
        />
      )}
      <Table
        {...tableProps}
        onChange={useCallback(tableChange, [])}
        onHandle={useCallback(tableHandle, [])}
      />
    </div>
  )
})
