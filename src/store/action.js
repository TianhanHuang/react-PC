import * as type from './action-type'

// 保存用户消息
export const saveUserInfo = (userInfo) => {
  return {
    type: type.SAVE_USERINFO,
    userInfo
  }
}

// 修改用户信息
export const saveAttrInfo = (datatype, value) => {
  return {
    type: type.SAVE_ATTRINFO,
    datatype,
    value,
  }
}

// 修改用户信息
export const modifyUserInfo = (key, value) => {
  return {
    type: type.MODIFY_USERINFO,
    key,
    value
  }
}


export const addAmount = (amount) => {
  console.log({amount})
  return {
    type: type.ADDAMOUNT,
    amount
  }
}

export const changeLoginStatus = (status) => {
  return {
    type: type.LOGINFORM,
    status
  }
}
// 表格数据
export const getOrderList = (list) => {
  return {
    type: type.ORDERLIST,
    list
  }
}
// 是否加载表格数据
export const changeLoading = (value) => {
  return {
    type: type.LOADING,
    value
  }
}

// 快捷支付短信数据
export const getSmsCodeData = (value) => {
  return {
    type: type.SMSCODEDATA,
    value
  }
}