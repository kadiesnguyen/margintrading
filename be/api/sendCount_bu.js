const config = require('../config')
const Helper = require("../helpers");
const fileSys = config.PATH_SYS_CONFIG
const EthereumTx = require('ethereumjs-tx').Transaction
const common = require('ethereumjs-common')
const Web3 = require('web3')
const Tele = require("../auth/telegram_notify");
var db = require("../database");


let dataSys = Helper.getConfig(fileSys);


var TOKEN_KEY_Ether = 'X6P7HHXBKYX2G6DPY5BTKKIIMUU67F1JKV', TOKEN_KEY_Bsc = 'ACXPSZEP9QKN5QU2NYDGTP72CRT86MMVAT', apiEther = null, apiBsc = null, web3 = null, web3Bsc = null; 

var ContractAddress = null, USDTJSON = null, USDT_BSC = null; 

function setConnectSmartChain(type) {

    if(!type){ // mainnet

        USDTJSON = Helper.getConfig(config.ABI_USDT_MAINNET); //require('./config/USDT_BEP20_mainnet.json');

        ContractAddress = dataSys.CONTRACT_USDT_MAIN; // mặc địch của //BUSD-T Stablecoin

        /* 
            Config Ether Scan BEP20
        */  
        apiEther = require('etherscan-api').init(TOKEN_KEY_Ether, 'mainnet') //rinkeby
        web3     = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${dataSys.projectId}`))
        /* 
            Config BSC Scan BEP20
        */  
        apiBsc   = require("bscscan-api").init(TOKEN_KEY_Bsc,'mainnet')  // 97: Testnet. 56: mainnet
        web3Bsc  = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org')) //https://bsc-dataseed1.binance.org (mainnet)
        
        USDT_BSC = new web3Bsc.eth.Contract(USDTJSON, ContractAddress);
    
    }else{

        USDTJSON = Helper.getConfig(config.ABI_USDT_TESTNNET); //require('./config/USDT_BEP20_testnet.json');

        ContractAddress = dataSys.CONTRACT_USDT_TEST; // mặc địch của //Binance USD (BUSD) (test)

        /* 
            Config Ether Scan BEP20
        */   
        apiEther = require('etherscan-api').init(TOKEN_KEY_Ether, 'rinkeby') //mainnet
        web3     = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${dataSys.projectId}`))
         /* 
            Config BSC Scan BEP20
        */     
        apiBsc   = require("bscscan-api").init(TOKEN_KEY_Bsc,'testnet')  // 97: Testnet. 56: mainnet
        web3Bsc  = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545')) //https://bsc-dataseed1.binance.org (mainnet)
         
        USDT_BSC = new web3Bsc.eth.Contract(USDTJSON, ContractAddress);
    }
}

setConnectSmartChain(dataSys.IS_TEST_SMART_CHAIN);


setInterval(() => {
    dataSys = Helper.getConfig(fileSys);
    setConnectSmartChain(dataSys.IS_TEST_SMART_CHAIN);
}, 60000);


module.exports = {
    sendCoinERC20: async (priceUSDT, AddressForUser, idHis) => {
        return await new Promise((resolve, reject) => {
        
            let addressFrom = dataSys.ADDRESS_ETH_TRANSACTION; // Địa chỉ ví Admin
            let KeyFrom     = dataSys.PRIVATE_KEY_ETH_TRANSACTION;
           
            var balanceEther = apiBsc.account.balance(addressFrom);
            if(!!addressFrom && addressFrom != '' || !!KeyFrom && KeyFrom != ''){
                balanceEther.then((balanceData) =>{
                    if(balanceData.status == 1){
                        
                        let price = Number(balanceData.result); // price lấy số dư hiện tại
                        // convert từ $ muốn rút sang ETH
                        let cvtoETH = priceUSDT / dataSys.quotePriceETH;

                        let amountTransaction = web3.utils.toWei(cvtoETH.toString(), 'ether'); // chuyển từ $ sang price eth
                        
                        let gasP = 10, gasL = 21000;
                        let fee = gasL*gasP*1000000000; // giới hạn Gas  * giá Gas * 100 * 1.000.000.000 ( 1 tỉ )
                        let tongTienChuyen = Number(amountTransaction) + fee;
                        //let soTienConLai = web3.utils.fromWei((price - tongTienChuyen).toString(), 'ether');
                        if(price > amountTransaction){

                            let privateKeyAccount = Buffer.from(dataSys.PRIVATE_KEY_ETH_TRANSACTION, 'hex'); // Private KEY for Admin

                            // chuyển về Ví user
                            web3.eth.getTransactionCount(addressFrom, (err, txCount) => {
                                const txObj = {
                                    nonce: web3.utils.toHex(txCount),
                                    from: addressFrom,
                                    to: AddressForUser, // đây là ví khách hàng
                                    value: web3.utils.toHex(web3.utils.toWei(amountTransaction.toString(), 'ether')),
                                    gasLimit: web3.utils.toHex(gasL),
                                    gasPrice: web3.utils.toHex(web3.utils.toWei(gasP.toString(), 'gwei'))
                                }

                                // sign the transaction
                                const tx = new EthereumTx(txObj, { chain: dataSys.IS_TEST_SMART_CHAIN ? 'rinkeby' : 'mainnet' })
                                tx.sign(privateKeyAccount);

                                const serializedTx = tx.serialize();
                                const raw = '0x' + serializedTx.toString('hex');

                                // broadcast the transation
                                web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                                    //console.log('ETH da gui txHash: ', txHash);
                                    let ercchuyen = web3.utils.fromWei(tongTienChuyen.toString(), 'ether');
                                    let json = {
                                        success: 1,
                                        price_trans: ercchuyen,
                                        msg: 'ETH da gui txHash: ' + txHash
                                    }
                                    db.query(
                                        `UPDATE trade_history SET real_amount = ? WHERE id = ?`,
                                        [
                                            ercchuyen,
                                            idHis
                                        ])
                                    console.log(`🏆Địa chỉ: ${addressFrom} ERC hiện tại: vừa chuyển ${ercchuyen} cho: ${AddressForUser}!`)
                                    resolve(json)
                                })
                            });
                        }else{
                            let soTienConLai = web3.utils.fromWei(price.toString(), 'ether');
                            let soTienCanChuyen = web3.utils.fromWei(tongTienChuyen.toString(), 'ether');
                            let json = {
                                success: 99,
                                msg: `⚡️Số dư ETH hiện tại: ${soTienConLai} không đủ để thanh toán cho số tiền: ${soTienCanChuyen}!`
                            }
                            console.log(`⚡️Số dư địa chỉ: ${addressFrom} ERC hiện tại: ${soTienConLai} không đủ để thanh toán cho số tiền: ${soTienCanChuyen}`)
                            resolve(json);
                        }
                    }else{
                        let json = {
                            success: 99,
                            msg: 'Hệ thống bảo trì'
                        }
                        resolve(json);
                    }
                })
            }else{
                let json = {
                    success: 99,
                    msg: 'Địa chỉ gửi tiền chưa thiết lập!'
                }
                resolve(json);
            }
                
        });
        
        
    },

    sendCoinBSC: async (priceUSDT, AddressForUser , idHis) => {
        return await new Promise((resolve, reject) => {
			
			let dataSys = Helper.getConfig(fileSys);
	
            let addressFrom = dataSys.ADDRESS_ETH_TRANSACTION; // Địa chỉ ví Admin
            let KeyFrom     = dataSys.PRIVATE_KEY_ETH_TRANSACTION;

            if(!!addressFrom && addressFrom != '' || !!KeyFrom && KeyFrom != ''){
                
                var balanceEther = apiBsc.account.balance(addressFrom);
                balanceEther.then((balanceData) =>{
                    if(balanceData.status == 1){
                

                        let price = Number(balanceData.result); // price lấy số dư hiện tại
                        // convert từ $ muốn rút sang BNB
                        let cvtoBSC = priceUSDT / dataSys.quotePriceBNB;
                        let amountTransaction = web3Bsc.utils.toWei(cvtoBSC.toString(), 'ether'); // chuyển từ $ sang price BNB
		
                        let gasP = 10, gasL = 21000;
                        //let fee = gasL*gasP*1000000000; // giới hạn Gas  * giá Gas * 100 * 1.000.000.000 ( 1 tỉ )
						let fee = web3Bsc.utils.toWei((gasL*gasP).toString(), 'gwei');
						
                        let tongTienChuyen = Number(amountTransaction) + Number(fee);
                        //let soTienConLai = web3Bsc.utils.fromWei((price - tongTienChuyen).toString(), 'ether');

                        if(price > amountTransaction){
                            let privateKeyAccount = Buffer.from(KeyFrom.replace('0x', ''), 'hex'); // Private KEY for Admin
                            // chuyển về Ví user
                            web3Bsc.eth.getTransactionCount(addressFrom, (err, txCount) => {
                                const txObj = {
                                    nonce: web3Bsc.utils.toHex(txCount),
                                    from: addressFrom,
                                    to: AddressForUser, // đây là ví khách hàng
                                    value: web3Bsc.utils.toHex(amountTransaction), //web3Bsc.utils.toWei(amountTransaction.toString(), 'ether')
                                    gasLimit: web3Bsc.utils.toHex(gasL),
                                    gasPrice: web3Bsc.utils.toHex(web3Bsc.utils.toWei(gasP.toString(), 'gwei'))
                                }

                                // sign the transaction
                                let id = dataSys.IS_TEST_SMART_CHAIN ? 97 : 56;

                                const chain = common.default.forCustomChain(
                                    'mainnet', {
                                        name: 'bnb',
                                        networkId: id,
                                        chainId: id
                                    },
                                    'petersburg'
                                )

                                // sign the transaction
                                const tx = new EthereumTx(txObj, {common: chain})
                                tx.sign(privateKeyAccount)

                                const serializedTx = tx.serialize();
                                const raw = '0x' + serializedTx.toString('hex');

                                // broadcast the transation
                                web3Bsc.eth.sendSignedTransaction(raw, (err, txHash) => {
                                    //console.log('ETH da gui txHash: ', txHash);
                                    let bscchuyen = web3Bsc.utils.fromWei(tongTienChuyen.toString(), 'ether');
                                    let priceGoc  = web3Bsc.utils.fromWei(amountTransaction.toString(), 'ether');
                                    let phi       = web3Bsc.utils.fromWei(fee.toString(), 'ether');
                                    let json = {
                                        success: 1,
                                        price_trans: bscchuyen,
                                        msg: 'BSC da gui txHash: ' + txHash
                                    }
                                    db.query(
                                        `UPDATE trade_history SET real_amount = ?, pay_fee = ? WHERE id = ?`,
                                        [
                                            priceGoc,
                                            phi,
                                            idHis
                                        ])
                                    console.log(`🏆Địa chỉ: ${addressFrom} BSC hiện tại: vừa chuyển <b>${web3Bsc.utils.fromWei(amountTransaction, 'ether')} BNB</b> cho ${AddressForUser} tương đương với 💴<b>$${priceUSDT}</b> phí: <b>${web3Bsc.utils.fromWei(fee, 'ether')} BNB</b>`); 
                                    resolve(json);
                                })

                            });
                        }else{
                            
                            let soTienConLai = web3Bsc.utils.fromWei(price.toString(), 'ether');
                            let soTienCanChuyen = web3Bsc.utils.fromWei(tongTienChuyen.toString(), 'ether');
							
                            let json = {
                                success: 99,
                                msg: `⚡️Số dư BSC hiện tại: ${soTienConLai} không đủ để thanh toán cho số tiền: <b>${soTienCanChuyen}</b>`
                            }
                            console.log(`⚡️Số dư địa chỉ: ${addressFrom} BSC hiện tại: <b>${soTienConLai}</b> không đủ để thanh toán cho số tiền: <b>${soTienCanChuyen} BNB</b> tương đương 💴$${priceUSDT}`)
                            resolve(json);
                        }
                    }else{
                        let json = {
                            success: 99,
                            msg: 'Hệ thống bảo trì'
                        }
                        resolve(json);
                    }
                });    
            }else{
                let json = {
                    success: 99,
                    msg: 'Địa chỉ gửi tiền chưa thiết lập!'
                }
                resolve(json);
            }
        })
        
        
    },

    sendCoinETH_ERC20: async (priceUSDT, AddressForUser, idHis) => {
        return await new Promise((resolve, reject) => {
            let json = {
                success: 99,
                msg: `⚡️ERC-20 Bảo trì`
            }
            console.log(`⚡️ERC-20 Bảo trì`);
            resolve(json);
        })
    },

    sendCoinBSC_BEP20: async (priceUSDT, AddressForUser , idHis) => {
        return await new Promise((resolve, reject) => {
            let addressFrom = dataSys.ADDRESS_ETH_TRANSACTION; // Địa chỉ ví Admin
            let KeyFrom     = dataSys.PRIVATE_KEY_ETH_TRANSACTION || null;

            if(addressFrom == null || KeyFrom == null){
                let json = {
                    success: 99,
                    msg: 'Địa chỉ gửi tiền chưa thiết lập!'
                }
                console.log(`⚡️Địa chỉ chưa được thiết lập`);
                resolve(json);
            }
		
            let balanceToken = USDT_BSC.methods.balanceOf(addressFrom).call(); // lấy token usdt
            balanceToken.then((res) => {
                if(res > 0){
                    let balanceBsc = apiBsc.account.balance(addressFrom); // get phí BNB
                    balanceBsc.then((res2) => {
                        try{
                            if(res2.status == 1){
								let fee = Number(web3Bsc.utils.toWei('0.0021', 'ether'));
								
                                let balance = res2.result;
                                let price = Number(balance);

                                if(price >= fee){ //0.00105 * 2 là phí tối tối thiểu 
					
                                    let priceChuyen = web3Bsc.utils.toWei(priceUSDT.toString(), 'ether');
							
                                    let amount = web3Bsc.utils.toHex(priceChuyen);
        
                                    let gasP = 10, gasL = 210000;
        
                                    let gasPrice = web3Bsc.utils.toWei(gasP.toString(), 'gwei');
        
                                    let toAddressAdmin = AddressForUser; // Ví khách hàng
        
                                    //toAddressAdmin = '0xCce2524d64807CAad4Ba9400998dA3822390A3D6'; //test
        
                                    // price KEY của Ví chuyển
                                    let privateKeyAccount = Buffer.from(KeyFrom.replace('0x', ''), 'hex');
									
                                    web3Bsc.eth.getTransactionCount(addressFrom)
                                    .then((count) => {
                                        let rawTransaction = {
                                            from : addressFrom,
                                            gasPrice: web3Bsc.utils.toHex(gasPrice),  //web3Bsc.utils.toHex(gasP.result), //web3Bsc.utils.toWei(gasP.toString(), 'gwei')
                                            gasLimit: web3Bsc.utils.toHex(gasL),
                                            to: ContractAddress,
                                            value: "0x0",
                                            data: USDT_BSC.methods.transfer(toAddressAdmin, amount).encodeABI(),
                                            nonce: web3Bsc.utils.toHex(count)
                                        }

                                        let id = dataSys.IS_TEST_SMART_CHAIN ? 97 : 56;
                   
                                        const chain = common.default.forCustomChain(
                                            'mainnet', {
                                                name: 'bnb',
                                                networkId: id, 
                                                chainId: id
                                            },
                                            'petersburg'
                                        )
         
                                        const tx = new EthereumTx(rawTransaction, {common: chain});
                                        tx.sign(privateKeyAccount);  
        
                                        const serializedTx = tx.serialize();
                                        const raw = '0x' + serializedTx.toString('hex');
                                       
				
                                        // broadcast the transation
                                        web3Bsc.eth.sendSignedTransaction(raw, (err, txHash) => {
                                            if(err){
                                                console.log(`🙅<b>${err}</b>`); 
                                                let json = {
                                                    success: 99,
                                                    msg: err
                                                }
                                                resolve(json);
                                            }
                                            if(void 0 !== txHash){
                                                // dự tính phí gas hợp đồng này Gas Used by Transaction
                                                web3Bsc.eth.estimateGas(rawTransaction)
                                                .then((gasUsed) => {
                                                    let phi = gasUsed * web3Bsc.utils.fromWei(gasP.toString(), 'gwei');
           
                                                    let json = {
                                                        success: 1,
                                                        price_trans: priceUSDT,
                                                        msg: 'BSC da gui txHash: ' + txHash
                                                    }
                                                    db.query(
                                                        `UPDATE trade_history SET real_amount = ?, pay_fee = ?, status = ? WHERE id = ?`,
                                                        [
                                                            priceUSDT,
                                                            phi,
                                                            1,
                                                            idHis
                                                        ])
                                                    console.log(`🏆Địa chỉ BSC: ${addressFrom} hiện tại: vừa chuyển <b>$${priceUSDT} USDT</b> cho ${AddressForUser}\nPhí: <b>${phi} BNB</b>`); 
                                                    resolve(json);
        
                                                }).catch((error) => {
                                                    console.log(`🙅<i>Không lấy được phí GAS hợp đồng</i>`); 
                                                    let json = {
                                                        success: 99,
                                                        msg: 'Không tạo được hợp đồng'
                                                    }
                                                    resolve(json);
                                                });
                                            }
                                        })
                                    }).catch((error) => {
                                        console.log(`🙅<i>Không tạo được hợp đồng: </i> ${error}`); 
                                        let json = {
                                            success: 99,
                                            msg: 'Không tạo được hợp đồng: ' + error
                                        }
                                        resolve(json);
                                    });
                                }else{
                                    // thông báo nạp phí để hoàn thành rút tiền
                                    //💸Số dư tối thiểu BNB: <b>0.00105</b> để làm phí chuyển
                                    let conlaiFee = fee - price;
                                    console.log(`
                                    🏘Địa chỉ: ${addressFrom}
                                    🏋️Số dư hiện tại BNB: <b>${web3Bsc.utils.fromWei(price.toString(), 'ether')}</b>
                                    💸Số dư tối thiểu BNB: <b>0.0021</b> để làm phí chuyển
                                    - Vui lòng nạp thêm: 💸<b>${web3Bsc.utils.fromWei(conlaiFee.toString(), 'ether')}</b> BNB phí`);
									 let json = {
                                        success: 99,
                                        msg: 'Không đủ phí'
                                    }
                                    resolve(json);
                                }
                            }
                        }catch(e){
                            let json = {
                                success: 99,
                                msg: 'Hệ thống bảo trì'
                            }
                            console.log(`Hệ thống bảo trì`);
                            resolve(json);
                        }
                    })
    
                }else{
                    let soTienConLai = web3Bsc.utils.fromWei(res.toString(), 'ether');
                    let soTienCanChuyen = priceUSDT;
    
                    let json = {
                        success: 99,
                        msg: `⚡️Số dư USDT hiện tại: $${soTienConLai} không đủ để thanh toán cho: <b>$${soTienCanChuyen}</b>`
                    }
                    console.log(`⚡️Số dư USDT địa chỉ: ${addressFrom} hiện tại: <b>$${soTienConLai}</b> không đủ để thanh toán cho số tiền: <b>💴$${priceUSDT}</b>`);
                    resolve(json);
                }

            }); 
    
            
        })
        
    }


}