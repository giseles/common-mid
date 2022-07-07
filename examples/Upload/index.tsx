import React, { memo } from 'react'
import { useSelector } from 'dva'
import { MidUpload } from 'common-mid'
import { storage } from 'common-screw'
import { imageUploadUrl, videoUploadUrl, fileUploadUrl } from 'config/request'

export const Upload = memo((props: any) => {
  const { fileServerUrl } = useSelector((_: any) => _.common)
  const { type, limits } = props
  const typeInfo: any = {
    image: {
      typeName: '图片',
      isImage: true,
      uploadUrl: imageUploadUrl,
      limits: { fileType: 'image', maxSize: '10', ...limits }
    },
    video: {
      typeName: '视频',
      isVideo: true,
      uploadUrl: videoUploadUrl,
      limits: { fileType: 'video', maxSize: '100', ...limits }
    },
    file: {
      typeName: '文件',
      isFile: true,
      uploadUrl: fileUploadUrl,
      limits: { maxSize: '10', ...limits }
    },
    imageCrop: {
      typeName: '图片',
      uploadUrl: imageUploadUrl,
      limits: { aspect: 1, fileType: 'image', maxSize: '10', ...limits }
    }
  }

  return (
    <MidUpload
      {...props}
      {...typeInfo[type]}
      headers={{ authorization: storage.getItem('token') }}
      serverUrl={fileServerUrl}
    />
  )
})
