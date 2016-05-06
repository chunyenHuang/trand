casper.test.begin('Trand', function suite(test) {
  casper.start('http://localhost:3000', function() {
      test.assertTitle("Trand", "Trand - Homepage title is the one expected");
  });
  casper.then(function () {
    test.assertExists('h3', "h3 title is found");
  });

  casper.then(function () {
    test.assertExists('form[ng-show="!newUser"]', "form - A login form is found.");
    this.fill('form', {
      loginEmail: "business@gmail.com",
      loginPassword: '123',
    }, true);
  });

  casper.then(function () {
    this.click("a[href^='#/search']");
    test.assertUrlMatch('#/search', 'link to search page');
  });

  casper.then(function () {
    this.click("a[href^='#/combinations']");
    test.assertUrlMatch('#/combinations', 'link to combinations page');
  });

  casper.then(function () {
    this.click("a[href^='#/collections']");
    test.assertUrlMatch('#/collections', 'link to collections page');
  });

  casper.run(function () {
      test.done();
  });
});
