import React, { memo } from "react"
import { Layout, Result } from "antd"

interface Props {
  className?: string // class名称
  Button: any // 按钮组件
  tip?: { back: string; home: string; homeUrl: string } // 提示语
  resultProps?: {
    status: any
    title: string
    subTitle: string
    [key: string]: any
  } // Result属性
}

/**
 * @name  空状态
 * @param  {Props} 配置项
 * @example
 * <MidEmpty
 *  className={styles.layout}
 *  Button={Button}
 *  tip={tip}
 *  resultProps={resultProps}
 * />
 */
export const MidEmpty = memo((props: Props) => {
  const {
    className,
    Button,
    tip = { back: "返回上一级", home: "回到首页", homeUrl: "/home" },
    resultProps = {
      status: "404",
      title: "404",
      subTitle: "出错啦！您访问的页面没找到！"
    }
  } = props
  return (
    <Layout className={className}>
      <Result
        extra={[
          <Button
            key="1"
            type="primary"
            size="large"
            name={tip.back}
            onClick={() => window.history.back()}
          />,
          tip.home && (
            <Button
              key="2"
              type="primary"
              size="large"
              name={tip.home}
              href={tip.homeUrl}
            />
          )
        ]}
        {...resultProps}
      />
    </Layout>
  )
})
