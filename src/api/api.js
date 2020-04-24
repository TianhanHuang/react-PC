import Server from './server'
import qs from 'qs'
import { message } from 'antd'
import interfaceUrl from './interface'
class API extends Server {
  /**
   *  用途：用户登录
   *  @url http://cangdu.org:8001/v1/captchas
   *  返回result为1表示成功
   *  @method post
   *  @return {promise}
   */
  async sellerLogin(data) {
    let result = await this.axios('post', interfaceUrl.userLogin, qs.stringify(data))
    console.log(result)
    if (result.result === 1) {
    }
    return result || []
  }

  /**
   *  用途：用户登出
   *  @url http://cangdu.org:8001/v1/captchas
   *  返回result为1表示成功
   *  @method post
   *  @return {promise}
   */
  async sellerLoginOut(data) {
    let result = await this.axios('post', interfaceUrl.userLoginOut, qs.stringify(data))
    console.log(result)
    if (result.result === 1) {
      message.success(result.msg)
    }
    return result || []
  }

  /**
   *  用途：获取登录验证码
   *  @method post
   *  @return {promise}
   */
  async getSmsCode(data, type) {
    let url = ''
    switch (type) { // 普通登录
      case 1:
        url = interfaceUrl.smsCodeLogin
        break;
      case 2: 
        url = interfaceUrl.smsCodeFindPwd
        break;
      case 3:
        url = interfaceUrl.smsCodeRegister
        break;
      default:
        break;
    }
    let result = await this.axios('post', url, qs.stringify(data))
    console.log(result)
    if (result.result === 1) {
      message.success(result.msg);
    }
    return result || []
  }
  /**
   *  用途：忘记密码
   *  @method post
   *  @return {promise}
   */
  async findPwd(data) {
    let result = await this.axios('post', interfaceUrl.findPwd, qs.stringify(data))
    console.log(result)
    if (result.result === 1) {
      message.success(result.msg);
    }
    return result || []
  }
  
  /** 注册
   *  @method post
   *  @return {promise}
   */
  async userRegister(data) {
    let result = await this.axios('post', interfaceUrl.register , qs.stringify(data))
    console.log(result)
    if (result.result === 1) {
      message.success(result.msg);
    }
    return result || []
  }

  /** 获取用户信息
   *  @method get
   *  @return {promise}
   */
  async getUserInfo(data) {
    let result = await this.axios('get', interfaceUrl.userInfo , qs.stringify(data))
    return result || []
  }

  /** 获取订单导航
   *  @method get
   *  @return {promise}
   */
  async getNavList(data) {
    let result = await this.axios('get', interfaceUrl.orderNav , data)
    return result || []
  }

  /** 获取订单列表
   *  @method get
   *  @return {promise}
   */
  async getOrderList(data) {
    let result = await this.axios('get', interfaceUrl.orderList , data)
    return result || []
  }

  /** 获取订单筛选条件
   *  @method get
   *  @return {promise}
   */
  async orderFilter(data) {
    let result = await this.axios('get', interfaceUrl.orderFilter , data)
    return result || []
  }

   /** 获取订单详情
   *  @method get
   *  @return {promise}
   */
  async orderDetail(data) {
    let result = await this.axios('get', interfaceUrl.orderInfo , data)
    return result || []
  }
  
  /** 删除订单
   *  @method post
   *  @return {promise}
   */
  async deleteOrder(data) {
    let result = await this.axios('post', interfaceUrl.orderDelete , qs.stringify(data))
    return result || []
  }
  /** 取消订单
   *  @method post
   *  @return {promise}
   */
  async orderCancel(data) {
    let result = await this.axios('post', interfaceUrl.orderCancel , qs.stringify(data))
    return result || []
  }

  /** 取消订单
   *  @method post
   *  @return {promise}
   */
  async confirmReceipt(data) {
    let result = await this.axios('post', interfaceUrl.confirmReceipt , qs.stringify(data))
    return result || []
  }

  /** 修改个人信息
   *  @method post
   *  @return {promise}
   */
  async updateUserInfo(data) {
    let result = await this.axios('post', interfaceUrl.updateUserInfo , qs.stringify(data))
    return result || []
  }

  /** 获取收货地址列表
   *  @method post
   *  @return {promise}
   */
  async getAddressList(data) {
    let result = await this.axios('post', interfaceUrl.getAddressList , qs.stringify(data))
    return result || []
  }

  /** 编辑和新增收货地址
   *  @method post
   *  @return {promise}
   */
  async saveAddress(data) {
    let result = await this.axios('post', interfaceUrl.saveAddress , data)
    return result || []
  }

   /** 删除收货地址
   *  @method post
   *  @return {promise}
   */
  async deleteAddress(data) {
    let result = await this.axios('post', interfaceUrl.deleteAddress , qs.stringify(data))
    return result || []
  }

  /** 获取省市区 三级联动地址
   *  @method post
   *  @return {promise}
   */
  async getAddressArea(data) {
    let result = await this.axios('get', interfaceUrl.getAddressArea , (data))
    return result || []
  }

  /** 获取地址详情
   *  @method post
   *  @return {promise}
   */
  async getAddressInfo(data) {
    let result = await this.axios('get', interfaceUrl.getAddressInfo , (data))
    return result || []
  }

  /** 获取账期列表
   *  @method post
   *  @return {promise}
   */
  async getperiodList(data) {
    let result = await this.axios('get', interfaceUrl.periodList , (data))
    return result || []
  }

  /** 获取账期列表
   *  @method post
   *  @return {promise}
   */
  async getPeriodInfo(data) {
    let result = await this.axios('get', interfaceUrl.periodDetail , (data))
    return result || []
  }

  /** 银联绑卡 -- 获取请求URL
   *  @method post
   *  @return {promise}
   */
  async bindyinlianCard(data) {
    let result = await this.axios('get', interfaceUrl.bindyinlianCard , (data))
    return result || []
  }

  /** 银联绑卡
   *  @method post
   *  @return {promise}
   */
  async bindBank(data, URL) {
    let result = await this.axios('post', URL , (data))
    return result || []
  }
   /** 获取银行卡列表
   *  @method post
   *  @return {promise}
   */
  async getBankList(data) {
    console.log(interfaceUrl.getBankList)
    let result = await this.axios('get', interfaceUrl.getBankList, (data))
    return result || []
  }
  /** 获取订单详情
   *  @method post
   *  @return {promise}
   */
  async getOrderDetail(data) {
    console.log(interfaceUrl.getBankList)
    let result = await this.axios('get', interfaceUrl.orderDetail, (data))
    return result || []
  }
  /** 获取验证码
   *  @method post
   *  @return {promise}
   */
  async getSms(data) {
    let result = await this.axios('post', interfaceUrl.getSmeCode, (data))
    return result || []
  }

  /** 快捷支付
   *  @method post
   *  @return {promise}
   */
  async quickPay(data) {
    let result = await this.axios('post', interfaceUrl.paypay, qs.stringify(data))
    return result || []
  }

  /** 快捷支付
   *  @method get
   *  @return {promise}
   */
  async getTable(data) {
    let result = await this.axios('get', interfaceUrl.wangdata, (data))
    return result || []
  }

  /** 支付宝支付轮询
   *  @method get
   *  @return {promise}
   */
  async payCheck(data) {
    let result = await this.axios('get', interfaceUrl.payCheck, (data))
    return result || []
  }
  
  /** 账期支付
   *  @method post
   *  @return {promise}
   */
  async periodPay(data) {
    let result = await this.axios('post', interfaceUrl.periodPay, (data))
    return result || []
  }

  /** 账期支付
   *  @method post
   *  @return {promise}
   */
  async getSmsPeriod(data) {
    let result = await this.axios('post', interfaceUrl.periodSms, (data))
    return result || []
  }
}

export default new API()