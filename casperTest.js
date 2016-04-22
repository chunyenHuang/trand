casper.test.begin('Trand', 5, function suite(test) {
    casper.start('http://localhost:3000', function() {
        test.assertTitle("Trand", "Trand - Homepage title is the one expected");
        test.assertExists('form', "form - A form is found.");
        this.fill('form', {
            content: "Dress"
        }, true);
        test.assertExists('h1');
    });

    casper.then(function() {
      test.assertTitle("Trand", "Trand - Homepage title is the one expected");
      test.assertUrlMatch('#/results', "Search form has been submitted.");
    });

    casper.run(function() {
        test.done();
    });
});
