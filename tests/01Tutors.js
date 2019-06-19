module.exports = {
  'Check Tutor Filter' : browser => {
    browser
      .url('https://austincodingacademy.com/tutors')
      .click('select')
      .click('option[value="austinDowntown"]')
      .click('input[type="text"]')
      .click('[aria-label="Saturday, June 22, 2019"]')
    browser.expect.element('#tutor-8858762:not([hidden])').to.be.present;
    browser.expect.element('#tutor-10004148[hidden]').to.be.present;
    browser.end();
  }
};