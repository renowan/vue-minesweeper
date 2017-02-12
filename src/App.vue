<template>
  <div id="app">
    <div class="container">

      <div class="bs-example">

        <div class="row">

          <div class="col-xs-2">
            <label>Total Mas</label>
            <input class="form-control" type="text" placeholder="" :value="masX * masY" readonly>
          </div>

          <div class="col-xs-2">
            <label>Was open</label>
            <input class="form-control" type="text" placeholder="" :value="wasOpen" readonly>
          </div>

          <div class="col-xs-2">
            <label>Bom</label>
            <input class="form-control" type="text" placeholder="" :value="bom" readonly>
          </div>

          <div class="col-xs-1">
            <label>Row</label>
            <input type="text" class="form-control" placeholder="" v-model="input.row">
          </div>

          <div class="col-xs-1">
            <label>Col</label>
            <input type="text" class="form-control" placeholder="" v-model="input.col">
          </div>

          <div class="col-xs-1">
            <label>Bom</label>
            <input type="text" class="form-control" placeholder="" v-model="input.bom">
          </div>

          <div class="col-xs-1">
            <div>
              <label>&nbsp;</label>
            </div>
            <button class="btn btn-primary" @click="startGame">Start</button>
          </div>

        </div>

        <hr>

        <div class="row" v-if="gameClear">
          <div class="col-xs-12">
            <i class="glyphicon glyphicon-thumbs-up"></i> Clear!
          </div>
        </div>
        <div class="row" v-if="gameOver">
          <div class="col-xs-12">
            <i class="glyphicon glyphicon-thumbs-down"></i> Game Over!
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12" v-if="!gameClear && !gameOver">
            <i class="glyphicon glyphicon-menu-right"></i> Game playing
          </div>
        </div>

      </div>

      <div class="main-borad">
        <div class="field">

          <div v-for="line in matrix" class="clearfix">
            <Mas v-for="m in line"
              :data="m"
              v-on:switch-flg="onChangeFlg"
              v-on:click-mas="onClickMas">
            </Mas>
          </div>

        </div>
      </div>

      <div class="row">
        <div class="col-xs-12">
          <p>
            <code>Shift</code> + click to switch flag <i class="glyphicon glyphicon-flag"></i>.
          </p>
        </div>
      </div>


    </div>

  </div>
</template>

<script>
import dropdown from './components/ui/Dropdown.vue'
import * as utility from './utility'
import Mas from './components/Mas'

export default {
  name: 'app',
  components: {
    Mas,
    dropdown
  },
  computed: {
    masDebug () {
      let t = ''
      this.matrix.forEach((elm, index) => {
        elm.forEach((mas, masIndex) => {
          t += `<span>${mas.data}</span>`
        })
        t += '<br>'
      })
      return t
    }
  },
  data () {
    return {
      input: {
        row: 5,
        col: 5,
        bom: 5
      },

      /* 調整用変数 */
      masX: 10,        // フィールドサイズ X
      masY: 10,        // フィールドサイズ Y
      bomRate: 0.1,    // 爆弾率

      /* 制御用変数 */
      bom: 5,          // 爆弾数
      matrix: [],      // 爆弾配分

      /* ゲーム進行用変数 */
      wasOpen: 0,
      gameOver: false,
      gameClear: false
    }
  },
  watch: {
    wasOpen () {
      let canClear = (this.masX * this.masY) - this.bom
      if (canClear === this.wasOpen) {
        this.gameClear = true
      }
    }
  },
  created () {
    // 爆弾の数
    this.init()
  },
  methods: {
    startGame () {
      this.masX = this.input.row
      this.masY = this.input.col
      this.bom = this.input.bom
      this.init()
    },
    // 初期化
    init () {
      this.gameClear = false
      this.gameOver = false
      this.bom = this.bom > (this.masX * this.masY) ? 1 : this.bom
      this.matrix = utility.creatMatrix(this.masX, this.masY, this.bom)
    },
    onClickMas (data) {
      if (this.gameOver || this.gameClear) return
      const {line, col} = data
      let target = this.matrix[line][col]
      if (!target.isShow) {

        target.isShow = true

        if (target.data !== '*') {
          /* =======================
           no bom click
          ======================= */

          if (target.data === '0') {

            let emtyMas = []
            emtyMas = this.scanAll()

            // 空マスの周りを再帰的にスキャンしてshowにする
            while (emtyMas.length > 0) {
              emtyMas.forEach((elm) => {
                this.matrix[elm.row][elm.col].isShow = true
              })
              emtyMas = this.scanAll()
            }
          }
          let wasOpen = 0
          this.matrix.forEach((row) => {
            row.forEach((mas) => {
              if (mas.isShow && mas.data !== '*') wasOpen ++
            })
          })
          this.wasOpen = wasOpen
        } else {
          /* =======================
           bom! Game Over
          ======================= */
          this.gameOver = true

          // open all bom
          this.matrix.forEach((row) => {
            row.forEach((mas) => {
              if (mas.data === '*') mas.isShow = true
            })
          })
        }

      }

    },
    scanAll () {
      let saver = 40
      let matrix = this.matrix

      let result = []

      matrix.forEach((row, rowIndex) => {
        row.forEach((mas, colIndex) => {
          // openしたもの、かつ空のマス
          if (mas.isShow === true && mas.data === '0') {
            // 上の行
            if (matrix[rowIndex - 1]) {
              const topLeft = matrix[rowIndex - 1][colIndex - 1]
              if (topLeft && !topLeft.isShow) {
                result.push({
                  row: rowIndex - 1,
                  col: colIndex - 1
                })
              }
              const topCenter = matrix[rowIndex - 1][colIndex]
              if (topCenter && !topCenter.isShow) {
                result.push({
                  row: rowIndex - 1,
                  col: colIndex
                })
              }
              const topRight = matrix[rowIndex - 1][colIndex + 1]
              if (topRight && !topRight.isShow) {
                result.push({
                  row: rowIndex - 1,
                  col: colIndex + 1
                })
              }
            }

            // 左右
            const left = matrix[rowIndex][colIndex - 1]
            if (left && !left.isShow) {
              result.push({
                row: rowIndex,
                col: colIndex - 1
              })
            }
            const right = matrix[rowIndex][colIndex + 1]
            if (right && !right.isShow) {
              result.push({
                row: rowIndex,
                col: colIndex + 1
              })
            }

            // 下の行
            if (matrix[rowIndex + 1]) {
              const bottomLeft = matrix[rowIndex + 1][colIndex - 1]
              if (bottomLeft && !bottomLeft.isShow) {
                result.push({
                  row: rowIndex + 1,
                  col: colIndex - 1
                })
              }
              const bottomCenter = matrix[rowIndex + 1][colIndex]
              if (bottomCenter && !bottomCenter.isShow) {
                result.push({
                  row: rowIndex + 1,
                  col: colIndex
                })
              }
              const bottomRight = matrix[rowIndex + 1][colIndex + 1]
              if (bottomRight && !bottomRight.isShow) {
                result.push({
                  row: rowIndex + 1,
                  col: colIndex + 1
                })
              }
            }
          }
        })
      })

      return result
    },
    onChangeFlg (data) {
      const target = this.matrix[data.line][data.col]
      target.flg = !target.flg
    }
  }
}
</script>

<style>
.tool-bar {
  margin-top: 40px;
  background-color: #ddd;
  width: 800px;
  height: 40px;
  padding: 8px;
}

.field {
  /*width: 800px;*/
  /*background-color: #eee;*/
  /*height: 400px;*/
  /*border: 1px solid #cecece;*/
}

.mas {
  width: 22px;
  height: 22px;
  border: 1px solid #cecece;
  border-left-width: 0;
  border-top-width: 0;
  /*display: inline-block;*/
  float: left;
  margin: 0;
  padding: 3px 0 0;
  font-size: 11px;
  text-align: center;
  font-weight: bold;
  user-select: none;
}

.mas.num-1 { color: blue }
.mas.num-2 { color: green }
.mas.num-3 { color: red }
.mas.num-4 { color: red }
.mas.num-5 { color: red }
.mas.num-6 { color: red }
.mas.num-7 { color: red }
.mas.num-8 { color: red }

.un-show {
  background-color: #eee;
  /*border: 3px solid #ddd;*/
  /*border-style: inset;*/
  padding: 1px 0 0;
	border-top: 3px solid #DDD;
	border-left: 3px solid #DDD;
	border-right: 3px solid #BBB;
	border-bottom: 3px solid #BBB;

}
.test-mas span {
  margin-left: 6px;
}

.glyphicon-flag {
  color: blue;
}

.glyphicon-asterisk {
  color: red;
}

.container {
  padding-top: 30px;
}

.bs-example {
  margin-right: 0;
  margin-left: 0;
  background-color: #fff;
  border-color: #ddd;
  border-width: 1px;
  border-radius: 4px 4px 0 0;
  -webkit-box-shadow: none;
  box-shadow: none;

  position: relative;
  margin: 0 -15px 15px;
  border-style: solid;
  padding: 15px 15px;
}

.main-borad {
  border-width: 1px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  margin: -15px -15px 15px;
  padding: 14px 14px;
  background-color: #f7f7f9;
  border: 1px solid #e1e1e8;
  border-top-width: 0;
}
</style>
