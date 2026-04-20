/**
 * Dev: t.me/uppppto200
 * Please contact us if you have any problems
 * ALL OTHER CONTACTS ARE INTERMEDIARIES
 */

// const TelegramBot = require('node-telegram-bot-api')
const express = require("express");
const helmet = require("helmet");
const config = require('./config')
const Helper = require("./helpers");

const fileSys = config.PATH_SYS_CONFIG
const dataSys = Helper.getConfig(fileSys);

// const TelegramAll = new TelegramBot(dataSys.TELEGRAM_TOKEN, {polling: true})
// TelegramAll.set

// global['ARESTele'] = TelegramAll;

const app = express();
app.use(helmet());

//require('./hoahong'); // chạy trả thưởng hoa hồng
require('./src/app'); // chạy http
require('./games/trade'); // chạy game
require('./auth/sys_settings'); // chạy thiết lập hệ thống
// require('./auth/mess'); // chạy BOT Telegram
require('./src/nap'); // chạy BOT Nạp
require('./auth/notifi'); // chạy thông báo

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
process.on('uncaughtException', function (exception) {
	console.log(exception);
});
