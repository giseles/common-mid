import React, { memo } from "react"
import { Upload } from "antd"
import { InboxOutlined } from "@ant-design/icons"

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
    value,
    limits,
    uploadUrl,
    headers,
    onChange,
    tip = null
  } = props

  const beforeUpload = (file: any) => {
    return new Promise((resolve, reject) => {
      const { maxSize, fileType } = limits
      if (fileType && file.type.indexOf(fileType) < 0) {
        message(LANG.IMG_TIP_TYPE)
        return Upload.LIST_IGNORE
      }
      if (file.size > maxSize * 1024 * 1024) {
        message(LANG.IMG_TIP_SIZE(typeName, maxSize))
        return Upload.LIST_IGNORE
      }
      resolve(true)
    })
  }

  const handleChange = (info: any) => {
    const { file } = info
    const { status, response } = file
    if (status === "done") {
      let { code, msg, data } = response
      if (code === "8001") {
        onChange({ path: data?.path || data, name: file.name })
      } else {
        message(msg)
      }
    }
  }
  return (
    <div className={className}>
      <Upload.Dragger
        name="file"
        action={uploadUrl}
        headers={headers}
        maxCount={1}
        // @ts-ignore
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onRemove={(e) => onChange(null)}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{LANG.UPLOAD_FILE}</p>
        {value && (
          <p className="ant-upload-hint">
            {LANG.UPLOAD_FILE_TIP + (value?.name || value)}
          </p>
        )}
      </Upload.Dragger>
      {tip}
    </div>
  )
})
