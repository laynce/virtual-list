import { onBeforeUnmount, onMounted, ref, computed, nextTick} from '../../lib/vue.js'

export default {
  name: 'VirtualList',
  props: {
    itemHeight: {
      type: Number,
      default: 32
    },
    itemClass: {
      type: String,
      default: ''
    },
    containerHeight: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: ()=> ([])
    }
  },
  setup (props) {
    const virtualList = ref(null)

    const alreadyScrollNum = ref(0)

    const marginTop = ref(0)

    const activeList = computed(() => {
      const { containerHeight, itemHeight, list } = props
      const num = parseInt(containerHeight / itemHeight)
      const scrollNum = alreadyScrollNum.value
      return list.slice(scrollNum, scrollNum + num + 1)
    })

    const scroll = _.throttle(() => {
      const container = virtualList.value
      const num = parseInt(container.scrollTop / props.itemHeight)
      // marginTop 保证内容一直显示在视区范围内
      marginTop.value = `${num * props.itemHeight}px`
      alreadyScrollNum.value = num
    }, 40)

    onMounted(async () => {
      await nextTick()
      virtualList.value.addEventListener('scroll', scroll)
    })

    onBeforeUnmount(() => {
      virtualList.value.removeEventListener('scroll', scroll)
    })

    return {
      virtualList,
      activeList,
      marginTop,
    }
  },
  template: `<div
  ref="virtualList"
  class="virtual-list"
  :style="{
    height: containerHeight + 'px'
  }"
>
  <div
    class="virtual-list-mg"
    :style="{
      height: itemHeight * list.length + 'px'
    }"
  />

  <ul
    class="virtual-list-container"
    :style="{
      marginTop: marginTop,
    }"
  >
    <li
      v-for="(item, index) in activeList"
      :key="index"
      class="virtual-list-item"
      :class="itemClass"
    >
      <slot
        v-bind="item"
      />
    </li>
  </ul>
</div>`
}