<template>
  <div id="home">
    <NavBar class="home-nav"><div slot="center">购物街</div></NavBar>
    <HomeSwiper :banners="banners"/>
    <RecommendView :recommends="recommends"/>
    <FeatureView/>

    <TabControl @tabClick="tabClick" class="tab-control" :titles="titles"></TabControl>

    <GoodsList :goods="showGoods"></GoodsList>


    <ul>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
      <li>列表4</li>
      <li>列表5</li>
      <li>列表6</li>
      <li>列表7</li>
      <li>列表8</li>
      <li>列表9</li>
      <li>列表10</li>
    </ul>
    <ul>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
      <li>列表4</li>
      <li>列表5</li>
      <li>列表6</li>
      <li>列表7</li>
      <li>列表8</li>
      <li>列表9</li>
      <li>列表10</li>
    </ul>
    <ul>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
      <li>列表4</li>
      <li>列表5</li>
      <li>列表6</li>
      <li>列表7</li>
      <li>列表8</li>
      <li>列表9</li>
      <li>列表10</li>
    </ul>
    <ul>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
      <li>列表4</li>
      <li>列表5</li>
      <li>列表6</li>
      <li>列表7</li>
      <li>列表8</li>
      <li>列表9</li>
      <li>列表10</li>
    </ul>
  </div>
</template>

<script>
import HomeSwiper from './childcomps/HomeSwiper'
import RecommendView from './childcomps/RecommendView'
import FeatureView from './childcomps/FeatureView'


import NavBar from '../../components/common/navbar/NavBar'
import TabControl from '../../components/content/tabcontrol/TabControl'
import GoodsList from '../../components/content/goods/GoodsList'

import { getMultiData, getHomeGoods } from '../../network/home'



export default {
  name: "Home",
  components: {
    NavBar,
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
      currentType: 'pop'
    }
  },
  created(){
    this.getMultiData()

    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

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
        console.log(res);
      })
    },
    tabClick(index){
      console.log(index);
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

    }

  }
}
</script>

<style scoped>
  #home {
    padding-top: 44px;
    //background-color: #fff;
  }

  .home-nav {
    background: var(--color-tint);
    color: white;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;

    z-index: 9;
  }
  .tab-control {
    position: sticky;
    top: 44px;
    background-color: #fff;
    z-index: 9;
  }
</style>
