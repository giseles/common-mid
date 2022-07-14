import { Modal } from "antd"
import { isString } from "common-screw"
import { ModalType, LooseObject } from "../../index"
import "antd/es/modal/style"
/**
 * @name 统一返回信息提示框
 * @param  {Object} data 数据
 * @param  {Object} type 类型 = "error"
 * @example
 * confirm({msg:'success',data:'成功'})     ---- 成功
 * confirm({msg:'info',data:'信息'})        ---- 信息
 * confirm({msg:'warning',data:'警告'})     ---- 警告
 * confirm({msg:'error',data:'失败'})       ---- 失败
 */

export const MidConfirm = (
  data: LooseObject,
  type: keyof ModalType = "warning",
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

  if (isString(data)) {
    return Modal.warning(data)
  } else {
    const showType = type || list[data.code] || "error"
    Modal[showType]({
      title: data.msg,
      content: data.data
    })
  }
}
