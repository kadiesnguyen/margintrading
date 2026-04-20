const { 
    getAllBetHis,
    getAllBetHisTrash,
    deleteBetHisById
}  = require("./bet.controller");
const router = require("express");
const app = router();
const { checkToken, checkRole } = require("../../auth/token_validation");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});



app.get("/historyBet", checkToken, checkRole("VIEW_BET_HISTORY"), getAllBetHis);

app.get("/hisBetTrash", checkToken, checkRole("VIEW_BET_HISTORY"), getAllBetHisTrash);

app.patch("/deleteBet", checkToken, checkRole("*"), deleteBetHisById);



module.exports = app;