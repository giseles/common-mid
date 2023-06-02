import React, { memo, useState } from "react"
import { Upload, Modal } from "antd"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"

const toInitImg = (data) => {
  const list = data?.split(",") || []
  const value: any = []
  list.forEach((_, index) => {
    value.push({ uid: index + 1, status: "done", url: _ })
  })
  return value
}

/**
 * @name  上传图片等
 * @param  {Object} 配置项
 * @example
 * <MidUploadImg {...props} />
 */
export const MidUploadImg = memo((props: any) => {
  const {
    LANG,
    message,
    className,
    typeName,
    value: initValue,
    limits,
    uploadUrl,
    serverUrl,
    headers,
    onChange,
    tip = null,
    maxCount = 1
  } = props
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(toInitImg(initValue))
  const [preview, setPreview] = useState({
    open: false,
    url: ""
  })

  const beforeUpload = (file: any) => {
    return new Promise((resolve) => {
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

  const handleChange = ({ fileList }) => {
    const value: any = []
    const urlList: any = []
    fileList.forEach((_) => {
      let { uid, status, name, url = "", response } = _
      if (status === "uploading") {
        setLoading(true)
      } else if (status === "done" && response) {
        setLoading(false)
        let { code, msg, data } = response
        if (code === "8001") {
          url = serverUrl + (data && data.path ? data.path : data)
        } else {
          message(msg)
        }
      }
      value.push({ uid, name, status, url })
      urlList.push(url)
    })
    setValue(value)
    onChange(urlList.join(","))
  }

  const handlePreview = (file) => {
    file.url &&
      setPreview({
        open: true,
        url: file.url
      })
  }

  return (
    <div className={className}>
      <Upload
        name="file"
        listType="picture-card"
        action={uploadUrl}
        headers={headers}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        fileList={value}
      >
        {value.length < maxCount && (
          <>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">
              {loading ? LANG.UPLOAD_ING : LANG.UPLOAD}
            </div>
          </>
        )}
      </Upload>
      {tip}
      <Modal
        open={preview.open}
        footer={null}
        title="图片预览"
        onCancel={() => setPreview({ open: false, url: "" })}
      >
        <img alt="example" style={{ width: "100%" }} src={preview.url} />
      </Modal>
    </div>
  )
})
