import React, { memo } from "react"
import { Button, Layout, Result } from "antd"
// import "antd/es/button/style"
// import "antd/es/layout/style"
// import "antd/es/result/style"

interface Props {
  className?: string // class名称
  Link: any // Link组件
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
 *  Link={Link}
 *  tip={tip}
 *  resultProps={resultProps}
 * />
 */
export const MidEmpty = memo((props: Props) => {
  const {
    className,
    Link,
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
            onClick={() => window.history.back()}
            type="primary"
            size="large"
          >
            {tip.back}
          </Button>,
          tip.home && (
            <Button key="2" type="primary" size="large">
              <Link to={tip.homeUrl}>{tip.home}</Link>
            </Button>
          )
        ]}
        {...resultProps}
      />
    </Layout>
  )
})
