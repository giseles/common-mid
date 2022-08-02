import { createFromIconfontCN } from "@ant-design/icons"

/**
 * @name  自定义Font图标
 * @param  {Object} 配置项
 * @example
 * MidIconFont({ scriptUrl: '/font/iconfont.js' ,extraCommonProps:{}})
 */
export const MidIconFont = (props) => createFromIconfontCN(props)
