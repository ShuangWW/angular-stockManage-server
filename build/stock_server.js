"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
var app = express();
app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.get('/api/stock', function (req, res) {
    var result = stocks;
    var params = req.query;
    if (params.name) {
        result = result.filter(function (stock) { return stock.name.indexOf(params.name) != -1; });
    }
    res.json(result);
});
app.get('/api/stock/:id', function (req, res) {
    res.json(stocks.find(function (stock) { return stock.id == req.params.id; }));
});
var server = app.listen(8000, 'localhost', function () {
    console.log("服务器已启动，地址是:http://localhost:8000");
});
var subscriptions = new Set();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (websocket) {
    subscriptions.add(websocket);
});
var messageCount = 0;
setInterval(function () {
    subscriptions.forEach(function (ws) {
        if (ws.readyState == 1) {
            ws.send(JSON.stringify({ messageCount: messageCount++ }));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
var Stock = /** @class */ (function () {
    function Stock(id, name, price, rating, desc, categories) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Stock;
}());
exports.Stock = Stock;
var stocks = [
    { id: 1, name: '第一只股票', price: 1.99, rating: 3, desc: '暂无', categories: ['金融', '互联网'] },
    { id: 2, name: '第二只股票', price: 2.99, rating: 3.5, desc: '暂无', categories: ['金融', '互联网'] },
    { id: 3, name: '第三只股票', price: 1.69, rating: 2.3, desc: '暂无', categories: ['金融', '互联网'] },
    { id: 4, name: '第四只股票', price: 3, rating: 5, desc: '暂无', categories: ['金融', '互联网'] }
];
