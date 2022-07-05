import React, { memo } from "react"
import { MidDescTable } from "common-mid"
import styles from "./index.module.less"

export const DescTable = memo((props: any) => (
  <MidDescTable {...props} className={styles.wrap} />
))
