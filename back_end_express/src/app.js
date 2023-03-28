const express = require('express')
const app = express()
const port = '3000'

const cors = require('cors')
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    next()
})
app.use(cors({
    origin: ['http://localhost:8080'],
    method: ['GET', 'POST']
}))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}))
app.use(bodyParser.json({
    limit: '10mb'
}))

const GA = require('./all_autotrain_GA.js')

app.post('/GA/Train', (request, response) => {
    let requestData = request.body;
    return new Promise((resolve, reject) => {
        GA.GA_train(requestData)
            .then((res) => {
                response.send(res)
                resolve(res)
            }).catch((error) => {
                reject(error)
            })
    })
})

app.post('/GA/Predict', (request, response) => {
    let requestData = request.body;
    return new Promise((resolve, reject) => {
        GA.GA_pre(requestData)
            .then((res) => {
                response.send(res)
                resolve(res)
            }).catch((error) => {
                reject(error)
            })
    })
})

app.post('/GA/Finetune', (request, response) => {
    let requestData = request.body;
    return new Promise((resolve, reject) => {
        GA.Incremental_Learning(requestData)
            .then((res) => {
                if (res.message == "no") {
                    response.status(701)
                }
                response.send(res)
                resolve(res)
            }).catch((error) => {
                reject(error)
            })
    })
})

app.listen(port, () => {
    console.log('服务已经启动，' + String(port) + '端口监听中');
})