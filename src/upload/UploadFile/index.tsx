import React, { memo, useState } from "react"
import { Upload, Button } from "antd"
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons"

/**
 * @name  上传文件等
 * @param  {Object} 配置项
 * @example
 * <MidUploadFile {...props} />
 */
export const MidUploadFile = memo((props: any) => {
  const {
    LANG,
    message,
    className,
    typeName,
    limits,
    uploadUrl,
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

  return (
    <div className={className}>
      <Upload
        name="file"
        listType="text"
        action={uploadUrl}
        headers={headers}
        maxCount={1}
        // beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        <Button>
          {loading ? <LoadingOutlined /> : <UploadOutlined />}
          {loading ? LANG.UPLOAD_ING : LANG.UPLOAD}
        </Button>
      </Upload>
      {tip}
    </div>
  )
})
