const simpleGit = require('simple-git');
const _ = require('lodash');
const fse = require('fs-extra');

const GITEE = 'gitee';
const GITHUB = 'github';

const gitFetch = async ({
  provider,
  repo,
  token,
  username,
  branch,
  commit,
  tag,
  execDir = '/tmp/code',
}) => {
  fse.emptyDirSync(execDir);
  const gitRepo = _.includes(repo, '://') ? _.split(repo, '://')[1] : repo;

  const git = simpleGit(execDir);
  console.info(`Git Init ${execDir}`);
  await git.init();

  switch (provider) {
    case GITEE:
      console.info(`Git remote add origin https://${username}:***@${gitRepo}`);
      await git.addRemote('origin', `https://${username}:${token}@${gitRepo}`);
      break;
    case GITHUB:
      console.info(`Git remote add origin https://***@${gitRepo}`);
      await git.addRemote('origin', `https://${token}@${gitRepo}`);
      break;
    default:
      console.error(`Not support ${provider}`);
      break;
  }

  let ref;
  if (branch && commit) {
    ref = `+${commit}:refs/remotes/origin/${branch}`;
  } else if (tag) {
    ref = `refs/tags/${tag}`;
  } else {
    ref = 'HEAD';
  }

  console.info(`Git fetch --depth=1 origin ${ref}`);
  await git.fetch(`origin`, ref, { '--depth': '1' });
  console.info(`Git reset --hard FETCH_HEAD`);
  await git.reset(['--hard', 'FETCH_HEAD']);
  console.info(`clone repo success`);
};

module.exports = {
  gitFetch,
};
