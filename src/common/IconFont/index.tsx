import { createFromIconfontCN } from "@ant-design/icons"

interface Props {
  scriptUrl: string // font图标地址
  extraCommonProps?: any // 额外属性
}

/**
 * @name  自定义Font图标
 * @param  {Props} 配置项
 * @example
 * MidIconFont({ scriptUrl: '/font/iconfont.js' ,extraCommonProps:{}})
 */
export const MidIconFont = (props: Props) => createFromIconfontCN(props)
