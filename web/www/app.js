'use strict';

import { Server } from 'http';
import express from 'express';
import socketIo from 'socket.io';
import configureExpress from './config/express';

// import shopRouter, { wsConfig as shopWsConfig }
//   from './routers/shop.router';
// import policeRouter, { wsConfig as policeWsConfig }
//   from './routers/police.router';
// import repairShopRouter, { wsConfig as repairShopWsConfig }
//   from './routers/repair-shop.router';
import bankRouter, { wsConfig as bankWsConfig }
  from './routers/bank.router';

const BANK_ROOT_URL = '/bank';
// const POLICE_ROOT_URL = '/police';
// const REPAIR_SHOP_ROOT_URL = '/repair-shop';
// const SHOP_ROOT_URL = '/shop';

// const app = express();
var app = express()
app.use(function(req, res, next) {
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
        if (req.method === 'OPTIONS') return res.send(200)
    }
    next()
})
const httpServer = new Server(app);

// Setup web sockets
const io = socketIo(httpServer);
// shopWsConfig(io.of(SHOP_ROOT_URL));
// policeWsConfig(io.of(POLICE_ROOT_URL));
// repairShopWsConfig(io.of(REPAIR_SHOP_ROOT_URL));
bankWsConfig(io.of(BANK_ROOT_URL));

configureExpress(app);

app.get('/', (req, res) => {
  res.render('home', { homeActive: true });
});

// Setup routing
// app.use(SHOP_ROOT_URL, shopRouter);
// app.use(POLICE_ROOT_URL, policeRouter);
// app.use(REPAIR_SHOP_ROOT_URL, repairShopRouter);
app.use(BANK_ROOT_URL, bankRouter);

export default httpServer;
