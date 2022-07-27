
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function run() {
  await delay(1500);
  // throw new Error("错误！");
  console.log(222);
}

module.exports = run;
