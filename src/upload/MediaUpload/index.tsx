// @ts-ignore
import React, { Fragment, useState } from "react"
// @ts-ignore
import { Upload, message, Button } from "antd"
// @ts-ignore
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined
  // @ts-ignore
} from "@ant-design/icons"

export const MediaUpload = (props) => {
  const [loading, setLoading] = useState(false)
  const [isValid, setValidator] = useState(true)
  const {
    className,
    type,
    beforeUpload: bfUp,
    value,
    limits = {},
    buttonText = "UPLOAD",
    icon = true,
    uploadUrl,
    imageUploadUrl,
    videoUploadUrl,
    intl,
    fileServerUrl
  } = props
  const isImage = type === "image"
  const isFile = type === "file"
  let serverUrl = isImage ? imageUploadUrl : videoUploadUrl
  if (uploadUrl) {
    serverUrl = uploadUrl
  }
  const url = fileServerUrl + value

  const headers = {
    // @ts-ignore
    authorization: JSON.parse(localStorage.getItem("token")).data
  }

  const beforeUpload =
    bfUp ||
    function (file) {
      const test = new Promise((resolve, reject) => {
        const keys = Object.keys(limits)
        const { types, minSize, maxSize, fileType, ...rest } = limits
        if (fileType && file.type.indexOf(fileType) < 0) {
          reject("文件格式错误")
        }
        isImage &&
          file.type.indexOf("image") < 0 &&
          reject(intl.get("RICH_IMAGE_ERROR"))
        !(isFile || isImage) &&
          file.type.indexOf("video") < 0 &&
          reject(intl.get("RICH_VIDEO_ERROR"))
        if (keys.length < 1) {
          // @ts-ignore
          resolve()
        }
        types &&
          types.indexOf(file.type) < 0 &&
          reject(intl.get("RICH_TYPE_ERROR") + types)
        minSize &&
          file.size / 1024 < minSize &&
          reject(intl.get("RICH_SIZE_ERROR"))
        maxSize &&
          file.size / 1024 > maxSize &&
          reject(intl.get("RICH_SIZE_ERROR"))

        if (Object.keys(rest).length < 1 || isFile) {
          // @ts-ignore
          resolve()
        }

        getWidthHeight(file)
          .then(({ currentWidth, currentHeight }: any) => {
            const {
              width,
              height,
              minWidth,
              minHeight,
              maxWidth,
              maxHeight,
              aspectRatio
            } = rest
            if (width && width !== currentWidth) {
              reject(intl.get("RICH_SIZE_ERROR"))
            }
            if (height && height !== currentHeight) {
              reject(intl.get("RICH_SIZE_ERROR"))
            }
            if (minWidth && minWidth > currentWidth) {
              reject(intl.get("RICH_SIZE_ERROR"))
            }
            if (minHeight && minHeight > currentHeight) {
              reject(intl.get("RICH_SIZE_ERROR"))
            }
            if (maxWidth && maxWidth < currentWidth) {
              reject(intl.get("RICH_SIZE_ERROR"))
            }
            if (maxHeight && maxHeight < currentHeight) {
              reject(intl.get("RICH_SIZE_ERROR"))
            }
            if (aspectRatio && aspectRatio !== currentWidth / currentHeight) {
              reject(intl.get("RICH_RATIO_ERROR") + aspectRatio)
            }
            // @ts-ignore
            resolve()
          })
          .catch((e) => {
            reject(e)
          })
      })
      test
        .then(() => setValidator(true))
        .catch((e) => {
          message.error(e)
          setValidator(false)
        })
      return test
    }

  const getWidthHeight = (file) => {
    return isImage ? getImageSize(file) : getVideoSize(file)
  }

  const getVideoSize = (file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file)
      const video = document.createElement("video")
      video.onloadedmetadata = (e) => {
        URL.revokeObjectURL(url)
        // @ts-ignore
        const { currentWidth, currentHeight } = video
        resolve({ currentWidth, currentHeight })
      }
      video.src = url
      video.load()
    })
  }

  const getImageSize = (file) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.onload = (e: any) => {
        let src = e.target.result
        const image = new Image()
        image.onload = (f: any) => {
          const { width: currentWidth, height: currentHeight } =
            f.target || f.path[0]
          resolve({ currentWidth, currentHeight })
        }
        image.onerror = () => {
          reject("error")
        }
        image.src = src
      }
      fileReader.readAsDataURL(file)
    })
  }

  const handleChange = (info) => {
    const { file } = info
    const { status, response } = file
    if (status === "uploading") {
      setLoading(true)
      return
    }
    if (status === "done") {
      setLoading(false)
      let { code, msg, data } = response
      const img = data && data.path ? data.path : data
      if (code !== "8001") {
        message.error(msg)
      } else {
        props.onChange(img)
      }
      return
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">{intl.get(buttonText)}</div>
    </div>
  )

  const getContent = () => {
    if (isFile) {
      return (
        <Button>
          {icon && <UploadOutlined />}
          {intl.get(buttonText)}
        </Button>
      )
    }
    if (!value) {
      return uploadButton
    } else {
      return isImage ? (
        <img src={url} alt={intl.get("MSG_IMAGE")} style={{ width: "100%" }} />
      ) : (
        <video src={url} style={{ width: "100%" }} />
      )
    }
  }

  return (
    <Fragment className={className}>
      <Upload
        // name={isImage ? 'image' : 'file'}
        name={isImage ? "file" : "file"}
        listType={!isFile && "picture-card"}
        className={!isFile ? "avatar-upload" : ""}
        showUploadList={isFile}
        action={serverUrl}
        headers={headers}
        beforeUpload={beforeUpload}
        {...props}
        onChange={handleChange}
      >
        {getContent()}
      </Upload>
      <p className={isValid ? "" : "error_extra"}>{!isFile && props.extra}</p>
    </Fragment>
  )
}
