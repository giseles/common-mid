import React, { memo, useState } from "react"
import { Upload } from "antd"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"

/**
 * @name  上传视频等
 * @param  {Object} 配置项
 * @example
 * <MidUploadVideo {...props} />
 */
export const MidUploadVideo = memo((props: any) => {
  const {
    LANG,
    message,
    className,
    typeName,
    value,
    limits,
    uploadUrl,
    serverUrl,
    headers,
    onChange,
    tip = null
  } = props

  const [loading, setLoading] = useState(false)

  const beforeUpload = (file: any) => {
    return new Promise((resolve, reject) => {
      const { maxSize, fileType } = limits
      if (fileType && file.type.indexOf(fileType) < 0) {
        message(LANG.IMG_TIP_TYPE(typeName))
        reject()
      }
      if (file.size > maxSize * 1024 * 1024) {
        message(LANG.IMG_TIP_SIZE(typeName, maxSize))
        reject()
      }
      resolve(true)
    })
  }

  const handleChange = (info: any) => {
    const { file } = info
    const { status, response } = file
    if (status === "uploading") {
      setLoading(true)
    } else if (status === "done") {
      setLoading(false)
      let { code, msg, data } = response
      if (code === "8001") {
        onChange(data && data.path ? data.path : data)
      } else {
        message(msg)
      }
    }
  }

  const getContent = () => {
    const tipIcon = loading ? <LoadingOutlined /> : <PlusOutlined />
    const tipDes = loading ? LANG.UPLOAD_ING : LANG.UPLOAD
    let content = (
      <>
        {tipIcon}
        <div className="ant-upload-text">{tipDes}</div>
      </>
    )
    if (value) {
      content = <video src={serverUrl + value} style={{ width: "100%" }} />
    }
    return content
  }

  return (
    <div className={className}>
      <Upload
        name="file"
        listType="picture-card"
        action={uploadUrl}
        headers={headers}
        maxCount={1}
        // @ts-ignore
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {getContent()}
      </Upload>
      {tip && <div>{tip}</div>}
    </div>
  )
})
