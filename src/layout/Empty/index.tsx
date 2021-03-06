import React, { memo } from "react"
import { router } from "dva"
import { Button, Layout, Result } from "antd"
import "antd/es/button/style"
import "antd/es/layout/style"
import "antd/es/result/style"

/**
 * @name  空状态
 * @param  {Object} 配置项
 * @example
 * <MidEmpty className={styles.layout} />
 */
export const MidEmpty = memo((props) => {
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
