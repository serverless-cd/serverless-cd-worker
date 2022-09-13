/**
 * 
 * @param {*} event 
 * @returns
  {
    // 仓库信息
    provider: 'github' | 'gitee'
    repo: 'https://github.com/wss-git/git-action-test',
    token: '',
    username: '',
    // 事件信息
    event: ''
    branch?: '',
    commit?: '',
    tag?: '',
  }
*/
function getPayload(event) {
  if (Object.prototype.toString.call(event) === '[object Uint8Array]') {
    return JSON.parse(event.toString() || '{}');
  }
  return event;
}

function getOTSTaskPayload(steps = []) {
  return steps.map(({ run, stepCount, status }) => ({ run, stepCount, status }))
}

module.exports = {
  getPayload,
  getOTSTaskPayload
}
