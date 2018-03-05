const express = require('express');
const request = require('request');
const app = express();
const port = process.env.PORT || 8000;

var router  = express.Router();

const endPoint = 'https://viacep.com.br/ws';
const returnType = 'json';

// routes
router.get('/', function(req, res) {
  res.json({ message: 'YEAH! Seja Bem-Vindo a nossa API' });
});

router.route('/cep/:cep')
  .get(function(req, res) {
    var cep = req.params.cep;
    var url = `${endPoint}/${cep}/${returnType}`;

    request(url, function(error, response, body) {
        if(error || !body)
            res.send(error)
        
        if (response.statusCode === 200) {
          const endereco = JSON.parse(body);
          res.json(endereco);
        }

        res.status(response.statusCode).send({ error: `${response.statusCode}` }); 
    });
  });
 
router.route('/address/:uf/:city/:street')
  .get(function(req, res) {
    var uf = req.params.uf;
    var city = req.params.city;
    var street = req.params.street;
    var url = `${endPoint}/${uf}/${city}/${street}/${returnType}`;

    request(url, function(error, response, body) {
        if(error || !body)
            res.send(error)

        if (response.statusCode === 200) {
          const cep = JSON.parse(body);
          res.json(cep);
        }

        if (response.statusCode === 400) {
          res.status(response.statusCode).send({
            error: 'A cidade e o logradouro precisam ter no mínimo 3 caracteres.'
          }); 
        }

        res.status(response.statusCode).send({ error: `${response.statusCode}` }); 
    });
  });

  // Middleware
app.use(function(req, res, next) {
    var _send = res.send;
    var sent = false;
    res.send = function(data) {
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});


// prefixa as rotas com o valor /api
app.use('/api', router);

app.listen(port, function() {
  console.log(`Server running at http://localhost:${port}`);
  console.log('To shutdown the server: ctrl + c');
});
