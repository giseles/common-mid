import React, { memo, useState } from "react"
import { Upload, Button } from "antd"
import { message } from "common-mid"
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined
} from "@ant-design/icons"

export const MidBaseUpload = memo((props: any) => {
  const [loading, setLoading] = useState(false)
  const [isValid, setValidator] = useState(true)
  const {
    className,
    type,
    typeName,
    value,
    limits = {},
    uploadUrl,
    serverUrl,
    headers,
    tip = null,
    isImage,
    isVideo,
    isFile
  } = props
  const beforeUpload = (file: any) => {
    const { maxSize, fileType } = limits
    if (fileType && file.type.indexOf(fileType) < 0) {
      // reject('文件格式错误')
      message({ msg: "文件格式错误" })
      return false
    }
    if (file.size > maxSize * 1024 * 1024) {
      // reject(`${typeName}大小应小于${maxSize}MB`)
      message({ msg: `${typeName}大小应小于${maxSize}MB` })
      return false
    }
    return true
    // const test = new Promise((resolve, reject) => {
    //   const { maxSize, fileType } = limits
    //   if (fileType && file.type.indexOf(fileType) < 0) {
    //     reject('文件格式错误')
    //   }
    //   if (file.size > maxSize * 1024 * 1024) {
    //     reject(`${typeName}大小应小于${maxSize}MB`)
    //   }
    //   resolve(true)
    // })
    // return test
    //   .then(() => setValidator(true))
    //   .catch(e => {
    //     message({ msg: e })
    //     setValidator(false)
    //   })
  }

  const handleChange = (info: any) => {
    const { file } = info
    console.log(info)
    const { status, response } = file
    if (status === "uploading") {
      setLoading(true)
    } else if (status === "done") {
      setLoading(false)
      let { code, msg, data } = response
      console.log(code, msg, data)
      if (code === "8001") {
        props.onChange(data && data.path ? data.path : data)
      } else {
        message({ msg })
      }
    }
  }

  const getContent = () => {
    const tipIcon = loading ? <LoadingOutlined /> : <PlusOutlined />
    const tipDes = loading ? "上传中" : "上传"
    let show = (
      <>
        {tipIcon}
        <div className="ant-upload-text">{tipDes}</div>
      </>
    )
    if (isFile) {
      // 文件
      show = (
        <Button>
          {tipIcon} {tipDes}
        </Button>
      )
    } else if (isImage && value) {
      // 图片
      show = (
        <img src={serverUrl + value} alt="图片" style={{ width: "100%" }} />
      )
    } else if (isVideo && value) {
      // 视频
      show = <video src={serverUrl + value} style={{ width: "100%" }} />
    }
    return show
  }

  return (
    <div className={className}>
      <Upload
        // name={isImage ? 'image' : 'file'}
        // {...props}
        name={type}
        listType={isFile ? "text" : "picture-card"}
        // className={!isFile ? 'avatar-upload' : ''}
        showUploadList={isFile}
        action={uploadUrl}
        headers={headers}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {getContent()}
      </Upload>
      {tip && <div>{tip}</div>}
    </div>
  )
})
