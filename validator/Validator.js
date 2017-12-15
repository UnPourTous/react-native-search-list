export const containsChinese = (input) => {
  if (input) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(input)) {
      return true
    }
    return false
  }
}

export const sTrim = (sourceStr) => {
  if (sourceStr) {
    return sourceStr.replace(/\s+/g, '')
  } else {
    return ''
  }
}

export const isCharacter = (value) => {
  let Regx = /^[A-Za-z]*$/
  if (Regx.test(value)) {
    return true
  } else {
    return false
  }
}
