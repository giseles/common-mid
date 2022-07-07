import React, { memo, useCallback } from 'react'
import { useDispatch } from 'dva'
import { MidPageHeader } from 'common-mid'
import styles from './index.module.less'

export const PageHeader = memo((props: any) => {
  const dispatch = useDispatch()
  const { border, backUrl, backInfo = {} } = props

  const onBack = useCallback(() => {
    if (typeof backUrl === 'function') backUrl()
    dispatch({
      type: 'common/handleJump',
      payload: {
        pathname: backUrl,
        ...backInfo
      }
    })
  }, [backInfo, backUrl, dispatch])

  return (
    <>
      <MidPageHeader
        {...props}
        className={border ? styles.header : styles.headerNoBorder}
        onBack={onBack}
      />
    </>
  )
})
