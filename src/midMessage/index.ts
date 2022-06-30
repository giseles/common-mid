// @ts-ignore
import { message } from "antd"
import { LooseObject } from "../_interface/LooseObject"
import { MessageType } from "../_interface/antd"
/**
 *
 * @name 统一返回数据提示
 * @param  {Object} data 数据
 * @param  {Number} maxCount 最大显示数 = 1
 * @param  {Number} successCode 成功code码 = 8001
 * @example
 * midMessage({code:'8001',msg:'成功'})           ---- 成功
 * midMessage({code:'loading',msg:'加载中'})      ---- 加载中
 * midMessage({code:'warning',msg:'警告'})        ---- 警告
 * midMessage({code:'4004',msg:'失败'},1,8001)           ---- 失败
 */
export const midMessage = (
  data: LooseObject,
  maxCount: number = 1,
  successCode: number = 8001
) => {
  message.config({
    maxCount
  })
  const list: any = {
    [successCode]: "success",
    loading: "loading",
    info: "info",
    warning: "warning",
    error: "error"
  }
  const type: keyof MessageType = list[data.code] || "error"
  message[type](data.msg)
}
