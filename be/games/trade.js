const express = require('express')
const app = express()
const config = require('./../config.js')
//const msg = require('./../msg')
const apiBinace = require('node-binance-api')
const Binance = require('binance-api-node').default;

const toFixed = require('tofixed')
const axios = require('axios')
const WebSocket = require('ws')
const fs = require('fs')
const { v1: uuidv1 } = require('uuid');
const cors = require('cors')
const { updatePriceWinLose } = require('./../api/trans_user');

const Tele = require("../auth/telegram_notify")
const Helper = require("../helpers");

const BOT_TRADE = require("../auth/model/botTrade");
const db = require('../database');

// const { getPrize } = require('../helper/getPrize');
const { SEND_THONG_BAO } = require("../auth/notifi");
const { verify } = require("jsonwebtoken");

const NodeCache = require("node-cache");
const myCache = new NodeCache();

const fileSys = config.PATH_SYS_CONFIG
const fileCommission = config.PATH_SYS_COMMISSION

let RANDOM_SESSION = {}; // Random max 500 phiên
const RANDOM_SESSION_MAX = 100;

var {
    getPriceUser,
    updateBalanceUser,
    updatePersonalTrading,
    checkF0Commission,
    updateAmountRateCommission,
    checkF0CommissionInF0,
    updateAmountWin,
    updateAmountLose,
    insertBetOrder,
    getMaretingAcc,
    listF0With7Level
} = require("./../games/service.trade")


app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

// use https

var httpServer = require('http').createServer(app);

const wss = new WebSocket.Server(
    {
        server: httpServer,
        //port: 80
    }
)

httpServer.listen(config.PORT_TRADE)


var instance = new apiBinace().options({
    APIKEY: config.BINANCE_APIKEY,
    APISECRET: config.BINANCE_APISECRET,
    useServerTime: true, // Nếu bạn gặp lỗi dấu thời gian, hãy đồng bộ hóa với thời gian máy chủ khi khởi động
    test: false // Nếu bạn muốn sử dụng chế độ test
});

//
const config_gui = {}
const symbolList = ["ETHUSDT", "SOLUSDT", "NEARUSDT", "DOTUSDT"];

symbolList.forEach(async (symbol) => {
    instance.futuresCandles(symbol, "1m").then(data => {
        config_gui[symbol] = {
            open: data[data.length - 1][1],
            close: data[data.length - 1][4]
        }
    })
});

instance.websockets.miniTicker((data) => {
    symbolList.filter((symbol) => {
        return data[symbol]
    }).forEach((symbol) => {
        config_gui[symbol] = {
            open: config_gui[symbol].close,
            close: data[symbol].close
        };
    })
})

function updateConfigGUI() {
    symbolList.filter((symbol) => {
        return config_gui[symbol]
    }).forEach((symbol) => {
        const lastClose = Number(config_gui[symbol].close);
        const close = (lastClose + lastClose * (Math.random() * BIEN_DO * 2 - BIEN_DO) / 100).toFixed(3);
        config_gui[symbol] = {
            open: config_gui[symbol].close,
            close: Number(close).toFixed(8)
        };
    })
}

setInterval(function () {
    updateConfigGUI();
}, 1000);

var instanceFuture = Binance({
    apiKey: config.BINANCE_APIKEY,
    apiSecret: config.BINANCE_APISECRET,
})

var LIST_GET_DATA = [], jsonData = [], SO_GIAY_DEM_NGUOC = config.SO_GIAY_DEM_NGUOC, ANTI_BET = false, ORDER_OR_WATTING = 'order', timeGet = new Date().getTime();
var rateNhaThuong = config.RATE_NHA_THUONG; // tỉ lệ nhận thưởng là 95% cho mỗi lần thắng
var SEVER_GET = 'BTC/USDT', BET_MAX = config.BET_MAX;
var BTC_USER_BUY = [], BTC_USER_SELL = [], AMOUNT_USER_BUY = [], AMOUNT_USER_SELL = [];
var PRICE_BUY_LIVE_BACKUP = 0, PRICE_SELL_LIVE_BACKUP = 0, PRICE_BUY_LIVE = 0, PRICE_SELL_LIVE = 0, PRICE_BUY_DEMO = 0, PRICE_SELL_DEMO = 0;
var totalPTBuy = 0, totalPTSell = 0, session = 1000000, AMOUNT_MARKETING_LOSE = 0, AMOUNT_MARKETING_WIN = 0, PRICE_MAKETING_BUY = 0, PRICE_MAKETING_SELL = 0;
var BUY = [], SELL = [], STATIC = [], getLoadStaticGue = {}, tCountDown, LIST_USER_XU_LY = {}, BTC_USER_BUY_BACK = [], BTC_USER_SELL_BACK = [];
let AMOUNT_MAX_BREAK_BRIDGE = 400, AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE = -30, CLOSE_CHECK = 0, OPEN_CHECK = 0;
//time
var gameTime = new Date().getTime();
var closePrice;
// Config tỉ lệ nến râu dài

const BIEN_DO = 2;
const TI_LE = 0.9;

//Lịch sử kết quả
var HIST_RESULTS = []
//
var DATA_GL = require('./editBet');
const { ppid } = require('process');
//const { Console } = require('console')

const tradeConfig = Helper.getConfig('trade');

if (!(tradeConfig.static.length % 2)) {
    tradeConfig.static.shift();
    Helper.setConfig('trade', tradeConfig);
}

STATIC = tradeConfig.static;

session = tradeConfig.session;

function writeSessionDB() {
    tradeConfig.session = session;
    Helper.setConfig('trade', tradeConfig);
}

function writeStaticDB() {
    tradeConfig.static = STATIC;
    Helper.setConfig('trade', tradeConfig);
}


if (Object.keys(RANDOM_SESSION).length === 0) {
    // Random kết quả
    for (let index = 0; index < RANDOM_SESSION_MAX; index++) {
        RANDOM_SESSION[session + index] = ~~(Math.random() * 10) % 2 ? 'buy' : 'sell';
    }
}

class PlayerData {
    constructor(id, uid) {
        this.id = id
        this.uid = uid
    }
}

function verifyJwt(token, key) {
    return new Promise((resolve, reject) => {
        verify(token, key, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        })
    })
}

const users = {};

console.log(`- SV ${SEVER_GET} START \n- Server started port: ${config.PORT_TRADE}.`);



wss.on('connection', async function (ws, req) {
    //
    const queryClient = require('url').parse(req.url, true).query;
    if (void 0 !== queryClient.token) {
        //Check token user
        try {
            const decoded = await verifyJwt(queryClient.token, config.TOKEN_KEY);
            user = decoded.result;
            //
            // xóa user và thêm nếu có kết nối lại ( để lêu lại log xử lý kết quả )
            //let t = 0;
            for (let l in users) {
                if (users[l].email == user.username) {
                    //t++;
                    //console.log(t+ ": " + users[l].email);
                    // send có tài khoản` đăng nhập ở nơi khác
                    let ws = users[l].ws;
                    let mess = { type: 'disAccount', mess: 'Tài khoản của bạn đang được đăng nhập ở nơi khác!', style: 'danger' };
                    ws.send(JSON.stringify({ type: 'mess', data: mess }));
                    break;
                }
            }

            let player = new PlayerData(uuidv1(), 0);
            player.ws = ws;
            if (user.x == 1) {
                player.uid = "ADMIN_BO"
                ws.send(JSON.stringify({ type: 'getTruck', data: DATA_GL, min_am_go: AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE, max_amount_be: AMOUNT_MAX_BREAK_BRIDGE }));
            }
            else player.uid = user.uid;
            player.email = user.username;
            users[player.id] = player;
            //
        } catch (error) {
            ws.close()
        }

    }
    else {
        ws.close()
    }
    //
    // login vào web sẽ in ra tổng dữ liệu
    const listData = LIST_GET_DATA.reduce((prev, curr) => {
        prev[curr.date] = curr["close"];
        return prev;
    }, {});
    ws.send(JSON.stringify({ type: 'get_config_history', data: listData }))
    ws.send(JSON.stringify({ type: 'get_config_gui', data: config_gui }));
    ws.send(JSON.stringify({ type: 'hist_results', data: HIST_RESULTS }));

    //get trans volum
    let totalBuy = 0, totalSell = 0;
    totalBuy = PRICE_BUY_LIVE;
    totalSell = PRICE_SELL_LIVE;

    let jsonTransVolum = { nbuy: totalBuy, nsell: totalSell, ptbuy: Number(totalPTBuy), ptsell: Number(totalPTSell) }
    ws.send(JSON.stringify({ type: 'transVolum', data: jsonTransVolum }))

    let countBUY = BUY.length;
    let countSELL = SELL.length;

    let staticShow = { ss: session, cbuy: countBUY, csell: countSELL, static: STATIC }


    if (Object.keys(getLoadStaticGue).length === 0) {
        getLoadStaticGue = { Moving: { b: 0, s: 0, m: 0 }, Oscillators: { b: 0, s: 0, m: 0 }, Summary: { b: 0, s: 0, m: 0 } }
    }


    ws.send(JSON.stringify({ type: 'static', data: staticShow, load: getLoadStaticGue }));




    ws.on('message', d => {
        var data = JSON.parse(d)
        //info
        // if (data.type === 'accountDetail') {
        //     let obj = data.data;

        //     if (void 0 === obj.email) {
        //         let mess = { type: 'reloadAccount', mess: 'Không lấy được email!', style: 'danger' };
        //         ws.send(JSON.stringify({ type: 'mess', data: mess }));
        //         return;
        //     }
        //     // xóa user và thêm nếu có kết nối lại ( để lêu lại log xử lý kết quả )
        //     //let t = 0;
        //     for (let l in users) {
        //         if (users[l].email == obj.email) {
        //             //t++;
        //             //console.log(t+ ": " + users[l].email);
        //             // send có tài khoản` đăng nhập ở nơi khác
        //             let ws = users[l].ws;
        //             let mess = { type: 'disAccount', mess: 'Tài khoản của bạn đang được đăng nhập ở nơi khác!', style: 'danger' };
        //             ws.send(JSON.stringify({ type: 'mess', data: mess }));
        //             break;
        //         }
        //     }

        //     let player = new PlayerData(uuidv1(), 0);
        //     player.ws = ws;
        //     player.uid = obj.a;
        //     player.email = obj.email;
        //     users[player.id] = player;


        //     for (let obj in users) {
        //         let uid = users[obj].uid;
        //         // tìm UID của ADMIN rồi gửi
        //         if (uid == 'ADMIN_BO') {
        //             //console.log(uid);
        //             let ws = users[obj].ws;
        //             ws.send(JSON.stringify({ type: 'getTruck', data: DATA_GL, min_am_go: AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE, max_amount_be: AMOUNT_MAX_BREAK_BRIDGE }));
        //         }
        //     }
        // }


        if (data.type === 'getListData') {
            ws.send(JSON.stringify({ type: 'get_config_history', data: LIST_GET_DATA }));
            ws.send(JSON.stringify({ type: 'static', data: staticShow, load: getLoadStaticGue }));
        }

        // chỉnh sửa trò chơi
        if (data.type === 'editGL') {
            let obj = data.data

            if (obj.type == 'BTC_BUY') {
                BTC_SET_BUY_WIN()
            }
            if (obj.type == 'BTC_SELL') {
                BTC_SET_SELL_WIN()
            }
            if (obj.type == 'BTC_LESS') {
                BTC_LESS_WIN()
            }
            if (obj.type == 'BTC_OFF') {
                BTC_TOOL_OFF()
            }
            if (obj.type == 'BOT') {
                DATA_GL.BOT = DATA_GL.BOT ? false : true
            }
            if (obj.type == 'BOT_GO_TIEN') {
                DATA_GL.PRICE_FUND_ON_OFF = DATA_GL.PRICE_FUND_ON_OFF ? false : true;
            }
            if (obj.type == 'GO_TIEN_OFF') {
                DATA_GL.LESS_WIN = false;
                Tele.sendMessBet(`🔔 ADMIN <i>OFF</i> GỠ TIỀN\n🖲Hệ thống LỜI/LỖ hiện tại 💴: <i>${DATA_GL.PRICE_FUND_PROFITS}</i>👉Bây giờ LỜI/LỖ sẽ là: <i>0</i>`);
                DATA_GL.PRICE_FUND_PROFITS = 0;
            }

            if (obj.type == 'TOGGLE_ENABLE_SESSION') {
                DATA_GL.ENABLE_SESSION = obj.val;
                Tele.sendMessBet(`🔔 ADMIN ${obj.val ? 'Bật' : 'Tắt'} chế độ phiên ngẫu nhiên!`);
            }

            if (obj.type == 'WRITE_AMOUNT_MAX_BREAK_BRIDGE') {
                AMOUNT_MAX_BREAK_BRIDGE = Number(obj.AMOUNT);
                Tele.sendMessBet(`🔔 ADMIN vừa đặt lại mốc BẺ 💴: <i>${obj.AMOUNT}</i>`);
            }
            if (obj.type == 'WRITE_AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE') {
                AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE = Number(obj.AMOUNT);
                Tele.sendMessBet(`🔔 ADMIN vừa đặt lại mốc GỠ 💴: <i>${obj.AMOUNT}</i>`);
            }
        }

        // kết thúc

        if (data.type === 'bet') {
            let obj = data.data
            if (obj.type === 'buy') {
                BetBUY(ws, obj)
            } else {
                BetSELL(ws, obj)
            }
        }

    })



    ws.on('close', message => {
        // chạy lệnh xóa id nếu user bị mất kết nối
        for (let obj in users) {
            if (users[obj].ws == ws) {
                delete users[obj];
                break;
            }
        }
    })


});

// Lấy dữ liệu đầu vào
getListStartGame();

function getListStartGame() {

    axios.get(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1s&limit=120`)
        .then(data => {
            const getData = data.data;
            getData.map(d => {
                let t = Math.round(d[0]),
                    o = parseFloat(d[1]),
                    h = parseFloat(d[2]),
                    l = parseFloat(d[3]),
                    c = parseFloat(d[4]),
                    v = parseFloat(d[5]).toFixed(2);

                // if (Math.abs(h - Math.max(c, o)) > BIEN_DO && Math.random() < TI_LE) {
                //     h = Math.random() * BIEN_DO + Math.max(c, o);
                //     h = parseFloat(Number(h).toFixed(2));
                // }
                // if (Math.abs(l - Math.max(c, o)) > BIEN_DO && Math.random() < TI_LE) {
                //     l = Math.min(c, o) - Math.random() * BIEN_DO;
                //     l = parseFloat(Number(l).toFixed(2));
                // }

                // const num_ran = () => {
                //     let num = Number((Math.random() * 0.1) + 0.01).toFixed(2);
                //     return parseFloat(num);
                // }

                // if (Math.round(Math.random())) {
                //     c = c + num_ran();
                // } else {
                //     c = c - num_ran();
                // }
                // c = parseFloat(c).toFixed(2);

                let getS = { date: t - t % 1000, open: o, high: h, low: l, close: c, volume: parseFloat(v) };
                LIST_GET_DATA.push(getS);
            });
            jsonData = LIST_GET_DATA[LIST_GET_DATA.length - 1]
            closePrice = jsonData.close;

            //LIST_GET_DATA[LIST_GET_DATA.length - 1].date = timeGet;
            countDownGame();

        })
}

let maintenance = false;

// kích hoạt kiểm tra bảo trì hết chưa
function AccpetIsBaoTri() {
    clearInterval(tCountDown);
    let oc = setInterval(() => {
        if (!maintenance) {
            clearInterval(oc);
            let msg = 'Bảo trì đã xong.';
            Tele.sendMessBet(msg);
            LIST_GET_DATA = [], jsonData = [], SO_GIAY_DEM_NGUOC = config.SO_GIAY_DEM_NGUOC, ANTI_BET = false, ORDER_OR_WATTING = 'order';
            // STATIC = [];
            BUY = [];
            SELL = [];
            getLoadStaticGue = {};
            getListStartGame();
            countDownGame();
        }
    }, 1000);
}

checkBaoTriBinance();

function checkBaoTriBinance() {
    setInterval(() => {
        axios.get('https://api.binance.com/sapi/v1/system/status')
            .then(data => {
                const getData = data.data;
                let dataSys = Helper.getConfig(fileSys);
                if (getData.status) { // bảo trì
                    dataSys.maintenance = maintenance = true; // bảo trì
                    let msg = 'Binance sẽ thực hiện nâng cấp hệ thống theo lịch trình. Quý khách trade coin vui lòng để ý để chủ động trong gd hoặc rút tiền.';
                    dataSys.maintenanceContent = msg;

                    Tele.sendMessBet(msg);
                    Helper.setConfig(fileSys, dataSys);
                    AccpetIsBaoTri();
                    let obj = { type: 'bet', mess: msg, style: 'danger' };
                    wss.clients.forEach(function each(client) {
                        client.send(JSON.stringify({ type: 'mess', data: obj }));
                    })
                } else {
                    dataSys.maintenance = maintenance = false;
                    Helper.setConfig(fileSys, dataSys);
                    //let json = JSON.stringify(dataSys)
                    //fs.writeFile(fileSys, json, 'utf8', (err) => {})
                }
            }).catch((error) => { });
    }, 25000);
}

function XU_LY_SEND_BOT_DU_DOAN(s) {

    if (ORDER_OR_WATTING === 'order') {

        if (s === 29) {
            BOT_TRADE.SEND_TUONG_TAC();
        }

        if (s == 25) {
            BOT_TRADE.SEND_BOT_DU_BAO();
        }

        if (s === 15 || s < 3) {
            BOT_TRADE.SEND_BOT_SECOND(s);
        }
    }

}


function countDownGame() {


    const SO_GIAY_MAC_DINH = SO_GIAY_DEM_NGUOC;
    gameTime = new Date().getTime();
    gameTime = gameTime - gameTime % 1000;
    tCountDown = setInterval(() => {

        SO_GIAY_DEM_NGUOC = (--SO_GIAY_DEM_NGUOC + SO_GIAY_MAC_DINH) % SO_GIAY_MAC_DINH;

        playRealTimeSpot(SO_GIAY_DEM_NGUOC);

        var s = 0
        if (SO_GIAY_DEM_NGUOC < 10) {
            s = '0' + SO_GIAY_DEM_NGUOC;
        } else {
            s = SO_GIAY_DEM_NGUOC;
        }


        jsonData['candleClose'] = s;
        jsonData['type'] = ORDER_OR_WATTING;

        // XỬ LÝ SEND DỰ ĐOÁN TELEGRAM
        XU_LY_SEND_BOT_DU_DOAN(SO_GIAY_DEM_NGUOC);
        //
        if (SO_GIAY_DEM_NGUOC <= config.SO_GIAY_DEM_NGUOC_KET_QUA) {
            ORDER_OR_WATTING = "watting"
            ANTI_BET = true;
        }

        xulyInVaoHisBeCau();

        if (SO_GIAY_DEM_NGUOC == config.SO_GIAY_DEM_NGUOC_KET_QUA) {
            SEND_MESS_THONG_BAO_CHENH_LECH();

            if (session !== 1000000) PUSH_STATIC(jsonData);
        }
        if (SO_GIAY_DEM_NGUOC == 0) {
            gameTime = timeGet;

            // trở về giây cũ
            // SO_GIAY_DEM_NGUOC = SO_GIAY_MAC_DINH - 1;


            // đổi lại trạng thái

            // ORDER_OR_WATTING = ORDER_OR_WATTING === 'order' ? 'watting' : 'order';
            ORDER_OR_WATTING = "order";
            ANTI_BET = false;

            // đủ 100 item thì clear
            if (STATIC.length > 99) {

                //STATIC = [];
                //SELL = [];
                //BUY = [];

                for (let i = 0; i < 20; i++) {

                    BUY.shift();
                    SELL.shift();
                    STATIC.shift();
                    writeStaticDB();

                }
            }

            // clear BOT ảo
            BOTAOClear()
            xuLyChartKetThuc1Phien(jsonData);


            if (DATA_GL.BOT) {
                BOTAOStart()
            }

            // if (ORDER_OR_WATTING === 'order') {

            //     // xử lý BUY anh SELL khi kết thúc Watting

            //     xuLyChartKetThuc1Phien(jsonData);


            //     if (DATA_GL.BOT) {
            //         BOTAOStart()
            //     }

            //     // ANTI_BET = false // cho dat cuoc
            // } else {
            //     // ANTI_BET = true // khong cho dat cuoc
            //     // gửi danh sách vào ADMIN
            //     xulyInVaoHisBeCau();

            //     SEND_MESS_THONG_BAO_CHENH_LECH();

            //     if (session !== 1000000) PUSH_STATIC(jsonData);

            // }
        }



        // chuyển tất cả dữ liệu ra ngoài client

        if (!maintenance) {
            wss.clients.forEach(function each(client) {
                client.send(JSON.stringify({
                    type: 'get_config', data: {
                        session,
                        gameTime,
                        nowTime: timeGet,
                        price: LIST_GET_DATA[LIST_GET_DATA.length - 1].close,
                        time: SO_GIAY_DEM_NGUOC
                    }
                }));
                client.send(JSON.stringify({ type: 'get_config_gui', data: config_gui }));
            });
        }


        if (DATA_GL.ENABLE_SESSION) {
            for (let obj in users) {
                let uid = users[obj].uid;
                // tìm UID của ADMIN rồi gửi
                if (uid == 'ADMIN_BO') {
                    //console.log(uid);
                    let ws = users[obj].ws;
                    ws.send(JSON.stringify({ type: 'random', RANDOM_SESSION }));
                }
            }
        }

    }, 1000)
}


function SEND_MESS_THONG_BAO_CHENH_LECH() {
    //let totalBuy = void 0 === eval(PRICE_BUY_LIVE.join('+')) ? 0 : eval(PRICE_BUY_LIVE.join('+'));
    //let totalSell = void 0 === eval(PRICE_SELL_LIVE.join('+')) ? 0 : eval(PRICE_SELL_LIVE.join('+'));

    let totalBuy = PRICE_BUY_LIVE - PRICE_MAKETING_BUY;
    let totalSell = PRICE_SELL_LIVE - PRICE_MAKETING_SELL;

    if (totalBuy > 0 || totalSell > 0) {
        Tele.sendMessBetAmount(`✍️Phiên: 💸<b>${session}</b>\n✍️Cửa BUY: 💸<b>${totalBuy}</b>\n✍️Cửa SELL: 💸<b>${totalSell}</b>`);
    }

}

let o = 0;


// khởi chạy game
function playRealTimeSpot(s) {

    // if (s == 0) {
    const now = new Date().getTime();
    timeGet = now - now % 1000;
    // }

    instance.candlesticks("BTCUSDT", "1m", (error, ticks) => { //symbol
        if (error == null) {

            let last_tick = ticks[ticks.length - 1];

            let [time, open, high, low, close, volume] = last_tick;
            let t = timeGet;

            // định giá open chuyển nến ( đều nến )
            //o = (tC + o + (Math.random() * 1.5)).toFixed(2)
            let h = parseFloat(parseFloat(high).toFixed(2)),
                l = parseFloat(parseFloat(low).toFixed(2)),
                c = parseFloat(parseFloat(close).toFixed(2)),
                v = parseFloat(parseFloat(volume).toFixed(2));


            // if (Math.abs(h - Math.max(c, o)) > BIEN_DO && Math.random() < TI_LE) {
            //     h = Math.random() * BIEN_DO + Math.max(c, o);
            //     h = parseFloat(Number(h).toFixed(2));
            // }

            // if (Math.abs(l - Math.max(c, o)) > BIEN_DO && Math.random() < TI_LE) {
            //     l = Math.min(c, o) - Math.random() * BIEN_DO;
            //     l = parseFloat(Number(l).toFixed(2));
            // }


            const num_ran = () => {
                const key = 'hdfjghkjdhf';

                if (myCache.has(key)) {
                    return myCache.take(key);
                }

                let num = Number((Math.random() * 1.98) + 0.01).toFixed(2);
                num = parseFloat(num);
                myCache.set(key, num, 2);

                return num;
            }

            const rantruefalse = () => {
                const key = 'ssss3213234dsfsd';

                if (myCache.has(key)) {
                    return myCache.take(key);
                }

                let num = Math.round(Math.random());
                num = parseFloat(num);
                myCache.set(key, num, 3);

                return num;
            }

            if (rantruefalse()) {
                c = c + num_ran();
            } else {
                c = c - num_ran();
            }
            c = parseFloat(c).toFixed(2);



            if (s == config.SO_GIAY_DEM_NGUOC - 1) {
                closePrice = LIST_GET_DATA[LIST_GET_DATA.length - 1].close;
                jsonData = { open: closePrice }
            }

            // kiểm tra bảo trì hệ thống

            // kết thúc kiểm tra
            // ======================================

            if (maintenance) return;
            // ======================================

            // KẾT THÚC CHỈNH SỬA THÔNG SỐ GIÁ

            //=========================================

            if (s < config.SO_GIAY_DEM_NGUOC) {
                // jsonData = { date: t, open: o, high: h, low: l, close: c, volume: v }

                // const num_ran = () => {
                //     let num = Number((Math.random() * 0.3) + 0.01).toFixed(2);
                //     return parseFloat(num);
                // }

                // if (Math.round(Math.random())) {
                //     c = c + num_ran();
                // } else {
                //     c = c - num_ran();
                // }
                // c = parseFloat(c).toFixed(2);

                jsonData.date = t;
                jsonData.high = h;
                jsonData.low = l;
                jsonData.close = c;
                jsonData.volume = v;
            }

            XU_LY_VOLUM(s, jsonData);
            LIST_GET_DATA.push({ date: jsonData.date, open: jsonData.open, close: jsonData.close });
        }
    })

}

let rdSe = 7, rdSe2 = 26;

function XU_LY_VOLUM(s, jDATA) {

    //if(maintenance) return; // bảo trì , dừng


    if ((ORDER_OR_WATTING === 'watting' && s < rdSe) && (ORDER_OR_WATTING === 'watting' && s != 0) ||
        ORDER_OR_WATTING === 'order' && s > rdSe2 ||
        ORDER_OR_WATTING === 'order' && s == 0
    ) {
        //if((ORDER_OR_WATTING === 'watting' && s < rdSe) ||
        //	ORDER_OR_WATTING === 'order' && s > rdSe2 ||
        //	ORDER_OR_WATTING === 'watting' && s == 0
        //){
        //console.log(ORDER_OR_WATTING + ' --- ' + s);
        /* RA BUY */
        //if(!CHECK_XU_LY_VOL){
        //    CHECK_XU_LY_VOL = true;
        CLOSE_CHECK = jDATA.close;
        OPEN_CHECK = jDATA.open;

        //}


        let totalBuy = 0;
        let totalSell = 0;

        if (s < rdSe) {
            totalBuy = PRICE_BUY_LIVE_BACKUP = PRICE_BUY_LIVE;
            totalSell = PRICE_SELL_LIVE_BACKUP = PRICE_SELL_LIVE;
        }
        if (s > rdSe2) {
            totalBuy = PRICE_BUY_LIVE_BACKUP;
            totalSell = PRICE_SELL_LIVE_BACKUP;
        }


        totalBuy -= PRICE_MAKETING_BUY;
        totalSell -= PRICE_MAKETING_SELL;


        if (DATA_GL.BTC.BUY) {
            if (CLOSE_CHECK < OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
                let tl = OPEN_CHECK - CLOSE_CHECK;
                CLOSE_CHECK = CLOSE_CHECK + tl + (Math.random() * 3);

            } else {
                let rd = Math.floor(Math.random() * 6);
                if (rd % 2) {
                    CLOSE_CHECK = CLOSE_CHECK + (Math.random() * 3);
                } else {
                    //CLOSE_CHECK += (Math.random() * 3);
                }

            }
            jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
        } else if (DATA_GL.BTC.SELL) {
            if (CLOSE_CHECK > OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
                let tl = CLOSE_CHECK - OPEN_CHECK;
                CLOSE_CHECK = CLOSE_CHECK - tl - (Math.random() * 3);
            } else {
                let rd = Math.floor(Math.random() * 6);
                if (rd % 2) {
                    CLOSE_CHECK = CLOSE_CHECK - (Math.random() * 3);
                } else {
                    //CLOSE_CHECK += (Math.random() * 3);
                }

            }
            jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
        } else {
            if (DATA_GL.ENABLE_SESSION) {
                // Random kết quả trùng khớp thì sẽ oce
                if (void 0 !== RANDOM_SESSION[session]) {
                    const title = RANDOM_SESSION[session];
                    if (title === 'buy') {
                        if (CLOSE_CHECK < OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
                            let tl = OPEN_CHECK - CLOSE_CHECK;
                            CLOSE_CHECK = CLOSE_CHECK + tl + (Math.random() * 3);

                        } else {
                            let rd = Math.floor(Math.random() * 6);
                            if (rd % 2) {
                                CLOSE_CHECK = CLOSE_CHECK + (Math.random() * 3);
                            } else {
                                //CLOSE_CHECK += (Math.random() * 3);
                            }

                        }
                        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
                    } else if (title === 'sell') {
                        if (CLOSE_CHECK > OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
                            let tl = CLOSE_CHECK - OPEN_CHECK;
                            CLOSE_CHECK = CLOSE_CHECK - tl - (Math.random() * 3);
                        } else {
                            let rd = Math.floor(Math.random() * 6);
                            if (rd % 2) {
                                CLOSE_CHECK = CLOSE_CHECK - (Math.random() * 3);
                            } else {
                                //CLOSE_CHECK += (Math.random() * 3);
                            }

                        }
                        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
                    }
                }
            } else {
                if (DATA_GL.LESS_WIN) { // ít là ăn
                    if (totalBuy < totalSell) { // BUY sẽ thắng ( CLOSE > OPEN )
                        if (CLOSE_CHECK < OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
                            let tl = OPEN_CHECK - CLOSE_CHECK;
                            CLOSE_CHECK = CLOSE_CHECK + tl + (Math.random() * 4);
                        } else {
                            let rd = Math.floor(Math.random() * 6);
                            if (rd % 2) {
                                CLOSE_CHECK = CLOSE_CHECK + (Math.random() * 3);
                            } else {
                                //CLOSE_CHECK += (Math.random() * 3);
                            }

                        }
                        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
                    } else if (totalBuy > totalSell) { // SELL sẽ thắng ( CLOSE < OPEN ) // if(totalBuy > totalSell)
                        if (CLOSE_CHECK > OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
                            let tl = CLOSE_CHECK - OPEN_CHECK;
                            CLOSE_CHECK = CLOSE_CHECK - tl - (Math.random() * 4);
                        } else {
                            let rd = Math.floor(Math.random() * 6);
                            if (rd % 2) {
                                CLOSE_CHECK = CLOSE_CHECK - (Math.random() * 3);
                            } else {
                                //CLOSE_CHECK += (Math.random() * 3);
                            }

                        }
                        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));
                    }
                } else {
                    let totalBuyAv = totalBuy - totalSell;
                    let totalSellAv = totalSell - totalBuy;

                    let rdn = AMOUNT_MAX_BREAK_BRIDGE;

                    if (totalBuyAv > rdn) {
                        // SELL sẽ thắng bắc buộc phải  ( CLOSE < OPEN )
                        if (CLOSE_CHECK > OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) {
                            let tl = CLOSE_CHECK - OPEN_CHECK;
                            CLOSE_CHECK = CLOSE_CHECK - tl - (Math.random() * 4);
                        } else {
                            let rd = Math.floor(Math.random() * 6);
                            if (rd % 2) {
                                CLOSE_CHECK = CLOSE_CHECK - (Math.random() * 3);
                            } else {
                                //CLOSE_CHECK += (Math.random() * 3);
                            }

                        }
                        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));

                    } else if (totalSellAv > rdn) {
                        // BUY sẽ thắng bắc buộc phải ( CLOSE > OPEN )
                        if (CLOSE_CHECK < OPEN_CHECK || CLOSE_CHECK == OPEN_CHECK) { // nếu close nhỏ hơn

                            let tl = OPEN_CHECK - CLOSE_CHECK;
                            CLOSE_CHECK = CLOSE_CHECK + tl + (Math.random() * 4);
                        } else {
                            let rd = Math.floor(Math.random() * 6);
                            if (rd % 2) {
                                CLOSE_CHECK = CLOSE_CHECK + (Math.random() * 3);
                            } else {
                                //CLOSE_CHECK += (Math.random() * 3);
                            }

                        }
                        jsonData.close = parseFloat(CLOSE_CHECK.toFixed(2));

                    }

                }
            }
        }
    } else {
        PRICE_BUY_LIVE_BACKUP = PRICE_SELL_LIVE_BACKUP = 0;
        //CHECK_XU_LY_VOL = false;
        //CLOSE_CHECK = 0;
        //OPEN_CHECK = 0;
    }


}

function xuLyChartKetThuc1Phien(data) {
    if (maintenance) return; // bảo trì , dừng



    PRICE_BUY_LIVE_BACKUP = PRICE_BUY_LIVE;
    PRICE_SELL_LIVE_BACKUP = PRICE_SELL_LIVE;



    PRICE_MAKETING_BUY = 0;
    PRICE_MAKETING_SELL = 0;

    /**
     * Ít là ăn
     *
     */

    session++;
    writeSessionDB();

    //}


    rdSe = Math.floor(Math.random() * 10) + 5;
    rdSe2 = Math.floor(Math.random() * 6) + 20;

    PUSH_STATIC_2(data);




    //timeGet = new Date().getTime();
    // Xử lý kết quả

}


function PUSH_STATIC(data) {

    let title;

    if (data.close > data.open) { // BUY
        title = 'buy';
        BUY.push(title);
    } else { // SELL
        title = 'sell';
        SELL.push(title);
    }
    if (LIST_GET_DATA.length >= 240) {
        LIST_GET_DATA.shift();
    }
    // LIST_GET_DATA.push(data);

    STATIC.push(title);
    writeStaticDB();

    writeStatic();
}

function PUSH_STATIC_2(data) {

    let title;

    if (data.close > data.open) { // BUY
        title = 'buy';
        BUY.push(title);
    } else { // SELL
        title = 'sell';
        SELL.push(title);
    }

    BOT_TRADE.SEND_RESULT(title);

    if (LIST_GET_DATA.length >= 120) {
        LIST_GET_DATA.shift();
    }
    // LIST_GET_DATA.push(data);

    STATIC.push(title);

    writeStaticDB();
    writeStatic();

    HandlingBuySell2(title);

    pushHistResults(title, data.close)

}

function XU_LY_QUY_BOT(PRICE_WIN, PRICE_LOSE) {

    //console.log(AMOUNT_MARKETING_WIN + ' -- ' + AMOUNT_MARKETING_LOSE);
    //console.log(PRICE_WIN + ' -- ' + PRICE_LOSE);

    // Không mở chức năng
    if (!DATA_GL.PRICE_FUND_ON_OFF) return;
    //console.log('PRICE W: ' + PRICE_WIN);
    //console.log('PRICE L: ' + PRICE_LOSE);

    //console.log('MKT W: ' + AMOUNT_MARKETING_WIN);
    //console.log('MKT L: ' + AMOUNT_MARKETING_WIN);

    let price_win = PRICE_WIN - AMOUNT_MARKETING_WIN; // đây là số tiền hệ thống trả người thắng
    let price_lose = PRICE_LOSE - AMOUNT_MARKETING_LOSE; // đây là số tiền hệ thống nhận từ người thua
    let total = price_lose - price_win; // số dư lời
    // thêm vào bộ nhớ số tiền tiền lời / lỗ
    //console.log(total);

    let sss = session;
    DATA_GL.PRICE_FUND_PROFITS += total;
    //console.log(DATA_GL.PRICE_FUND_PROFITS);

    if (DATA_GL.PRICE_FUND_PROFITS < AMOUNT_NEGA_AMOUNT_BREAK_BRIDGE) { // âm tiền hệ thống lỗ
        // bật chức năng bên ít win
        //console.log(DATA_GL.PRICE_FUND_PROFITS);
        BTC_LESS_WIN();
        Tele.sendMessBet(`🔍Phiên hiện tại: <b>${sss--}</b> 💴: <i>${total}</i>\n🖲Hệ thống LỖ 💴: <i>${DATA_GL.PRICE_FUND_PROFITS}</i>\n🕹Gỡ tiền: <i>ON</i>`);
    } else if (DATA_GL.PRICE_FUND_PROFITS < 0) {
        Tele.sendMessBet(`🔍Phiên hiện tại: <b>${sss--}</b> 💴: <i>${total}</i>\n🖲Hệ thống đang LỖ 💴: <i>${DATA_GL.PRICE_FUND_PROFITS}</i>🗣Sắp bẻ cầu`);
    } else if (DATA_GL.PRICE_FUND_PROFITS > 0) {
        BTC_TOOL_OFF();
        Tele.sendMessBet(`🔍Phiên hiện tại: <b>${sss--}</b> 💴: <i>${total}</i>\n🖲Hệ thống LỜI 💴: <i>${DATA_GL.PRICE_FUND_PROFITS}</i>\n🕹Gỡ tiền: <i>OFF</i>`);
        DATA_GL.PRICE_FUND_PROFITS = 0;
    }
    // thoát BOT nếu là acc marketing chơi
    if ((AMOUNT_MARKETING_WIN > 0 || AMOUNT_MARKETING_LOSE > 0) && DATA_GL.PRICE_FUND_PROFITS == 0) {
        BTC_TOOL_OFF();
    }

    //console.log(DATA_GL);

    AMOUNT_MARKETING_WIN = AMOUNT_MARKETING_LOSE = 0;
    // // kiểm tra tích quỹ đã đủ chưa
    // // quỷ tiếp theo bé hơn quỹ mặc định nhập
    // if(DATA_GL.PRICE_FUND_NEXT < DATA_GL.PRICE_FUND_DEFAULT){
    //     // tích % tổng lời ra đưa vào quỹ ( mặc địch cho cược tự nhiên )
    //     let FUND = total / 100 * DATA_GL.PRICE_FUND_RATE;
    //     DATA_GL.PRICE_FUND_NEXT += FUND;
    // } else if(DATA_GL.PRICE_FUND_NEXT >= DATA_GL.PRICE_FUND_DEFAULT){

    // }

}

function BTC_TOOL_OFF() {
    DATA_GL.BTC.BUY = false;
    DATA_GL.BTC.SELL = false;
    DATA_GL.LESS_WIN = false;
}

function BTC_SET_BUY_WIN() {
    DATA_GL.BTC.BUY = true;
    DATA_GL.BTC.SELL = false;
    DATA_GL.LESS_WIN = false;
}

function BTC_SET_SELL_WIN() {
    DATA_GL.BTC.BUY = false;
    DATA_GL.BTC.SELL = true;
    DATA_GL.LESS_WIN = false;
}

function BTC_LESS_WIN() {
    DATA_GL.BTC.BUY = false;
    DATA_GL.BTC.SELL = false;
    DATA_GL.LESS_WIN = true;
}

//========================= XỬ LÝ ĐẶT CƯỢC

function BetBUY(ws, data) {
    if (ANTI_BET) {
        let obj = { type: 'bet', mess: 'Vui lòng đợi phiên sau!', style: 'danger' }
        ws.send(JSON.stringify({ type: 'mess', data: obj }))
        return
    }

    //let idPlayer = data.idPlayer;

    let uid = data.uid
    let typeAccount = data.typeAccount
    let action = data.type
    let betAmount = Number(data.betAmount)

    let accMarketing = data.mkt;

    for (let obj in users) {
        if (users[obj].ws == ws) {
            users[obj].uid = uid; // thay đổi id nếu change account
        }
    }

    var numberRegex = /^[]?\d+(\.\d+)?([eE][]?\d+)?$/;

    if (numberRegex.test(betAmount)) {

        // số tiền đc phép đặt cược
        if (betAmount < BET_MAX) {
            let obj = { type: 'bet', mess: 'Số tiền không được nhở hơn ' + BET_MAX, style: 'danger' }
            ws.send(JSON.stringify({ type: 'mess', data: obj }))
            return
        }

        getMaretingAcc(data.email, (err, result) => {
            accMarketing = result.marketing;

            // kết thúc
            getPriceUser(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!result) {
                    return
                }

                if (result.balance >= betAmount) {
                    if (typeAccount == 1) {
                        PRICE_BUY_LIVE += betAmount
                        //PRICE_BUY_LIVE.push(betAmount);
                        updatePersonalTrading(data, (err, result) => { })
                    } else {
                        PRICE_BUY_DEMO += betAmount;
                        //PRICE_BUY_DEMO.push(betAmount);
                    }

                    if (void 0 === AMOUNT_USER_BUY[`${uid}`]) AMOUNT_USER_BUY[`${uid}`] = 0;

                    if (typeAccount == 1 && accMarketing == 1) {
                        PRICE_MAKETING_BUY += betAmount;
                    }

                    AMOUNT_USER_BUY[`${uid}`] += betAmount
                    BTC_USER_BUY[`${uid}`] = AMOUNT_USER_BUY[`${uid}`] + '||' + action + '||' + typeAccount + '||' + data.email + '||' + accMarketing + '||' + uid;

                    //console.log('MKT BET BUY: ' + accMarketing);
                    updateBalanceUser(data, (err, result) => {
                        ws.send(JSON.stringify({ type: 'checkBet', data: 'ok' }))
                    })

                    //SendNotifyTele(uid, typeAccount, 'BUY', betAmount)
                    // getPriceUser(data, (err, result) => {
                    //     if(err){
                    //         console.log(err);
                    //         return
                    //     }
                    //     let obj = {acc: typeAccount, balance: Number(result.balance), type: action}
                    //     ws.send(JSON.stringify({type: 'info', data: obj}))
                    // })
                } else if (result.balance < betAmount) {
                    let obj = { type: 'bet', mess: 'Số dư không đủ!', style: 'danger' }
                    ws.send(JSON.stringify({ type: 'mess', data: obj }))
                }
            });

        });


    }
}

function BetSELL(ws, data) {
    if (ANTI_BET) {
        let obj = { type: 'bet', mess: 'Vui lòng đợi phiên sau!', style: 'danger' }
        ws.send(JSON.stringify({ type: 'mess', data: obj }))
        return
    }

    let uid = data.uid
    let typeAccount = data.typeAccount
    let action = data.type
    let betAmount = Number(data.betAmount);

    let accMarketing = data.mkt;

    for (let obj in users) {
        if (users[obj].ws == ws) {
            users[obj].uid = uid; // thay đổi id nếu change account
        }
    }


    var numberRegex = /^[]?\d+(\.\d+)?([eE][]?\d+)?$/;

    if (numberRegex.test(betAmount)) {
        // số tiền đc phép đặt cược
        if (betAmount < BET_MAX) {
            let obj = { type: 'bet', mess: 'Số tiền không được nhở hơn ' + BET_MAX, style: 'danger' }
            ws.send(JSON.stringify({ type: 'mess', data: obj }))
            return
        }
        getMaretingAcc(data.email, (err, result) => {
            accMarketing = result.marketing;

            // kết thúc
            getPriceUser(data, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!result) {
                    return
                }
                if (result.balance >= betAmount) {
                    if (typeAccount == 1) {
                        //PRICE_SELL_LIVE.push(betAmount);
                        PRICE_SELL_LIVE += betAmount
                        updatePersonalTrading(data, (err, result) => { })
                    } else {
                        //PRICE_SELL_DEMO.push(betAmount);
                        PRICE_SELL_DEMO += betAmount;
                    }

                    if (void 0 === AMOUNT_USER_SELL[`${uid}`]) AMOUNT_USER_SELL[`${uid}`] = 0;

                    if (typeAccount == 1 && accMarketing == 1) {
                        PRICE_MAKETING_SELL += betAmount;
                    }

                    // nếu tồn tại acc marketing

                    AMOUNT_USER_SELL[`${uid}`] += betAmount
                    BTC_USER_SELL[`${uid}`] = AMOUNT_USER_SELL[`${uid}`] + '||' + action + '||' + typeAccount + '||' + data.email + '||' + accMarketing + '||' + uid;

                    //console.log('MKT BET SELL: ' + accMarketing);
                    updateBalanceUser(data, (err, result) => {
                        ws.send(JSON.stringify({ type: 'checkBet', data: 'ok' }))
                    })


                } else if (result.balance < betAmount) {
                    let obj = { type: 'bet', mess: 'Số dư không đủ!', style: 'danger' }
                    ws.send(JSON.stringify({ type: 'mess', data: obj }))
                }
            })

        })

    }
}


//========================= KẾT THÚC XỬ LÝ ĐẶT CƯỢC

function SendNotifyTele(accID, typeAcc, typeBet, amount) {
    let dataSys = Helper.getConfig(fileSys);
    if (dataSys.activeBetSendTelegram) {
        if (amount > 100) {
            Tele.sendMessBet(`Tài khoản: <b>${accID} (${typeAcc ? 'Live' : 'Demo'})</b>\nVừa cược: <b>${typeBet}</b> với <b>$${amount}</b>`)
        }
    }
}


function xulyInVaoHisBeCau() {

    const DATA_LIST_BE_CAU = [];

    for (let key in BTC_USER_BUY) {
        let uID = key;
        let moneyAndActionBuy = BTC_USER_BUY[uID];
        let moneyAndAction = moneyAndActionBuy.split("||");
        let money = moneyAndAction[0];
        let action = moneyAndAction[1];
        let typeAcc = moneyAndAction[2];
        let email = moneyAndAction[3];
        let mkt = moneyAndAction[4];
        if (typeAcc == 1) {
            let obj = { e: email, uid: uID, sv: SEVER_GET, bet: action, amount: money, mkt: mkt }
            DATA_LIST_BE_CAU.push(obj);
        }
    }

    for (let key in BTC_USER_SELL) {
        let uID = key;
        let moneyAndActionSell = BTC_USER_SELL[uID];
        let moneyAndAction = moneyAndActionSell.split("||");
        let money = moneyAndAction[0];
        let action = moneyAndAction[1];
        let typeAcc = moneyAndAction[2];
        let email = moneyAndAction[3];
        let mkt = moneyAndAction[4];
        if (typeAcc == 1) {
            let obj = { e: email, uid: uID, sv: SEVER_GET, bet: action, amount: money, mkt: mkt }
            DATA_LIST_BE_CAU.push(obj)
        }
    }



    for (let obj in users) {
        let uid = users[obj].uid;
        // tìm UID của ADMIN rồi gửi

        if (uid == 'ADMIN_BO') {
            //console.log(uid);
            let ws = users[obj].ws;
            //let totalPriceBUY = void 0 === eval(PRICE_BUY_LIVE.join('+')) ? 0 : eval(PRICE_BUY_LIVE.join('+'));
            //let totalPriceSELL = void 0 === eval(PRICE_SELL_LIVE.join('+')) ? 0 : eval(PRICE_SELL_LIVE.join('+'));
            let totalPriceBUY = PRICE_BUY_LIVE;
            let totalPriceSELL = PRICE_SELL_LIVE;

            ws.send(JSON.stringify({ type: 'truck', data: DATA_LIST_BE_CAU, price_buy: totalPriceBUY * 1, price_sell: totalPriceSELL * 1, mktBUY: PRICE_MAKETING_BUY * 1, mktSELL: PRICE_MAKETING_SELL * 1 }));
        }
    }


}


function writeStatic() {

    let countBUY = BUY.length;
    let countSELL = SELL.length;

    //Moving
    let MovBUY = Math.floor(Math.random() * 16)
    let MovSELL = Math.floor(Math.random() * 16)
    let MovNeutral = Math.floor(Math.random() * 7)
    if (MovBUY === MovSELL) {
        MovSELL = Math.floor(Math.random() * 5)
    }

    //Oscillators
    let OscBUY = Math.floor(Math.random() * 16)
    let OscSELL = Math.floor(Math.random() * 16)
    let OscNeutral = Math.floor(Math.random() * 7)
    if (OscBUY === OscSELL) {
        OscSELL = Math.floor(Math.random() * 5)
    }

    //Summary
    let SumBUY = MovBUY + OscBUY
    let SumSELL = MovSELL + OscSELL
    let SumNeutral = MovNeutral + OscNeutral

    getLoadStaticGue = { Moving: { b: MovBUY, s: MovSELL, m: MovNeutral }, Oscillators: { b: OscBUY, s: OscSELL, m: OscNeutral }, Summary: { b: SumBUY, s: SumSELL, m: SumNeutral } }
    let obj = { ss: session, cbuy: countBUY, csell: countSELL, static: STATIC }

    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({ type: 'static', data: obj, load: getLoadStaticGue }));
    });
}

async function HandlingBuySell2(title) {
    var TOTAL_WIN_PRICE = 0, TOTAL_LOSE_PRICE = 0;

    let countUser = Object.keys(users).length;

    for (let obj in BTC_USER_BUY) {

        let moneyAndActionBuy = BTC_USER_BUY[obj];
        let moneyAndAction = moneyAndActionBuy.split("||");
        let money = moneyAndAction[0];
        let action = moneyAndAction[1];
        let type = moneyAndAction[2];
        let email = moneyAndAction[3];
        let accMarketingBuy = moneyAndAction[4];
        let uid = moneyAndAction[5];
        let ws = '';

        await new Promise((res, rej) => {
            let o = 0;
            for (let av in users) {
                o++;
                if (users[av].email == email) {
                    ws = users[av].ws;
                    res();
                }
                if (o === countUser) res();
            }
        })

        if (action === title) { // đây là thắng của BUY
            let amount = money / 100 * rateNhaThuong; // Money của BUY

            let amountShow = Number(amount); // là số tiền nhận được
            let addMo = amountShow + Number(money);

            let obj = {
                balance: addMo,
                win: amountShow,
                upID: uid,
                email: email
            }

            if (type == 1) {
                updatePriceWinLose(obj, 'w');
                TOTAL_WIN_PRICE += amountShow;
            }

            if (type == 1 && accMarketingBuy == 1) {
                AMOUNT_MARKETING_WIN += amountShow;
            }

            updateAmountWin(obj, (err, result) => { })

            let obj2 = {
                type: 'kq',
                data: { kq: 'win', money: addMo }
            }

            //console.log('XU LY BUY WIN: ' + accMarketingBuy);
            if (ws !== '')
                ws.send(JSON.stringify(obj2));

            // Lưu vào lịch sử
            await SaveHistory('win', uid, type, action, SEVER_GET, amountShow, money, email, accMarketingBuy);

            await handleStreakChallenge(email);



        } else if (action !== title) {

            let obj = {
                lose: Number(money),
                upID: uid,
                email: email
            }
            updateAmountLose(obj, (err, result) => { })

            if (type == 1) {
                updatePriceWinLose(obj, 'l');
                TOTAL_LOSE_PRICE += obj.lose;
            }
            if (type == 1 && accMarketingBuy == 1) {
                AMOUNT_MARKETING_LOSE += obj.lose;
            }

            let obj2 = {
                type: 'kq',
                data: { kq: 'lose', money: Number(money) }
            }


            if (ws !== '')
                ws.send(JSON.stringify(obj2));

            // Lưu vào lịch sử
            await SaveHistory('lose', uid, type, action, SEVER_GET, money, money, email, accMarketingBuy);
            await handleStreakChallenge(email);

        }

    }

    for (let obj in BTC_USER_SELL) {
        let moneyAndActionSell = BTC_USER_SELL[obj];
        let moneyAndAction = moneyAndActionSell.split("||");
        let money2 = moneyAndAction[0];
        let action2 = moneyAndAction[1];
        let type2 = moneyAndAction[2];
        let email2 = moneyAndAction[3];
        let accMarketingSell = moneyAndAction[4];
        let uid = moneyAndAction[5];
        let ws = '';

        await new Promise((res, rej) => {
            let o = 0;

            for (let av in users) {
                o++;
                if (users[av].email == email2) {
                    ws = users[av].ws;
                    res();
                }
                if (o === countUser) res();
            }
        })




        if (action2 === title) { // đây là thắng của SELL
            let amount = money2 / 100 * rateNhaThuong; // Money của BUY

            let amountShow = Number(amount); // là tổng số tiền nhận được
            let addMo = amountShow + Number(money2);

            let obj = {
                balance: addMo,
                win: amountShow,
                upID: uid,
                email: email2
            }

            if (type2 == 1) {
                TOTAL_WIN_PRICE += amountShow;
                updatePriceWinLose(obj, 'w');
            }
            if (type2 == 1 && accMarketingSell == 1) {
                AMOUNT_MARKETING_WIN += amountShow;
            }

            updateAmountWin(obj, (err, result) => { });

            let obj2 = {
                type: 'kq',
                data: { kq: 'win', money: addMo }
            }

            if (ws !== '')
                ws.send(JSON.stringify(obj2));

            //console.log('XU LY SELL WIN: ' + accMarketingSell);

            // Lưu vào lịch sử
            await SaveHistory('win', uid, type2, action2, SEVER_GET, amountShow, money2, email2, accMarketingSell);
            await handleStreakChallenge(email2);


        } else if (action2 !== title) {

            let obj = {
                lose: Number(money2),
                upID: uid,
                email: email2
            }
            updateAmountLose(obj, (err, result) => { })

            if (type2 == 1) {
                TOTAL_LOSE_PRICE += obj.lose;
                updatePriceWinLose(obj, 'l');
            }

            if (type2 == 1 && accMarketingSell == 1) {
                AMOUNT_MARKETING_LOSE += obj.lose;
            }

            let obj2 = {
                type: 'kq',
                data: { kq: 'lose', money: Number(money2) }
            }

            //console.log('XU LY SELL LOSE: ' + accMarketingSell);

            if (ws !== '')
                ws.send(JSON.stringify(obj2));

            // Lưu vào lịch sử
            await SaveHistory('lose', uid, type2, action2, SEVER_GET, money2, money2, email2, accMarketingSell);
            await handleStreakChallenge(email2);

        }

    }


    // BTC_USER_BUY_BACK = BTC_USER_BUY;
    // BTC_USER_SELL_BACK = BTC_USER_SELL;

    BTC_USER_BUY = [];
    BTC_USER_SELL = [];
    AMOUNT_USER_BUY = [];
    AMOUNT_USER_SELL = [];



    PRICE_BUY_LIVE = 0;
    PRICE_SELL_LIVE = 0;

    PRICE_BUY_DEMO = 0;
    PRICE_SELL_DEMO = 0;

    // Xử lý kết quả random
    const keySessionRandom = Object.keys(RANDOM_SESSION);
    if (Number(keySessionRandom[keySessionRandom.length - 1]) === session - 1) {
        RANDOM_SESSION = {};
        for (let index = 1; index <= RANDOM_SESSION_MAX; index++) {
            RANDOM_SESSION[session + index] = ~~(Math.random() * 10) % 2 ? 'buy' : 'sell';
        }
    }

    XU_LY_QUY_BOT(TOTAL_WIN_PRICE, TOTAL_LOSE_PRICE);
    //money, uid, type, email, marketing
    HandlingCommissionBUY();
    HandlingCommissionSELL();
}


function pushHistResults(kq, price) {
    HIST_RESULTS.push({ kq, price, time: timeGet, session: session - 1 })
    if (HIST_RESULTS.length > 10) {
        HIST_RESULTS.shift()
    }

    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({ type: 'hist_results', data: HIST_RESULTS }));
    });
}


// Xử lý thưởng hoa hồng khi đặt cược

async function HandlingCommissionBUY() {
    // lấy thông tin systeam hoa hồng
    let lsComm = Helper.getConfig(fileCommission);

    let UpId = ''; // lấy mã ref ( nếu có )
    let RefFN = ''; // ref của chính mình
    //let email = ''; // email của chính mình
    var levelVip = 1;

    let obj = {
        penCom: 0, // rate hoa hồng
        upID: 0,
        refID: 0, // ID ref của mình
        email: '', // email chính mình
        fromID: 0, // là mã ID account LIVE
        volum: 0 // số tiền đặt cược
    }

    for (let xl in BTC_USER_BUY_BACK) {
        let moneyAndActionBuy = BTC_USER_BUY_BACK[xl];
        let moneyAndAction = moneyAndActionBuy.split("||");
        let money = moneyAndAction[0];
        //let action = moneyAndAction[1];
        let type = moneyAndAction[2];
        let email = moneyAndAction[3];
        let accMarketingBuy = moneyAndAction[4];
        let uid = moneyAndAction[5];

        if (type == 1) {
            await new Promise((res, rej) => {
                checkF0Commission(email, (err, results) => { // lấy thông tin của mình

                    if (results.length) { // nếu tồn tại
                        UpId = results[0].upline_id; // lấy mã ref ( nếu có )
                        RefFN = results[0].ref_code; // ref của chính mình
                    }
                    res();
                });
            })


            if (void 0 !== UpId || UpId !== null || UpId !== '') { // nếu có tồn tại F0 của mình

                await new Promise((res, rej) => {
                    listF0With7Level(UpId, (err, results) => { // lấy thông tin của mình bao gồm F0 của mình
                        let i = 0;
                        let tt = Object.keys(results).length;
                        for (let nb in results) {
                            let d = results[nb];

                            if (d.length > 0) {
                                levelVip = d[0].level_vip;

                                let rateVal = lsComm[i].value * 1;
                                let rateCommission = money / 100 * rateVal;

                                obj.penCom = rateCommission;
                                obj.upID = RefFN;
                                obj.refID = d[0].ref_code;
                                obj.email = d[0].email;
                                obj.fromID = uid;
                                obj.volum = money;
                                obj.mkt = accMarketingBuy;
                                obj.session = session;

                                if (i === 0) { // F0 của mình chắc chắn sẽ nhận
                                    // update số tiền hoa hồng vào tài khoản
                                    updateAmountRateCommission(obj);

                                } else {
                                    if (levelVip >= i) {
                                        obj.volum = 0;
                                        // update số tiền hoa hồng vào tài khoản
                                        updateAmountRateCommission(obj);
                                    }
                                }
                            } else {
                                res();
                                break;
                            }
                            i++;
                        }

                    });
                })
            }
        }

    }

    //BTC_USER_BUY_BACK = [];
}

async function HandlingCommissionSELL() {
    // lấy thông tin systeam hoa hồng
    let lsComm = Helper.getConfig(fileCommission);

    let UpId = ''; // lấy mã ref ( nếu có )
    let RefFN = ''; // ref của chính mình
    //let email = ''; // email của chính mình
    var levelVip = 1;

    let obj = {
        penCom: 0, // rate hoa hồng
        upID: 0,
        refID: 0, // ID ref của mình
        email: '', // email chính mình
        fromID: 0, // là mã ID account LIVE
        volum: 0 // số tiền đặt cược
    }


    for (let xl in BTC_USER_SELL_BACK) {
        let moneyAndActionSell = BTC_USER_SELL_BACK[xl];
        let moneyAndAction = moneyAndActionSell.split("||");
        let money2 = moneyAndAction[0];
        //let action2 = moneyAndAction[1];
        let type2 = moneyAndAction[2];
        let email2 = moneyAndAction[3];
        let accMarketingSell = moneyAndAction[4];
        let uid = moneyAndAction[5];

        if (type2 == 1) {
            await new Promise((res, rej) => {
                checkF0Commission(email2, (err, results) => { // lấy thông tin của mình

                    if (results.length) { // nếu tồn tại
                        UpId = results[0].upline_id; // lấy mã ref ( nếu có )
                        RefFN = results[0].ref_code; // ref của chính mình
                    }
                    res();
                });
            })

            if (void 0 !== UpId || UpId !== null || UpId !== '') { // nếu có tồn tại F0 của mình
                await new Promise((res, rej) => {
                    listF0With7Level(UpId, (err, results) => { // lấy thông tin của mình bao gồm F0 của mình
                        let i = 0;
                        //let tt = Object.keys(results).length;
                        //console.log(tt);
                        for (let nb in results) {
                            let d = results[nb];

                            if (d.length > 0) {

                                levelVip = d[0].level_vip;

                                let rateVal = lsComm[i].value * 1;
                                let rateCommission = money2 / 100 * rateVal;

                                obj.penCom = rateCommission;
                                obj.upID = RefFN;
                                obj.refID = d[0].ref_code;
                                obj.email = d[0].email;
                                obj.fromID = uid;
                                obj.volum = money2;
                                obj.mkt = accMarketingSell;
                                obj.session = session;

                                if (i === 0) { // F0 của mình chắc chắn sẽ nhận
                                    // update số tiền hoa hồng vào tài khoản
                                    updateAmountRateCommission(obj, (err) => { });

                                } else {
                                    if (levelVip >= i) {
                                        obj.volum = 0;
                                        // update số tiền hoa hồng vào tài khoản
                                        updateAmountRateCommission(obj, (err) => { });
                                    }
                                }
                            } else {
                                res();
                                break;
                            }
                            i++;

                        }

                    });
                })
            }
        }

    }

    //BTC_USER_SELL_BACK = [];
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Kết thúc xử lý thưởng hoa hồng khi đặt cược




// Xử lý lưu vào lịch sử


async function SaveHistory(wl, uid, typeAccount, buy_sell, currency, amountWL, amountBet, email, marketing) {
    var count = LIST_GET_DATA.length - 1;
    var op = parseFloat(LIST_GET_DATA[count].open).toFixed(2)
    var cl = parseFloat(LIST_GET_DATA[count].close).toFixed(2)

    let obj = {
        uid: uid,
        typeAccount: Number(typeAccount),
        currency: currency,
        buy_sell: buy_sell,
        amount_win: wl == 'win' ? Number(amountWL) : 0,
        amount_lose: wl == 'win' ? 0 : Number(amountWL),
        amount_bet: amountBet,
        open: op,
        close: cl,
        session: session,
        email: email,
        mkt: marketing
    }

    await insertBetOrder(obj, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
    })

}


// kết thúc xử lý lưu vào lịch sử




//=========================

var startBotAo, numberBuy = 0, numberSell = 0;

function BOTAOStart() {

    //var PRICE_BUY_BOT = 0, PRICE_SELL_BOT = 0;

    startBotAo = setInterval(function () {
        var rd = Math.floor((Math.random() * 2) + 1);
        var rdNumBuy = 0;
        var rdNumSell = 0;
        if (rd == 1) {
            rdNumBuy = Math.floor((Math.random() * BET_MAX) + (BET_MAX * 1.5));
            rdNumSell = Math.floor((Math.random() * 10000) + 1);
        } else {
            rdNumBuy = Math.floor((Math.random() * 10000) + 1);
            rdNumSell = Math.floor((Math.random() * BET_MAX) + (BET_MAX * 1.5));
        }
        numberBuy += rdNumBuy;
        numberSell += rdNumSell;


        let getPRICE_BUY = PRICE_BUY_LIVE + numberBuy;
        let getPRICE_SELL = PRICE_SELL_LIVE + numberSell;

        numberBuy = getPRICE_BUY;
        numberSell = getPRICE_SELL;


        let total = numberBuy + numberSell;

        /**
         * Thay đổi logic -> random trong khoảng 40 - 60 % mỗi cái
         */
        // totalPTBuy = toFixed((numberBuy/total)*100, 0);
        // totalPTSell = toFixed((numberSell/total)*100, 0);


        totalPTBuy = toFixed(getRandomArbitrary(40, 60), 0);
        totalPTSell = 100 - Number(totalPTBuy);


        wss.clients.forEach(function each(client) {
            let json = { nbuy: numberBuy, nsell: numberSell, ptbuy: Number(totalPTBuy), ptsell: Number(totalPTSell) }

            client.send(JSON.stringify({ type: 'transVolum', data: json }));
        })

    }, 2000);
}

function BOTAOClear() {
    numberBuy = 0;
    numberSell = 0;
    clearInterval(startBotAo);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

async function handleStreakChallenge(email) {
    return;
    try {
        const userByEmail = await new Promise((resolve, reject) => {
            db.query(`SELECT verified, nick_name FROM users WHERE email = ? AND marketing = 0`, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (!results.length) {
                    return reject("Not found");
                }
                resolve(results[0]);
            })
        });

        if (userByEmail) {
            // Chưa đăng ký KYC nghỉ
            if (Number(userByEmail.verified)) {
                const configStreakChallenge = Helper.getConfig('streak-challenge');
                // Chưa config
                if (configStreakChallenge) {
                    let listBetByUser = await new Promise((resolve, reject) => {
                        db.query(`SELECT email, amount_bet, amount_win, amount_lose, created_at FROM bet_history WHERE type_account = 1 AND DAY(created_at) = DAY(NOW()) AND email = ? ORDER BY created_at DESC`, [email], (err, results) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(results);
                        })
                    });

                    listBetByUser = Array.from(listBetByUser);

                    const currentPrize = getPrize();
                    const prize = currentPrize.sum * currentPrize.precent;

                    if (listBetByUser.length >= Number(configStreakChallenge.consecutive)) {
                        let countBetLoseOK = 0;
                        let isContinueLose = true;
                        listBetByUser.forEach((e) => {
                            if (Number(e.amount_lose) > 0 && Number(e.amount_bet) >= Number(configStreakChallenge.moneyConditional) && isContinueLose) {
                                countBetLoseOK += 1;
                            } else {
                                isContinueLose = false;
                            }
                        });

                        let countBetWinOK = 0;
                        let isContinueWin = true;
                        listBetByUser.forEach((e) => {
                            if (Number(e.amount_win) > 0 && Number(e.amount_bet) >= Number(configStreakChallenge.moneyConditional) && isContinueWin) {
                                countBetWinOK += 1;
                            } else {
                                isContinueWin = false;
                            }
                        });

                        if (countBetLoseOK >= Number(configStreakChallenge.consecutive)) {
                            db.query(`INSERT INTO streak_challenge(email, nick_name, count, prize, session, isAddByAdmin, isWin, created_at) VALUES(?,?,?,?,?,?,?,now())`, [
                                email,
                                userByEmail.nick_name,
                                countBetLoseOK,
                                prize,
                                session,
                                0,
                                0
                            ], (err, results) => {
                                if (err) {
                                    return callback(err);
                                }
                                sendNotiStreakChallenge(email, prize);
                            });
                        }

                        if (countBetWinOK >= Number(configStreakChallenge.consecutive)) {
                            db.query(`INSERT INTO streak_challenge(email, nick_name, count, prize, session, isAddByAdmin, isWin, created_at) VALUES(?,?,?,?,?,?,?,now())`, [
                                email,
                                userByEmail.nick_name,
                                countBetWinOK,
                                prize,
                                session,
                                0,
                                1
                            ], (err, results) => {
                                if (err) {
                                    return callback(err);
                                }
                                sendNotiStreakChallenge(email, prize);
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function sendNotiStreakChallenge(email, prize) {
    await new Promise((resolve, reject) => {
        db.query(`UPDATE users SET money_usdt = money_usdt + ? WHERE email = ?`, [prize, email], (err, res) => {
            if (err) {
                return reject(err);
            }

            resolve(res);
        })
    })

    const currentUser = new Promise((resolve, reject) => {
        db.query(`select nick_name from users WHERE email = ?`, [email], (err, res) => {
            if (err) {
                return reject(err);
            }

            resolve(res[0].nick_name);
        })
    })

    await new Promise((resolve, reject) => {
        db.query(`insert into trade_history (email, from_u, to_u, type_key, type, currency, amount, status, created_at)
        values(?,?,?,?,?,?,?,?,now())`,
            [
                email,
                currentUser.nick_name,
                currentUser.nick_name,
                'streak-challenge', // Nạp nhanh
                `Giải thưởng Streak Challenge`,
                'usdt',
                prize,
                1
            ], (err, res) => {
                if (err) {
                    return reject(err);
                }

                resolve(res);
            })
    })

    SEND_THONG_BAO('streak-challenge', email, email, `Chúc mừng bạn đã nhận được giải thưởng Streak Challenge`, `Giá trị phần thưởng là $${prize}. Hãy mạnh mẽ và chiến đấu!`);
}

module.exports = { USER_ONLINE: users }
