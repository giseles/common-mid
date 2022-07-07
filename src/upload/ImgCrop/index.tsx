import React, { memo, useState } from "react"
import AntdImgCrop from "antd-img-crop"
import { Upload } from "antd"
import { message } from "common-mid"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"

// const limits = {
//   width: 700,
//   maxSize: 10,
//   fileType: 'png',
//   aspect: 1
// }

export const MidImgCrop = memo((props: any) => {
  const [loading, setLoading] = useState(false)
  let {
    className,
    value,
    tip = null,
    limits,
    headers,
    uploadUrl,
    serverUrl
  } = props

  const beforeCrop = (file: any) => {
    const { fileType } = limits
    if (file.type.indexOf(fileType) < 0) {
      message({ msg: "图片格式错误" })
      return false
    }
    return file
  }
  const beforeUpload = async (file: any) => {
    const { maxSize, width } = limits
    // @ts-ignore
    if (width && width > (await getImageSize(file)).width) {
      message({ msg: `图片宽度应大于${width}px` })
      return false
    }
    if (file.size > maxSize * 1024 * 1024) {
      message({ msg: `图片应小于${maxSize}MB` })
      return false
    }
    return true
  }
  const getImageSize = (file: any) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.onload = (e: any) => {
        let src = e.target.result
        const image = new Image()
        image.onload = (f: any) => {
          const { width, height } = f.target || f.path[0]
          resolve({ width, height })
        }
        image.onerror = () => {
          reject("error")
        }
        image.src = src
      }
      fileReader.readAsDataURL(file)
    })
  }
  const handleChange = (info: any) => {
    const { file } = info
    const { status, response } = file
    if (status === "uploading") {
      setLoading(true)
      return
    }
    if (status === "done") {
      setLoading(false)
      let { code, msg, data } = response
      if (code !== "8001") {
        message({ msg })
      } else {
        props.onChange(data && data.path ? data.path : data)
      }
      return
    }
  }

  return (
    <div className={className}>
      <AntdImgCrop
        grid
        rotate
        beforeCrop={beforeCrop}
        quality="1"
        aspect={limits.aspect}
      >
        <Upload
          listType="picture-card"
          showUploadList={false}
          action={uploadUrl}
          headers={headers}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {value ? (
            <img src={serverUrl + value} alt="图片" style={{ width: "100%" }} />
          ) : (
            <>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">
                {loading ? "上传中" : "上传"}
              </div>
            </>
          )}
        </Upload>
      </AntdImgCrop>
      {tip && <div>{tip}</div>}
    </div>
  )
})
