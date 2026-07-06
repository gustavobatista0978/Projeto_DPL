# Contrato da API — Locadora de Jogos Digital

**Dupla:** [Gustavo Batista], [Erick Guilherme]
**Tema:** Locadora de jogos de videogame (catálogo, filtros de consoles e registro de aluguel)

##  Contrato da API

| Método | Endpoint | Entrada | Resposta | Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | — | página HTML (frontend) | 200 |
| **GET** | `/jogos` | plataforma (query URL, opcional) | lista de jogos em JSON | 200 |
| **POST** | `/login` | usuario, senha (body JSON) | mensagem de sucesso / erro | 200 / 401 |
| **POST** | `/aluguel` | id, cliente (body JSON) | confirmação + alteração de disponibilidade | 201 / 400 / 404 |

##  Decisões de projeto (justificadas)
* **plataforma** vai na query URL porque é um filtro público de busca — pode aparecer abertamente na barra do navegador (o "envelope").
* **usuario** e **senha** vão no body JSON porque são dados privados e confidenciais (a "carta").
* **/aluguel** responde `400` quando falta um campo obrigatório de validação (ex: sem o nome do cliente) ou quando o jogo já se encontra alugado (indisponível), `404` quando o ID do jogo não existe no catálogo, e `201` quando o aluguel é registrado com sucesso.
* Dados guardados em um vetor na memória — se o servidor for reiniciado, o status de disponibilidade dos jogos volta ao estado inicial.

##  Casos de teste no Postman

| # | Requisição | Esperado |
| :--- | :--- | :--- |
| 1 | **GET** `/jogos` | `200` — lista completa (ex: 5 jogos cadastrados) |
| 2 | **GET** `/jogos?plataforma=ps5` | `200` — apenas os jogos da plataforma PlayStation 5 |
| 3 | **GET** `/jogos?plataforma=atari` | `200` — lista vazia `[]` |
| 4 | **POST** `/login` com `admin` / `etefmc123` | `200` — sucesso na autenticação |
| 5 | **POST** `/login` com senha errada | `401` — erro de credenciais inválidas |
| 6 | **POST** `/aluguel` `{ "id": 2, "cliente": "Ana" }` | `201` — Jogo muda o status `disponivel` de `true` para `false` |
| 7 | **POST** `/aluguel` sem o campo `cliente` | `400` — erro de validação (campo obrigatório ausente) |
| 8 | **POST** `/aluguel` `{ "id": 99, "cliente": "Ana" }` | `404` — jogo não existe no catálogo |
| 9 | **POST** `/aluguel` `{ "id": 2, "cliente": "Carlos" }` | `400` — jogo indisponível (já foi alugado no teste 6) |