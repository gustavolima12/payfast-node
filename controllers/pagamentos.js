module.exports = function(app) {
    
    const PAGAMENTO_CRIADO = "CRIADO";
    const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
    const PAGAMENTO_CANCELADO = "CANCELADO";

    app.get('/pagamentos', function(req, res) {
        console.log('GET: request for endpoint /pagamentos');
        res.send('OK');
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        console.log('POST: request for endpoint /pagamentos/pagamento with body');
        
        req.assert('pagamento.forma_de_pagamento', 'forma_de_pagamento is required and must be 3 characters').notEmpty().isLength({min:3});
        req.assert('pagamento.valor', 'valor decimal is required').isFloat();
        req.assert('pagamento.moeda', 'moeda is required and must be 3 characters').notEmpty().isLength({min:3});

        var errors = req.validationErrors();
        if(errors) {
            console.log('request invalid' + errors);
            res.status(400).send(errors);
            return;                
        }

        var bodyPagamento = req.body['pagamento'];
        bodyPagamento.status = PAGAMENTO_CRIADO;
        bodyPagamento.data_criacao = new Date;
        bodyPagamento.data_modificacao = null;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.salva(bodyPagamento, function(erroPagamento, resPagamento) {
            if(erroPagamento) {
                console.log('internal server error found: ' + erroPagamento);
                res.status(500).send(erroPagamento);
                return;
            }
            bodyPagamento.id = resPagamento.insertId; 


            if(bodyPagamento.forma_de_pagamento == 'cartao') {
                var bodyCartao = req.body['cartao'];
                var client = new app.servicos.clienteCartoes();
                
                client.autoriza(bodyCartao, function(erroCartao, reqCartao, respCartao, resCartao) { // obrigatório passar parâmetros
                    if(erroCartao) {
                        console.log('request invalid');
                        res.status(400).send(erroCartao);
                        return;
                    }
                    console.log('card authorized');
                    bodyCartao = resCartao;
                });
            }
            
            setTimeout(paymentResponse, 1000);
            
            function paymentResponse() {
                var response = {
                    dados_do_pagamento: bodyPagamento,
                    dados_do_cartao: bodyCartao,
                    links: [
                        {
                            href: 'http://localhost:3000/pagamentos/pagamento/' + bodyPagamento.id,
                            rel: 'confirmar',
                            method: 'PUT'
                        },
                        {
                            href: 'http://localhost:3000/pagamentos/pagamento/' + bodyPagamento.id,
                            rel: 'cancelar',
                            method: 'DELETE'
                        }
                    ]
                }

                res.location('/pagamentos/pagamento/' + bodyPagamento.id);
                console.log('payment created');
                res.status(201).send(response);
            }
        });
        
    });

    app.put('/pagamentos/pagamento/:id', function(req, res) {
        var pagamentoId = req.params.id;
        console.log('PUT: request for endpoint /pagamentos/pagamento/' + pagamentoId);
        console.log('verifying if the payment ' + pagamentoId + ' with status CRIADO exists');
        
        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);
        
        var pagamento = {};
        pagamento.id = pagamentoId;
        pagamento.status = 'CRIADO';
        pagamentoDAO.getByIdAndStatus(pagamento, function(error, result) {    
            if(error) {
                console.log('internal server error found: ' + error);
                res.status(500).send(error);
                return;
            }   
            else if(result.length > 0) {
                pagamento.status = PAGAMENTO_CONFIRMADO;
                pagamento.data_modificacao = new Date;
                pagamentoDAO.atualiza(pagamento, function(error, result) {    
                    if(error) {
                        console.log('internal server error found: ' + error);
                        res.status(500).send(error);
                        return;
                    } 
                    console.log('payment confirmed');
                    res.status(200).send(pagamento);
                }); 
            }
            else {
                console.log('payment not found');
                res.status(404).send(result);
            }
        }); 
    });
    
    app.delete('/pagamentos/pagamento/:id', function(req, res) {
        var pagamentoId = req.params.id;
        console.log('DELETE: request for endpoint /pagamentos/pagamento/' + pagamentoId);
        console.log('verifying if the payment ' + pagamentoId + ' exists');
        
        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);
        
        var pagamento = {};
        pagamentoDAO.getById(pagamentoId, function(error, result) {    
            if(error) {
                console.log('internal server error found: ' + error);
                res.status(500).send(error);
                return;
            }   
            else if(result.length > 0) {
                pagamento.id = pagamentoId;
                pagamento.status = PAGAMENTO_CANCELADO;
                pagamento.data_modificacao = new Date;
                pagamentoDAO.atualiza(pagamento, function(error, result) {    
                    if(error) {
                        console.log('internal server error found: ' + error);
                        res.status(500).send(error);
                        return;
                    } 
                    console.log('payment canceled');
                    res.status(200).send(pagamento);
                });
            }
            else {
                console.log('payment not found');
                res.status(404).send(result);
            }
        }); 
    });
};