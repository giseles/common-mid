// @ts-ignore
import React from "react"
// @ts-ignore
import { useSelector } from "dva"
// @ts-ignore
import { message } from "antd"
// @ts-ignore
import BraftEditor from "braft-editor"

const RichText = (props) => {
  let {
    media: mediaSettings = {},
    value,
    videoUploadUrl,
    axios,
    ...rest
  } = props

  if (typeof value === "string") {
    value = BraftEditor.createEditorState(value)
  }

  const { currentLocale = "", intl } = useSelector((_) => _.global)
  const { fileServerUrl } = useSelector((_) => _.common)

  const language = currentLocale.indexOf("en") < 0 ? "zh" : "en"

  const handleUpload = (param) => {
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: response.msg
      })
      message.error(response.msg)
    }

    let data = new FormData()
    data.set("file", param.file)
    data.set("needWholeUrl", "true")
    const req = {
      data,
      onUploadProgress: progressFn
    }

    axios.post(videoUploadUrl, req).then((r) => {
      if (r.code !== "8001") {
        errorFn(r)
      } else {
        const filePath = r.data.path
        param.success({
          url: fileServerUrl + filePath,
          meta: {
            id: fileServerUrl + filePath,
            maxWidth: "100%",
            style: { maxWidth: "100%", display: "block", margin: "10px auto" },
            loop: true, // 指定音视频是否循环播放
            autoPlay: true, // 指定音视频是否自动播放
            controls: true // 指定音视频是否显示控制栏
          }
        })
      }
    })
  }

  const handleValidate = (file) => {
    let type = file.type.split("/")[0]
    if (!type || types.indexOf(file.type) < 0) {
      message.error(intl.get("TYPE_ERROR"))
      return false
    } else if (maxSize[type] && file.size > maxSize[type] * 1024) {
      message.error(intl.get("SIZE_ERROR"))
      return false
    } else {
      return true
    }
  }

  let media: any = {
    uploadFn: handleUpload,
    validateFn: handleValidate,
    accepts: {
      image: "image/jpg,image/jpeg,image/bmp,image/png,image/ico",
      video: "video/mp4"
    }
  }

  let types = "image/jpg,image/jpeg,image/bmp,image/png,image/ico,video/mp4"

  let fileTypes = Object.keys(media.accepts)

  let maxCount = { image: 10, video: 1 }

  let maxSize = { video: 102400 }

  let { accepts } = mediaSettings

  if (accepts) {
    let a = {}
    types = ""
    for (let [k, v] of Object.entries(accepts)) {
      // @ts-ignore
      a[k] = v.type
      // @ts-ignore
      types += v.type + ","
      // @ts-ignore
      maxCount[k] = v.maxCount
      // @ts-ignore
      maxSize[k] = v.maxSize
    }
    media.accepts = a
    fileTypes = Object.keys(media.accepts)
  }

  const initCount = () => {
    let c = {}
    for (let t of fileTypes) {
      c[t.toUpperCase()] = 0
    }
    return c
  }

  let count = (files) => {
    let c = initCount()
    for (let f of Object.values(files)) {
      // @ts-ignore
      c[f.type] += 1
    }
    return c
  }

  const hooks = {
    "insert-medias": (files) => {
      let value1 = value ? value.toRAW(true).entityMap : []
      let current = count(value1)
      let now = count(files)
      for (let [k, v] of Object.entries(maxCount)) {
        let type = k.toUpperCase()
        if (v < current[type] + now[type]) {
          message.error(intl.get("COUNT_ERROR"))
          return false
        }
      }
    }
  }

  const data = { media, value, language, ...rest, hooks }
  const readOnlyData = { ...data, controls: [] }

  return props.readOnly ? (
    <BraftEditor {...readOnlyData} />
  ) : (
    <BraftEditor {...data} />
  )
}

export default RichText
