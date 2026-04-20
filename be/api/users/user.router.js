const {
    createAgency,
    updateAgency,
    getUserById,
    getAllUser,
    updateUserById,
    updateUserMoney,
    updateUserPasswordByEmail,
    deleteUserById,
    loginUser,
    getAdminByAdminUsername,
    verifiedAccount,
    getListAgency,
    viewMemberAgency,
    createUserAccount,
    withdrawallist,
    forgotPassAccount,
    activeUser,
    getInfoUser,
    updateInfoVerify,
    activeGoogle2FA,
    unActiveGoogle2FA,
    createGoogle2FA,
    listHisBO,
    WithDrawalVND,
    BalanceWallet,
    BankInfo,
    getBankList,
    setBankList,
    UserEnabled,
    UserDisabled,
    getNguoiGioiThieu,
    getBoStatistics,
    getBoStatisticsCurrentDay,
    getListHisOrder,
    getListHisOrderDate,
    getListHisTradeWallet,
    getListHisTradeWalletPage,
    getListHisTradeWalletHH,
    getListHisTradeWalletHHPage,
    getListHisTradeWalletWGD,
    getListHisTradeWalletWGDPage,
    getComDetails,
    getComDetailsPage,
    getComDetailsDate,
    getAgencySearchLevel,
    getAgencySearchName,
    getListAnalytics,
    getListAnalyticsDetail,
    changeAccType,
    changPassAd,
    getListCmsHis,
    getListNotifi,
    updateListNotifi,
    getUserBankInfo,
    getRolesList,
    updateRolesList,
    getCapDuoiInfo,
    updatePassword,
    updateBankInfo,
    updateUpline
}  = require("./user.controller");
const router = require("express");
const app = router();
const { checkToken, checkRole } = require("../../auth/token_validation");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.post("/register", createUserAccount);
app.get("/withdrawallist", withdrawallist);

app.post("/forgot-password", forgotPassAccount);

app.patch("/change-password", checkToken, updatePassword);

app.post("/agency", [checkToken, checkRole('*')], createAgency);

app.patch("/agency", [checkToken, checkRole('*')], updateAgency);

app.get('/getAllUser', [checkToken, checkRole('VIEW_USERS') ], getAllUser);

app.get('/getID/:id', checkToken, getUserById);


app.patch('/updateUser', [checkToken, checkRole('*')], updateUserById);

app.patch('/updatePassword', checkToken, updateUserPasswordByEmail);

app.patch('/updateMoney', [checkToken, checkRole('*') ], updateUserMoney);

app.delete('/deleteUserById/:id', checkToken, deleteUserById);


app.post("/activeUser", activeUser);

app.post("/login", loginUser);

app.post("/AdminSingIn", getAdminByAdminUsername);

app.post('/verifiedUser', [checkToken, checkRole('*')], verifiedAccount);

app.get('/analytics/:idUser', [checkToken, checkRole('VIEW_USERS')], getListAnalyticsDetail);

app.get('/getAgency', checkToken, checkRole('VIEW_AGENT'), getListAgency);

app.get('/viewTotalMAgency/:id', checkToken, viewMemberAgency)

app.get('/info', checkToken, getInfoUser)

app.get('/analytics', [checkToken, checkRole('VIEW_DASHBOARD')], getListAnalytics)


app.post('/update-info', checkToken, updateInfoVerify);

app.post('/update-gg2fa', checkToken, activeGoogle2FA);

app.post('/disable-gg2fa', checkToken, unActiveGoogle2FA);

app.get('/create-gg2fa', checkToken, createGoogle2FA);

app.get('/listbo', checkToken, listHisBO);


app.post('/withdrawal-vnd', checkToken, WithDrawalVND);


app.get('/balance-wallet', checkToken, BalanceWallet);

app.get('/bank-list', [checkToken, checkRole('VIEW_PAYMENT_METHOD')], getBankList);

app.post('/bank-list', [checkToken, checkRole('*')], setBankList);

app.get('/bank-info', checkToken, BankInfo);

app.get('/my-bank-info', checkToken, getUserBankInfo);

app.patch("/update-bank-info", checkToken, updateBankInfo);


app.get('/enabled/:id', [checkToken, checkRole('*')], UserEnabled);

app.get('/disabled/:id', [checkToken, checkRole('*')], UserDisabled);

app.get('/bo-statistics', checkToken, getBoStatistics);

app.get('/bo-statistics-current-day', checkToken, getBoStatisticsCurrentDay);


app.get('/history-order', checkToken, getListHisOrder);

app.get('/history-order-date', checkToken, getListHisOrderDate);


app.get('/history-wallet', checkToken, getListHisTradeWallet);

app.get('/history-wallet/:page', checkToken, getListHisTradeWalletPage);

app.get('/history-wallet-co', checkToken, getListHisTradeWalletHH);

app.get('/history-wallet-co/:page', checkToken, getListHisTradeWalletHHPage);


app.get('/history-wallet-trade', checkToken, getListHisTradeWalletWGD);

app.get('/history-wallet-trade/:page', checkToken, getListHisTradeWalletWGDPage);


app.get('/presenter', checkToken, getNguoiGioiThieu);

app.get('/commission-details', checkToken, getComDetails);

app.get('/commission-details/:page', checkToken, getComDetailsPage);

app.post('/commission-details-date', checkToken, getComDetailsDate);

app.post('/agency-search-lv', checkToken, getAgencySearchLevel);

app.post('/agency-search-name', checkToken, getAgencySearchName);

app.post("/changeAcc", checkToken, changeAccType);

app.post("/changPassAd", checkToken, changPassAd);

app.post("/getListCmsHis", checkToken, getListCmsHis);

app.post("/getListNotifi", checkToken, getListNotifi);

app.post("/updateListNotifi", checkToken, updateListNotifi);

app.get("/roles-list/:role", [checkToken, checkRole('VIEW_ROLE')], getRolesList)

app.post("/roles-list/:role", [checkToken, checkRole('*')], updateRolesList)

app.get("/cap-duoi-info", [checkToken, checkRole('*')], getCapDuoiInfo)

app.post("/update-upline", [checkToken, checkRole('*')], updateUpline)

module.exports = app;
