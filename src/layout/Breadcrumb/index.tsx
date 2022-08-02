import React, { memo } from "react"
import { router } from "dva"
import { Breadcrumb as AntdBread } from "antd"
// import "antd/es/breadcrumb/style"

const { Link } = router

/**
 * @name  面包屑导航
 * @param  {Object} 配置项
 * @example
 * <MidBreadcrumb
    className={styles.antdBread}
    pathname={pathname}
    AllPathInfo={breadcrumbList}
    AllPathPermission={ablePathList}
    IconFont={IconFont}
    property={property}
    specialList={specialList}
  />
 */
export const MidBreadcrumb = memo((props: any) => {
  const {
    className,
    pathname,
    AllPathInfo,
    AllPathPermission,
    IconFont,
    property,
    specialList
  } = props
  const pathSnippets = pathname.split("/").filter((i: any) => i)
  const extraBreadcrumbItems = pathSnippets.map((_: any, index: any) => {
    const { noJumpList, jumpList, noShowList } = specialList
    if (noJumpList[_]) {
      return <AntdBread.Item key={index}>{noJumpList[_]}</AntdBread.Item>
    }

    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`
    let toUrl = url
    if (Object.keys(jumpList).includes(_)) {
      toUrl = jumpList[_]
    }
    if (!AllPathInfo[url]?.name || noShowList.includes(_)) {
      // 无路径名称或 不显示路径
      return ""
    }
    const content = (
      <>
        {property.isShowIcon && AllPathInfo[url]?.icon && (
          <IconFont type={`icon-${AllPathInfo[url]?.icon}1`} />
        )}
        {AllPathInfo[url]?.name}
      </>
    )
    return (
      <AntdBread.Item key={url}>
        {toUrl ? <Link to={toUrl}>{content}</Link> : content}
      </AntdBread.Item>
    )
  })

  return (
    <AntdBread separator={property.separator} className={className}>
      {AllPathPermission.includes(property.homeUrl) && (
        <AntdBread.Item href={property.homeUrl}>
          {property.isShowIcon && <IconFont type={property.homeIcon} />}
          首页
        </AntdBread.Item>
      )}
      {AllPathPermission.includes(pathname) && extraBreadcrumbItems}
    </AntdBread>
  )
})
