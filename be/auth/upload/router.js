const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

app.use(cors());
app.use(bodyParser.json())
const { checkToken } = require("../../auth/token_validation");


const upload = require('./uploadMiddleware')
const Resize = require('./Resize')


app.get('/me/photo/:name', function (req, res) {
    var filename = req.params.name;
    const imagePath = path.join(__dirname, '/avatars/' + filename);
    res.sendFile(imagePath, function (err) {
        if (err) {
            res.status(err.status).end('.');
        }
    })
})

app.get('/me/photo/passport/:name', function (req, res) {
    var filename = req.params.name;
    const imagePath = path.join(__dirname, '/passports/' + filename);
    res.sendFile(imagePath, function (err) {
        if (err) {
            res.status(err.status).end('.');
        }
    })
})

app.get('/photo/champions/:name', function (req, res) {
    var filename = req.params.name;
    const imagePath = path.join(__dirname, '/champions/' + filename);
    res.sendFile(imagePath, function (err) {
        if (err) {
            res.status(err.status).end('.');
        }
    })
})

app.post('/avatar', [checkToken, upload.single('image')], async function (req, res) {
    // folder upload
    const imagePath = path.join(__dirname, '/avatars');
    // call class Resize
    let username = req.user.username
    const fileUpload = new Resize(imagePath);


    if (!req.file) {
        res.status(401).json({ success: 0, error: 'Please provide an image' })
        return
    }

    const filename = await fileUpload.save(req.file.buffer, username)

    return res.status(200).json({ success: 1, error: 'Upload success', file: filename })
})

app.post('/champion', upload.single('image'), async function (req, res) {
    // folder upload
    const imagePath = path.join(__dirname, '/champions');
    // call class Resize
    let nick = req.body.email;
    const fileUpload = new Resize(imagePath);

    if (!req.file) {
        res.status(401).json({ success: 0, error: 'Please provide an image' })
        return
    }

    const fileName = await fileUpload.saveChampionBackground(req.file.buffer, nick)

    return res.status(200).json({ success: 1, data: fileName });
})

app.post('/passport/front', [checkToken, upload.single('image')], async function (req, res) {
    // folder upload
    const imagePath = path.join(__dirname, '/passports');
    // call class Resize
    let username = req.user.username
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.json({ success: 0, error: 'Please provide an image' })
        return
    }

    let filename = await fileUpload.savePassPortFront(req.file.buffer, username)

    return res.status(200).json({ success: 1, image: filename, error: 'Upload success' })
})

app.post('/passport/back', [checkToken, upload.single('image')], async function (req, res) {
    // folder upload
    const imagePath = path.join(__dirname, '/passports');
    // call class Resize
    let username = req.user.username
    const fileUpload = new Resize(imagePath);

    if (!req.file) {
        res.json({ success: 0, error: 'Please provide an image' })
        return
    }

    let filename = await fileUpload.savePassPortBack(req.file.buffer, username)

    return res.json({ success: 1, image: filename, error: 'Upload success' })
})

module.exports = app;
