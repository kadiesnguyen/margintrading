//const e = require("cors");
const moment = require('moment-timezone');
const db = require("./../../database");
const config = require('../../config');
const Helper = require("../../helpers");
var fileSys = config.PATH_SYS_CONFIG;
const fileCommissionVip = config.PATH_SYS_COMMISSION_VIP;
//const fs = require('fs');
const Web3 = require('web3');
const axios = require('axios');

var dataSys = Helper.getConfig(fileSys);
const Tele = require("../../auth/telegram_notify");
const { SEND_THONG_BAO } = require("../../auth/notifi");
const { users } = require('./../../games/trade');

const createAddressBTC = `https://api.blockcypher.com/v1/btc/main/addrs?token=${dataSys.tokenBlockcypher}`;
// 2000 request 1 ngày eth / btc
//const web3 = new Web3(new Web3.providers.WebsocketProvider(`https://api.blockcypher.com/v1/eth/main/addrs?token=${dataSys.tokenBlockcypher}`))

// 100k request 1 ngày ETH
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${dataSys.projectId}`));

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

Date.prototype.getWeek = function () {
    var target = new Date(this.valueOf());
    var dayNr = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

function getDateRangeOfWeek(weekNo) {
    var d1 = new Date();
    numOfdaysPastSinceLastMonday = eval(d1.getDay() - 1);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    var weekNoToday = d1.getWeek();
    var weeksInTheFuture = eval(weekNo - weekNoToday);
    d1.setDate(d1.getDate() + eval(7 * weeksInTheFuture));
    var rangeIsFrom = eval(d1.getFullYear() + 1) + "-" + d1.getMonth() + "-" + d1.getDate();
    d1.setDate(d1.getDate() + 6);
    var rangeIsTo = eval(d1.getFullYear() + 1) + "-" + d1.getMonth() + "-" + d1.getDate();
    return rangeIsFrom + " to " + rangeIsTo;
};

function creatAccountUser(data) {
    db.query(
        `select count(email) as countMail from account WHERE email = ?`,
        [data.username], (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            if (results[0].countMail > 0) return;
            // tạo tài khoản thật
            db.query(
                `insert into account (email, type, u_id, created_at)
                    values(?,1,?,now())`,
                [
                    data.username,
                    makeid(10)
                ]
            );
        }
    )
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = {

    checkUserNickName: (nick, callback) => {
        db.query(
            `SELECT nick_name FROM users WHERE nick_name = ?`,
            [nick], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    checkRefCode: (code, callback) => {
        db.query(
            `SELECT 1 FROM users WHERE ref_code = ?`,
            [code], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    createAccount: async (data, callback) => {
        try {
            if (data.upline_id === '') {
                data.upline_id = null
            }

            db.query(
                `insert into users (username, last_name, password, phone, upline_id, ref_code, created_at)
                  values(?,?,?,?,?,?,now())`,
                [
                    data.username,
                    data.name,
                    data.password,
                    data.phone,
                    data.refCode,
                    makeid(7),
                ],
                async (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    creatAccountUser(data);
                    return callback(null, results);
                }
            );
        } catch (error) {
            return callback(error);
        }

    },


    createAgency: async (data, callback) => {
        try {
            const role = data.role == "admin" ? 1 : 2;
            let ref_code = makeid(7);
            if (data.ref_code && data.ref_code.trim()) {
                const isExistRefCode = await new Promise((res, rej) => {
                    db.query(`SELECT count(id) as count FROM users WHERE ref_code = ?`,
                        [data.ref_code.toUpperCase()],
                        (error, result) => {
                            res(result[0].count)
                        })
                });

                if (isExistRefCode) {
                    return callback(null, false)
                }
                else {
                    ref_code = data.ref_code.toUpperCase();
                }
            }

            db.query(
                `insert into users (ref_code, username, first_name, last_name, password, email, phone, active, manage_supers, created_at)
                values(?,?,?,?,?,?,?,?,?,now())`,
                [
                    ref_code,
                    data.username,
                    data.first_name,
                    data.last_name,
                    data.password,
                    data.email,
                    data.phone,
                    1,
                    role
                ],
                async (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    creatAccountUser(data);
                    const createdUser = await new Promise((resolve, reject) => {
                        db.query(
                            `SELECT * FROM users WHERE username = ?`,
                            [data.username],
                            (error, results, fields) => {
                                resolve(results[0])
                            });
                    });

                    return callback(null, createdUser)
                }
            );
        } catch (error) {
            if (error) {
                return callback(error);
            }
        }

    },

    updateAgency: (data, callback) => {
        const role = data.role == "admin" ? 1 : 2;
        if (!data.password) {
            db.query(
                `UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ?, phone = ?, manage_supers = ? where id = ?`,
                [
                    data.username,
                    data.first_name,
                    data.last_name,
                    data.email,
                    data.phone,
                    role,
                    data.id
                ],

                (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, true)
                }
            );
        }

        else {
            db.query(
                `UPDATE users SET username = ?, password = ?, first_name = ?, last_name = ?, email = ?, phone = ?, manage_supers = ? where id = ?`,
                [
                    data.username,
                    data.password,
                    data.first_name,
                    data.last_name,
                    data.email,
                    data.phone,
                    role,
                    data.id
                ],

                (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, true)
                }
            );
        }

    },

    checkUserPhone: (phone, callback) => {
        phone = phone.trim();
        db.query(
            `select phone from users where phone = ?`,
            [phone],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },

    checkUsername: (username, callback) => {
        username = username.toLowerCase().trim();
        db.query(
            `select username from users where username = ?`,
            [username],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },

    checkExistedAgency: (username, email, callback) => {
        db.query(
            `select username from users where username = ? OR email = ?`,
            [username.trim(), email.trim()], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    checkAgencyUserNameUpdate: (data, callback) => {
        db.query(
            `select username from users where (email = ? AND id <> ?) or (username = ? AND id <> ?)`,
            [data.email, data.id, data.username, data.id], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    checkCodeSecure: (data, callback) => {
        db.query(
            `select email from users where email = ? and code_secure = ?`,
            [data.email, data.code_secure], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    checkActiveUser: (email, callback) => {
        db.query(
            `select active from users where email = ? and active = 1 and isDisabled = 0`,
            [email], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    getInfoUser: (username, callback) => {
        var dataList = [];
        db.query(
            `select
                users.id,
                users.phone,
                users.username,
                users.last_name as name,
                users.ref_code as ref,
                users.upline_id as upid,
                account.balance as balance,
                account.u_id as uid
                from users
                INNER JOIN account ON users.username = account.email AND account.type = 1
                WHERE username = ? AND
                isDisabled = 0`,
            [username],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                dataList = results[0];
                return callback(null, dataList);
            }
        );
    },

    getAllUser: async (data, ref_code, query, callback) => {
        const limit = query.limit >> 0 || 20
        const offset = query.offset >> 0 || 0
        const search = query.s || ""

        if (data.x == 1 && !ref_code) {
            const searhQuery = search ? "AND (username LIKE ? OR CONCAT(COALESCE(first_name, ''), last_name) LIKE ? or email LIKE ?)" : "";
            const countUsesrs = new Promise((res, rej) => {
                const values = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []
                db.query(`SELECT count(id) as count FROM users WHERE deleted_at is NULL AND manage_supers = 0 ${searhQuery}`, values, (err, result) => {
                    if (err) {
                        rej(err)
                    }
                    if (result) {
                        res(result[0].count)
                    }
                })
            })
            const usersList = new Promise((res, rej) => {
                const values = search ? [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset] : [limit, offset]
                db.query(
                    `SELECT user_temp.*, account.balance FROM
                     (SELECT * FROM users WHERE deleted_at is NULL AND manage_supers = 0 ${searhQuery} ORDER BY users.id DESC LIMIT ? OFFSET ?) user_temp
                     LEFT JOIN account ON user_temp.username = account.email AND account.type = 1`,
                    values, (err, result) => {
                        if (err) {
                            rej(err)
                        }
                        if (result) {
                            res(result)
                        }
                    }
                )
            })
            try {
                const [count, items] = await Promise.all([countUsesrs, usersList]);
                return callback(null, { count, items })
            } catch (err) {
                return callback(err)
            }
        }

        if ((data.x == 1 && !!ref_code) || data.x == 2) {
            let r = data.ref_code
            if (data.x == 1) {
                r = ref_code
            }
            const searhQuery = search ? "AND (username LIKE ? OR CONCAT(COALESCE(first_name, ''), last_name) LIKE ? or email LIKE ?)" : "";
            const countUsesrs = new Promise((res, rej) => {
                const values = search ? [r, `%${search}%`, `%${search}%`, `%${search}%`] : [r]
                db.query(`SELECT count(id) as count FROM users WHERE deleted_at is NULL AND manage_supers = 0 AND upline_id = ? ${searhQuery}`, values, (err, result) => {
                    if (err) {
                        rej(err)
                    }
                    if (result) {
                        res(result[0].count)
                    }
                })
            })
            const usersList = new Promise((res, rej) => {
                const values = search ? [r, `%${search}%`, `%${search}%`, `%${search}%`, limit, offset] : [r, limit, offset]
                db.query(
                    `SELECT user_temp.*, account.balance FROM
                     (SELECT * FROM users WHERE deleted_at is NULL AND manage_supers = 0 AND upline_id = ? ${searhQuery} ORDER BY users.id DESC LIMIT ? OFFSET ?) user_temp
                     LEFT JOIN account ON user_temp.username = account.email AND account.type = 1`,
                    values, (err, result) => {
                        if (err) {
                            rej(err)
                        }
                        if (result) {
                            res(result)
                        }
                    }
                )
            })
            try {
                const [count, items] = await Promise.all([countUsesrs, usersList]);
                return callback(null, { count, items })
            } catch (err) {
                return callback(err)
            }
        }

    },

    getUserById: (id, callback) => {
        db.query(
            `select * from users where id = ?`,
            [id], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0])
            }
        )
    },
    getwithdrawallist: (callback) => {
        db.query(
            `select email, currency, amount, created_at from trade_history where delete_status = 0 and status = ? and type_key = "rt" order by id desc LIMIT 50`,
            [1], (error, results) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    updateUserById: (data, callback) => {
        if (!data.password) {
            let qr = `update users set last_name = ?, bank = ?, phone = ?, so_cmnd = ?, updated_at = now() where id = ?`;
            db.query(
                qr,
                [
                    data.name,
                    data.bank,
                    data.phone,
                    data.so_cmnd,
                    data.id,
                ], (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, results)
                }
            )
        }

        else {
            let qr = `update users set last_name = ?, bank = ?, phone = ?, so_cmnd = ?, password = ? , updated_at = now() where id = ?`;
            db.query(
                qr,
                [
                    data.name,
                    data.bank,
                    data.phone,
                    data.so_cmnd,
                    data.password,
                    data.id,
                ], (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, results)
                }
            )
        }
    },

    updateInfoVerify: (data, callback) => {
        db.query(
            `update users set bank = ?, phone = ?, so_cmnd = ?, verified = 1 where email = ?`,
            [
                data.bank,
                data.phone,
                data.so_cmnd,
                data.email
            ], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },

    updateUserMoney: (data, callback) => {
        db.query(
            `update account set balance = balance + ? where email = ? and type = 1`,
            [
                data.amount,
                data.email
            ], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }

                db.query(`INSERT INTO add_money_history (email, type, price_VN, created_at)
                 VALUES(?,?,?,now())`,
                    [
                        data.email,
                        1,
                        data.amount
                    ]);
                return callback(null, results)
            }
        )
    },

    activeUser: (data, callback) => {
        db.query(
            `update users set active = 1, code_secure = ? where email = ?`,
            [
                makeid(4),
                data.email
            ], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                creatAccountUser(data);
                return callback(null, results)
            }
        )

    },

    updateUserPasswordByEmail: (data, callback) => {
        db.query(
            `UPDATE users SET password = ? WHERE username = ?`,
            [data.password, data.username],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },


    deleteUserById: (id, callback) => {
        db.query(
            `UPDATE users SET active = 0, deleted_at = now() WHERE id = ?`,
            [id], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
        // db.query(
        //     `delete from users where id = ?`,
        //     [id], (error, results, fields) => {
        //         if(error){
        //             return callback(error);
        //          }
        //          return callback(null, results)
        //     }
        // )
    },

    getUserByUserEmail: (email, callback) => {
        db.query(
            `SELECT users.phone, users.username, u_id as uid, users.password, users.last_name as name, users.deleted_at
            FROM users INNER JOIN account ON users.username = account.email
            WHERE users.email = ? OR users.username = ? AND isDisabled = 0 `,
            [email, email],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                if (results[0] && !!results[0].deleted_at) {
                    return callback(null);
                }
                return callback(null, results[0]);
            }
        );
    },

    getAdminByAdminUsername: (username, callback) => {
        db.query(
            `select email, last_name as name, password,  manage_supers as x, ref_code from users where (email = ? OR username = ?) AND manage_supers <> 0 AND isDisabled = 0`,
            [username, username], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }

                if (!results.length) {
                    return callback("Tài khoản hoặc mật khẩu không chính xác!");
                }
                const roles = Helper.getConfig('role') || {};
                if (results[0].x == 1) {
                    results[0].permissions = roles['admin']
                }
                else if (results[0].x == 2) {
                    results[0].permissions = roles['agency']
                }
                return callback(null, results[0])
            }
        )
    },


    verifiedAccount: async (data, callback) => {
        if (data.verified !== -1) {
            db.query(
                `update users set verified = ? where id = ?`,
                [data.verified, data.id], (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    if (data.verified) {
                        db.query(
                            `SELECT email FROM users WHERE id = ?`,
                            [data.id], (error, result, fields) => {

                            })
                    }
                    return callback(null, results);
                }
            )
        } else {
            const emailUser = await new Promise((resolve, reject) => {
                db.query(`select email from users where id = ?`, [data.id], (err, res) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(res[0].email);
                })
            });

            db.query(
                `update users set bank = ?, verified = 0 where email = ?`,
                [
                    null,
                    emailUser
                ], (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    return callback(null, results);
                }
            )
        }
    },

    // get đại lý
    getListAgency: callback => {
        db.query(
            `select * from users where manage_supers <> 0 order by id desc`,
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    viewMemberAgency: (id, callback) => {
        db.query(
            `select COUNT(upline_id) as totalPeopel from users where upline_id = ?`,
            [id], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },


    checkMoneyUser: (email, callback) => {
        db.query(
            `select money_usdt as balance from users where email = ?`,
            [
                email
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0])
            }
        )
    },


    listHisBO: (email, callback) => {

        db.query(
            `select u_id from account where email = ? order by id desc`,
            [
                email
            ], (error, results, fields) => {

                var listAcc = []
                results.forEach(function (res) {
                    listAcc.push(res.u_id)
                })

                db.query(
                    `select
                        buy_sell as bs,
                        currency as c,
                        type_account as t,
                        amount_win as aw,
                        amount_lose as al,
                        amount_bet as ab,
                        open as o,
                        close as cl,
                        created_at as d
                        from bet_history where id_account = ? or id_account = ? and status = 1 order by id desc`,
                    [
                        listAcc[0],
                        listAcc[1]
                    ], (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        return callback(null, results)
                    }
                )
            }
        )

        //
    },


    WithDrawalVND: (data, callback) => {
        db.query(
            `select account.balance, users.bank, verified from account
            INNER JOIN users ON account.email = users.username AND type = 1
            where users.username = ?`,
            [data.username],
            async (error, results, fields) => {
                if (error) {
                    return callback(error);
                }

                if (!results[0].verified) {
                    const messages = "Account is not verified";
                    return callback(null, null, messages)
                }

                const bankNote = results[0].bank;
                const balance = results[0].balance;
                const tongPhi = Number(data.amount);
                if (balance >= tongPhi) {
                    //======= Trừ tiền tài khoản mình
                    db.query(
                        `UPDATE account SET balance = balance - ? WHERE email = ?`,
                        [tongPhi, data.username],
                        (error, results, fields) => {
                            if (error) {
                                return callback(error);
                            }
                            /**
                             * note user | tên ngân hàng | chi nhánh ngân hàng | số tài khoản | chủ tài khoản
                             */

                            //==== IN vào lịch sử
                            db.query(
                                `insert into trade_history (email, type_key, type, currency, amount, bank, note, status, created_at)
                            values(?,?,?,?,?,?,?,?,now())`,
                                [
                                    data.username,
                                    "rt", // Rút Tiền
                                    "Rút tiền VNĐ",
                                    "vnd",
                                    data.amount,
                                    bankNote,
                                    data.note,
                                    0,
                                ],
                                (error, results, fields) => {

                                }
                            );

                            return callback(null, results);
                        }
                    );
                } else {
                    return callback(null);
                }
            }
        );
    },


    BalanceWallet: (email, callback) => {
        db.query(
            `select
                money_usdt as usdt,
                money_eth as eth,
                money_btc as btc,
                money_paypal as paypal
                from users where email = ?`,
            [
                email
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0])
            }
        )
    },

    getUserBankInfo: (username, callback) => {
        db.query(
            `select bank, verified from users where username = ?`,
            [username],
            (errors, results, fields) => {
                if (errors) {
                    return callback(errors);
                }
                return callback(null, results[0])
            });
    },

    updateBankInfo: (data, callback) => {
        db.query(
            `update users set bank = ?, verified = 1 where username = ?`,
            [data.bank, data.username],
            (errors, results, fields) => {
                if (errors) {
                    return callback(errors);
                }

                return callback(null, results)
            });

    },

    getMyBankInfo: (email, callback) => {
        db.query(
            `select bank from users where email = ?`,
            [
                email
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0])
            }
        )
    },

    getBankList: (callback) => {
        const redataSys = Helper.getConfig('bank');
        return callback(null, redataSys || []);
    },

    setBankList: (data, callback) => {
        try {
            Helper.setConfig('bank', data)
            return callback(null, true);
        }
        catch (err) {
            return callback(err)
        }

    },

    DepositToWallet: (data, callback) => {

        const redataSys = Helper.getConfig(fileSys);

        let currUse = redataSys.typeCurrUseSys.toLowerCase()
        let money = 0
        if (currUse == 'usdt' || currUse == 'paypal') {
            money = data.m
        } else if (currUse == 'eth') {
            money = data.m * currUse.quotePriceETH
        } else if (currUse == 'btc') {
            money = data.m * currUse.quotePriceBTC
        }

        // money là tổng nhận
        // data.mlaf số tiền nhập

        // nạp nhanh
        if (!!money && money >= 11) {

            db.query(
                `update users set money_${currUse} = money_${currUse} - ? where email = ?`,
                [
                    data.m,
                    data.email
                ],
                (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    //update vào tài khoản thật
                    db.query(`update account set balance = balance + ? where email = ? and type = 1`, [money, data.email])

                    //==== IN vào lịch sử
                    db.query(`insert into trade_history (email, from_u, to_u, type_key, type, currency, amount, note, status, created_at)
                      values(?,?,?,?,?,?,?,?,?,now())`,
                        [
                            data.email,
                            data.nick,
                            data.uidLive,
                            'nn', // Nạp nhanh
                            `Nạp nhanh ${currUse.toUpperCase()} -> Live Account`,
                            currUse,
                            data.m,
                            data.gc,
                            1
                        ])

                    return callback(null, results)
                }
            )


        } else {
            return callback(null, [])
        }
    },


    UserEnabled: (data, callback) => {
        db.query(
            // `update users set isDisabled = ? where id = ? AND (username <> ? OR username IS NULL) AND (email IS NULL OR email <> ?)`,
            `update users set isDisabled = ? where id = ?`,
            [
                0,
                data.id,
                // data.email,
                // data.email
            ],

            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )

    },

    UserDisabled: (data, callback) => {
        db.query(
            // `update users set isDisabled = ? where id = ? AND (username <> ? OR username IS NULL) AND (email IS NULL OR email <> ?)`,
            `update users set isDisabled = ? where id = ?`,
            [
                1,
                data.id,
                // data.email,
                // data.email
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                if (results.affectedRows) {
                    db.query(
                        `select email from users where id = ?`,
                        [data.id],
                        (err, res) => {
                            if (err) {
                                return callback(err);
                            }

                            const email = res[0].email;
                            for (let l in users) {
                                if (users[l].email == email) {
                                    let ws = users[l].ws;
                                    let mess = {
                                        type: "disAccount",
                                        mess: "TÀI KHOẢN CỦA BẠN ĐANG TẠM KHOÁ VUI LÒNG HIỆN HỆ DVKH ĐỂ ĐƯỢC HỖ TRỢ !",
                                        style: "danger",
                                    };
                                    ws.send(JSON.stringify({ type: "mess", data: mess }));
                                    break;
                                }
                            }
                        }
                    );
                }
                return callback(null, results);
            }
        );

    },


    getNguoiGioiThieu: async (email, callback) => {
        let obj = {
            nick: '', // tên người giới thệu
            tsdl: 0, // tổng số đại lý
            tsngd: 0, // tổng số nhà giao dịch
            hhdl: 0, // Hoa hồng đại lý
            hhgd: 0, // hoa hồng giao dịch
            hhttisMe: 0, // hoa hồng tuần của f1 đại lý
            tsdlisMe: 0, // tổng số đại lý
            tslgdCD1: 0, // tổng số lượng giao dịch tháng này
            tslgdCD2: 0, // tổng số lượng giao dịch tháng 2
            tslgdCD3: 0, // tổng số lượng giao dịch tháng 3
            tslgdCD4: 0, // tổng số lượng giao dịch tháng 4
            t1: '',
            t2: '',
            t3: '',
            t4: '',
        }, upline_id = '', refForMe = '', lvVip = 0;

        await new Promise((resolve, reject) => {
            // lấy tên người f1 mà chính mình đã đăng ký
            db.query(
                `SELECT upline_id, ref_code, level_vip, pending_commission AS hhforme, commission_vip AS hhdl FROM users WHERE email = ?`,
                [
                    email
                ],
                (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }

                    upline_id = results[0].upline_id ? results[0].upline_id : '';
                    refForMe = results[0].ref_code
                    lvVip = results[0].level_vip
                    // obj.hhgd = results[0].hhforme
                    obj.hhdl = results[0].hhdl

                    resolve();
                })
        })

        // Lấy hoa hồng giao dịch VIP của các F dưới tháng này
        await new Promise((resolve, reject) => {
            db.query(
                `select
                SUM(pending_commission) AS hhgd,
                SUM(vip_commission) AS thhvip,
                SUM(personal_trading_volume) AS tslgdCD
                FROM commission_history WHERE ((upline_id = ? AND type = ?) OR (ref_id = ? AND type = ?)) AND MONTH(created_at) = MONTH(NOW())`,
                [
                    refForMe,
                    'hhv',
                    refForMe,
                    'klgd',
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    obj.hhgd = results[0].hhgd || 0;
                    obj.tshhmtn = (results[0].thhvip || 0) + obj.hhgd;
                    obj.tslgdCD1 = results[0].tslgdCD || 0;
                    resolve();
                })
        });


        if (upline_id !== '') {
            await new Promise((resolve, reject) => {
                // nếu tồn tại F0 của mình
                db.query(
                    `SELECT nick_name FROM users WHERE ref_code = ?`,
                    [upline_id], (error, results, fields) => {
                        if (error) {
                            resolve([]);
                        }

                        obj.nick = results[0].nick_name
                        //==================================================
                        resolve();
                        //return callback(null, obj)
                    })

            })
        } else {
            upline_id = '-------';
        }


        //========== TỔNG SỐ NHÀ GIAO DỊCH
        let listData = {
            "cap1": [],
            "cap2": [],
            "cap3": [],
            "cap4": [],
            "cap5": [],
            "cap6": [],
            "cap7": [],
            "cap8": [],
            "cap9": [],
            "cap10": [],
            "cap11": [],
            "cap12": [],
            "cap13": [],
            "cap14": [],
            "cap15": []
        };


        let cap1 = false, cap2 = false, cap3 = false, cap4 = false, cap5 = false, cap6 = false, cap7 = false, cap8 = false;
        // lấy cấp 1
        await new Promise((res, rej) => {
            db.query(
                `SELECT ref_code, vip_user FROM users WHERE upline_id = ?`,
                [
                    refForMe
                ], (error, result, fields) => {
                    if (result.length > 0) {
                        result.forEach((ele) => {
                            listData['cap1'].push(ele);
                            cap1 = true;
                        })
                    }
                    res();
                }
            )
        })

        if (cap1) {
            for (let i = 0; i < listData['cap1'].length; i++) {
                db.query(
                    `SELECT ref_code, vip_user FROM users WHERE upline_id = ?`,
                    [
                        listData['cap1'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap2'].push(ele);
                            });
                            cap2 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap2) {
            for (let i = 0; i < listData['cap2'].length; i++) {
                db.query(
                    `SELECT ref_code, vip_user FROM users WHERE upline_id = ?`,
                    [
                        listData['cap2'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap3'].push(ele);
                            });
                            cap3 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap3) {
            for (let i = 0; i < listData['cap3'].length; i++) {

                db.query(
                    `SELECT ref_code, vip_user FROM users WHERE upline_id = ?`,
                    [
                        listData['cap3'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap4'].push(ele);
                            });
                            cap4 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap4) {
            for (let i = 0; i < listData['cap4'].length; i++) {
                db.query(
                    `SELECT ref_code, vip_user FROM users WHERE upline_id = ?`,
                    [
                        listData['cap4'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap5'].push(ele);
                            });
                            cap5 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap5) {
            for (let i = 0; i < listData['cap5'].length; i++) {
                db.query(
                    `SELECT ref_code, vip_user FROM users WHERE upline_id = ?`,
                    [
                        listData['cap5'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap6'].push(ele);
                            });
                            cap6 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap6) {
            for (let i = 0; i < listData['cap6'].length; i++) {
                db.query(
                    `SELECT ref_code, vip_user FROM users WHERE upline_id = ?`,
                    [
                        listData['cap6'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap7'].push(ele);
                            });
                            cap7 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap7) {
            for (let i = 0; i < listData['cap7'].length; i++) {
                db.query(
                    `SELECT ref_code, vip_user FROM users WHERE upline_id = ?`,
                    [
                        listData['cap8'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap8'].push(ele);
                            });
                            cap8 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        let TSNGD = 0, TSDL = 0;
        for (let l in listData) {
            let d = listData[l];
            if (d.length > 0) {
                TSNGD += d.length;
                for (let i = 0; i < d.length; i++) {
                    if (d[i].vip_user == 1) TSDL++;
                }
            }
        }

        obj.tsngd = TSNGD;
        obj.tsdl = TSDL;


        //==================================

        // await new Promise((resolve, reject)=>{
        //     // lấy danh sách thành viên đã đăng ký link giới thiệu ( tổng số nhà giao dịch )

        //     db.query(
        //         `select COUNT(upline_id) AS tsngd FROM users WHERE upline_id = ?`,
        //         [
        //             refForMe
        //         ],(error, results, fields) => {
        //             if(error){
        //                 resolve([]);
        //             }

        //             if(results[0]){
        //                 obj.tsngd = results[0].tsngd
        //                 //obj.hhgd = results[0].hhgd + com_for_me
        //             }
        //             resolve();
        //     })
        //     // kết thúc



        // })
        // await new Promise((resolve, reject)=>{
        //     // tổng số đại lý ( đã mua vip )
        //     db.query(
        //         `SELECT COUNT(vip_user) AS tsdl FROM users WHERE upline_id = ? AND vip_user = 1`,
        //         [
        //             refForMe
        //         ],(error, results, fields) => {
        //             if(error){
        //                 resolve([]);
        //             }

        //             if(results[0]){
        //                 obj.tsdl = results[0].tsdl
        //             }
        //             resolve();
        //     })
        //     // kết thúc


        // })

        //await new Promise((resolve, reject)=>{
        //    // tổng số đại lý ( đã mua vip )
        //    db.query(
        //        `select commission_vip AS hhdl FROM users WHERE ref_code = ?`,
        //        [
        //            refForMe
        //        ],(error, results, fields) => {
        //            if(error){
        //                resolve([]);
        //            }
        //
        //           if(results[0]){
        //               obj.hhdl = results[0].hhdl
        //           }
        //           resolve();
        //   })
        // kết thúc


        //})

        // của bản thân mình
        //==============================
        //==============================
        //==============================
        let listAgent = await new Promise((resolve, reject) => {
            // tổng số đại lý ( đã mua vip ) của bản thân
            // AND vip_user = ?
            db.query(
                `SELECT email FROM users WHERE upline_id = ? AND vip_user = ?`,
                [
                    refForMe,
                    1
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    if (results[0]) {
                        obj.tsdlisMe = results.length
                    }
                    resolve(results);
                })

        })


        await new Promise((resolve, reject) => {
            // tổng số hoa hồng đại lý của bản thân tuần này
            let min = 0;
            let max = listAgent.length;
            if (max == 0) resolve();
            let totalDLVip = obj.tsdlisMe
            listAgent.forEach(function (item) {
                //SELECT SUM(personal_trading_volume) AS hhttisMe FROM commission_history WHERE upline_id = ? AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW())
                db.query(
                    `SELECT SUM(amount_bet) AS hhttisMe FROM bet_history WHERE email = ? AND type_account = ? AND marketing = ? AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW())`,
                    [
                        item.email, // mã của f1 đại lý
                        1,
                        0
                        //refForMe,
                    ], (error, results, fields) => {
                        if (error) {
                            resolve([]);
                        }
                        if (!!results[0].hhttisMe) {
                            min++;
                            let hhTuanNay = obj.hhttisMe += results[0].hhttisMe;
                            // UPDATE vip level nếu đủ tổng hoa hồng
                            if (lvVip <= 8) {
                                if (totalDLVip == 3 && hhTuanNay >= 2000) {
                                    db.query(`UPDATE users SET level_vip = 2 WHERE ref_code = ?`, [refForMe])
                                } else if (totalDLVip == 4 && hhTuanNay >= 4000) {
                                    db.query(`UPDATE users SET level_vip = 3 WHERE ref_code = ?`, [refForMe])
                                } else if (totalDLVip == 5 && hhTuanNay >= 8000) {
                                    db.query(`UPDATE users SET level_vip = 4 WHERE ref_code = ?`, [refForMe])
                                } else if (totalDLVip == 6 && hhTuanNay >= 16000) {
                                    db.query(`UPDATE users SET level_vip = 5 WHERE ref_code = ?`, [refForMe])
                                } else if (totalDLVip == 7 && hhTuanNay >= 32000) {
                                    db.query(`UPDATE users SET level_vip = 6 WHERE ref_code = ?`, [refForMe])
                                } else if (totalDLVip == 8 && hhTuanNay >= 64000) {
                                    db.query(`UPDATE users SET level_vip = 7 WHERE ref_code = ?`, [refForMe])
                                } else if (totalDLVip == 9 && hhTuanNay >= 128000) {
                                    db.query(`UPDATE users SET level_vip = 8 WHERE ref_code = ?`, [refForMe])
                                }
                            }
                            if (min == max) resolve();
                        } else {
                            resolve();
                        }
                    })
            });


        })
        // kết thúc
        //==============================
        //==============================
        //==============================
        // lấy tổng số lượng giao dịch cấp dưới 4 tháng
        let currentDate = new Date()
        //let thangnay =  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        let cach1thang = new Date(currentDate.getFullYear(), currentDate.getMonth())
        let cach2thang = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        let cach3thang = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2)
        let cach4thang = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3)



        obj.t1 = cach1thang
        obj.t2 = cach2thang
        obj.t3 = cach3thang
        obj.t4 = cach4thang

        await new Promise((resolve, reject) => {
            // Tổng số nhà giao dịch mới tháng này
            db.query(
                `select
                SUM(personal_trading_volume) AS tslgdCD,
                COUNT(personal_trading_volume) AS tslgdMoi,
                COUNT(pending_commission) AS tshhMoi
                FROM commission_history WHERE upline_id = ? AND MONTH(created_at) = MONTH(NOW())`,
                [
                    refForMe
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    obj['tslgdmtn'] = results[0].tslgdMoi || 0;
                    // obj['tshhmtn'] = results[0].tshhMoi || 0;
                    resolve();
                })


        })
        await new Promise((resolve, reject) => {
            // Tổng số nhà giao dịch mới tháng trước
            db.query(
                `select
                SUM(personal_trading_volume) AS tslgdCD,
                COUNT(personal_trading_volume) AS tslgdMoi,
                COUNT(pending_commission) AS tshhMoi
                FROM commission_history WHERE upline_id = ? AND MONTH(created_at) = MONTH(NOW()) - 1`,
                [
                    refForMe
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    obj['tslgdmtt'] = results[0].tslgdMoi || 0;
                    obj['tshhmtt'] = results[0].tshhMoi || 0;
                    resolve();
                })

        })
        // let uIdAccount = await new Promise((resolve, reject)=>{
        //     // get account name
        //     db.query(
        //         `SELECT u_id FROM account WHERE email = ? AND type = 1`,
        //         [
        //             email
        //         ],
        //         (error, results, fields) => {
        //             if(error){
        //                 return callback(error);
        //             }
        //             resolve(results[0].u_id);
        //         })
        // })

        // await new Promise((resolve, reject)=>{
        //     // tổng số lượng giao dịch cấp dưới tháng này
        //     //SELECT SUM(personal_trading_volume) AS tslgdCD FROM commission_history WHERE from_upid = ? AND ref_id = ? AND MONTH(created_at) = MONTH(NOW())
        //     db.query(
        //         `SELECT SUM(personal_trading_volume) AS tslgdCD FROM commission_history WHERE upline_id = ? AND type = ? AND MONTH(created_at) = MONTH(NOW())`,
        //         [
        //             //uIdAccount,
        //             refForMe,
        //             'klgd'
        //         ],(error, results, fields) => {
        //             if(error){
        //                 resolve([]);
        //             }
        //             obj.tslgdCD1 = results[0].tslgdCD || 0;
        //             resolve();
        //     })

        // })
        await new Promise((resolve, reject) => {
            // tổng số lượng giao dịch cấp dưới cách 1 tháng

            db.query(
                `SELECT SUM(personal_trading_volume) AS tslgdCD FROM commission_history WHERE upline_id = ? AND type = ? AND MONTH(created_at) = MONTH(NOW()) - 1`,
                [
                    //uIdAccount,
                    refForMe,
                    'klgd'
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    obj.tslgdCD2 = results[0].tslgdCD || 0;
                    resolve();
                })

        })
        await new Promise((resolve, reject) => {

            // tổng số lượng giao dịch cấp dưới cách 2 tháng

            db.query(
                `SELECT SUM(personal_trading_volume) AS tslgdCD FROM commission_history WHERE upline_id = ? AND type = ? AND MONTH(created_at) = MONTH(NOW()) - 2`,
                [
                    //uIdAccount,
                    refForMe,
                    'klgd'
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    obj.tslgdCD3 = results[0].tslgdCD || 0;
                    resolve();
                })


        })
        await new Promise((resolve, reject) => {
            // cách 3 tháng
            db.query(
                `select SUM(personal_trading_volume) AS tslgdCD FROM commission_history WHERE upline_id = ? AND type = ? AND MONTH(created_at) = MONTH(NOW()) - 3`,
                [
                    //uIdAccount,
                    refForMe,
                    'klgd'
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    obj.tslgdCD4 = results[0].tslgdCD || 0;
                    resolve();
                })

        })

        await new Promise((resolve, reject) => {
            // lấy tổng số đại lý mới f1 của mình tháng này
            db.query(
                `select
                COUNT(nick_name) AS totalNewDL
                from users where upline_id = ? AND vip_user = 1 AND marketing = ? AND MONTH(created_at) = MONTH(NOW())`,
                [
                    refForMe,
                    0
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    obj['tsdlmtn'] = results[0].totalNewDL || 0;
                    resolve();
                })

        })
        await new Promise((resolve, reject) => {
            // lấy tổng số đại lý mới f1 của mình tháng trước
            db.query(
                `select
                COUNT(nick_name) AS totalNewDL
                from users where upline_id = ? AND vip_user = 1 AND marketing = ? AND MONTH(created_at) = MONTH(NOW()) - 1`,
                [
                    refForMe,
                    0
                ], (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    }
                    obj['tsdlmtt'] = results[0].totalNewDL || 0;
                    resolve();
                })

        })
        //================================================
        // Tháng này
        await new Promise((resolve, reject) => {
            // tổng số nhà giao dịch mới
            //`select COUNT(personal_trading_volume) AS tsngdMoi FROM commission_history WHERE upline_id = ? AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) - ?`,
            for (let a = 0; a < 4; a++) {
                db.query(
                    `select COUNT(id) AS tsngdMoi
                    FROM users WHERE upline_id = ? AND marketing = ? AND pricePlay > 0 AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) - ?`,
                    [
                        refForMe,
                        0,
                        a
                    ], (error, results, fields) => {
                        if (error) {
                            resolve([]);
                        }
                        obj['tsngdMoi' + a] = results[0].tsngdMoi || 0;
                        if (a === 3) resolve();
                    })

            }
        })
        await new Promise((resolve, reject) => {
            // tổng số đại lý mới hôm nay
            for (let b = 0; b < 4; b++) {
                db.query(
                    `select
                    COUNT(vip_user) AS tsdlMoi
                    FROM users WHERE upline_id = ? AND vip_user = 1 AND marketing = ? AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) - ?`,
                    [
                        refForMe,
                        0,
                        b
                    ], (error, results, fields) => {
                        if (error) {
                            resolve([]);
                        }
                        obj['tsdlMoi' + b] = results[0].tsdlMoi || 0;
                        if (b === 3) resolve();
                    })

            }
        })
        await new Promise((resolve, reject) => {
            // tổng số hoa hồng mới hôm nay
            for (let c = 0; c < 4; c++) {
                db.query(
                    `select
                    COUNT(pending_commission) AS tshhMoi
                    FROM commission_history WHERE upline_id = ? AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) - ?`,
                    [
                        refForMe,
                        c
                    ], (error, results, fields) => {
                        if (error) {
                            resolve([]);
                        }
                        obj['tshhMoi' + c] = results[0].tshhMoi || 0;
                        if (c === 3) resolve();

                    })

            }
        })
        //================================================
        // Tháng trước
        await new Promise((resolve, reject) => {
            // tổng số nhà giao dịch mới tháng trước
            //select
            //COUNT(personal_trading_volume) AS tsngdMoi
            //FROM commission_history WHERE upline_id = ?
            for (let d = 0; d < 4; d++) {
                db.query(
                    `select COUNT(id) AS tsngdMoi
                    FROM users WHERE upline_id = ? AND marketing = ? AND pricePlay > 0 AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) - ? AND MONTH(created_at) = MONTH(NOW()) - 1`,
                    [
                        refForMe,
                        0,
                        d
                    ], (error, results, fields) => {
                        if (error) {
                            resolve([]);
                        }
                        obj['tsngdTTMoi' + d] = results[0].tsngdMoi || 0;
                        if (d === 3) resolve();
                    })

            }
        })
        await new Promise((resolve, reject) => {
            // tổng số đại lý mới tháng trước
            for (let f = 0; f < 4; f++) {
                db.query(
                    `select
                    COUNT(vip_user) AS tsdlMoi
                    FROM users WHERE upline_id = ? AND vip_user = 1 AND marketing = ? AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) - ? AND MONTH(created_at) = MONTH(NOW()) - 1`,
                    [
                        refForMe,
                        0,
                        f
                    ], (error, results, fields) => {
                        if (error) {
                            resolve([]);
                        }
                        obj['tsdlTTMoi' + f] = results[0].tsdlMoi || 0;
                        if (f === 3) resolve();
                    })

            }
        })
        await new Promise((resolve, reject) => {
            // tổng số hoa hồng mới tháng trước
            for (let g = 0; g < 4; g++) {
                db.query(
                    `select
                    COUNT(pending_commission) AS tshhMoi
                    FROM commission_history WHERE upline_id = ? AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) - ? AND MONTH(created_at) = MONTH(NOW()) - 1`,
                    [
                        refForMe,
                        g
                    ], (error, results, fields) => {
                        if (error) {
                            resolve([]);
                        }
                        obj['tshhTTMoi' + g] = results[0].tshhMoi || 0;
                        if (g === 3) resolve();
                    })

            }

        })

        return callback(null, obj);
    },


    getBoStatistics: async (email, callback) => {
        // lấy tài khoản thực của email

        var obj = {
            //bet_amount: order_amount,
            down: 0, // số lần sell
            down_rate: 0, // tỉ lệ sell

            lose: 0,
            profits: 0, // lợi nhuận rồng
            refund: 0, // hoàn tiền
            revenue: 0, // tổng doanh thu

            trades: 0, // tổng tiền giao dịch


            up: 0, // số lần buy
            up_rate: 0, // tỉ lệ buy

            win: 0,
            win_rate: 0
        }, uid = 0;
        await new Promise((resolve, reject) => {
            db.query(
                `select * from account where email = ? and type = 1`,
                [
                    email
                ],
                (error, results, fields) => {
                    if (results.length == 0) {
                        //return callback(null);
                        resolve()
                    }
                    let rs = results[0];
                    uid = rs.u_id;

                    let win = rs.win;
                    let lose = rs.lose;
                    //let withdrawal = results[0].withdrawal
                    //let deposit = results[0].deposit
                    let order_amount = rs.order_amount;

                    let total = win + lose;

                    let rateWin = (win / total) * 100;

                    obj.profits = win - lose; // lợi nhuận rồng
                    obj.revenue = win; // tổng doanh thu

                    obj.trades = order_amount; // tổng tiền giao dịch
                    obj.win_rate = rateWin
                    resolve();
                })
        })
        if (uid == 0) {
            return callback(null);
        }
        await new Promise((resolve, reject) => {
            // lấy tổng lần đánh thắng, thua
            db.query(
                `SELECT
                COUNT(amount_win) AS totalWin
                FROM bet_history WHERE id_account = ? AND type_account = 1 AND amount_win > 0`,
                [
                    uid
                ], (error, result, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.win = result[0].totalWin
                    resolve();
                })
        })
        await new Promise((resolve, reject) => {
            db.query(
                `SELECT
                COUNT(amount_lose) AS totalLose
                FROM bet_history WHERE id_account = ? AND type_account = 1 AND amount_lose > 0`,
                [
                    uid
                ], (error, result, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.lose = result[0].totalLose
                    resolve();
                })

        })
        await new Promise((resolve, reject) => {
            db.query(
                `SELECT
                COUNT(buy_sell) AS totalBUY
                FROM bet_history WHERE id_account = ? AND buy_sell = ? AND type_account = 1`,
                [
                    uid,
                    'buy'
                ], (error, result, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    obj.up = result[0].totalBUY
                    resolve();
                })
        })
        await new Promise((resolve, reject) => {
            db.query(
                `SELECT
                COUNT(buy_sell) AS totalSell
                FROM bet_history WHERE id_account = ?  AND buy_sell = ? AND type_account = 1`,
                [
                    uid,
                    'sell'
                ], (error, result, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.down = result[0].totalSell

                    let tt = obj.up + obj.down

                    let rateUp = (obj.up / tt) * 100

                    obj.up_rate = rateUp
                    resolve();
                })
        })

        return callback(null, obj);
    },

    getBoStatisticsCurrentDay: async (email, callback) => {
        const obj = {
            win: 0,
            lose: 0,
        };
        await new Promise((resolve, reject) => {
            // lấy tổng lần đánh thắng, thua
            db.query(
                `SELECT
                SUM(amount_bet) AS totalWin
                FROM bet_history WHERE email = ? AND type_account = 1 AND amount_win > 0 AND CAST(created_at AS DATE) = CAST(CURRENT_DATE() AS DATE)`,
                [email], (error, result, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.win = result[0].totalWin || 0;
                    resolve();
                })
        })
        await new Promise((resolve, reject) => {
            db.query(
                `SELECT
                SUM(amount_lose) AS totalLose
                FROM bet_history WHERE email = ? AND type_account = 1 AND amount_lose > 0 AND CAST(created_at AS DATE) = CAST(CURRENT_DATE() AS DATE)`,
                [email], (error, result, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.lose = result[0].totalLose || 0;
                    resolve();
                })

        })

        return callback(null, obj);
    },

    getListHisOrder: (username, callback) => {
        // lấy tài khoản thực của username
        db.query(
            `select u_id from account where email = ? and type = 1`,
            [
                username
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                if (!results) {
                    return callback(null, results[0])
                }
                let rs = results[0]
                var uid = rs.u_id

                // lấy danh sách order tài khoản thực
                db.query(
                    `select
                        amount_bet as ab,
                        amount_lose as al,
                        amount_win as aw,
                        buy_sell as bs,
                        close as c,
                        close > open as r,
                        created_at as d,
                        session as oss,
                        currency as cu from bet_history where id_account = ? and type_account = 1 AND DATE(created_at) >= DATE(NOW()) ORDER BY id DESC LIMIT 20`,
                    [
                        uid
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }

                        return callback(null, results)

                    })

            })

    },

    getListHisOrderDate: (username, query, callback) => {
        // lấy tài khoản thực của email
        db.query(
            `select u_id from account where email = ? and type = 1`,
            [
                username
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                if (!results) {
                    return callback(null, results[0])
                }
                let rs = results[0]
                let uid = rs.u_id

                // lấy danh sách order tài khoản thực
                db.query(
                    `SELECT
                        amount_bet as ab,
                        amount_lose as al,
                        amount_win as aw,
                        buy_sell as bs,
                        close as c,
                        close > open as r,
                        created_at as d,
                        session as oss,
                        currency as cu FROM bet_history WHERE (id_account = ? and type_account = 1) AND (created_at >= ? AND created_at < ?) ORDER BY id DESC LIMIT 200`,
                    [
                        uid,
                        query.s,
                        query.e + ' 23:59:59'
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }

                        return callback(null, results)
                    })

            })

    },


    getListHisTradeWallet: (nick, callback) => {

        db.query(
            `SELECT * FROM trade_history WHERE from_u = ? OR to_u = ? ORDER BY id DESC LIMIT 10`,
            [
                nick,
                nick
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                // tổng reco
                db.query(
                    `SELECT COUNT(from_u) AS totalCount FROM trade_history WHERE from_u = ? OR to_u = ?`,
                    [
                        nick,
                        nick
                    ],
                    (error, result, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        results['count'] = result[0].totalCount
                        return callback(null, results)
                    })
            })

    },

    getListHisTradeWalletPage: (data, callback) => {
        // lấy tài khoản thực của email
        let count_per_page = 10;
        let page_number = Number(data.page)
        if (page_number == 1) page_number = 0
        let next_offset = (page_number - 1) * count_per_page

        db.query(
            `SELECT * FROM trade_history WHERE from_u = ? AND type_key != ? ORDER BY id DESC LIMIT ? OFFSET ? `,
            [
                data.email,
                'hh',
                count_per_page,
                next_offset > 0 ? next_offset : 0
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            })
    },


    getListHisTradeWalletHH: (email, callback) => {
        db.query(
            `SELECT ref_code FROM users WHERE email = ?`,
            [
                email,
            ], (error, res, fields) => {
                let ref_id = res[0].ref_code;
                // lấy tài khoản thực của email
                db.query(
                    `SELECT * FROM commission_history WHERE (upline_id = ? AND type = ?) OR (ref_id = ? AND type = ?) ORDER BY id DESC LIMIT 10`,
                    [
                        ref_id,
                        'hhv',
                        ref_id,
                        'klgd',
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        results['count'] = results.length;
                        return callback(null, results)
                    })
            })
    },


    getListHisTradeWalletHHPage: (data, callback) => {
        // lấy tài khoản thực của email
        let count_per_page = 10;
        let page_number = Number(data.page)
        if (page_number == 1) page_number = 0
        let next_offset = page_number * count_per_page
        db.query(
            `SELECT ref_code FROM users WHERE email = ?`,
            [
                data.email,
            ], (error, res, fields) => {
                let ref_id = res[0].ref_code;
                db.query(
                    `SELECT * FROM commission_history WHERE (upline_id = ? AND type = ?) OR (ref_id = ? AND type = ?) ORDER BY id DESC LIMIT ? OFFSET ?`,
                    [
                        ref_id,
                        'hhv',
                        ref_id,
                        'klgd',
                        count_per_page,
                        next_offset
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        return callback(null, results)
                    })
            })

    },


    getListHisTradeWalletWGD: (nick, callback) => {
        // lấy tài khoản thực của email
        db.query(
            `SELECT * FROM trade_history WHERE (from_u = ? OR to_u = ?) AND (type_key = ? OR type_key = ?) ORDER BY id DESC LIMIT 10`,
            [
                nick,
                nick,
                'ctas',
                'ctsa'
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }

                // tổng reco
                db.query(
                    `SELECT COUNT(from_u) AS totalCount FROM trade_history WHERE (from_u = ? OR to_u = ?) AND (type_key = ? OR type_key = ?)`,
                    [
                        nick,
                        nick,
                        'ctas',
                        'ctsa'
                    ],
                    (error, result, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        results['count'] = result[0].totalCount
                        return callback(null, results)
                    })
            })

    },

    getListHisTradeWalletWGDPage: (data, callback) => {
        // lấy tài khoản thực của email
        let count_per_page = 10;
        let page_number = Number(data.page)
        if (page_number == 1) page_number = 0
        let next_offset = page_number * count_per_page

        db.query(
            `SELECT * FROM trade_history WHERE from_u = ? AND type_key = ? OR type_key = ? ORDER BY id DESC LIMIT ? OFFSET ? `,
            [
                data.nick,
                'ctas',
                'ctsa',
                count_per_page,
                next_offset
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            })
    },


    getComDetails: (email, callback) => {
        // lấy
        db.query(
            `select ref_code from users where email = ?`,
            [
                email
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                if (!results) {
                    return callback(null, results[0])
                }
                let rs = results[0]
                let uid = rs.ref_code

                db.query(
                    `SELECT
                        SUM(pending_commission) AS thanhtoan,
                        COUNT(pending_commission) AS soluongGD,
                        COUNT(upline_id) AS sonhaGD,
                        created_at AS dt
                        FROM commission_history WHERE upline_id = ? GROUP BY DAY(created_at) ORDER BY id DESC LIMIT 10`,
                    [
                        uid
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }

                        // tổng reco
                        db.query(
                            `SELECT
                                COUNT(pending_commission) AS totalCount
                                FROM commission_history WHERE upline_id = ? GROUP BY DAY(created_at) ORDER BY id DESC`,
                            [
                                uid
                            ],
                            (error, result, fields) => {
                                if (error) {
                                    return callback(error);
                                }
                                if (result.length != 0) {
                                    results['count'] = result[0].totalCount
                                } else {
                                    results['count'] = 0
                                }

                                return callback(null, results)
                            })
                    })

            })



    },

    getComDetailsPage: (data, callback) => {
        // lấy tài khoản thực của email
        let count_per_page = 10;
        let page_number = Number(data.page)
        if (page_number == 1) page_number = 0
        let next_offset = page_number * count_per_page

        // lấy tài khoản thực của email
        db.query(
            `select ref_code from users where email = ?`,
            [
                data.email
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                if (!results) {
                    return callback(null, results[0])
                }
                let rs = results[0]
                let uid = rs.ref_code

                db.query(
                    `SELECT
                        SUM(pending_commission) AS thanhtoan,
                        COUNT(pending_commission) AS soluongGD,
                        COUNT(upline_id) AS sonhaGD,
                        created_at AS dt
                        FROM commission_history WHERE upline_id = ? GROUP BY DAY(created_at) ORDER BY id DESC LIMIT ? OFFSET ? `,
                    [
                        uid,
                        count_per_page,
                        next_offset
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        return callback(null, results)

                    })

            })
    },

    getComDetailsDate: async (data, callback) => {
        let Rs = [];

        await new Promise((res, rej) => {
            // lấy
            db.query(
                `select ref_code from users where email = ?`,
                [
                    data.email
                ],
                (error, results, fields) => {
                    if (error) {
                        //return callback(error);
                        res(Rs);
                    }
                    if (!results) {
                        //return callback(null, results[0])
                        res(Rs);
                    }
                    let rs = results[0];
                    let uid = rs.ref_code;

                    let daysBetween = (Date.parse(data.e) - Date.parse(data.s)) / (24 * 3600 * 1000)

                    if (daysBetween < 0) {
                        //return callback(null, Rs)
                        res(Rs);
                    }

                    daysBetween++; // cộng thêm 1 ngày

                    let min = 0;

                    if (data.t == 1) {
                        // khối lượng hoa hồng giao dịch
                        for (let i = 0; i < daysBetween; i++) {
                            db.query(
                                `SELECT
                                    SUM(pending_commission) AS thanhtoan,
                                    SUM(personal_trading_volume) AS klgd,
                                    COUNT(pending_commission) AS soluongGD,
                                    DATE_FORMAT(created_at, '%Y-%m-%d') AS dt
                                    FROM commission_history WHERE type = ? AND ref_id = ? AND DAY(created_at) = DAY(?) - ? GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`,
                                [
                                    'klgd', // hoa hồng giao dịch
                                    uid,
                                    data.e,
                                    i
                                ],
                                (error, results, fields) => {
                                    if (error) {
                                        //return callback(error);
                                        res(Rs);
                                    }
                                    min++;
                                    if (Array.isArray(results) && results.length > 0) Rs.push(results[0]);
                                    if (min == daysBetween) res();
                                })
                        }
                    } else {
                        // khối lượng hoa hồng vip giao dịch
                        for (let i = 0; i < daysBetween; i++) {
                            db.query(
                                `SELECT
                                    SUM(vip_commission) AS doanhso,
                                    created_at AS dt
                                    FROM commission_history WHERE type = ? AND ref_id = ? AND DAY(created_at) = DAY(?) - ? GROUP BY DAY(created_at)`,
                                [
                                    'hhv',
                                    uid,
                                    data.e,
                                    i
                                ],
                                (error, results, fields) => {
                                    if (error) {
                                        res(error);
                                    }
                                    min++;
                                    if (results.length > 0) Rs.push(results[0])
                                    if (min == daysBetween) res();
                                })
                        }
                    }

                })
        })
        return callback(null, Rs);
    },

    getAgencySearchLevel: async (data, callback) => {

        let dt = moment().tz("Asia/Ho_Chi_Minh");
        let dt1 = moment().tz("Asia/Ho_Chi_Minh");
        let dt2 = moment().tz("Asia/Ho_Chi_Minh");

        let cach30ngay = dt.subtract(30, 'days').format("YYYY-MM-DD");
        let cach7ngay = dt1.subtract(7, 'days').format("YYYY-MM-DD");
        let cach1ngay = dt2.subtract(1, 'days').format("YYYY-MM-DD");


        //let currentDate = new Date()
        //let cach30ngay =  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay() - 30)
        //let cach7ngay =  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay() - 7)
        //let cach1ngay =  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay() - 1)

        //let c30n =  cach30ngay.getFullYear() + '-' + cach30ngay.getMonth() + '-' + cach30ngay.getDay()
        //let c7n =  cach7ngay.getFullYear() + '-' + cach7ngay.getMonth() + '-' + cach7ngay.getDay()
        //let c1n =  cach1ngay.getFullYear() + '-' + cach1ngay.getMonth() + '-' + cach1ngay.getDay()

        let c30n = cach30ngay;
        let c7n = cach7ngay;
        let c1n = cach1ngay;

        let n = data.kc, ac = 0;

        if (n == 30) {
            ac = c30n;
        } else if (n == 7) {
            ac = c7n;
        } else if (n == 1) {
            ac = c1n;
        } else {
            ac = 0;
        }

        let refID, UpID, listCap = [];
        let Level = data.id;
        // lấy danh sách 7 cấp dưới của mình
        let listData = {
            "cap1": [],
            "cap2": [],
            "cap3": [],
            "cap4": [],
            "cap5": [],
            "cap6": [],
            "cap7": [],
            "cap8": [],
            "cap9": [],
            "cap10": [],
            "cap11": [],
            "cap12": [],
            "cap13": [],
            "cap14": [],
            "cap15": []
        };

        await new Promise((res, rej) => {
            db.query(
                `SELECT upline_id, ref_code FROM users WHERE email = ?`,
                [
                    data.email
                ],
                (error, results, fields) => {
                    if (error) {
                        res([]);
                    }
                    if (!results) {
                        res([]);
                    }
                    let rs = results[0];
                    refID = rs.ref_code; // ref_code của mình
                    UpID = rs.upline_id;
                    res();
                }
            )


        });

        // let dataList = await new Promise((res, rej) => {
        // 	//SELECT  upline_id, ref_code
        // 	//FROM (SELECT * FROM users
        //     //            ORDER BY upline_id) users_sorted,
        //     //            (SELECT @pv := 'RYIFCWS') initialisation
        //     //    WHERE find_in_set(upline_id, @pv)
        //     //    AND length(@pv := concat(@pv, ',', ref_code));

        //     db.query(`with recursive cte (level_vip, tklgd, ref_code, upline_id, nick_name) as (
        // 			  select     level_vip,
        // 						 pricePlay,
        // 						 ref_code,
        // 						 upline_id,
        // 						 nick_name
        // 			  from       users
        // 			  where      upline_id = ?
        // 			  union all
        // 			  select     p.level_vip,
        // 						 p.pricePlay,
        // 						 p.ref_code,
        // 						 p.upline_id,
        // 						 p.nick_name
        // 			  from       users p
        // 			  inner join cte
        // 					  on p.upline_id = cte.ref_code
        // 			)
        // 			select * from cte;`,
        //         [
        // 			refID
        // 		], (error, result, fields) => {
        // 			//console.log(result);
        //             //let count = result.length;
        //             //if(count > 0){
        //                 res(result)
        //             //}
        //         }
        //     )

        // });

        let cap1 = false, cap2 = false, cap3 = false, cap4 = false, cap5 = false, cap6 = false, cap7 = false;
        // lấy cấp 1
        await new Promise((res, rej) => {
            db.query(
                `SELECT level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name FROM users WHERE upline_id = ?`,
                [
                    refID
                ], (error, result, fields) => {
                    if (result.length > 0) {
                        result.forEach((ele) => {
                            listData['cap1'].push(ele);
                        })
                        cap1 = true;
                    }
                    res();
                }
            )
        })


        if (cap1) {
            for (let i = 0; i < listData['cap1'].length; i++) {
                db.query(
                    `SELECT level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name FROM users WHERE upline_id = ?`,
                    [
                        listData['cap1'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap2'].push(ele);
                            });
                            cap2 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap2) {
            for (let i = 0; i < listData['cap2'].length; i++) {
                db.query(
                    `SELECT level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name FROM users WHERE upline_id = ?`,
                    [
                        listData['cap2'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap3'].push(ele);
                            });
                            cap3 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap3) {
            for (let i = 0; i < listData['cap3'].length; i++) {
                db.query(
                    `SELECT level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name FROM users WHERE upline_id = ?`,
                    [
                        listData['cap3'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap4'].push(ele);
                            });
                            cap4 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap4) {
            for (let i = 0; i < listData['cap4'].length; i++) {
                db.query(
                    `SELECT level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name FROM users WHERE upline_id = ?`,
                    [
                        listData['cap4'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap5'].push(ele);
                            });
                            cap5 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap5) {
            for (let i = 0; i < listData['cap5'].length; i++) {
                db.query(
                    `SELECT level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name FROM users WHERE upline_id = ?`,
                    [
                        listData['cap5'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap6'].push(ele);
                            });
                            cap6 = true;
                        }
                    }
                )
                await sleep(50);
            }
        }

        if (cap6) {
            for (let i = 0; i < listData['cap6'].length; i++) {
                db.query(
                    `SELECT level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name FROM users WHERE upline_id = ?`,
                    [
                        listData['cap6'][i].ref_code
                    ], (error, result, fields) => {
                        if (result.length > 0) {
                            result.forEach((ele) => {
                                listData['cap7'].push(ele);
                            });
                            cap7 = true;
                        } else {
                            cap7 = false;
                        }
                    }
                )
                await sleep(50);
            }
        }

        //if(cap7){
        //   for(let i = 0;  i < listData['cap7'].length; i++){
        //       db.query(
        //           `SELECT level_vip, pricePlay AS tklgd, ref_code, upline_id, nick_name FROM users WHERE upline_id = ?`,
        //           [
        //               listData['cap7'][i].ref_code
        //           ], (error, result, fields) => {
        //               if(result.length > 0){
        //                   result.forEach((ele) => {
        //                       listData['cap7'].push(ele);
        //                   });
        //                  //cap7 = true;
        //              }
        //          }
        //      )
        //      await sleep(50);
        //  }
        //}

        // if(dataList.length > 0){
        //     let u = 0, check = '';
        //     dataList.forEach((ele) => {
        // 		if(check != ele.upline_id){
        // 			u++;
        // 			check = ele.upline_id;
        // 		}
        // 		if(u <= 7){
        // 			listData[`cap${u}`].push(ele);
        // 		}

        //     })

        // }

        //await sleep(100);

        for (let i = 0; i < listData[`cap${Level}`].length; i++) {
            let qrr = `SELECT SUM(pending_commission) AS thhn FROM commission_history WHERE ref_id = ? AND upline_id = ? AND type = ? AND created_at > '${ac}'`;
            db.query(qrr,
                [
                    listData[`cap${Level}`][i].upline_id,
                    listData[`cap${Level}`][i].ref_code,
                    'klgd'
                ],
                (error2, resu, fields2) => {
                    if (resu[0].thhn !== null) {
                        listData[`cap${Level}`][i].thhn = resu[0].thhn;
                    } else {
                        listData[`cap${Level}`][i].thhn = 0;
                    }

                });
            await sleep(100);

        }


        return callback(null, listData[`cap${Level}`]);

    },


    getAgencySearchName: async (data, callback) => {

        if (data.name == '') return callback(null);

        let dt = moment().tz("Asia/Ho_Chi_Minh");
        let dt1 = moment().tz("Asia/Ho_Chi_Minh");
        let dt2 = moment().tz("Asia/Ho_Chi_Minh");

        let cach30ngay = dt.subtract(30, 'days').format("YYYY-MM-DD");
        let cach7ngay = dt1.subtract(7, 'days').format("YYYY-MM-DD");
        let cach1ngay = dt2.subtract(1, 'days').format("YYYY-MM-DD");

        let c30n = cach30ngay;
        let c7n = cach7ngay;
        let c1n = cach1ngay;

        let n = data.kc, ac = 0;

        if (n == 30) {
            ac = c30n;
        } else if (n == 7) {
            ac = c7n;
        } else if (n == 1) {
            ac = c1n;
        } else {
            ac = 0;
        }

        let listData = await new Promise((res, rej) => {
            db.query(
                `select ref_code from users where email = ?`,
                [
                    data.email
                ],
                (error, results, fields) => {
                    if (error) {
                        res([])
                    }
                    if (!results) {
                        res([])
                    }
                    let rs = results[0]
                    let uid = rs.ref_code; // ref_code của mình
                    let name = data.name

                    let qr = ''

                    // lấy thông tin đại lý
                    if (ac == 0) {
                        qr = `select level_vip, pricePlay AS tklgd, nick_name, ref_code from users where upline_id = ? AND nick_name LIKE CONCAT('%${name}%') ORDER BY id DESC`
                    } else {
                        qr = `select level_vip, pricePlay AS tklgd, nick_name, ref_code from users where upline_id = ? AND (nick_name LIKE CONCAT('%${name}%') AND created_at > '${ac}') ORDER BY id DESC`
                    }

                    db.query(qr,
                        [
                            uid
                        ],
                        (error, results, fields) => {
                            if (error) {
                                rej(error);
                            }
                            if (results.length == 0) {
                                return callback(null);
                            }
                            res(results)
                        })

                })
        });

        await new Promise((res, rej) => {
            let qrr = '';
            //if(ac == 0){
            //    qrr = `select SUM(personal_trading_volume) AS thhn from commission_history where ref_id = ? ORDER BY id DESC`
            //}else{
            qrr = `select SUM(personal_trading_volume) AS thhn from commission_history where ref_id = ? AND created_at > '${ac}') ORDER BY id DESC`
            //}

            let min = 0;
            let max = listData.length;

            if (max == 0) res([]);

            listData.forEach(function (result) {
                // lấy thông tin hoa hồng // personal_trading_volume AS thhn,
                db.query(qrr,
                    [
                        result.ref_code
                    ],
                    (error, resu, fields) => {
                        if (void 0 !== resu) listData[min].thhn = resu[0].thhn;
                        min++;
                        if (min == max) res(listData);
                    })
            });
        });

        return callback(null, listData)
    },

    updateSecret2FA: (data, callback) => {
        db.query(
            `UPDATE users SET active_2fa = 1, secret_2fa = ?, code_secure = ? WHERE email = ?`,
            [
                data.s,
                null,
                data.e
            ], (error, results, fields) => {
                if (error) {
                    return error;
                }
                return callback(null, results)
            }
        )
    },

    Disabled2FA: (email, callback) => {
        db.query(
            `UPDATE users SET active_2fa = 0, secret_2fa = null, code_secure = null WHERE email = ?`,
            [
                email
            ], (error, results, fields) => {
                if (error) {
                    return error;
                }
                return callback(null, results)
            }
        )
    },

    updateCodeSecure: (data, callback) => {
        db.query(
            `UPDATE users SET code_secure = ? WHERE email = ?`,
            [
                data.code,
                data.email
            ], (error, results, fields) => {
                if (error) {
                    return error;
                }
                return callback(null, results)
            }
        )
    },

    getSecrect2FA: (email, callback) => {
        db.query(
            `select secret_2fa from users where email = ?`,
            [
                email,
            ], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }

                return callback(null, results[0])
            }
        )
    },

    checkCodeSecure2FA: (data, callback) => {
        db.query(
            `select code_secure, password from users where email = ? AND code_secure = ?`,
            [
                data.email,
                data.code
            ], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }

                return callback(null, results[0])
            }
        )
    },

    getListAnalyticsDetail: async (idUser, callback) => {
        if (!idUser) {
            return callback(new Error('Not found!'));
        }

        const emailUserQuery = await new Promise((resolve, reject) => {
            db.query(
                `select username from users where id = ?`,
                [idUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results)
                }
            )
        });

        if (!emailUserQuery) {
            callback(new Error('Not found!'));
            return;
        }

        const emailUser = emailUserQuery[0].username;

        const lichSuNap = await new Promise((resolve, reject) => {
            db.query(
                `select * from trade_history where delete_status = 0 and (email = ?) and (type_key = "nt" or type_key = "nn") order by id desc LIMIT 100`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results)
                }
            )
        });

        const tongNap = await new Promise((resolve, reject) => {
            db.query(
                `select SUM(amount) as nap from trade_history where delete_status = 0 and (email = ?) and (type_key = "nt" or type_key = "nn")`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0].nap)
                }
            )
        });

        // const tienTrongViLive = await new Promise((resolve, reject) => {
        //     db.query(
        //         `select balance from account where email = ? and type = 1`,
        //         [emailUser], (error, results, fields) => {
        //             if (error) {
        //                 return reject(error);
        //             }
        //             return resolve(results[0] ? results[0].balance : 0)
        //         }
        //     )
        // });

        const lichSuRut = await new Promise((resolve, reject) => {
            db.query(
                `select * from trade_history where delete_status = 0 and (email = ?) and type_key = "rt" order by id desc LIMIT 100`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results)
                }
            )
        });

        const tongRut = await new Promise((resolve, reject) => {
            db.query(
                `select SUM(amount) as rut from trade_history where delete_status = 0 and (email = ?) and type_key = "rt" order by id`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0].rut)
                }
            )
        });

        const lichSuCuocTien = await new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM bet_history WHERE (status = 1) and (email = ?) ORDER BY id DESC LIMIT 1000`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results)
                }
            )
        });

        const tongThang = await new Promise((resolve, reject) => {
            db.query(
                `SELECT SUM(amount_win) as thang FROM bet_history WHERE (status = 1) and (email = ?) ORDER BY id DESC LIMIT 1000`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0].thang)
                }
            )
        });

        const tongThua = await new Promise((resolve, reject) => {
            db.query(
                `SELECT SUM(amount_lose) as thua FROM bet_history WHERE (status = 1) and (email = ?) ORDER BY id DESC LIMIT 1000`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0].thua)
                }
            )
        });

        const lichSuThemTien = await new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM add_money_history WHERE email = ? ORDER BY id desc LIMIT 100`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results)
                }
            )
        });

        const tongThem = await new Promise((resolve, reject) => {
            db.query(
                `SELECT SUM(price_VN) as them FROM add_money_history WHERE email = ? ORDER BY id desc LIMIT 100`,
                [emailUser], (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0].them)
                }
            )
        });

        return callback(null, {
            lichSuNap,
            lichSuRut,
            lichSuCuocTien,
            lichSuThemTien,
            tongNap,
            tongRut,
            tongThem,
            tongThang,
            tongThua
            // tienTrongViLive,
        });
    },

    getListAnalytics: async (data, user, callback) => {

        const obj = {
            nNDK: 0, // số người đăng ký
            nNDXM: 0,  // số người xác minh
            nDL: 0, // số đại lý ( thành viên VIP )
            tsTN: 0, // tổng số tiền nạp
            tsTR: 0, // tổng số tiền nạp
            tsNNT: 0, // tổng số người nạp tiền
            tsNNT7N: 0, // tổng số người nạp tiền 7 ngày qua
            tsFee: 0, // thuế phí
            tsTNFEE: 0, // tổng số thu nhập ( trừ ra thuế phí)
        }
        let dateQuery = '';
        if (data.from) {
            const validDate = moment(data.from, 'yyyy-MM-DD').isValid();
            if (validDate) {
                dateQuery = ` AND created_at >= '${data.from}'`
            }

        }

        const agencyQuery = user.x == 2 ? `AND email in (SELECT username FROM users WHERE upline_id = '${user.ref_code}')` : ""
        if (data.to) {
            const validDate = moment(data.to, 'yyyy-MM-DD').isValid();
            if (validDate) {
                dateQuery += ` AND created_at <= '${data.to}'`
            }
        }
        await new Promise((res, rej) => {
            //=====================
            if (user.x == 1) {
                db.query(
                    `SELECT COUNT(id) as nNDK FROM users WHERE  manage_supers = 0${dateQuery}`, (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        obj.nNDK = results[0].nNDK
                        res();
                    })
            }
            if (user.x == 2) {
                db.query(
                    `SELECT COUNT(id) as nNDK FROM users WHERE manage_supers = 0 AND upline_id = ?${dateQuery}`, [user.ref_code], (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        obj.nNDK = results[0].nNDK
                        res();
                    })
            }

        })

        await new Promise((res, rej) => {
            //===================
            db.query(
                `SELECT COUNT(id) as nNDXM FROM users WHERE verified = 1${dateQuery}`, (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.nNDXM = results[0].nNDXM;
                    res();
                })
        })

        await new Promise((res, rej) => {
            //===================
            db.query(
                `SELECT COUNT(id) as nDL FROM users WHERE manage_supers = 2${dateQuery}`, (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.nDL = results[0].nDL;
                    res();
                })
        })

        await new Promise((res, rej) => {
            db.query(
                `SELECT SUM(amount) AS tsTN FROM trade_history WHERE type_key = ? AND status = 1 ${agencyQuery}${dateQuery}`,
                [
                    'nt'
                ],
                (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.tsTN = results[0].tsTN;
                    res();
                })
        })

        await new Promise((res, rej) => {
            db.query(
                `SELECT SUM(amount) AS tsTR FROM trade_history WHERE type_key = ? AND status = 1 ${agencyQuery}${dateQuery}`,
                [
                    'rt'
                ],
                (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.tsTR = results[0].tsTR;
                    res();
                })
        })

        await new Promise((res, rej) => {
            //===================
            //===================
            db.query(
                `SELECT COUNT(from_u) as tsNNT FROM trade_history WHERE status = 1 AND type_key = ? ${agencyQuery} GROUP BY from_u${dateQuery}`,
                [
                    'nt'
                ]
                , (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    if (results.length != 0) {
                        obj.tsNNT = results[0].tsNNT;
                    }
                    res();
                })
        })

        await new Promise((res, rej) => {
            //===================
            db.query(
                `SELECT COUNT(from_u) as tsNNT7N FROM trade_history WHERE status = 1 AND type_key = ? AND WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) GROUP BY from_u`,
                [
                    'nt'
                ]
                , (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.tsNNT7N = results.length > 0 ? results[0].tsNNT7N : 0;
                    res();
                })
        })

        await new Promise((res, rej) => {
            //===================
            db.query(
                `SELECT SUM(amount_win) AS tsWin, SUM(amount_lose) AS tsLose, SUM(amount_bet) AS tsBet FROM bet_history WHERE marketing = ? AND status = 1 AND type_account = ? ${agencyQuery}${dateQuery}`,
                [
                    0,
                    1 // tài khoản thực
                ]
                , (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    obj.tsWin = results.length > 0 ? results[0].tsWin : 0;
                    obj.tsLose = results.length > 0 ? results[0].tsLose : 0;
                    obj.tsBet = results.length > 0 ? results[0].tsLose : 0;
                    res();
                })
        })

        await new Promise((res, rej) => {
            //===================
            db.query(
                `SELECT SUM(pending_commission) AS tsHHong FROM commission_history WHERE marketing = ? AND type = ? ${agencyQuery}${dateQuery}`,
                [
                    0,
                    'klgd',
                ]
                , (error, results, fields) => {
                    if (error) {
                        return callback(error);
                    }
                    obj.tsHHong = results.length > 0 ? results[0].tsHHong : 0;
                    res();
                })
        })

        return callback(null, obj);

    },

    changeAccType: async (data, callback) => {
        if (data.type === 1) {
            await new Promise((resolve, reject) => {
                db.query(`SELECT COUNT(ref_code) as isParent FROM users WHERE ref_code = (select upline_id from users WHERE id = ?)`, [data.id], (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res[0].isParent > 0) {
                        return callback(null, -1);
                    } else {
                        return resolve("");
                    }
                })
            });
        }

        db.query(
            `UPDATE users SET marketing = ?, updated_at=now() WHERE id = ?`,
            [
                data.type,
                data.id
            ], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                db.query(
                    `SELECT nick_name FROM users WHERE id = ?`,
                    [
                        data.id
                    ], (error, results, fields) => {
                        let nick = results[0].nick_name;
                    });
                return callback(null, results)
            }
        )
    },

    changPassAd: (data, callback) => {
        db.query(
            `UPDATE users SET password = ? WHERE email = ?`,
            [
                data.password,
                data.email
            ], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        )
    },

    getListCmsHis: async (data, callback) => {
        let email = data.e;

        let rs = [];
        await new Promise((resolve, reject) => {

            db.query(
                `SELECT * FROM commission_history WHERE email = ? AND type = ?`,
                [
                    email,
                    'klgd'
                ], (error, results, fields) => {
                    rs = results;
                    resolve();
                })

        })


        return callback(null, rs);
    },

    getListNotifi: async (data, callback) => {
        let email = data.e;

        let rs = [];
        await new Promise((resolve, reject) => {

            db.query(
                // `SELECT * FROM notifi WHERE cu_email = ? OR email = ? ORDER BY id DESC`,
                `SELECT * FROM notifi WHERE cu_email = ? ORDER BY id DESC`,
                [
                    email,
                    // email
                ], (error, results, fields) => {
                    rs = results;

                    resolve();
                })

        })


        return callback(null, rs);
    },

    updateListNotifi: async (data, callback) => {
        let email = data.e;

        await new Promise((resolve, reject) => {

            db.query(
                `UPDATE notifi SET views = ? WHERE cu_email = ?`,
                [
                    1,
                    email
                ], (error, results, fields) => {
                    resolve();
                })

        })

        return callback(null);
    },

    getRolesList: (role, callback) => {
        try {
            var roles = Helper.getConfig('role') || {};
            return callback(null, roles[role])
        }
        catch (err) {
            return callback(err)
        }

    },

    updateRolesList: (role, data, callback) => {
        try {
            var roles = Helper.getConfig('role') || {};
            roles[role] = data;
            Helper.setConfig('role', roles);
            return callback(null, true)
        }
        catch (err) {
            return callback(err)
        }
    },

    getCapDuoiInfo: async (ref_code, callback) => {
        let obj = {};
        const [nap, rut] = await new Promise((resolve, reject) => {
            db.query(
                `SELECT SUM(amount) as amount FROM trade_history
                    INNER JOIN users ON users.username = trade_history.email
                    WHERE (type_key = 'nt' OR type_key = 'rt') AND users.upline_id = ?
                    GROUP BY type_key`,
                [
                    ref_code,
                ], (error, results, fields) => {
                    if (error) {
                        console.log(error)
                    }
                    resolve(results);
                })
        })
        const bet = await new Promise((resolve, reject) => {
            db.query(
                `SELECT SUM(amount_bet) as amount, SUM(amount_win) as win, SUM(amount_lose) as lose FROM bet_history
                    INNER JOIN users ON users.username = bet_history.email
                    WHERE users.upline_id = ? `,
                [
                    ref_code,
                ], (error, results, fields) => {
                    if (error) {
                        console.log(error)
                    }
                    resolve(results[0]);
                })
        })
        obj = { nap, rut, bet }
        return callback(null, obj)
    },

    updateUpline: async (data, callback) => {
        db.query(
            `UPDATE users SET upline_id = ? WHERE username = ?`,
            [
                data.ref_code,
                data.username
            ],

            (error, results) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        );
    }

}
