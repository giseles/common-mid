// 扁平化Data
export const getFlatData = (list: any[] | undefined) => {
  let keys: any = {}
  if (list) {
    list.forEach((item) => {
      const name = String(item.name)
      keys[name] = { ...item }
    })
  }
  return keys
}
