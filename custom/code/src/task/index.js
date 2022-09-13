const { Long } = require('tablestore');
const model = require('./model');

async function create(userId, appName, taskId, params = {}) {
  if (!(userId && appName && taskId)) {
    console.log(`Task config incomplete, userId: ${userId}, appName: ${appName}, taskId: ${taskId}`);
    throw new Error('App config incomplete.');
  }
  const dbConfig = await model.findOne(userId, appName, taskId);
  if (dbConfig.taskId) {
    return {
      success: false,
      data: createError(400, '该task已存在，请勿重复添加'),
    };
  }
  // 创建 ots
  const attributes = {
    ...params,
    createdTime: Long.fromNumber(Date.now()),
  };

  const res = await model.create(userId, appName, taskId, attributes);
  return {
    success: true,
    data: res,
  };
}

async function update(userId, appName, taskId, params = {}) {
  if (!(userId && appName && taskId)) {
    console.log(`Task config incomplete, userId: ${userId}, appName: ${appName}`);
    throw new Error('App config incomplete.');
  }
  const dbConfig = await model.findOne(userId, appName, taskId);
  if (!dbConfig.taskId) {
    return {
      success: false,
      data: createError(400, '该task不存在'),
    };
  }

  const attributes = {
    ...params,
  };
  const res = await model.update(userId, appName, taskId, attributes);
  return {
    success: true,
    data: res,
  };
}

module.exports = {
  create,
  update,
}
