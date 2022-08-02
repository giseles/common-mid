import { Modal } from "antd"
import { ModalType, LooseObject } from "../../index"
import "antd/es/modal/style"

/**
 * @name 统一返回信息提示框
 * @param  {Object} data 数据
 * @param  {Object} type 类型 = "error"
 * @example
 * MidConfirm({msg:'success',data:'成功'})     ---- 成功
 * MidConfirm({msg:'info',data:'信息'})        ---- 信息
 * MidConfirm({msg:'warning',data:'警告'})     ---- 警告
 * MidConfirm({msg:'error',data:'失败'})       ---- 失败
 */

export const MidConfirm = (
  data: LooseObject,
  type: keyof ModalType,
  successCode: number = 8001
) => {
  const list: any = {
    [successCode]: "success",
    success: "success",
    loading: "loading",
    info: "info",
    warning: "warning",
    error: "error"
  }

  const content: any = {
    content: data?.data || data
  }
  if (data.msg) content.title = data.msg
  if (data.onOk) content.onOk = data.onOk
  return Modal[type || list[data?.code || "warning"]](content)
}
