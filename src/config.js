'use strict';

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  appVersion: process.env.APP_VERSION || 'dev',
  gitSha: process.env.GIT_SHA || 'local',
  buildNumber: process.env.BUILD_NUMBER || '0',
  buildDate: process.env.BUILD_DATE || new Date().toISOString(),
  githubRepository: process.env.GITHUB_REPOSITORY || 'local/dev',
  appEnv: process.env.APP_ENV || 'development',

  podName: process.env.POD_NAME || 'local',
  nodeName: process.env.NODE_NAME || 'local',
  podNamespace: process.env.POD_NAMESPACE || 'default',

  githubApiCacheTtl: 60_000,
};

module.exports = config;
