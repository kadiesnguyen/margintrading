const {
    createAgency,
    updateAgency,
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById,
    checkAgencyUserNameUpdate,
    updateUserMoney,
    updateUserPasswordByEmail,
    getUserByUserEmail,
    getAdminByAdminUsername,
    verifiedAccount,
    getListAgency,
    viewMemberAgency,
    createAccount,
    checkCodeSecure,
    activeUser,
    checkActiveUser,
    getInfoUser,
    updateInfoVerify,
    listHisBO,
    WithDrawalVND,
    BalanceWallet,
    getMyBankInfo,
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
    updateSecret2FA,
    updateCodeSecure,
    checkCodeSecure2FA,
    Disabled2FA,
    getListAnalytics,
    getListAnalyticsDetail,
    changeAccType,
    changPassAd,
    getListCmsHis,
    getListNotifi,
    updateListNotifi,
    checkRefCode,
    getRolesList,
    updateRolesList,
    getCapDuoiInfo,
    checkUserPhone,
    checkUsername,
    checkExistedAgency,
    updateBankInfo,
    getUserBankInfo,
    updateUpline,
    getwithdrawallist,

} = require("./user.service")

const { genSaltSync, hashSync, compareSync } = require("bcrypt")
const { sign, verify } = require("jsonwebtoken")
const config = require("./../../config")
const mailer = require("./../../auth/mail")
const htmlActive = require("./../../htmlMail/active")
const htmlFoget = require("./../../htmlMail/fogotPass")
const html2FACode = require("./../../htmlMail/on_2fa_code")
const html2FAEnabled = require("./../../htmlMail/on_2fa_enabled")
const html2FADisabled = require("./../../htmlMail/on_2fa_disabled")
const speakeasy = require('speakeasy')
const QRCode = require('qrcode')
const getIP = require('ipware')().get_ip
const Sniffr = require("sniffr")

let linkLogo = config.MAIL_LOGO
let linkFooter = config.MAIL_IMG_FOOTER
let titleSite = config.TITLE_SITE
let contact = config.CONTACT
let domain = config.DOMAIN

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

function sendOn2FACode(data) {

    let nameNick = data.nick_name
    let code = data.code
    let to = data.email
    let subject = 'Verification Code To Turn On 2FA'
    let titleSub = 'Verification Code To Turn On 2FA'
    let body = html2FACode.html2FACode(nameNick, linkLogo, linkFooter, contact, code, titleSite, titleSub)
    mailer.sendMail(to, subject, body)
}

function sendOn2FAEnable(data) {

    let nameNick = data.nick_name

    let to = data.email
    let subject = 'Two-Factor Authentication enabled'
    let titleSub = 'Enable Google Authentication'
    let body = html2FAEnabled.html2FAEnabled(nameNick, linkLogo, linkFooter, titleSite, titleSub)
    mailer.sendMail(to, subject, body)
}


function sendOn2FADisabled(data) {

    let nameNick = data.nick_name

    let to = data.email
    let subject = 'Two-Factor Authentication Disabled'
    let titleSub = 'Disabled Google Authentication'
    let body = html2FADisabled.html2FADisabled(nameNick, linkLogo, linkFooter, titleSite, titleSub)
    mailer.sendMail(to, subject, body)
}

function sendActiveMail(data) {
    const jsontoken = sign({ result: data }, config.TOKEN_KEY, {
        expiresIn: "30m"
    });

    let linkActive = domain + '/login?a=' + jsontoken

    let nameNick = data.nick_name

    let to = data.email
    let subject = 'Activate your account'
    let body = htmlActive.htmlActive(nameNick, linkLogo, linkFooter, contact, linkActive, titleSite)
    mailer.sendMail(to, subject, body)
}


function checkRole(x, r) {
    let role = x == 1 ? 'admin' : 'agency';
    try {
        const roles = Helper.getConfig('role')
        return roles[role].includes(r);
    }
    catch (err) {
        return false;
    }
}


module.exports = {

    forgotPassAccount: (req, res) => {
        let body = req.body
        // const jsontoken = sign({result: body}, config.TOKEN_KEY, {
        //     expiresIn: "1m"
        // });
        let linkActive = domain + '/reset-password?e=' + body.email

        let nameNick = body.nick_name

        let to = body.email
        let subject = 'You had requested to reset your password on ' + titleSite
        let boHtml = htmlFoget.htmlFoget(nameNick, linkLogo, titleSite, linkFooter, contact, linkActive)
        mailer.sendMail(to, subject, boHtml)
        return res.status(200).json({
            success: 1
        })
    },

    resendConfirmationAccount: (req, res) => {
        let email = req.body.email
        let obj = {
            email: email,
            nick_name: 'Guest'
        }
        sendActiveMail(obj)

        return res.status(200).json({
            success: 1
        })
    },

    updatePassword: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);

        const username = req.user.username;
        if (body.password != "") {
            getUserByUserEmail(username, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!results) {
                    return res.json({
                        success: 0,
                        message: "Invalid email or password",
                    });
                }
                const result = compareSync(body.password, results.password);
                if (result) {
                    const password = hashSync(body.newPassword, salt);
                    updateUserPasswordByEmail({ username, password }, (err, results) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (!results) {
                            return res.json({
                                success: 3,
                                message: "Faile to update user password",
                            });
                        } else {
                            return res.json({
                                success: 1,
                                message: "Update success",
                            });
                        }
                    });
                } else {
                    return res.json({
                        success: 0,
                        message: "Incorrect password",
                    });
                }
            });


        }
    },




    activeUser: (req, res) => {

        const token = req.body.token;

        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 0,
                    l: false,
                    message: "Invalid token"
                })
            } else {
                checkActiveUser(decoded.result.email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results.length) {
                        activeUser(decoded.result, (err, results) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (!results) {
                                return res.json({
                                    success: 0,
                                    message: "Faile to update user"
                                })
                            }
                            return res.json({
                                success: 1,
                                message: "Active success"
                            })
                        })
                    }
                })

            }
        })

    },

    listHisBO: (req, res) => {
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 0,
                    l: false,
                    message: "Invalid token"
                })
            } else {
                listHisBO(decoded.result.email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results
                    })
                })
            }
        })
    },

    withdrawallist: (req, res) => {
        getwithdrawallist((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                })
            }
            const data = results.map((item) => {
                item.name = item.email.replace(/.(?=.{3,}$)/g, '*');
                delete item.email;
                const createdAtDate = new Date(item.created_at);
                // Định dạng thời gian theo "d/m/Y H:s"
                item.created_at = `${(createdAtDate.getDate() + "").padStart(2, "0")}/${(createdAtDate.getMonth() + 1 + "").padStart(2, "0")
                    }/${createdAtDate.getFullYear()} ${(createdAtDate.getHours() + "").padStart(2, "0")}:${(createdAtDate.getMinutes() + "").padStart(2, "0")}`;

                return item;
            })
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    createUserAccount: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        if (body.password != "") {
            body.password = hashSync(body.password, salt);
        } else {
            return res.status(500).json({
                success: 0,
                message: "Database connection error",
            });
        }

        checkUserPhone(body.phone, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results.length) {
                checkUsername(body?.username?.trim(), (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results.length) {
                        try {
                            createAccount(body, (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        success: 0,
                                        message: "Database connection error",
                                    });
                                }
                                else {
                                    return res.json({
                                        success: 1,
                                    });
                                }
                            });
                        } catch (error) {
                            console.log(error);
                            return res.status(500).json({
                                success: 0,
                                message: "Database connection error",
                            });
                        }
                    } else {
                        return res.json({
                            success: 3,
                        });
                    }
                });
            } else {
                return res.json({
                    success: 2
                });
            }
        });
    },

    createAgency: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        if (body.password != '' || void 0 !== body.password) {
            body.password = hashSync(body.password, salt);
        } else {
            return res.status(500).json({
                success: 0,
                message: "Có lỗi ở mật khẩu"
            })
        }

        checkExistedAgency(body.username, body.email, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results.length) {
                createAgency(body, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            success: 0,
                            message: "Database connection error"
                        })
                    }

                    if (results == false) {
                        return res.json({
                            success: 2,
                            message: "Mã giới thiệu đã tồn tại."
                        })
                    }

                    return res.status(200).json({
                        success: 1,
                        data: results
                    })
                })
            } else {
                return res.json({
                    success: 2,
                    message: "Tên đăng nhập đã tồn tại."
                })
            }

        })
    },

    updateAgency: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        if (body.password != '' || void 0 !== body.password) {
            body.password = hashSync(body.password, salt);
        }

        checkAgencyUserNameUpdate(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results.length) {
                updateAgency(body, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            success: 0,
                            message: "Database connection error"
                        })
                    }
                    return res.json({
                        success: 1,
                    })
                })
            } else {
                return res.json({
                    success: 2
                })
            }

        })
    },

    getAllUser: (req, res) => {
        const ref_code = req.query.ref_code
        const query = req.query
        getAllUser(req.user, ref_code, query, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    getUserById: (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },


    createGoogle2FA: (req, res) => {

        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                let email = decoded.result.email

                let secret = speakeasy.generateSecret({
                    length: 20,
                    name: 'BO Trade (' + email + ')'
                });

                QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
                    return res.json({
                        success: 1,
                        qr: image_data,
                        s: secret.base32 // Save this value to your DB for the user
                    })
                });
            }
        })
    },

    sendCodeG2FA: (req, res) => {
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                return res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                let email = decoded.result.email
                let nick = decoded.result.nick_name
                let code = makeid(6)

                let data = {
                    email: email,
                    nick_name: nick,
                    code: code
                }

                updateCodeSecure(data, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    sendOn2FACode(data);
                    return res.json({
                        success: 1
                    })
                })


            }
        })
    },


    unActiveGoogle2FA: (req, res) => {
        const body = req.body;
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                let secret = decoded.result.secret_2fa
                let token = body.t
                let code = body.c
                let email = decoded.result.email
                let password = body.p

                let da = {
                    email: email,
                    code: code
                }

                if (secret == null) {
                    getUserByUserEmail(email, (err, results) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        secret = results.secret_2fa
                    })
                }

                setTimeout(() => {
                    // kiểm tra mật khẩu và code secure
                    checkCodeSecure2FA(da, (err, results) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (!results) {
                            return res.json({
                                success: 0,
                                message: "Invalid email or password"
                            })
                        }
                        const result = compareSync(password, results.password);
                        if (result) {
                            // let token2 = speakeasy.totp({
                            //     secret: secret,
                            //     encoding: 'base32'
                            // });

                            // Verify a given token
                            const tokenValidates = speakeasy.totp.verify({
                                secret,
                                encoding: 'base32',
                                token,
                                window: 2,
                                //step:60
                            });

                            if (tokenValidates) {
                                // Tắt 2FA
                                Disabled2FA(email, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    if (!results) {
                                        return res.json({
                                            success: 0,
                                            message: "Faile to update user"
                                        })
                                    }
                                    // send mail
                                    let nick = decoded.result.nick_name
                                    let data = {
                                        nick_name: nick,
                                        email: email
                                    }

                                    sendOn2FADisabled(data)

                                    return res.json({
                                        success: 1
                                    })
                                })

                            } else {
                                return res.json({
                                    success: 2
                                })
                            }

                        } else {

                            return res.json({
                                success: 0
                            })
                        }
                    })
                }, 500)



            }
        })
    },

    activeGoogle2FA: (req, res) => {
        const body = req.body;
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                let secret = body.s
                let token = body.t
                let code = body.c
                let email = decoded.result.email
                let password = body.p

                let da = {
                    email: email,
                    code: code
                }

                // kiểm tra mật khẩu và code secure
                checkCodeSecure2FA(da, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Invalid password or code active"
                        })
                    }

                    const result = compareSync(password, results.password);
                    if (result) {
                        // let token2 = speakeasy.totp({
                        //     secret: secret,
                        //     encoding: 'base32'
                        // });
                        //console.log(token2)
                        // Verify a given token
                        const tokenValidates = speakeasy.totp.verify({
                            secret,
                            encoding: 'base32',
                            token,
                            window: 2,
                            // step:60 // là bước thời gian + thêm (s) giây
                        });
                        let obj = {
                            e: email,
                            s: secret
                        }
                        if (tokenValidates) {
                            // update vào db mã secret
                            updateSecret2FA(obj, (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (!results) {
                                    return res.json({
                                        success: 0,
                                        message: "Faile to update user"
                                    })
                                }
                                // send mail
                                let nick = decoded.result.nick_name
                                let data = {
                                    nick_name: nick,
                                    email: email
                                }

                                sendOn2FAEnable(data)

                                return res.status(200).json({
                                    success: 1
                                })
                            })


                        } else {
                            return res.json({
                                success: 2
                            })
                        }

                    } else {

                        return res.json({
                            success: 0
                        })
                    }
                })


            }
        })
    },

    updateUserById: (req, res) => {
        const body = req.body;

        const updateData = {
            name: body.name,
            bank: `${body.bankName}|${body.bankBranch}|${body.bankNumber}|${body.bankHolder}`,
            so_cmnd: body.idNumber,
            phone: body.phone,
            id: body.id
        }
        if (void 0 !== body.password) {
            const salt = genSaltSync(10);
            updateData.password = hashSync(body.password, salt);
        }

        updateUserById(updateData, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to update user"
                })
            }
            return res.json({
                success: 1,
                message: "Update success"
            })
        })
    },

    updateInfoVerify: (req, res) => {
        const body = req.body;
        const email = req.user.email;
        const bank = `${body.bankName}:${body.holder}:${body.bankNumber}`
        const data = {
            email,
            bank,
            phone: body.phone,
            so_cmnd: body.idNumber
        }
        updateInfoVerify(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to update user"
                })
            }
            return res.json({
                success: 1,
                message: "Update success"
            })
        })
    },

    updateUserMoney: (req, res) => {
        const body = req.body;
        updateUserMoney(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to update user money"
                })
            }

            return res.json({
                success: 1,
                message: "Update success"
            })
        })
    },

    updateUserPasswordByEmailClient: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        if (body.password != '') {

            // checkCodeSecure(body, (err, results) => {
            //     if(err){
            //         console.log(err);
            //         return;
            //     }
            //if(results.length){
            body.password = hashSync(body.password, salt);

            updateUserPasswordByEmail(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!results) {
                    return res.json({
                        success: 0,
                        message: "Faile to update user password"
                    })
                }
                return res.json({
                    success: 1,
                    message: "Update success"
                })
            })
            // }else{
            //     return res.json({
            //         success: 2
            //     })
            // }

            // })



        }
    },

    updateUserPasswordByEmailClient2: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        if (body.password != '') {

            checkCodeSecure(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (results.length) {

                    getUserByUserEmail(body.email, (err, results) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (!results) {
                            return res.json({
                                success: 0,
                                message: "Invalid email or password"
                            })
                        }
                        const result = compareSync(body.passOld, results.password);
                        if (result) {

                            body.password = hashSync(body.password, salt);

                            updateUserPasswordByEmail(body, (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (!results) {
                                    return res.json({
                                        success: 3,
                                        message: "Faile to update user password"
                                    })
                                } else {
                                    return res.json({
                                        success: 1,
                                        message: "Update success"
                                    })
                                }

                            })
                        } else {
                            return res.json({
                                success: 0,
                                message: "Invalid email or password"
                            })
                        }
                    });


                } else {
                    return res.json({
                        success: 2
                    })
                }

            })



        }
    },

    updateUserPasswordByEmail: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        if (body.password != '') {
            body.password = hashSync(body.password, salt);
            updateUserPasswordByEmail(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!results) {
                    return res.json({
                        success: 0,
                        message: "Faile to update user password"
                    })
                }
                return res.json({
                    success: 1,
                    message: "Update success"
                })
            })
        }
    },

    deleteUserById: (req, res) => {
        const id = req.params.id;
        deleteUserById(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                message: "Delete success"
            })
        })
    },

    loginG2FA: (req, res) => {
        const body = req.body;
        let token = body.token;
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                let secret = decoded.result.secret_2fa
                let token = body.code

                // Verify a given token
                const tokenValidates = speakeasy.totp.verify({
                    secret,
                    encoding: 'base32',
                    token,
                    window: 2
                });

                if (tokenValidates) {
                    let email = decoded.result.email
                    let password = decoded.result.password
                    getUserByUserEmail(email, (err, results) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (!results) {
                            return res.json({
                                success: 0,
                                message: "Invalid email or password"
                            })
                        }
                        const result = compareSync(password, results.password);
                        if (result) {
                            return res.json({
                                success: 1,
                                message: "Login success",
                            })
                        } else {
                            return res.json({
                                success: 0,
                                message: "Invalid email or password"
                            })
                        }
                    })
                } else {
                    return res.json({
                        success: 6,
                        message: "Google 2FA"
                    })
                }
            }
        })
    },

    loginUser: (req, res) => {
        const body = req.body;
        const ip = getIP(req);
        const userAgent = req.headers["user-agent"];
        const s = new Sniffr();
        s.sniff(userAgent);
        getUserByUserEmail(body.username, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Invalid username or password",
                });
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                const {
                    phone,
                    username,
                    name,
                    uid
                } = results;

                const tokenPayload = {
                    phone,
                    username,
                    name,
                    uid
                }
                const jsontoken = sign({ result: tokenPayload }, config.TOKEN_KEY, {
                    expiresIn: "8h",
                });
                return res.json({
                    success: 1,
                    message: "Login success",
                    token: jsontoken,
                });
            } else {
                return res.json({
                    success: 0,
                    message: "Invalid username or password",
                });
            }
        });

    },

    getAdminByAdminUsername: (req, res) => {
        const body = req.body;
        getAdminByAdminUsername(body.username, (err, results) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: err
                })
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                delete results.password
                const jsontoken = sign({ result: results }, config.TOKEN_KEY, {
                    expiresIn: "1h"
                });
                //res.header('Authorization', 'sky '+jsontoken);
                return res.json({
                    success: 1,
                    message: "Login success",
                    token: jsontoken
                })
            } else {
                return res.json({
                    success: 0,
                    message: "Invalid email or password"
                })
            }
        });
    },

    verifiedAccount: (req, res) => {
        const data = req.body;
        verifiedAccount(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to update user verifi"
                })
            }
            return res.json({
                success: 1,
                message: "Verify success"
            })
        })
    },

    // get ds đại lý
    getListAgency: (req, res) => {
        getListAgency((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    viewMemberAgency: (req, res) => {
        const id = req.params.id;
        viewMemberAgency(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    getInfoUser: (req, res) => {

        getInfoUser(req.user.username, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found",
                });
            }
            return res.json({
                success: 1,
                data: results,
            });
        });
    },


    WithDrawalVND: (req, res) => {
        const body = req.body;
        const user = req.user;

        const data = {
            username: user.username,
            amount: body.amount
        }

        if (data.amount <= 0) {
            return res.json({
                success: 3,
                message: "Invalid amount"
            });
        }
        WithDrawalVND(data, (err, results, messages) => {
            if (err) {
                console.log(err);
                return;
            }

            if (messages) {
                return res.json({
                    success: 2,
                    message: messages
                });
            }

            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to send user",
                });
            }
            return res.json({
                success: 1,
                message: "Send success",
            });
        });

    },



    BalanceWallet: (req, res) => {

        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {

                let email = decoded.result.email

                BalanceWallet(email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Faile to send user"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results
                    })
                })
            }
        })
    },

    getUserBankInfo: (req, res) => {
        const username = req.user.username
        getUserBankInfo(username, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to send user"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    getMyBankInfo: (req, res) => {
        const email = req.user.email;
        getMyBankInfo(email, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to send user"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },



    BankInfo: (req, res) => {

        getBankList((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to send user",
                });
            }

            return res.json({
                success: 1,
                data: results || [],
            });
        });

    },

    updateBankInfo(req, res) {
        const {
            name, branch, number, holder
        } = req.body
        if (!(name && branch && number && holder)) {
            return res.json({
                success: 1,
                message: "Missing bank info"
            });
        }
        const data = {
            username: req.user.username,
            bank: `${name}|${branch}|${number}|${holder}`
        }
        updateBankInfo(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to send user",
                });
            }
            return res.json({
                success: 1,
            });
        });
    },

    getBankList: (req, res) => {
        getBankList((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to send user"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    setBankList: (req, res) => {

        setBankList(req.body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to send user"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    getNguoiGioiThieu: (req, res) => {

        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {

                let email = decoded.result.email

                getNguoiGioiThieu(email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results
                    })
                })
            }
        })
    },

    UserEnabled: (req, res) => {
        const data = {
            id: req.params.id,
            email: req.user.email
        }
        UserEnabled(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    UserDisabled: (req, res) => {
        const data = {
            id: req.params.id,
            email: req.user.email
        }
        UserDisabled(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    getBoStatistics: (req, res) => {

        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {

                let email = decoded.result.email

                getBoStatistics(email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results
                    })
                })
            }
        })
    },

    getBoStatisticsCurrentDay: (req, res) => {

        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {

                let email = decoded.result.email

                getBoStatisticsCurrentDay(email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results
                    })
                })
            }
        })
    },

    getListHisOrder: (req, res) => {
        const username = req.user.username;
        getListHisOrder(username, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },


    getListHisOrderDate: (req, res) => {
        const username = req.user.username;
        const query = req.query
        getListHisOrderDate(username, query, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },


    getListHisTradeWallet: (req, res) => {
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                getListHisTradeWallet(decoded.result.email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },

    getListHisTradeWalletPage: (req, res) => {
        let body = req.params
        let token = req.get('authorization');
        token = token.split(" ")[1];
        let obj = {
            email: req.user.email,
            page: body.page
        }

        getListHisTradeWalletPage(obj, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                })
            }
            return res.json({
                success: 1,
                data: results,
                count: results.count
            })
        })
    },

    getListHisTradeWalletHH: (req, res) => {
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                getListHisTradeWalletHH(decoded.result.email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },

    getListHisTradeWalletHHPage: (req, res) => {
        let body = req.params
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                let obj = {
                    email: decoded.result.email,
                    page: body.page
                }
                getListHisTradeWalletHHPage(obj, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },

    getListHisTradeWalletWGD: (req, res) => {
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                getListHisTradeWalletWGD(decoded.result.email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },

    getListHisTradeWalletWGDPage: (req, res) => {
        let body = req.params
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                let obj = {
                    nick: decoded.result.nick_name,
                    page: body.page
                }
                getListHisTradeWalletWGDPage(obj, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },



    getComDetails: (req, res) => {
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                getComDetails(decoded.result.email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },

    getComDetailsPage: (req, res) => {
        let body = req.params
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {
                let obj = {
                    email: decoded.result.email,
                    page: body.page
                }
                getComDetailsPage(obj, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },

    getComDetailsDate: (req, res) => {
        let data = req.body
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {

                data['email'] = decoded.result.email

                getComDetailsDate(data, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results
                    })
                })
            }
        })
    },


    getAgencySearchLevel: (req, res) => {
        let body = req.body
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {

                body['email'] = decoded.result.email

                getAgencySearchLevel(body, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },


    getAgencySearchName: (req, res) => {
        let body = req.body
        let token = req.get('authorization');
        token = token.split(" ")[1];
        verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.json({
                    success: 3,
                    l: false,
                    m: "no no"
                })
            } else {

                body['email'] = decoded.result.email

                getAgencySearchName(body, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (!results) {
                        return res.json({
                            success: 0,
                            message: "Record not Found"
                        })
                    }
                    return res.json({
                        success: 1,
                        data: results,
                        count: results.count
                    })
                })
            }
        })
    },

    getListAnalytics: (req, res) => {
        const query = req.query
        const user = req.user
        getListAnalytics(query, user, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    getListAnalyticsDetail: (req, res) => {
        const idUser = req.params.idUser;
        getListAnalyticsDetail(idUser, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    changeAccType: (req, res) => {
        const body = req.body;
        changeAccType(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }

            if (results === -1) {
                // Nick mkt có cấp trên không được cộng tiền
                return res.json({
                    success: -1,
                    message: "Tài khoảng MKT không được có tuyến trên!"
                })
            } else {
                if (!results) {
                    return res.json({
                        success: 0,
                        message: "Faile to update user"
                    })
                }
                return res.json({
                    success: 1,
                    message: "Update success"
                })
            }
        })
    },

    changPassAd: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);

        if (body.pass != '') {
            body.pass = hashSync(body.pass, salt);
        } else {
            return res.json({
                success: 0,
                message: "Faile to update user password"
            })
        }
        const data = {
            email: req.user.email,
            password: body.pass
        }
        changPassAd(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Faile to update user password"
                })
            }
            return res.json({
                success: 1,
                message: "Update success"
            })
        })
    },

    getListCmsHis: (req, res) => {
        const body = req.body;
        getListCmsHis(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    getListNotifi: (req, res) => {
        const body = req.body;
        getListNotifi(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    updateListNotifi: (req, res) => {
        const body = req.body;
        updateListNotifi(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1
            })
        })
    },


    getRolesList: (req, res) => {
        const role = req.params.role
        getRolesList(role, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    updateRolesList: (req, res) => {
        const role = req.params.role
        const data = req.body
        updateRolesList(role, data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1
            })
        });
    },

    getCapDuoiInfo: (req, res) => {
        let ref_code = req.query.ref_code
        getCapDuoiInfo(ref_code, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    updateUpline: (req, res) => {

        updateUpline(req.body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    }

}
