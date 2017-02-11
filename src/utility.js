import {shuffle} from 'lodash'

export const calculate = (arr, width) => {
  arr = arr.map((elm, index) => {
    let result = 0
    const isLineStart = index % width === 0
    const isLineEnd = index % width === (width - 1)

    if (elm === '*') return elm
    const near9 = index - (width + 1)
    if (arr[near9]) result += (arr[near9] === '*' ? 1 : 0)
    const near8 = index - (width + 0)
    if (arr[near8]) result += (arr[near8] === '*' ? 1 : 0)
    const near7 = index - (width - 1)
    if (arr[near7]) result += (arr[near7] === '*' ? 1 : 0)

    if (!isLineStart) {
      const near6 = index - 1
      if (arr[near6]) result += (arr[near6] === '*' ? 1 : 0)
    }

    if (!isLineEnd) {
      const near4 = index + 1
      if (arr[near4]) result += (arr[near4] === '*' ? 1 : 0)
    }

    const near3 = index + (width - 1)
    if (arr[near3]) result += (arr[near3] === '*' ? 1 : 0)
    const near2 = index + (width + 0)
    if (arr[near2]) result += (arr[near2] === '*' ? 1 : 0)
    const near1 = index + (width + 1)
    if (arr[near1]) result += (arr[near1] === '*' ? 1 : 0)

    return String(result)
  })
  return arr
}

export const creatMatrix = (masX, masY, bom) => {
  // 爆弾 = *
  // なし = 0
  let base = []
  let matrix = []
  const _masTotle = masX * masY
  const _saveMas = _masTotle - bom

  for (var i = 0; i < _masTotle; i++) {
    if (i < _saveMas) {
      base.push('0')
    } else {
      base.push('*')
    }
  }

  base = shuffle(base)
  base = shuffle(base)

  base = calculate(base, masX)

  base = base.map((elm, index) => {
    return {
      line: 0,
      col: 0,
      data: elm,
      isShow: true,
      flg: false
    }
  })

  // 行に分ける
  base.forEach((elm, index) => {
    const line = Math.floor(index / masX)
    const col = index % masX
    elm.line = line
    elm.col = col
    if (!matrix[line]) matrix[line] = []
    matrix[line][col] = elm
  })
  return matrix
}
