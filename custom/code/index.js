const express = require("express");
const app = express();

app.get("*", (req, res) => {
  res.header("Content-Type", "text/html;charset=utf-8");
  console.log("test");

  res.send(`Hello`);
});

app
  .listen(9000, () => {
    console.log("start success.");
  })
  .on("error", (e) => {
    console.error(e.code, e.message);
  });
