import virtualList from "./virtual-list.js";


const virtualListPlugin = {
  install: (vue) => {
    vue.component('VirtualList', virtualList)
  }
}


export default virtualListPlugin