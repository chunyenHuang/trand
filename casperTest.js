casper.test.begin('Trand', 5, function suite(test) {
    casper.start('http://localhost:3000', function() {
        test.assertTitle("Trand", "Trand - Homepage title is the one expected");
        test.assertExists('form', "form - A form is found.");
        test.assertExists('h1');
        this.fill('form', {
            content: "Dress"
        }, true);
    });

    casper.then(function() {
      test.assertTitle("Trand", "Trand - Homepage title is the one expected");
      test.assertHttpStatus(200);
      // test.assertEval(function() {
      //     return __utils__.findAll("h3.r").length >= 10;
      // }, "search results have 10 or more results");

    });

    casper.run(function() {
        test.done();
    });
});
