nightwatch_config = {
  src_folders: ['tests'],

  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },

  common_capabilities: {
    'browserstack.user': process.env.BROWSERSTACK_USER,
    'browserstack.key': process.env.BROWSERSTACK_KEY,
    name: 'Bstack-[Nightwatch] Parallel Test'
  },

  test_settings: {
    default: {},
    windowsChrome: {
      desiredCapabilities: {
        os: 'WINDOWS',
        os_version: '10',
        browserName: 'chrome'
      }
    },
    windowsFirefox: {
      desiredCapabilities: {
        os: 'WINDOWS',
        os_version: '10',
        browserName: 'firefox',
      }
    },
    macChrome: {
      desiredCapabilities: {
        os: 'OS X',
        os_version: 'Mojave',
        browserName: 'chrome'
      }
    },
    macFirefox: {
      desiredCapabilities: {
        os: 'OS X',
        os_version: 'Mojave',
        browserName: 'firefox'
      }
    },
    safari: {
      desiredCapabilities: {
        os: 'OS X',
        os_version: 'Mojave',
        browserName: 'safari'
      }
    }
  }
};

// Code to support common capabilites
for (var i in nightwatch_config.test_settings) {
  var config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
  config['desiredCapabilities'] = config['desiredCapabilities'] || {};
  for (var j in nightwatch_config.common_capabilities) {
    config['desiredCapabilities'][j] =
      config['desiredCapabilities'][j] ||
      nightwatch_config.common_capabilities[j];
  }
}

module.exports = nightwatch_config;
