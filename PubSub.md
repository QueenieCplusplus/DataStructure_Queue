# PubSub
訂閱模組的使用

# 訂閱的優點

即時更新是行動應用程式的基本功能，目前手機和桌機 app 皆透過 Web Socket 做網路與自身設備之間的溝通技術，TCP 技術能開啟雙向溝通，即 app 和 web 可以透過一個 link 做 send/ receive 的 channel，因此可以直接透過此通道從伺服器推送更新到手機和桌機網頁上。

以往，在尚未有 ws 之前，僅依靠 http 傳輸方式時，監聽的狀態是不斷傳送請求給伺服器來確定網頁內容是否有改變？！，例如透過 poll 等機制...。

但是因為 web socket 技術的出現，即時的資料更新得以透過 pub/sub 的方式做即時接收更新的媒介。

# Web Socket 通訊端模組

    $ npm install graphql-subscriptions

===>+ graphql-subscriptions@1.1.0

    $ npm install subscriptions-transport-ws
    
===>+ subscriptions-transport-ws@0.9.16

# WS Server runs on

ws://localhost:4000

# config in route/index.js

    // apollo server supports Pub/Sub
    var server = require('graphql-subscriptions')

    var express = require('express');
    const app = express();

    const {createServer} = require('http')

    // 使用 express 實例 app 建立 HTTP 伺服器
    const httpServer = createServer(app)

    // 本議題重點
    server.installSubScriptionHandlers(httpServer)


    // to use graphql-subscriptions as Apollpo server supports Sub.
    httpServer.listen({ port:4000 }, ()=>
      console.log(`GraphQL Server from Apollo is running now, which start its server at localhost:4000${server.installSubScriptionHandlers}`)
    )

# 額外的實作

在 schema Mutation 中多定義 subscription 型別。
用此型別來將資料傳輸傳遞至客戶端。
