![logo](http://en.gravatar.com/userimage/107370100/a08594145564536138dfaaf072c7b241.png)

# Austin Coding Academy

## Automated Browser Testing with Selenium

### What is Selenium?

> [Selenium](https://www.seleniumhq.org/) automates browsers. That's it!

Selenium itself is a simple API to do all the things that we do when surfing the
web in a browser:

* Click this thing
* Look for text
* Add a thing
* Delete a thing
* Navigate to a page
* etc

While this can be used for some pretty cool projects like [automating instagram actions](https://medium.com/@mottet.dev/lets-create-an-instagram-bot-to-show-you-the-power-of-selenium-349d7a6744f7) or
[knowing exactly when your local apple store has that watch you want in stock](https://github.com/kevincolten/page-watcher/blob/master/index.js), in the industry it is mainly used to test high-level interactions that
simulates a user, and when they break.

### How does it work?

Like everything else in web development, it's a big ol' hack. Selenium
taps into the browser and exposes a low level API for us to use. All we have to
do is open the browser "in the context of Selenium" and we can get going.

### What does the Selenium language look like?

You can actually write Selenium instructions in almost any language! Today we
are going to use the Node.js (JavaScript) implementation and a library called
[Nightwatch.js](https://nightwatchjs.org/)

### Configuring Selenium

You can clone this repo `git clone https://github.com/AustinCodingAcademy/selenium-workshop.git` and `npm install` your way to success. But we are going to go through it step-by-step anyway.

#### Install Dependencies

After creating a new folder and `cd`ing into it, you can run `npm init`, press `enter` a bunch
of times, then install our dependencies

`npm install --save nightwatch chromedriver geckodriver selenium-server-standalone-jar`

We'll also need to make sure we have [Java SE Development Kit 8u212](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed.

#### Configure our Browsers

What browsers do we want to test on? All of them! But let's start on what we probably
have installed already: Firefox, Chrome, and maybe Safari (if you are on a Mac)

Create a file called `nightwatch.conf.js`

```js
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
```

You can see here we have our three browsers. Each browser will need the appropriate
"driver" that selenium can plug into it with. Chrome uses its own "chromedriver",
Firefox uses the "geckodriver", and Safari uses a "safaridriver" that comes built in
to the most recent Mac OS X releases.

### Let's write a test!

We built a small app, https://austincodingacademy.com/tutors,
to help our students find a tutor that is available at a
chosen time and place. Let's write a test that ensures those filters are working
correctly.

Create a directory called `tests` and in it a file called `01Tutors.js`. Nightwatch
will run tests in filename order by default.

`tests/01Tutors.js`

```js
module.exports = {
  'Check Tutor Filter' : browser => {
    browser.url('https://austincodingacademy.com/tutors')
    browser.end();
  }
};
```

and why don't we give it a whirl: `npx nightwatch -e chrome`

Hopefully we had Chrome open up, navigate to our page, then close

```bash
$ npx nightwatch -e chrome

[01 Tutors] Test Suite
======================
Running:  Check Tutor Filter

No assertions ran.
```

#### Automate some commands

Let's begin performing some actions. We want to:

1. Click the select box
2. Click Downtown Location
3. Click the data input box
4. Click our date

Referring to the [Nightwatch API Commands Docs](https://nightwatchjs.org/api#api-commands), we can use `.click('css selector')`.

```js
module.exports = {
  'Check Tutor Filter' : browser => {
    browser
      .url('https://austincodingacademy.com/tutors')
      .click('select')
      .click('option[value="austinDowntown"]')
      .click('input[type="text"]')
      .click('[aria-label="Tuesday, June 18, 2019"]')
    browser.end();
  }
};
```

#### Let's test it

We need to make a list of expectations so we can know if it is working.

```js
module.exports = {
  'Check Tutor Filter' : browser => {
    browser
      .url('https://austincodingacademy.com/tutors')
      .click('select')
      .click('option[value="austinDowntown"]')
      .click('input[type="text"]')
      .click('[aria-label="Tuesday, June 18, 2019"]')
    browser.expect.element('#tutor-8858846:not([hidden])').to.be.present;
    browser.expect.element('#tutor-10004148[hidden]').to.be.present;
    browser.end();
  }
};
```

And let's give it a shot!

```bash
$ npx nightwatch -e chrome

[01 Tutors] Test Suite
======================
Running:  Check Tutor Filter

✔ Expected element <#tutor-8858846:not([hidden])> to be present - element was present in 39ms
✔ Expected element <#tutor-10004148[hidden]> to be present - element was present in 17ms

OK. 2 assertions passed. (2.606s)
```

### Remote Testing

Great! As long as every one of your users use the exact same operating system,
browser, and versions, we should be golden! But that just isn't the case. Windows
users won't have Safari, Macs won't have IE 8/9/10/11, and, of course, Mac and Windows
versions of Chrome and Firefox are not as identical as you'd think.

So we have two options, go out and start buying up every combination of hardware
and OS and hire a QA team to sit in a dark room and run scripts all day, or
throw the tests up to the cloud!

#### BrowserStack

[BrowserStack](https://www.browserstack.com) is one of the leading services in this field. They have just about
[every combination](https://www.browserstack.com/screenshots) of OS/Browser/Version
ready to test on. This and their competitors aren't cheap, but it is cheaper than
a QA team, and we get to start out with 100 free minutes.

Make an account and sign in, click Products -> Automate, and grab your Username
and Access Key

#### Using Selenium in the Cloud

Now let's set up a similar configuration file but point it to BrowserStack

`browserstack.conf.js`

```js
nightwatch_config = {
  src_folders: ['tests'],

  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },

  common_capabilities: {
    'browserstack.user': '<BROWSERSTACK USER>',
    'browserstack.key': '<BROWSERSTACK ACCESS KEY',
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
```

Enter your USER and ACCESS KEY and let's run our tests in the cloud!

```bash
$ npx nightwatch -c browserstack.conf.js -e macFirefox,windowsChrome,windowsFirefox,macChrome,safari
macFirefox [01 Tutors] Test Suite
macFirefox ======================
macFirefox Results for:  Check Tutor Filter
macFirefox ✔ Expected element <#tutor-8858846:not([hidden])> to be present - element was present in 132ms
macFirefox ✔ Expected element <#tutor-10004148[hidden]> to be present - element was present in 137ms
macFirefox ✔ [01 Tutors] Check Tutor Filter (9.203s)
windowsChrome [01 Tutors] Test Suite
windowsChrome ======================
windowsChrome Results for:  Check Tutor Filter
windowsChrome ✔ Expected element <#tutor-8858846:not([hidden])> to be present - element was present in 182ms
windowsChrome ✔ Expected element <#tutor-10004148[hidden]> to be present - element was present in 180ms
windowsChrome ✔ [01 Tutors] Check Tutor Filter (12.355s)
windowsFirefox [01 Tutors] Test Suite
windowsFirefox ======================
windowsFirefox Results for:  Check Tutor Filter
windowsFirefox ✔ Expected element <#tutor-8858846:not([hidden])> to be present - element was present in 128ms
windowsFirefox ✔ Expected element <#tutor-10004148[hidden]> to be present - element was present in 117ms
windowsFirefox ✔ [01 Tutors] Check Tutor Filter (8.852s)
macChrome [01 Tutors] Test Suite
macChrome ======================
macChrome Results for:  Check Tutor Filter
macChrome ✔ Expected element <#tutor-8858846:not([hidden])> to be present - element was present in 192ms
macChrome ✔ Expected element <#tutor-10004148[hidden]> to be present - element was present in 137ms
macChrome ✔ [01 Tutors] Check Tutor Filter (5.554s)
safari [01 Tutors] Test Suite
safari ======================
safari Results for:  Check Tutor Filter
safari ✔ Expected element <#tutor-8858846:not([hidden])> to be present - element was present in 127ms
safari ✔ Expected element <#tutor-10004148[hidden]> to be present - element was present in 120ms
safari ✔ [01 Tutors] Check Tutor Filter (8.575s)
```

You can mix and match OS and Browsers with their [Capabilities Generator](https://www.browserstack.com/automate/capabilities)