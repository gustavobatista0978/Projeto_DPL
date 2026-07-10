const express = require('express');
const jogos = require('./main');

const app = express();
const PORT = 3000;

app.use(express.json());


// GET / (Envia o HTML inicial)
app.get('/', (req, res) => {
    res.send("<h1>Backend da Locadora de Jogos!</h1>");
});

// Rota: GET /jogos
app.get('/jogos', (req, res) => {
    const { plataforma } = req.query;

    if (plataforma) {
        const jogosFiltrados = jogos.filter(j => j.plataforma.toLowerCase() === plataforma.toLowerCase());
        return res.status(200).json(jogosFiltrados);
    }

    res.status(200).json(jogos);
});

// Rota: POST /login
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === 'Gustavo' && senha === 'etefmc123') {
        return res.status(200).json({ mensagem: "Autenticação realizada com sucesso!" });
    }

    res.status(401).json({ erro: "Usuário ou senha inválidos." });
});

// Rota: POST /aluguel
app.post('/aluguel', (req, res) => {
    const { id, cliente } = req.body;

    if (!id || !cliente) {
        return res.status(400).json({ erro: "Dados incompletos. 'id' e 'cliente' são obrigatórios." });
    }

    const jogo = jogos.find(j => j.id === Number(id));

    if (!jogo) {
        return res.status(404).json({ erro: `Jogo com o ID ${id} não foi encontrado.` });
    }

    if (!jogo.disponivel) {
        return res.status(400).json({ erro: `O jogo '${jogo.titulo}' já está alugado e indisponível.` });
    }

    jogo.disponivel = false;
    res.status(201).json({
        mensagem: "Aluguel registado com sucesso!",
        jogo: jogo.titulo,
        cliente: cliente
    });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado com sucesso em http://localhost:3000`);
});