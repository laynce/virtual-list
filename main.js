import { createApp } from './lib/vue.js'
import virtualListPlugin from './src/plugins/index.js'

const app = createApp({
  setup() {

    let list = []

    for (let i = 0; i < 100; i++) {
      list.push({
        name: `第${i+1}条`
      })
    }

    return {
      list
    }
  }
}) // param 传递一个根组件

app.use(virtualListPlugin)

app.mount('#app')

