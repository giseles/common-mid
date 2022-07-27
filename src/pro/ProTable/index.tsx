import React, { useCallback, memo } from "react"

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
