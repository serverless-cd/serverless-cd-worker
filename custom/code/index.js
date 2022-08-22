const express = require("express");
const app = express();

app.get("/message", (req, res) => {
  res.header("Content-Type", "application/json");
  // 1. 获取serverless-pipeline.yaml
  // 2. serverlesss-cd/core parseSpec
  // 3. serverlesss-cd/engine engine.start()
  
  res.send(`Hello`);
});

app
  .listen(9000, () => {
    console.log("start success.");
  })
  .on("error", (e) => {
    console.error(e.code, e.message);
  });
