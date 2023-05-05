const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 's3nh4s3cr3t4', // Troque por uma string aleatória e segura
  resave: false,
  saveUninitialized: true
}));

// Rotas
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Fazer login' });
});

app.post('/login', (req, res) => {
  const { nome_de_usuario, senha } = req.body;

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cobrapix'
  });

  connection.connect();

  const query = `SELECT * FROM usuarios WHERE nome_de_usuario = '${nome_de_usuario}' AND senha = '${senha}'`;

  connection.query(query, (error, results, fields) => {
    if (error) throw error;

    if (results.length > 0) {
      req.session.loggedin = true;
      req.session.nome_de_usuario = nome_de_usuario;
      res.redirect('/pagina_de_boas_vindas');
    } else {
      res.send('Nome de usuário ou senha incorretos.');
    }

    connection.end();
  });
});

app.get('/pagina_de_boas_vindas', (req, res) => {
  if (req.session.loggedin) {
    res.render('pagina_de_boas_vindas', { title: 'Bem-vindo', nome_de_usuario: req.session.nome_de_usuario });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
