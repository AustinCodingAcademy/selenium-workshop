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