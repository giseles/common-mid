// @ts-ignore
import { Modal } from "antd"
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

export const confirm = (data: LooseObject, type: keyof ModalType = "error") => {
  Modal[type]({
    title: data.msg,
    content: data.data
  })
}
