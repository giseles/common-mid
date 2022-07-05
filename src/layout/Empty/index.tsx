// @ts-ignore
import React, { memo } from "react"
// @ts-ignore
import { router } from "dva"
// @ts-ignore
import { Button, Layout, Result } from "antd"
import "antd/es/button/style"
import "antd/es/layout/style"
import "antd/es/result/style"

export const Empty = memo((props) => {
  const { className } = props
  return (
    <Layout className={className}>
      <Result
        status="404"
        title="404"
        subTitle="出错啦！您访问的页面没找到！"
        extra={[
          <Button
            onClick={() => window.history.back()}
            type="primary"
            size="large"
          >
            返回上一级
          </Button>,
          <Button type="primary" size="large">
            <router.Link to="/home">回到首页</router.Link>
          </Button>
        ]}
      />
    </Layout>
  )
})
