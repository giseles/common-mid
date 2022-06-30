// @ts-ignore
import { Modal } from "antd"
import { LooseObject } from "../_interface/LooseObject"
import { ModalType } from "../_interface/antd"

/**
 * @name 统一返回信息提示框
 * @param  {Object} data 数据
 * @param  {Object} type 类型 = "error"
 * @example
 * midConfirm({msg:'success',data:'成功'})     ---- 成功
 * midConfirm({msg:'info',data:'信息'})        ---- 信息
 * midConfirm({msg:'warning',data:'警告'})     ---- 警告
 * midConfirm({msg:'error',data:'失败'})       ---- 失败
 */

export const midConfirm = (
  data: LooseObject,
  type: keyof ModalType = "error"
) => {
  Modal[type]({
    title: data.msg,
    content: data.data
  })
}
