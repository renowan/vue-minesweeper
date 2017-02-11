<template>
  <div id="app">
    <div class="container">

      <!-- tool-bar -->
      <div class="row">
        <div class="col-xs-12">
          <div class="tool-bar">tool-bar</div>
        </div>
      </div>

      <!-- field -->
      <div class="row">
        <div class="col-xs-12">
          <div class="field clearfix">
            <div v-for="line in matrix" class="clearfix">
              <Mas v-for="m in line" :data="m" v-on:click-mas="onClickMas"></Mas>
            </div>


            <!-- <div class="mas">3</div>
            <div class="mas hata">3</div>
            <div class="mas"><i class="glyphicon glyphicon-flag"></i></div>
            <div class="mas"><i class="glyphicon glyphicon-asterisk"></i></div> -->
          </div>

        </div>
      </div>

      <!-- デバッグ -->
      <div class="row">
        <div class="col-xs-12">
          <table class="table">
            <thead>
              <tr>
                <th width="110">#</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>爆弾数</td>
                <td>{{bom}}</td>
              </tr>
              <tr>
                <td>爆弾配列</td>
                <td class="test-mas" v-html="masDebug">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import * as utility from './utility'
import Mas from './components/Mas'

export default {
  name: 'app',
  components: {
    Mas
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
      /* 調整用変数 */
      masX: 10,        // フィールドサイズ X
      masY: 10,        // フィールドサイズ Y
      bomRate: 0.1,    // 爆弾率

      /* 制御用変数 */
      bom: 0,          // 爆弾数
      matrix: []       // 爆弾配分
    }
  },
  created () {
    // 爆弾の数
    this.init()
  },
  methods: {
    // 初期化
    init () {
      this.bom = Math.floor(this.masX * this.masY * this.bomRate)
      this.matrix = utility.creatMatrix(this.masX, this.masY, this.bom)
    },
    onClickMas (data) {
      const {line, col} = data
      let target = this.matrix[line][col]
      if (!target.isShow) {
        target.isShow = true
      }
      if (target.data === '0') {
        if (this.matrix[line + 1][col]) this.matrix[line + 1][col].isShow = true
        if (this.matrix[line - 1][col]) this.matrix[line - 1][col].isShow = true
        if (this.matrix[line + 1]) this.scan(line + 1, col)
        this.scan(line, col)
        if (this.matrix[line - 1]) this.scan(line - 1, col)
      }
    },
    checkMas (line, col, val) {
      let r = false
      const target = this.matrix[line][col]
      const nextTarget = this.matrix[line][col + val]
      console.log('ba', col + val)
      if (nextTarget && nextTarget.data === '0') {
        r = true
      } else {
        if (target && target.data === '0') {
          r = true
        }
      }
      return r
      // return target && nextTarget && target.data === '0'
    },
    scan (line, col) {
      let colPlueCounter = col + 1
      let colMinusCounter = col - 1
      while (this.checkMas(line, colPlueCounter, 1)) {
        this.matrix[line][colPlueCounter].isShow = true
        colPlueCounter += 1
        if (this.matrix[line][colPlueCounter]) {
          this.matrix[line][colPlueCounter].isShow = true
        }
      }
      while (this.checkMas(line, colMinusCounter, -1)) {
        this.matrix[line][colMinusCounter].isShow = true
        colMinusCounter -= 1
        if (this.matrix[line][colMinusCounter]) {
          this.matrix[line][colMinusCounter].isShow = true
        }
      }
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
  width: 800px;
  background-color: #eee;
  height: 400px;
  border: 1px solid #cecece;
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
</style>
