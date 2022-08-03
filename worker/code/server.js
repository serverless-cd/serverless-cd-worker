"use strict";

const PORT = 9000;
const HOST = "0.0.0.0";
const REQUEST_ID_HEADER = "x-fc-request-id";

const express = require("express");
const app = express();
app.use(express.raw());

app.get("/", async (req, res) => {
  res.send("index");
});

// webhook触发
// 1. on push master/ on tag
// 2. export someting env

app.post("/send", async (req, res) => {
  
  res.send("OK");
});

var server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

server.timeout = 0; // never timeout
server.keepAliveTimeout = 0; // keepalive, never timeout
