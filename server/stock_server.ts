import * as express from "express";
import * as path from 'path';
import { Server } from "ws";

const app=express();

app.use('/',express.static(path.join(__dirname,'..','client')));

app.get('/api/stock',(req,res)=>{
    let result=stocks;
    let params=req.query;
    if(params.name){
        result=result.filter(stock=>stock.name.indexOf(params.name) != -1)
    }
    res.json(result)
})

app.get('/api/stock/:id',(req,res)=>{
    res.json(stocks.find(stock=>stock.id==req.params.id))
})

const server=app.listen(8000,'localhost',()=>{
    console.log("服务器已启动，地址是:http://localhost:8000")
});

var subscriptions = new Set<any>();

const wsServer=new Server({port:8085});
wsServer.on("connection",websocket=>{
    subscriptions.add(websocket)
})

var messageCount = 0;
setInterval(()=>{
    subscriptions.forEach(ws=>{
        if(ws.readyState==1){
            ws.send(JSON.stringify({messageCount:messageCount++}))
        }else{
            subscriptions.delete(ws)
        }
    })
},2000)

export class Stock {
    constructor(public id: number,
                public name: string,
                public price: number,
                public rating: number,
                public desc: string,
                public categories: Array<string>) {

    }
}

const stocks:Stock[]=[
    {id:1,name:'第一只股票',price:1.99,rating:3,desc:'暂无',categories:['金融','互联网']},
    {id:2,name:'第二只股票',price:2.99,rating:3.5,desc:'暂无',categories:['金融','互联网']},
    {id:3,name:'第三只股票',price:1.69,rating:2.3,desc:'暂无',categories:['金融','互联网']},
    {id:4,name:'第四只股票',price:3,rating:5,desc:'暂无',categories:['金融','互联网']}
]