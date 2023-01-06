import React, { memo, useState } from "react"
import { useDeepCompareEffect } from "common-hook"
import {
  MidUploadFile,
  MidUploadImg,
  MidUploadImgCrop,
  MidUploadVideo
} from "common-mid"
// import { MidUploadFile } from '../UploadFile'
// import { MidUploadImg } from '../UploadImg'
// import { MidUploadImgCrop } from '../UploadImgCrop'
// import { MidUploadVideo } from '../UploadVideo'

// {
//   type: 'upload',
//   name: 'sort',
//   label: '文件',
//   uploadType: 'file',
//   limits: { fileType: 'pdf' }
// },
// {
//   type: 'upload',
//   name: 'sort2',
//   label: '图片',
//   uploadType: 'image'
// },
// {
//   type: 'upload',
//   name: 'sort4',
//   label: '图片剪裁',
//   uploadType: 'imageCrop',
//   limits: { width: '600' }
// },
// {
//   type: 'upload',
//   name: 'sort3',
//   label: '视频',
//   uploadType: 'video'
// }

const DEFAULT_LANG_LIST = {
  "zh-CN": {
    IMG: "图片",
    UPLOAD: "上传",
    UPLOAD_ING: "上传中",
    UPLOAD_FILE: "单击或拖动文件到此区域上传文件",
    UPLOAD_FILE_TIP: "文件已上传 : ",
    IMG_TIP_TYPE: "文件格式不符合要求",
    IMG_TIP_SIZE: (value: any, size: any) => `${value}应小于${size}MB`,
    IMG_TIP_WIDTH: (value: any) => `图片宽度应大于${value}px`
  },
  "en-US": {
    IMG: "Image",
    UPLOAD: "Upload",
    UPLOAD_ING: "Uploading",
    UPLOAD_FILE: "Click or drag file to this area to upload",
    UPLOAD_FILE_TIP: "File uploaded : ",
    IMG_TIP_TYPE: "File Format error",
    IMG_TIP_SIZE: (value: any, size: any) =>
      `${value} should be less than ${size}MB`,
    IMG_TIP_WIDTH: (value: any) =>
      `IMAGE width should be greater than ${value}px`
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
    setRender(toRender(type, { LANG, ...restProps }))
  }, [LANG, type, restProps])

  const toRender = (type: any, uploadProp: object) => {
    let content
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
