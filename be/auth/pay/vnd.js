const express = require('express')
const db = require("../../database");
const app = express();
const { checkToken, checkRole } = require("../token_validation.js");
const { users } = require('../../src/nap');

app.post('/vnd', checkToken, function(req, res) {
  const { a, bank, holder, number } = req.body;
  const username = req.user.username;
  if(a <= 0 || !a){
    return res.json({
      success: 2,
      message: "Invalid amount"
    });
  }
  const bankInfo = `${bank}|${holder}|${number}`
  db.query(`SELECT username, bank FROM users WHERE username = ?`, [username], (err, result) => {
    if (err) {
      throw new Error(err);
    }

    if (Array.isArray(result) && result.length) {
      /**
       * status: 0: gửi admin phê duyệt
       * 1: success
       * -1: cancel
       */
      db.query(`INSERT INTO trade_history (email, type_key, type, currency, bank, amount, status, created_at)
      values(?,?,?,?,?,?,?,now())`,
      [
        username,
        'nt',
        'Nạp tiền (VNĐ)',
        'vnd',
        bankInfo,
        a,
        0
      ], (err, result1) => {
        if (err) {
          throw new Error(err);
        }
        res.status(200).json({ success: 1 });
      });
    }
  });
});

app.post('/approval', [checkToken, checkRole('*') ],function(req, res) {
  const body = req.body;
  const {
    status,
    id,
    note,
    amount,
    email,
  } = body;
  db.query(`UPDATE trade_history SET status = ?, note = ? WHERE id = ?`,
  [
    status,
    note,
    id,
  ], (err) => {
    if (err) {
      throw new Error(err);
    }

    if (status === 1) {
   
      for(let obj in users) {
        if(users[obj].email == email) {
          users[obj].ws.send(JSON.stringify({ type: 'nap', data: {
            status: status,
            amount: amount
          } }))
          break;
        }
      }
      db.query(`UPDATE account SET balance = balance + ? WHERE email = ?`, [
        amount,
        email,
      ], (err1) => {
        if (err1) {
          throw new Error(err1);
        }
        res.status(200).json({ success: 1 });
      })
    } else {
      for(let obj in users) {
        if(users[obj].email == email) {
          users[obj].ws.send(JSON.stringify({ type: 'nap', data: {
            status: status
          } }));
          break;
        }
      }
      res.status(200).json({ success: 1 });
    }
  });
});

app.post('/approval-rut', [checkToken, checkRole('*') ], function(req, res) {
  const body = req.body;
  const {
    status,
    id,
    note,
    amount,
    email,
  } = body;

  db.query(`UPDATE trade_history SET status = ?, note = ? WHERE id = ?`,
  [
    status,
    note,
    id,
  ], (err) => {
    if (err) {
      throw new Error(err);
    }
    // Từ chối rút tiền thì cộng lại tiền cho user
    if (status === -1) {
      
      db.query(`UPDATE account SET balance = balance + ? WHERE email = ?`, [
        amount,
        email,
      ], (err1) => {
        if (err1) {
          throw new Error(err1);
        }
        for(let obj in users) {
          if(users[obj].email == email) {
            users[obj].ws.send(JSON.stringify({ type: 'rut', data: {
              status: status,
              amount: amount
            } }))
            break;
          }
        }
        res.status(200).json({ success: 1 });
      })
    } else {
      for(let obj in users) {
        if(users[obj].email == email) {
          users[obj].ws.send(JSON.stringify({ type: 'rut', data: {
            status: status,
          } }))
          break;
        }
      }
      res.status(200).json({ success: 1 });
    }
  });
});

module.exports = app;