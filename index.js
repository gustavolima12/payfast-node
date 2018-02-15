var app = require('./config/custom-express')();

app.listen(3000, function() {
    console.log('start server in port 3000');
});
