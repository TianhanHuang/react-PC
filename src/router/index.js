import asyncComponent from '@/utils/asyncComponent'
const login  = asyncComponent(() => import('@/pages/login/index')) // 登录
const cashier = asyncComponent(() => import('@/pages/pay/cashier')) // 收银台
const testPage1 = asyncComponent(() => import("@/pages/testPage/index"))
const myOrder = asyncComponent(() => import("@/pages/orderManage/myOrder/index")) // 我的订单
const accountPeriod = asyncComponent(() => import("@/pages/orderManage/accountPeriod/index")) // 我的账期
const payOnline = asyncComponent(() => import("@/pages/pay/payOnline/index")) // 在线支付
const orderInfo = asyncComponent(() => import("@/pages/orderManage/orderInfo/index")) // 订单详情
const personCenter = asyncComponent(() => import("@/pages/personCenter/index")) // 个人信息
const address = asyncComponent(() => import("@/pages/address/index")) // 收货地址
const accountPeriodDetail = asyncComponent(() => import("@/pages/orderManage/accountPeriod/detail/index")) // 账期详情
const result = asyncComponent(() => import("@/pages/pay/result/index")) // 支付结果
const success = asyncComponent(() => import("@/pages/pay/success/index")) // 支付成功
// 导航页面
let routes = [
  {
    path: '/',
    title: '我的订单',
    component: myOrder,
  },
  {
    path: '/orderManage/myOrder',
    title: '我的订单',
    component: myOrder,
  },
  {
    path: '/orderManage/orderInfo/:orderId',
    title: '订单详情',
    component: orderInfo,
  },
  {
    path: '/personCenter/index',
    title: '个人信息',
    component: personCenter,
  },
  {
    path: '/testPage/testPage',
    title: '测试页面',
    component: testPage1,
  },
  {
    path: '/orderManage/accountPeriod',
    title: '我的账期',
    component: accountPeriod,
    exact: true
  },
  {
    path: '/orderManage/accountPeriod/detail/:periodId',
    title: '账期详情',
    component: accountPeriodDetail,
    exact: true
  },
  {
    path: '/personCenter/address',
    title: '收货地址',
    component: address,
    exact: true
  }
]

// 单独的页面
let routes2 = [
  {
    path: '/login',
    title: '登录',
    component: login,
  },
  {
    path: '/pay/cashier',
    title: '收银台',
    component: cashier,
    exact: true
  },
  {
    path: '/pay/payOnline',
    title: '收银台',
    component: payOnline,
    exact: true
  },
  {
    path: '/pay/result',
    title: '支付结果',
    component: result,
    exact: true
  },
  {
    path: '/pay/success/:orderId',
    title: '支付成功',
    component: success,
    exact: true
  }
]
export {
  routes,
  routes2
}
// const otherRouter = [
//   {path:"/", component: layout },
// ]
// const mainRouter = [
//   {path:"/index", component: index },
//   // {path:"/", component: layout},
//   // {path:"/About", component: About},
// ]
// export {
//   otherRouter,
//   mainRouter
// }