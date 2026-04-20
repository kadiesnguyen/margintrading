import ApiAdmin from '@/services/ApiAdmin'

export default {

    //========== MEMBER


    getRevenueNap(){
        return ApiAdmin().get('api/trades/getRevenueNap')
    },

    getRevenueRut(){
        return ApiAdmin().get('api/trades/getRevenueRut')
    },

    getRevenueTrans(){
        return ApiAdmin().get('api/trades/getRevenueTrans')
    },

    getShowDT(obj){
        return ApiAdmin().post('api/trades/getShowDT', obj)
    },

    changeAccMarketing(obj){
        return ApiAdmin().post('api/users/changeAcc', obj)
    },

    changePassAdmin(obj){
        return ApiAdmin().post('api/users/changPassAd', obj)
    },

    createUser(obj){
        return ApiAdmin().post('api/users/create', obj)
    },

    createAgency(obj){
        return ApiAdmin().post('api/users/agency', obj)
    },

    updateAgency(obj){
        return ApiAdmin().patch('api/users/agency', obj)
    },

    getCapDuoiInfo(params){
        return ApiAdmin().get('api/users/cap-duoi-info', { params })
    },

   

    register (obj) {
        return ApiAdmin().post('api/users/register', obj)
    },

    loginAdmin (obj) {
        return ApiAdmin().post('api/users/AdminSingIn', obj)
    },

    getAllMember(params){
        return ApiAdmin().get('api/users/getAllUser', {params})
    },

    updateMember(obj){
        return ApiAdmin().patch('api/users/updateUser', obj)
    },

    updateMoneyMember(obj){
        return ApiAdmin().patch('api/users/updateMoney', obj)
    },

    // handleMoney(obj) {
    //     return ApiAdmin().post('api/pay/approval', obj);
    // },

    // handleMoneyRut(obj) {
    //     return ApiAdmin().post('api/pay/approval-rut', obj);
    // },

    deleteMember(id){
        return ApiAdmin().delete('api/users/deleteUserById/'+id)
    },

    analyticsUser(id){
        return ApiAdmin().get('api/users/analytics/'+id)
    },

    enabledAccount(id){
        return ApiAdmin().get('api/users/enabled/'+id)
    },

    disabledAccount(id){
      return ApiAdmin().get('api/users/disabled/'+id)
    },

    verifiedUser(obj){
        return ApiAdmin().post('api/users/verifiedUser', obj)
    },

    getListAgency(){
        return ApiAdmin().get('api/users/getAgency')
    },

    updateUpline(data){
        return ApiAdmin().post('api/users/update-upline', data)
    },

    viewMemberAgency(id){
        return ApiAdmin().get('api/users/viewTotalMAgency/'+id)
    },

    getRateCommission(){
        return ApiAdmin().get('api/setup/getRateCommission')
    },

    saveRateCommission(obj){
        return ApiAdmin().post('api/setup/saveRateCommission', obj)
    },

    saveRateCommission(obj){
        return ApiAdmin().post('api/setup/saveRateCommission', obj)
    },


    //==========

    //================
    //================
    //================
    //========== TRADE
    //================
    //================
    //================

    getAddMoneyListHistory(){
        return ApiAdmin().get('api/trades/historyAllAddMoney');
    },

    getTotalAddMoney(){
        return ApiAdmin().get('api/trades/totalAddMoney');
    },


    getTradeListHistory(){
        return ApiAdmin().get('api/trades/historyAll');
    },


    gethistoryAllTrash(){
        return ApiAdmin().get('api/trades/historyAllTrash');
    },


    deleteTrashByID(obj){
        return ApiAdmin().patch('api/trades/deleteTradeHisById', obj);
    },

    getDepositListHistory(){
        return ApiAdmin().get('api/trades/hisDepositAll');
    },


    getDepositAllTrash(){
        return ApiAdmin().get('api/trades/hisDepositAllTrash');
    },

    getWithdrawalListHistory(){
        return ApiAdmin().get('api/trades/hisWithDrawalAll');
    },

    doneWithDrawalByID(obj){
        return ApiAdmin().post('api/trades/doneWithdrawal', obj)
    },

    doneRefuseWithDrawalByID(obj){
        return ApiAdmin().post('api/trades/doneRefuseWithdrawal', obj)
    },

    getListF1F7(obj){
        return ApiAdmin().post('api/users/getListF1F7', obj)
    },

    getLisCommissionSearch(obj){
        return ApiAdmin().post('api/users/getListCmsHis', obj)
    },

    getbankList(){
        return ApiAdmin().get('api/users/bank-list')
    },

    setBankList(data){
        return ApiAdmin().post('api/users/bank-list', data)
    },



    //================
    //================
    //================
    //================
    //================

    //================
    //================
    //================
    //========== Analytics
    //================
    //================
    //================


    getAnalytics(params){
        return ApiAdmin().get('api/users/analytics', {params})
    },


    //================
    //================
    //================
    //========== Analytics
    //================
    //================
    //================



    //================
    //================
    //================
    //========== BET
    //================
    //================
    //================

    getBetsListHistory(){
        return ApiAdmin().get('api/bets/historyBet')
    },

    getBetsListHisTrash(){
        return ApiAdmin().get('api/bets/hisBetTrash')
    },

    deleteBetsTrash(obj){
        return ApiAdmin().patch('api/bets/deleteBet', obj)
    },

    //================
    //================
    //================
    //========== EXCHANGE
    //================
    //================
    //================

    getExListHistory(){
        return ApiAdmin().get('api/exs/historyEx')
    },

    getExListHisTrash(){
        return ApiAdmin().get('api/exs/historyExTrash')
    },

    deleteExTrash(obj){
        return ApiAdmin().patch('api/exs/deleteEx', obj)
    },


    getRolesList(role){
        return ApiAdmin().get('api/users/roles-list/' + role)
    },

    updateRoleList(role, obj){
        return ApiAdmin().post('api/users/roles-list/' + role, obj)
    }
}

// AuthenticationService.register({
//         email: 'testing@gmail.com',
//         password: '123456'
// })
