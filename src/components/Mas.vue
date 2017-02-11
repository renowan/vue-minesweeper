<template>
  <div :class="cl" @click="onClick">
    <span v-if="!data.isShow && data.flg"><i class="glyphicon glyphicon-flag"></i></span>
    <span v-if="data.isShow && data.data !== '*'">{{data.data === '0' ? '' : data.data}}</span>
    <span v-if="data.isShow && data.data === '*'"><i class="glyphicon glyphicon-asterisk"></i></span>
  </div>
</template>

<script>
export default {
  name: 'hello',
  computed: {
    cl () {
      const data = this.data.data
      const isShow = this.data.isShow
      let arr = ['mas']
      if (!isShow) arr.push('un-show')
      if (isShow && data !== '*') arr.push('num-' + data)
      return arr
    }
  },
  props: {
    data: {type: Object}
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    onClick () {
      this.$emit('click-mas', this.data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
