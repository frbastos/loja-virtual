
//mongod.exe --dbpath C:\data\db\

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

var esquemaProduto = new mongoose.Schema({
    nome: String,
    descricao: String,
    preco: Number
});

var Produtos = mongoose.model('produtos', esquemaProduto);

var db = mongoose.connect('mongodb://localhost/loja_virtual_db');

// configuração do express para todas as views dentro do diretorio views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// Rotas do Cliente
app.get('/', function(request, response){

    Produtos.find({}, function(erro, produtosEncontrados){

        var params = {
            produtos: produtosEncontrados
        };

        response.render('index', params);
    });

});

app.get('/consulta-pedido', function(request, response){
    response.render('consulta-pedido');
});

// Rotas do Administrador
app.post('/admin/cadastro', function(request, response){
    var body = request.body;

    var produto = new Produtos({
        nome: body.nome,
        descricao: body.descricao,
        preco: body.preco  
    });

    produto.save(function(erro){
        if(erro){
            console.log('Deu erro na aplicação');
        }else{
            response.redirect('/admin/produtos-cadastrados');
        }
    });
    
});

app.get('/admin/produtos-cadastrados', function(request, response){

    // busca lista de produtos com mongoose no mongo db
    Produtos.find({}, function(erro, produtosEncontrados){
        if(erro){
            console.log('Deu merda');
        }else{
            var params = {produtos: produtosEncontrados};
        response.render('produtos', params);
        }
    });
    
});


app.get('/admin/remove/:id', function(request, response) {
    var id = request.params.id;

    Produtos.findById(id, function(erro, produtoEncontrado){
        if(erro){
            console.log('Deu merda');
        }else{
            produtoEncontrado.remove();
            response.redirect('/admin/produtos-cadastrados');
        }
    });

});

app.listen(3000, function(){
    console.log('Servidor Rodando ...');
});