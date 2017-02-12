import {shuffle} from 'lodash'

const rewrite = (mas) => {
  if (mas.data === '*') mas
}

export const calculate = (arr, width) => {
  let _arr = []
  arr.forEach((row, rowIndex) => {
    row.forEach((mas, colIndex) => {

      if (mas.data !== '*') {
        let result = 0

        // 上の行
        if (arr[rowIndex - 1]) {
          const topLeft = arr[rowIndex - 1][colIndex - 1]
          if (topLeft && topLeft.data === '*') result += 1
          const topRight = arr[rowIndex - 1][colIndex + 1]
          if (topRight && topRight.data === '*') result += 1
          const topCenter = arr[rowIndex - 1][colIndex]
          if (topCenter && topCenter.data === '*') result += 1
        }

        const left = arr[rowIndex][colIndex - 1]
        if (left && left.data === '*') result += 1
        const right = arr[rowIndex][colIndex + 1]
        if (right && right.data === '*') result += 1

        // 下の行
        if (arr[rowIndex + 1]) {
          const buttomLeft = arr[rowIndex + 1][colIndex - 1]
          if (buttomLeft && buttomLeft.data === '*') result += 1
          const buttomRight = arr[rowIndex + 1][colIndex + 1]
          if (buttomRight && buttomRight.data === '*') result += 1
          const buttomCenter = arr[rowIndex + 1][colIndex]
          if (buttomCenter && buttomCenter.data === '*') result += 1
        }

        arr[rowIndex][colIndex].data = String(result)
      }
    })
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

  // 行に分ける
  base.forEach((elm, index) => {
    const line = Math.floor(index / masX)
    const col = index % masX
    // elm.line = line
    // elm.col = col
    if (!matrix[line]) matrix[line] = []
    matrix[line][col] = {
      line: line,
      col: col,
      data: elm,
      isShow: false,
      flg: false
    }
  })

  matrix = calculate(matrix)

  return matrix
}
