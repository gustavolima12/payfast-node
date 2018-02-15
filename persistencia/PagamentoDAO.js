function PagamentoDAO(connection) {
    this._connection = connection;
}

PagamentoDAO.prototype.salva = function(pagamento, callback) {
    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
}

PagamentoDAO.prototype.atualiza = function(pagamento, callback) {
    this._connection.query('UPDATE pagamentos SET status = ?, data_modificacao = ? WHERE id = ?', [pagamento.status, pagamento.data_modificacao, pagamento.id], callback);
}

PagamentoDAO.prototype.lista = function(callback) {
    this._connection.query('SELECT * FROM pagamentos', callback);
}

PagamentoDAO.prototype.getById = function(pagamentoId, callback) {
    this._connection.query('SELECT * FROM pagamentos WHERE id = ?', pagamentoId, callback);
}

PagamentoDAO.prototype.getByIdAndStatus = function(pagamento, callback) {
    this._connection.query('SELECT * FROM pagamentos WHERE id = ? AND status = ?', [pagamento.id, pagamento.status], callback);
}

module.exports = function() {
    return PagamentoDAO;
}