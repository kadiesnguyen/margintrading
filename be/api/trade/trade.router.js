const { 
    getAllTradeHis,
    getAllTradeHisTrash,
    deleteTradeHisById,
    getAllDepositHis,
    getAllDepositHisTrash,
    getAllWithDrawalHis,
    doneWithdrawal,
    getRevenueNap,
    getRevenueRut,
    getRevenueTrans,
    getShowDT,
    historyAllAddMoney,
    totalAddMoney,
    doneRefuseWithdrawal,
    getUserDepositHis,
    getUserWitdrawalHis
}  = require("./trade.controller");
const router = require("express");
const app = router();
const { checkToken, checkRole } = require("../../auth/token_validation");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.get("/hist-desposit-user", checkToken, getUserDepositHis);

app.get("/hist-withdrawal-user", checkToken, getUserWitdrawalHis);


app.get("/historyAll", checkToken, getAllTradeHis);

app.get("/historyAllTrash", checkToken, getAllTradeHisTrash);

app.patch("/deleteTradeHisById", checkToken, deleteTradeHisById);

app.get("/hisDepositAll", checkToken, checkRole("VIEW_DEPOSIT"), getAllDepositHis);

app.get("/hisDepositAllTrash", checkToken, getAllDepositHisTrash);

app.get("/hisWithDrawalAll", checkToken, checkRole("VIEW_WITHDRAW"), getAllWithDrawalHis);

app.post("/doneWithdrawal", checkToken, doneWithdrawal);

app.post("/doneRefuseWithdrawal", checkToken, doneRefuseWithdrawal);

app.post("/doneWithdrawalTele", doneWithdrawal);

app.get("/getRevenueNap", checkToken , getRevenueNap);

app.get("/getRevenueRut", checkToken, getRevenueRut);

app.get("/getRevenueTrans", checkToken, getRevenueTrans);

app.get("/getRevenueTrans", checkToken, getRevenueTrans);

app.post("/getShowDT", checkToken, getShowDT);

app.get("/historyAllAddMoney", checkToken, historyAllAddMoney);

app.get("/totalAddMoney", checkToken, totalAddMoney);

module.exports = app;