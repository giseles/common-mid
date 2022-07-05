import React, { memo } from "react"
import { MidEmpty } from "common-mid"
import styles from "./index.module.less"

export const Empty = memo(() => <MidEmpty className={styles.layout} />)
