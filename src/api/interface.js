// const interface = {
//   userLogin: '/buyer/user/login'
// }
// export {interface}
export default {
  userLogin: '/buyer/api/user/login', // 买家登录
  userLoginOut: '/buyer/api/user/login-out', // 买家登出
  smsCodeLogin: '/buyer/api/sms-code/login', // 登录 验证码
  smsCodeFindPwd: '/buyer/api/sms-code/find-pwd', // 忘记密码 验证码
  smsCodeRegister: '/buyer/api/sms-code/register',
  findPwd: '/buyer/api/user/find-pwd', // 找回密码
  register: '/buyer/api/user/register', // 注册
  userInfo: '/buyer/api/user/user-detail', // 用户信息
  orderNav: '/buyer/api/order/order-nav', //订单导航
  orderList: '/buyer/api/order/order-list', //订单列表
  orderFilter: '/buyer/api/order/order-filter', // 获取订单列表筛选
  orderInfo: '/buyer/api/order/order-detail', // 获取订单详情
  orderDelete: '/buyer/api/order/submit-order-delete', // 订单删除
  orderCancel: '/buyer/api/order/submit-order-cancel', //取消订单
  confirmReceipt: '/buyer/api/order/submit-order-receipt', // 确认收货
  updateUserInfo: '/buyer/api/user/update-user-detail', // 修改个人资料
  getAddressList: '/buyer/api/user/address/list', // 收货地址
  saveAddress: '/buyer/api/user/address/save', // 修改，新增地址
  deleteAddress: '/buyer/api/user/address/delete', // 删除收货地址
  getAddressArea: '/buyer/api/area/area-list', // 获取省市区联动地址
  getAddressInfo: '/buyer/api/user/address/info', // 获取地址详情
  periodList: '/buyer/api/period/list', // 账期列表
  periodDetail: '/buyer/api/period/detail', // 账期详情
  bindyinlianCard: '/buyer/api/pab/cross/bind-bank', // 银联绑卡
  getBankList: '/buyer/api/pab/cross/check-stand', // 快捷银行卡列表
  orderDetail: '/buyer/api/order/order-detail', //获取订单详情
  getSmeCode: '/buyer/api/pab/cross/quick-pay-sms', // 获取验证码
  paypay: '/buyer/api/pay/pay', // 支付
  wangdata: '/buyer/api/pab/cross/get-bank-limit', // 网关限制
  payCheck: '/buyer/api/pay/check', // 支付宝轮询
  periodPay: '/buyer/api/period/pay', // 账期支付
  periodSms: '/buyer/api/pab/cross/quick-pay-sms-by-period' // 账期支付
}