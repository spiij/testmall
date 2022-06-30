import {debounce} from "./utils";

import BackTop from "../components/content/backtop/BackTop";

export const itemListnerMixin = {
  data(){
    return {
      itemImgLoad: null,
    }
  },
  mounted(){
    const refresh = debounce(this.$refs.scroll.refresh, 50)

    this.itemImgLoad = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgLoad)

    //console.log('我是混入的内容')
  }
}


export const backTopMixin = {
  data(){
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick(){
      this.$refs.scroll.scrollTo(0, 0, 500)
      console.log('backClick');
    }
  },
  components: {
    BackTop
  }
}