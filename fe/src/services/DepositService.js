import  AdminDepositpAxios  from "./ApiAdmin"
import  UserDepositpAxios  from "./Api"

export default {
    depositVND(obj){
        return UserDepositpAxios().post('api/pay/vnd', obj)
    },

    handleMoney(obj) {
        return AdminDepositpAxios().post('api/pay/approval', obj);
    },

    handleMoneyRut(obj) {
        return AdminDepositpAxios().post('api/pay/approval-rut', obj);
    },

}
