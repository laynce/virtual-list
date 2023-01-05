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
  template: '#virtualListTemp'
}