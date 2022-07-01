// @ts-ignore
import React, { memo } from "react"
// @ts-ignore
import { router, useSelector } from "dva"
// @ts-ignore
import { Breadcrumb as AntdBread } from "antd"

const { Link } = router

export const Breadcrumb = memo((props: any) => {
  const { pathname, breadcrumbNameMap, pathWithPermission } = props
  const pathSnippets = pathname.split("/").filter((i: any) => i)
  const extraBreadcrumbItems = pathSnippets.map((_: any, index: any) => {
    if (_ === "form") {
      return <AntdBread.Item key={"form" + index}>表单</AntdBread.Item>
    } else if (_ === "info") {
      return <AntdBread.Item key={"info" + index}>个人中心</AntdBread.Item>
    }

    const jumpUrlList: any = {
      ec: null,
      oc: null,
      sc: null,
      market: "/sc/market/agent",
      employee: "/sc/employee/role",
      content: "/oc/content/notice",
      card: "/oc/card/scheme"
    }
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`
    let toUrl = url
    if (Object.keys(jumpUrlList).includes(_)) {
      toUrl = jumpUrlList[_]
    }
    if (
      !breadcrumbNameMap[url]?.name &&
      (_ === "add" || _ === "edit" || _ === "detail")
    ) {
      return ""
    }
    const content = (
      <>
        {/* {breadcrumbNameMap[url]?.icon && (
          <IconFont type={`icon-${breadcrumbNameMap[url]?.icon}1`} />
        )} */}
        {breadcrumbNameMap[url]?.name}
      </>
    )
    return (
      <AntdBread.Item key={_ + url}>
        {toUrl ? <Link to={toUrl}>{content}</Link> : content}
      </AntdBread.Item>
    )
  })

  return (
    <>
      <AntdBread separator=">">
        {breadcrumbNameMap["/home"] && (
          <AntdBread.Item href="/home">
            首页
            {/* <IconFont type={`icon-menu-sy1`} /> */}
          </AntdBread.Item>
        )}
        {pathname !== "/home" &&
          pathWithPermission.includes(pathname) &&
          extraBreadcrumbItems}
      </AntdBread>
    </>
  )
})
