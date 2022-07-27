// usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
// /home/node/.nvm/versions/node/v12.22.12/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

const prepareRuntimeEnv = (runtime) => {
  const RUNTIME_ENUM = {
    nodejs12: "v12.22.12",
    nodejs16: "v16.16.0",
  };
  let pathEnv;
  if (runtime === "nodejs14") {
    pathEnv = "usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
  } else {
    pathEnv = `/home/node/.nvm/versions/node/${RUNTIME_ENUM}/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`;
  }
  process.env.PATH = pathEnv;
};

const addEnv = (envs = {}) => {
  for (const key of envs) {
    const value = envs[key];
    if (!value) {
      process.env[key] = value;
    }
  }
};

module.exports = (runtime, envs) => {
  prepareRuntimeEnv(runtime);
  addEnv(envs);
};
