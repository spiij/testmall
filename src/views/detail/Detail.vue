<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="dcontent" ref="scroll" :probe-type="3" @scroll="contentScroll">

<!--      <ul>-->
<!--        <li v-for="item in $store.state.cartList">-->
<!--          {{item.iid + "" +  item.count}}-->
<!--        </li>-->
<!--      </ul>-->

      <DetailSwiper :top-images="topImages"></DetailSwiper>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addCart="addToCart"/>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "../../components/common/scroll/Scroll";

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from "../../network/detail";

import GoodsList from "../../components/content/goods/GoodsList";
import { debounce } from "../../common/utils";
import { itemListnerMixin, backTopMixin } from "../../common/mixin";

import { mapActions } from 'vuex'

export default {
  name: "Detail",
  data(){
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeYs: null,
      // itemImgLoad: null,

      currentIndex: 0
    }
  },
  created() {
    //console.log(this.$route.params);
    this.iid = this.$route.params.id

    getDetail(this.iid).then(res => {
      console.log(res);
      this.topImages = res.result.itemInfo.topImages

      this.goods = new Goods(res.result.itemInfo, res.result.columns, res.result.shopInfo.services)

      this.shop = new Shop(res.result.shopInfo)

      this.detailInfo = res.result.detailInfo

      this.paramInfo = new GoodsParam(res.result.itemParams.info, res.result.itemParams.rule)

      if(res.result.rate.cRate !== 0){
        this.commentInfo = res.result.rate.list[0]

      }

      // this.themeTopYs = []
      //
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //
      // console.log(this.themeTopYs);

      this.$nextTick(() => {

      })

    })

    getRecommend().then(res => {
      //console.log(res)
      this.recommends = res.data.list
    })

    this.getThemeYs = debounce(() => {
      this.themeTopYs = []

      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

      this.themeTopYs.push(Number.MAX_VALUE)
      //console.log(this.themeTopYs);
    }, 200)
  },
  mounted() {
    //console.log('mounted');

  },
  updated() {

  },
  mixins: [itemListnerMixin, backTopMixin],
  destroyed() {
    //console.log('destroyed');
    this.$bus.$off('itemImageLoad', this.itemImgLoad)
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad(){
      //console.log('----');
      this.$refs.scroll.refresh()

      this.getThemeYs()
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      //console.log(index);
    },
    contentScroll(position){
      //console.log(position);
      const positionY = -position.y

      //console.log(Number.MAX_VALUE)

      // for(let i in this.themeTopYs){
      //   console.log(i+1)
      // }
      let length = this.themeTopYs.length


      for(let i = 0; i < length-1; i++){
        // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
        //
        // }

        // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i
        //   console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }

        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      this.isShowBackTop = (-position.y) > 1000
    },
    addToCart(){
      //console.log('-----');
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.nowPrice
      product.iid = this.iid

      // this.$store.cartList.push(product)
      //this.$store.commit('addCart', product)

      this.addCart(product).then(res => {
        console.log(res);
      })

      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })
    }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 19;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 99;
    background-color: #fff;
  }
  .dcontent{
    height: calc(100% - 44px - 49px);
  }
</style>