import { message as AntdMessage } from "antd"
import { isString } from "common-screw"
import { MessageType } from "../../index"
import "antd/es/message/style"
/**
 *
 * @name 统一返回数据提示
 * @param  {Object} data 数据
 * @param  {Number} maxCount 最大显示数 = 1
 * @param  {Number} successCode 成功code码 = 8001
 * @example
 * message({code:'8001',msg:'成功'})           ---- 成功
 * message({code:'loading',msg:'加载中'})      ---- 加载中
 * message({code:'warning',msg:'警告'})        ---- 警告
 * message({code:'4004',msg:'失败'},1,8001)    ---- 失败
 * message('失败')                             ---- 失败
 */
export const message = (
  data: any,
  maxCount: number = 1,
  successCode: number = 8001
) => {
  AntdMessage.config({
    maxCount
  })
  const list: any = {
    [successCode]: "success",
    loading: "loading",
    info: "info",
    warning: "warning",
    error: "error"
  }
  if (isString(data)) {
    return AntdMessage.error(data)
  }
  const type: keyof MessageType = list[data.code] || "error"
  return AntdMessage[type](data.msg)
}
