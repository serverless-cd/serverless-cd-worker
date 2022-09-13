// refer: https://github.com/aliyun/aliyun-tablestore-nodejs-sdk
const { Client } = require('tablestore');
const { CREDENTIALS, OTS } = require('../constants');

const { region, instanceName } = OTS;

const tableClient = new Client({
  accessKeyId: CREDENTIALS.accessKeyId,
  accessKeySecret: CREDENTIALS.accessKeySecret,
  endpoint: `https://${instanceName}.${region}.tablestore.aliyuncs.com`,
  instancename: instanceName,
  maxRetries: 20, // 默认20次重试，可以省略此参数。
});

module.exports = tableClient;
