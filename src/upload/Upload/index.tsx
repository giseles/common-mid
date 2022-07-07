import React, { memo } from "react"
import { MidBaseUpload, MidImgCrop } from "common-mid"

export const MidUpload = memo((props: any) => {
  const { type } = props

  return (
    <>
      {type === "imageCrop" ? (
        <MidImgCrop {...props} />
      ) : (
        <MidBaseUpload {...props} />
      )}
    </>
  )
})
