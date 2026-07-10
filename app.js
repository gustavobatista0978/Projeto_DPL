const express = require("express");
const path = require("path");
const jogos = require("./jogos.json");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/jogos", (req, res) => {

    const plataforma = req.query.plataforma;

    if (!plataforma) {
        return res.status(200).json(jogos);
    }

    const jogosFiltrados = jogos.filter(jogo =>
        jogo.plataforma.toLowerCase() === plataforma.toLowerCase()
    );

    res.status(200).json(jogosFiltrados);
});

app.post("/login", (req, res) => {

    const { usuario, senha } = req.body;

    if (usuario === "admin" && senha === "etefmc123") {
        return res.status(200).json({
            mensagem: "Login realizado com sucesso!"
        });
    }

    res.status(401).json({
        mensagem: "Usuário ou senha inválidos."
    });

});

app.post("/aluguel", (req, res) => {

    const { id, cliente } = req.body;

    if (id === undefined || !cliente) {
        return res.status(400).json({
            mensagem: "Os campos 'id' e 'cliente' são obrigatórios."
        });
    }

    const jogo = jogos.find(j => j.id === id);

    if (!jogo) {
        return res.status(404).json({
            mensagem: "Jogo não encontrado."
        });
    }

    if (!jogo.disponivel) {
        return res.status(400).json({
            mensagem: "Este jogo já está alugado."
        });
    }

    jogo.disponivel = false;

    res.status(201).json({
        mensagem: `Jogo '${jogo.nome}' alugado para ${cliente}.`,
        jogo
    });

});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});