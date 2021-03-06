import {
  ADD_TO_CART,
  ADD_COUNTER
} from "./mutation-types";


export default {
  addCart(context, payload){
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      if(oldProduct){
        context.commit(ADD_COUNTER, oldProduct)
        resolve("商品数量+1")
      }else {
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve("添加商品成功")
      }

    })
  }
}