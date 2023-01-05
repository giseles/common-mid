import React, { memo, useState } from "react"
import { useDeepCompareEffect } from "common-hook"
import {
  MidUploadFile,
  MidUploadImg,
  MidUploadImgCrop,
  MidUploadVideo
} from "common-mid"
// import { MidUploadFile } from "../UploadFile"
// import { MidUploadImg } from "../UploadImg"
// import { MidUploadImgCrop } from "../UploadImgCrop"
// import { MidUploadVideo } from "../UploadVideo"

const DEFAULT_LANG_LIST = {
  "zh-CN": {
    IMG: "图片",
    UPLOAD: "上传",
    UPLOAD_ING: "上传中",
    IMG_TIP_TYPE: (value: any) => `${value}格式错误`,
    IMG_TIP_SIZE: (value: any, size: any) => `${value}应小于${size}MB`,
    IMG_TIP_WIDTH: (value: any) => `图片宽度应大于${value}px`
  },
  "en-US": {
    IMG: "Image",
    UPLOAD: "Upload",
    UPLOAD_ING: "Uploading",
    IMG_TIP_TYPE: (value: any) => `${value}格式错误`,
    IMG_TIP_SIZE: (value: any, size: any) => `${value}应小于${size}MB`,
    IMG_TIP_WIDTH: (value: any) => `图片宽度应大于${value}px`
  }
}

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
  const { language, langList = DEFAULT_LANG_LIST, type, ...restProps } = props

  const [render, setRender] = useState(<></>)
  // 默认第一个语言包
  const [LANG, setLANG] = useState(langList[Object.keys(langList)[0]])
  useDeepCompareEffect(() => {
    // 语言国际化 ,如果没有对应语言包，默认第一个语言包
    const list = Object.keys(langList)
    const e = language && list.includes(language) ? language : list[0]
    setLANG(langList[e])
  }, [langList, language])

  useDeepCompareEffect(() => {
    setRender(toRender())
  }, [props])

  const toRender = () => {
    let content
    const uploadProp = { LANG, ...restProps }
    switch (type) {
      case "imageCrop":
        content = <MidUploadImgCrop {...uploadProp} />
        break
      case "file":
        content = <MidUploadFile {...uploadProp} />
        break
      case "video":
        content = <MidUploadVideo {...uploadProp} />
        break
      default:
        content = <MidUploadImg {...uploadProp} />
    }
    return content
  }
  return render
})
