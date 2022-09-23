const { TEMPLATE_YAML, DOWNLOAD_CODE_DIR, ACCESS_KEY_ID, ACCESS_KEY_SECRET, LOG_OSS_BUCKET, LOG_OSS_REGION, OTS_REGION, OTS_INSTANCE_NAME, OTS_TASK_TABLE_NAME, OTS_TASK_INDEX_NAME } = process.env;

module.exports = {
  TEMPLATE_YAML,
  CODE_DIR: DOWNLOAD_CODE_DIR,
  // CODE_DIR: '/Users/wb447188/Desktop/serverless-cd/serverless-cd-worker/custom/abc',
  CREDENTIALS: {
    accessKeyId: ACCESS_KEY_ID,
    accessKeySecret: ACCESS_KEY_SECRET,
  },
  OSS_CONFIG: {
    bucket: LOG_OSS_BUCKET,
    region: LOG_OSS_REGION,
  },
  OTS: {
    region: OTS_REGION,
    instanceName: OTS_INSTANCE_NAME,
  },
  OTS_TASK: {
    name: OTS_TASK_TABLE_NAME,
    index: OTS_TASK_INDEX_NAME,
  },
}
