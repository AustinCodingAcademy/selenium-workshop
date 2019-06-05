module.exports = {
  src_folders: ['tests'],

  webdriver: {
    start_process: true
  },

  test_settings: {
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox'
      },
      webdriver: {
        server_path: 'node_modules/.bin/geckodriver',
        port: 4444
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome'
      },
      webdriver: {
        server_path: 'node_modules/.bin/chromedriver',
        port: 9515
      }
    },

    safari: {
      desiredCapabilities: {
        browserName: 'safari'
      },
      webdriver: {
        port: 4445
      }
    }
  }
};
