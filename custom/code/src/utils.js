/**
 * 
 * @param {*} event 
 * @returns
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
