const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("<h1>Backend da Locadora de Jogos!</h1>");
});


app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:3000`);
});