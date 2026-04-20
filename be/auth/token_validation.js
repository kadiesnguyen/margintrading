 const { verify } = require("jsonwebtoken");
const config = require("./../config")
const Helper = require("../helpers");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization');
        if(token){
            //token = token.slice(7);
            token = token.split(" ")[1];
            verify(token, config.TOKEN_KEY, (err, decoded) => {
                if(err){
                    res.status(401).json({
                        success: 4,
                        l: false,
                        message: "Invalid token"
                    })
                }else{
                    req.user = decoded.result
                    next();
                }
            })
        }else{
            res.status(403).json({
                success: 5,
                message: "Access denied!"
            })
        }
    },

    checkRole: (r) => (req, res, next) => {
        const x = req.user.x;
        let role = x == 1 ? 'admin' : 'agency';
        try{
            const roles = Helper.getConfig('role')
            if(roles[role].includes(r) || x == 1) {
                next()
            } 
            else{
                res.json({
                    success: 5,
                    message: "Access denied!"
                })
            }
        }
        catch(err){
            res.json({
                success: 5,
                message: "Access denied!"
            })
        }
    }
    
    
}