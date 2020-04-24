import * as user from './action-type'
let defaultState = {
  addressList: [],   // 地址列表
  addressName: '',  // 选中的地址
  temMessage: '', //临时姓名
  hasAddressList: [], // 已有的地址
  operate: 'edit',
  userInfo: {},
  geohash: [],
  amount: 1,
  loginForm: 1,
  orderList: {
    list: []
  },
  loading: true,
  smsCodeData: {}
}

// 用户消息
export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case user.SAVE_USERINFO:
      return {
        ...state,
        userInfo: action.userInfo
      }
    case user.SAVE_ATTRINFO:
      return {...state, ...{[action.datatype]: action.value}};
    case user.MODIFY_USERINFO:
      return {...state, userInfo: {...state.userInfo, [action.key]: action.value}};
    case user.ADDAMOUNT:
      console.log({action})
      return {...state, amount: ++action.amount}
    case user.LOGINFORM:
    console.log({action})
      return {...state, loginForm: action.status}
    case user.ORDERLIST:
      return {...state, orderList: action.list}
    case user.LOADING:
      return {...state, loading: action.value}
    case user.SMSCODEDATA:
      return {...state, smsCodeData: action.value}
    default:
      return state
  }
}