var fs = require('fs');

fs.readFile('../files/bodyPagamento.json', function(error, buffer) {
    console.log('arquivo lido');

    fs.writeFile('../util/bodyPagamento2.json', buffer, function(err) {
        console.log('arquivo escrito');
    });

});