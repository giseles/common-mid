import React, { memo } from 'react'
import { useSelector } from 'dva'
import { MidRichText } from 'common-mid'
import { videoUploadUrl } from 'config/request'
import axios from 'utils/request'
import './index.less'

export const RichText = memo((props: any) => {
  const { fileServerUrl } = useSelector((_: any) => _.common)

  return (
    <MidRichText {...props} axios={axios} serverUrl={fileServerUrl} uploadUrl={videoUploadUrl} />
  )
})
