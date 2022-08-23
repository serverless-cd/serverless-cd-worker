const express = require("express");
const simpleGit = require("simple-git");
const fs = require("fs");
const core = require("@serverless-cd/core");
const Engine = require("@serverless-cd/engine").default;
const app = express();

app.get("/message", async (req, res) => {
  res.header("Content-Type", "application/json");
  // 1. 获取serverless-pipeline.yaml
  const git = simpleGit({
    baseDir: __dirname,
  });
  console.log("Initializing...");
  await git.init();
  console.log("Initializing done");
  const remotes = await git.getRemotes();
  const isAddRemoteOrigin = remotes.find((remote) => remote.name === "origin");
  if (!isAddRemoteOrigin) {
    await git.addRemote(
      "origin",
      // "https://github.com/heimanba/git-action-test.git",
      "https://hub.fastgit.xyz/xsahxl/git-action-test.git"
    );
  }
  console.log("Adding remote done");
  await git.addConfig("core.sparsecheckout", true);
  console.log("Adding config done");
  fs.writeFileSync(".git/info/sparse-checkout", "serverless-pipeline.yaml\n");
  console.log("Writing sparse-checkout done");
  console.log("Pulling...");
  await git.pull("origin", "main");
  console.log("Pulling done");
  fs.unlinkSync(".git/info/sparse-checkout");
  console.log("Removing sparse-checkout done");
  // 2. serverlesss-cd/core parseSpec
  const { steps } = core.parseSpec();
  // 3. serverlesss-cd/engine engine.start()
  const engine = new Engine(steps);
  const result = await engine.start();
  res.send(JSON.stringify(result));
});

app
  .listen(9000, () => {
    console.log("start success.");
  })
  .on("error", (e) => {
    console.error(e.code, e.message);
  });
