<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
          class="check-button"
          :is-checked="isSelectAll"
          @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">合计：{{totalPrice}}</div>

    <div class="calculate">去计算({{checkLength}})</div>
  </div>
</template>

<script>
import CheckButton from "../../../components/content/checkbutton/CheckButton";

import { mapGetters } from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice(){
      return "￥" + this.cartList.filter(item => {
        return item.checked
      }).reduce((prev, item) => {
        return prev + item.count * item.price
      }, 0).toFixed(2)
    },
    checkLength(){
      return this.cartList.filter(item => {
        return item.checked
      }).length
    },
    isSelectAll(){
      if(this.cartList.length === 0){
        return false
      }


      // return !(this.cartList.filter(item => {
      //   return !item.checked
      // }).length)

      // return !(this.cartList.find(item => !item.checked))

      for(let item of this.cartList){
        if(!item.checked){
          return false
        }
      }

      return true
    }
  },
  methods: {
    checkClick(){
      if(this.isSelectAll){
        this.cartList.forEach(item => item.checked = false)
      }else {
        this.cartList.forEach(item => item.checked = true)
      }

    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    background-color: #eee;
    position: relative;
    /*bottom: 49px;*/
    line-height: 40px;
    display: flex;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    /*line-height: 40px;*/
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }

  .check-button {
    width: 22px;
    height: 22px;
    line-height: 22px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    /*float: right;*/
    width: 90px;
    background-color: #f00;
    color: #fff;
    text-align: center;
  }
</style>