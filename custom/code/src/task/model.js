const Orm = require('../ots/orm');
const { TABLE_NAME, INDEX_NAME } = require('./constant');

const orm = new Orm(TABLE_NAME, INDEX_NAME);

// 查询单个TASK数据
async function findOne(userId, appName, taskId) {
  return orm.findByPrimary([{ userId }, { appName }, { taskId }]);
}
// 创建
async function create(userId, appName, taskId, params) {
  return orm.create([{ userId }, { appName }, { taskId }], params);
}
// 查询列表
async function find(params = {}) {
  return await orm.find(params);
}
// 修改
async function update(userId, appName, taskId, params) {
  return orm.update([{ userId }, { appName }, { taskId }], params);
}
// 删除
async function remove(userId, appName, taskId) {
  return orm.delete([{ userId }, { appName }, { taskId }]);
}

module.exports = {
  findOne,
  create,
  find,
  update,
  remove,
};
