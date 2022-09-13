const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const core = require("@serverless-cd/core");
const { v4: uuidv4 } = require('uuid');
const fse = require('fs-extra');
const _ = require('lodash');
const Engine = require("@serverless-cd/engine").default;
const { CODE_DIR, TEMPLATE_YAML, CREDENTIALS, OSS_CONFIG } = require('./constants');
const { getPayload, getOTSTaskPayload } = require('./utils');
const { gitFetch } = require('./git');
const otsTask = require('./task');

const taskId = uuidv4();
const logPrefix = `/logs/${taskId}`;
// const logPrefix = logPrefix: '/Users/wb447188/Desktop/serverless-cd/serverless-cd-worker/custom/logs',
fse.emptyDirSync(logPrefix);

async function handler (event, context, callback) {
  // 解析入参
  const { payload, appConfig: { userId, appName } = {} } = getPayload(event);

  console.log('start task, uuid: ', taskId);
  // 拉取代码
  payload.execDir = CODE_DIR;
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(CODE_DIR, TEMPLATE_YAML));
  await gitFetch(payload);

  // 解析 pipline
  console.info(`parse spec: ${TEMPLATE_YAML}`);
  const piplineContext = await core.parseSpec();
  console.log('piplineContext:\n', JSON.stringify(piplineContext));

  // 启动 engine
  const steps = _.get(piplineContext, 'steps');
  const engine = new Engine({
    steps,
    logPrefix,
    ossConfig: {
      ...CREDENTIALS,
      ...OSS_CONFIG,
    },
  });

  // init task 表
  await otsTask.create(userId, appName, taskId, {
    commitId: payload.commitId,
    status: engine.context.status,
    steps: getOTSTaskPayload(engine.context.steps), 
  });

  // 监听每个步骤的执行结果
  engine.on('process', async () => {
    // init task 表
    await otsTask.update(userId, appName, taskId, {
      commitId: payload.commitId,
      status: engine.context.status,
      steps: getOTSTaskPayload(engine.context.steps), 
    });
  });

  // 终态
  engine.on('completed', async () => {
    await otsTask.update(userId, appName, taskId, {
      commitId: payload.commitId,
      status: engine.context.status,
      steps: getOTSTaskPayload(engine.context.steps), 
    });
    console.log('completed end.');
    callback(null, '');
  });

  await engine.start();
}

exports.handler = handler;
