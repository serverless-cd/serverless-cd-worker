#!/usr/bin/env zx
// https://docs.github.com/cn/actions/using-workflows/workflow-syntax-for-github-actions

const fs = require("fs");
const app = require("./app");
// const myname = await $`cat ./app/package.json`;

const pipeLine = fs.readFileSync("./pipeline.yaml");
const pipeLineObject = YAML.parse(pipeLine.toString());
console.log(pipeLineObject.job.steps[0]);
cd("app");
// ${pipeLineObject.job.steps[0].run}
const command = `echo dankun`;
// console.log(command)
await $`${command}`;

// echo`${myname}`;

// await app();

// await $ `npm i`
