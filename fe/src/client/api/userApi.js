import request from "@/client/request"

const login = (data) => {

    return request.post("api/users/login", data)
};

const register = (data) => {

    return request.post("api/users/register", data)
};

const getUserInfo = () => {
    return request.get("api/users/info")
};


const getWithdrawalList = () => {
    return request.get("api/users/withdrawallist")
};

const changePassword = (data) => {
    return request.patch("api/users/change-password", data)
}

const recharge = (data) => {
    return request.post("api/pay/vnd", data)
}

const withdrawal = (data) => {
    return request.post("api/users/withdrawal-vnd", data)
}


const updateBankInfo = (data) => {
    return request.patch("api/users/update-bank-info", data)
}

const getBankInfo = () => {
    return request.get("api/users/my-bank-info")
}

const uploadAvatar = (data, config) => {
    return request.post('api/auth/avatar', data, config)
}

const uploadPassportFront = (data, config) => {
    return request.post('api/auth/passport/front', data, config)
}

const uploadPassportBack = (data, config) => {
    return request.post('api/auth/passport/back', data, config)
}

const getRechargeHistory = () => {
    return request.get("api/trades/hist-desposit-user")
}

const getWithdrawalHistory = (data) => {
    return request.get("api/trades/hist-withdrawal-user")
}

const getBankNapInfo = (data) => {
    return request.get("api/users/bank-info")
}

const getBetHistory = () => {
    return request.get("api/users/history-order")
}

const getBetHistoryByDate = (params) => {
    return request.get("api/users/history-order-date", { params })
}


export {
    login,
    register,
    getUserInfo,
    changePassword,
    recharge,
    withdrawal,
    getRechargeHistory,
    getWithdrawalHistory,
    uploadAvatar,
    updateBankInfo,
    uploadPassportFront,
    uploadPassportBack,
    getBankInfo,
    getBankNapInfo,
    getBetHistory,
    getBetHistoryByDate,
    getWithdrawalList,
}
