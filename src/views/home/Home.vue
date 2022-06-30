<template>
  <div id="home">
    <NavBar class="home-nav"><div slot="center">购物街</div></NavBar>
    <TabControl @tabClick="tabClick"
                :titles="titles"
                ref="tabControl1"
                class="tab" v-show="isTabFixed">
    </TabControl>

    <scroll
        class="scontent"
        ref="scroll"
        :probe-type="3"
        @scroll="scroll"
        :pull-up-load="true"
        @pullingUp="loadMore">
      <HomeSwiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <RecommendView :recommends="recommends"/>
      <FeatureView/>

      <TabControl @tabClick="tabClick"
                  :titles="titles"
                  ref="tabControl2">
      </TabControl>

      <GoodsList :goods="showGoods"></GoodsList>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from './childcomps/HomeSwiper'
import RecommendView from './childcomps/RecommendView'
import FeatureView from './childcomps/FeatureView'


import NavBar from '../../components/common/navbar/NavBar'
import Scroll from '../../components/common/scroll/Scroll'
import TabControl from '../../components/content/tabcontrol/TabControl'
import GoodsList from '../../components/content/goods/GoodsList'
//import BackTop from "../../components/content/backtop/BackTop";

import { getMultiData, getHomeGoods } from '../../network/home'
// import { debounce } from '../../common/utils'

import { itemListnerMixin, backTopMixin } from "../../common/mixin";

export default {
  name: "Home",
  components: {
    NavBar,
    Scroll,
    HomeSwiper,
    RecommendView,
    FeatureView,

    TabControl,
    GoodsList
  },
  computed: {
    showGoods(){
      return this.goods[this.currentType].list
    }
  },
  data(){
    return {
      banners: [],
      recommends: [],
      titles: ['流行', '新款', '精选'],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] }
      },
      currentType: 'pop',

      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,


    }
  },
  created(){
    this.getMultiData()

    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },

  mixins: [itemListnerMixin, backTopMixin],
  // mounted() {
  //   const refresh = debounce(this.$refs.scroll.refresh, 50)
  //
  //   this.itemImgLoad = () => {
  //     //console.log('-----');
  //     //this.$refs.scroll.scroll.refresh()
  //
  //     refresh()
  //   }
  //
  //   this.$bus.$on('itemImageLoad', this.itemImgLoad)
  //
  //   //console.log(this.$refs.tabControl.$el.offsetTop);
  // },
  destroyed() {
    console.log('home destroyed');
  },
  activated() {
    //console.log('activated');
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    //console.log('deactivated');
    this.saveY = this.$refs.scroll.scroll.y
    this.$bus.$off('itemImageLoad', this.itemImgLoad)
  },
  methods: {
    getMultiData(){
      getMultiData().then(res => {
        //console.log(res)
        // this.result = res.data.banner.list

        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1
      getHomeGoods(type, 1).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        //console.log(res);
        this.$refs.scroll.scroll.finishPullUp()
      })
    },
    tabClick(index){
      //console.log(index);
      switch(index){
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
           this.currentType = 'sell'
          break;
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },

    scroll(position){
      // console.log(position);
      this.isShowBackTop = (-position.y) > 1000

      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore(){
      // console.log('上拉加载更多');
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      //console.log(this.tabOffsetTop);
      //console.log(this.$refs.tabControl.$el.offsetTop);
      //console.log("======");
    }


  }
}
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    /*background-color: #fff;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background: var(--color-tint);
    color: white;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/

    /*z-index: 9;*/
  }
  .tab {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  /*.tab-control {*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  background-color: #fff;*/
  /*  z-index: 9;*/
  /*}*/

  .scontent {
    /*height: 300px;*/
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/

  /*.fixed {*/
  /*  position: fixed;*/
  /*  left: 0;*/
  /*  top: 44px;*/
  /*  right: 0;*/
  /*}*/
</style>
