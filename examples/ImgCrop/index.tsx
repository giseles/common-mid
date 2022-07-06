import React, { memo } from 'react'
import { useSelector } from 'dva'
import { MidImgCrop } from 'common-mid'
import { storage } from 'common-screw'
import { imageUploadUrl } from 'config/request'

// const limits = {
//   width: 700,
//   maxSize: 10,
//   imgType: 'png',
//   aspect: 1
// }

export const ImgCrop = memo((props: any) => {
  const { fileServerUrl } = useSelector((_: any) => _.common)

  return (
    <MidImgCrop
      {...props}
      headers={{ authorization: storage.getItem('token') }}
      uploadUrl={imageUploadUrl}
      serverUrl={fileServerUrl}
    />
  )
})
