import React, { memo } from "react"
import { MidBaseUpload, MidImgCrop } from "common-mid"

/**
 * @name  集合多种上传
 * @param  {Object} 配置项
 * @example
 * <MidUpload
    {...props}
    {...typeInfo[type]}
    message={Message}
    headers={{ authorization: storage.getItem('token') }}
    serverUrl={fileServerUrl}
  />
 */
export const MidUpload = memo((props: any) => {
  const { type } = props

  return (
    <>
      {type === "imageCrop" ? (
        <MidImgCrop {...props} />
      ) : (
        <MidBaseUpload {...props} />
      )}
    </>
  )
})
