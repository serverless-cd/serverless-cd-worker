const path = require('path');
const fse = require('fs-extra');
const envPath = path.join(__dirname, '..', '.env');
if (fse.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
const core = require("@serverless-cd/core");
const _ = require('lodash');
const Engine = require("@serverless-cd/engine").default;
const { CODE_DIR, TEMPLATE_YAML, CREDENTIALS, OSS_CONFIG } = require('./constants');
const { getPayload, getOTSTaskPayload } = require('./utils');
const { gitFetch } = require('./git');
const otsTask = require('./task');

async function handler (event, _context, callback) {
  // 解析入参
  // const { payload, appConfig: { userId, appName } = {} } = getPayload(event);
  const inputs = getPayload(event);
  console.log(JSON.stringify(inputs, null, 2));
  const {
    taskId,
    provider,
    repo,
    authorization: {
      userId,
      username,
      appName,
      access_token: token,
    } = {},
    branch,
    commit,
    tag,
    execDir = CODE_DIR,
  } = inputs;

  const logPrefix = `/logs/${taskId}`;
  fse.emptyDirSync(logPrefix);
  console.log('start task, uuid: ', taskId);

  // 拉取代码
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(CODE_DIR, TEMPLATE_YAML));
  await gitFetch({
    provider,
    repo,
    token,
    username,
    branch,
    commit,
    tag,
    execDir,
  });

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
    triggerPayload: inputs,
    status: engine.context.status,
    steps: getOTSTaskPayload(engine.context.steps), 
  });

  // 监听每个步骤的执行结果
  engine.on('process', async () => {
    // init task 表
    await otsTask.update(userId, appName, taskId, {
      status: engine.context.status,
      steps: getOTSTaskPayload(engine.context.steps), 
    });
  });

  // 终态
  engine.on('completed', async () => {
    await otsTask.update(userId, appName, taskId, {
      status: engine.context.status,
      steps: getOTSTaskPayload(engine.context.steps), 
    });
    console.log('completed end.');
    callback(null, '');
  });

  await engine.start();
}

exports.handler = handler;
