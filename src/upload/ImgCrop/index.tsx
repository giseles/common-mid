// @ts-ignore
import React, { Fragment, useState } from "react"
// @ts-ignore
import { useSelector } from "dva"
// @ts-ignore
import AntdImgCrop from "antd-img-crop"
// @ts-ignore
import { Upload, message } from "antd"
// @ts-ignore
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"

// const limits = {
//   width: 700,
//   maxSize: 10,
//   imgType: 'png',
//   aspect: 1
// }

const ImgCrop = (props: any) => {
  const [loading, setLoading] = useState(false)
  let { value, tip = null, limits = {}, imageUploadUrl, fileServerUrl } = props
  limits = { aspect: 1, maxSize: 10, ...limits }
  const headers = {
    // authorization: JSON.parse(localStorage.getItem('token')).data
  }

  const beforeCrop = (file: any) => {
    const { imgType } = limits
    if (
      file.type.indexOf("image") < 0 ||
      (imgType && file.type.indexOf(imgType) < 0)
    ) {
      message.error("文件格式错误")
      return false
    }

    return file
  }
  const beforeUpload = async (file: any) => {
    const { maxSize, width } = limits
    // @ts-ignore
    if (width && width > (await getImageSize(file)).width) {
      message.error(`图片宽度应大于${width}px`)
      return false
    }
    if (file.size > maxSize * 1024 * 1024) {
      message.error(`图片大小应小于${maxSize}MB`)
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
        message.error(msg)
      } else {
        props.onChange(data && data.path ? data.path : data)
      }
      return
    }
  }

  return (
    <Fragment>
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
          action={imageUploadUrl}
          headers={headers}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {value ? (
            <img
              src={fileServerUrl + value}
              alt="图片"
              style={{ width: "100%" }}
            />
          ) : (
            <>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">
                {" "}
                {loading ? "上传中" : "上传"}
              </div>
            </>
          )}
        </Upload>
      </AntdImgCrop>
      {tip && <div>{tip}</div>}
    </Fragment>
  )
}

export default ImgCrop
