var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var id = 3;

var produtos = [
    {
        id: 1,
        nome: "Playstation",
        descricao: "Video Game",
        preco: 2700
    },
    {
        id: 2,
        nome: "Mesa",
        descricao: "Madeira",
        preco: 150
    }
];

function Produto(id, nome, descricao, preco){
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
}

// configuração do express para todas as views dentro do diretorio views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// Rotas do Cliente
app.get('/', function(request, response){
    var params = {
        produtos: produtos
    };

    response.render('index', params);
});

app.get('/consulta-pedido', function(request, response){
    response.render('consulta-pedido');
});

// Rotas do Administrador
app.post('/admin/cadastro', function(request, response){
    var body = request.body;
    var produto = new Produto(id++, body.nome, body.descricao, body.preco);

    //Salvar produto banco de dados
    produtos.push(produto);

    response.redirect('/admin/produtos-cadastrados');
});

app.get('/admin/produtos-cadastrados', function(request, response){
    var params = {produtos: produtos};
    response.render('produtos', params);
});


app.get('/admin/remove/:id', function(request, response) {
    var id = request.params.id;
    produtos.forEach(function(produto, index){
        if(produto.id == id){
            produtos.splice(index,1);
        }
    });

    response.redirect('/admin/produtos-cadastrados');
});

app.listen(3000, function(){
    console.log('Servidor Rodando ...');
});