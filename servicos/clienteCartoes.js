var restifyClient = require('restify-clients');

function ClientCartoes() {
    this._client = restifyClient.createJsonClient({
        url:'http://localhost:3001',
        version: '~1.0'
    });
}

ClientCartoes.prototype.autoriza = function(cartao, callback) {
    this._client.post('/cartoes/autoriza', cartao, callback);
}

module.exports = function() {
    return ClientCartoes;
}