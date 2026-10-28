// Em dev, o Vite repassa /api para http://127.0.0.1:8000 (veja vite.config.js).
// Assim front e API ficam na mesma origem: sem CORS e com cookies funcionando.
const BASE_URL = "/api";

// O csrf_token fica num cookie não-httponly, então o JS consegue lê-lo.
function obterCsrf() {
  const par = document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrf_token="));

  return par ? decodeURIComponent(par.split("=")[1]) : null;
}

// AJUSTE AQUI se o seu obter_csrf_token lê outro nome de header.
const HEADER_CSRF = "X-CSRF-Token";

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    credentials: "include", // envia o cookie de sessão
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      [HEADER_CSRF]: obterCsrf() ?? "",
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    const erro = new Error(`Erro HTTP: ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }

  return resposta.json();
}

// AJUSTE AQUI: rota e nomes dos campos do seu endpoint de login.
export const login = ({ login, senha }) =>
  requisicao("/auth/login", {
    method: "POST",
    body: JSON.stringify({ nome_login: login, senha }),
  });

// Retorna o id da unidade autenticada. Lança erro com status 401 se não houver sessão.
// AJUSTE AQUI se a resposta tiver outro formato (aceita { id: 1 } ou só 1).
export async function me() {
  const dados = await requisicao("/auth/me");
  return typeof dados === "object" && dados !== null ? dados.id : dados;
}

// AJUSTE AQUI: rota de logout do seu backend.
export const logout = () => requisicao("/auth/logout", { method: "POST" });

export const buscarUnidade = (id) => requisicao(`/unidade-saude/${id}`);

export const atualizarUnidade = (campos) =>
  requisicao("/unidade-saude/", {
    method: "PATCH",
    body: JSON.stringify(campos),
  });

export const criarMedico = (dados) =>
  requisicao("/medico/", { method: "POST", body: JSON.stringify(dados) });

export const atualizarMedico = (dados) =>
  requisicao("/medico/", {
    method: "PATCH",
    body: JSON.stringify(dados),
  });

export const deletarMedico = (id) =>
  requisicao(`/medico/${id}`, { method: "DELETE" });

export const criarMedicamento = (dados) =>
  requisicao("/medicamento/", { method: "POST", body: JSON.stringify(dados) });

export const deletarMedicamento = (id) =>
  requisicao(`/medicamento/${id}`, { method: "DELETE" });
