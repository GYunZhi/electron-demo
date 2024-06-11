// @see - https://www.electron.build/configuration/configuration

const config = {
  appId: 'YourAppID',
  asar: false,
  productName: 'YourAppName',
  directories: {
    output: 'release/${version}',
  },
  files: ['dist', 'dist-electron'],
  mac: {
    target: ['dmg'],
    artifactName: '${productName}-Mac-${version}-Installer.${ext}',
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    artifactName: '${productName}-Windows-${version}-Setup.${ext}',
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  linux: {
    target: ['AppImage'],
    artifactName: '${productName}-Linux-${version}.${ext}',
  },
};

module.exports = config;
