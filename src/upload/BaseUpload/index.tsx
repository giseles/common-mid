import React, { memo, useState } from "react"
import { Upload, Button } from "antd"
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined
} from "@ant-design/icons"

/**
 * @name  上传图片、视频、文件等
 * @param  {Object} 配置项
 * @example
 * <MidBaseUpload {...props} />
 */
export const MidBaseUpload = memo((props: any) => {
  const [loading, setLoading] = useState(false)
  const {
    message,
    className,
    typeName,
    value,
    limits,
    uploadUrl,
    serverUrl,
    headers,
    tip = null,
    isImage = false,
    isVideo = false,
    isFile = false
  } = props
  const beforeUpload = (file: any) => {
    return new Promise((resolve, reject) => {
      const { maxSize, fileType } = limits
      if (fileType && file.type.indexOf(fileType) < 0) {
        message(`${typeName}格式错误`)
        reject()
      }
      if (file.size > maxSize * 1024 * 1024) {
        message(`${typeName}应小于${maxSize}MB`)
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
        props.onChange(data && data.path ? data.path : data)
      } else {
        message(msg)
      }
    }
  }

  const getContent = () => {
    const tipIcon = loading ? <LoadingOutlined /> : <PlusOutlined />
    const tipDes = loading ? "上传中" : "上传"
    let content = (
      <>
        {tipIcon}
        <div className="ant-upload-text">{tipDes}</div>
      </>
    )
    if (isFile) {
      // 文件
      content = (
        <Button>
          {loading ? <LoadingOutlined /> : <UploadOutlined />} {tipDes}
        </Button>
      )
    } else if (isImage && value) {
      // 图片
      content = (
        <img src={serverUrl + value} alt="图片" style={{ width: "100%" }} />
      )
    } else if (isVideo && value) {
      // 视频
      content = <video src={serverUrl + value} style={{ width: "100%" }} />
    }
    return content
  }

  return (
    <div className={className}>
      <Upload
        name="file"
        listType={isFile ? "text" : "picture-card"}
        showUploadList={isFile}
        action={uploadUrl}
        headers={headers}
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
