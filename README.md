# Saúde Info — front (React + Vite + Tailwind)

## Rodando

1. Suba a API (em outro terminal, na pasta do backend):
   uvicorn app.main:app --reload --port 8000
   (ajuste o caminho do app se o seu for diferente)

2. Neste projeto:
   npm install
   npm run dev

3. Abra http://localhost:5173

O Vite repassa /api/* para http://127.0.0.1:8000/* (veja vite.config.js),
então não precisa configurar CORS no FastAPI.

## Onde ajustar se algo não bater com o backend (src/services/api.js)

- login():  POST /auth/login  com { login, senha }
- logout(): POST /auth/logout
- me():     GET  /auth/me     (aceita { id: 1 } ou só 1)
- HEADER_CSRF: nome do header que o obter_csrf_token lê (padrão X-CSRF-Token)
- Campos da unidade em src/pages/Painel.jsx: pessoas_em_atendimento,
  atendimentos_finalizados, horario_abertura, horario_fechamento,
  medicos, medicamentos
