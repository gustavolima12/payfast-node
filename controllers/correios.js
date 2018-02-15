module.exports = function(app) {
    
    app.post('/correios/calculo-prazo', function(req, res) {
        console.log('POST: request for endpoint /correios/calculo-prazo');
        
        var dadosDaEntrega = req.body;
        var client = new app.servicos.clientSOAPCorreios();

        client.calcDeliveryTime(dadosDaEntrega, function(error, result) {
            if(error) {
                res.status(500).send(error);
                return;
            }
            console.log('delivery time calculed');
            res.status(200).send(result);
        });

    });
};