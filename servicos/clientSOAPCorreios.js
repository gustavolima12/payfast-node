var soap = require('soap');

function ClientSOAPCorreios() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

ClientSOAPCorreios.prototype.calcDeliveryTime = function(dados, callback) {
    soap.createClient(this._url, function(error, client) {
        console.log('client soap criado');
        client.CalcPrazo(dados, callback);
    });
}

module.exports = function() {
    return ClientSOAPCorreios;
}