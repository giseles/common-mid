import { message } from "antd"
import { MessageType } from "../../index"
// import "antd/es/message/style"

/**
 *
 * @name 统一返回数据提示
 * @param  {Object} data 数据
 * @param  {Number} maxCount 最大显示数 = 1
 * @param  {Number} successCode 成功code码 = 8001
 * @example
 * MidMessage({code:'8001',msg:'成功'})           ---- 成功
 * MidMessage({code:'loading',msg:'加载中'})      ---- 加载中
 * MidMessage({code:'warning',msg:'警告'})        ---- 警告
 * MidMessage({code:'4004',msg:'失败'},1,8001)    ---- 失败
 * MidMessage('失败')                             ---- 失败
 */
export const MidMessage = (
  data: any,
  config: any,
  successCode: number = 8001
) => {
  if (config) message.config(config)
  const list: any = {
    [successCode]: "success",
    success: "success",
    loading: "loading",
    info: "info",
    warning: "warning",
    error: "error"
  }

  const type: keyof MessageType = list[data?.code || "warning"]
  const msg = data?.msg || data
  return message[type](msg)
}
