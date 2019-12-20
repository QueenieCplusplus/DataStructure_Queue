// apollo server supports Pub/Sub
var server = require('graphql-subscriptions')

var express = require('express');
const app = express();

const {createServer} = require('http')

// 使用 express 實例 app 建立 HTTP 伺服器
const httpServer = createServer(app)

server.installSubScriptionHandlers(httpServer)


// to use graphql-subscriptions as Apollpo server supports Sub.
httpServer.listen({ port:4000 }, ()=>
  console.log(`GraphQL Server from Apollo is running now, which start its server at localhost:4000${server.installSubScriptionHandlers}`)
)


