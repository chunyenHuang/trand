casper.test.begin('Trand', function suite(test) {
    casper.start('http://localhost:3000/', function() {
        test.assertTitle("Trand", "Trand - Homepage title is the one expected");
    });

    casper.then(function () {
      this.click("a[href^='#/search']");
      test.assertUrlMatch('#/search', 'link to search page');
    });

    casper.then(function () {
      this.mouse.click("a[href^='#/search']");
      test.assertExists('form', "form - A form is found.");
      this.fill('form', {
          content: "Dress"
      }, true);
    });

    casper.run(function () {
        test.done();
    });
});
