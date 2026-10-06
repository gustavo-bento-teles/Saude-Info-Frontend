import { useState } from "react";

import { login as fazerLogin } from "../services/api.js";

function validar({ login, senha }) {
  const erros = {};
  const loginLimpo = login.trim();

  if (!loginLimpo) {
    erros.login = "Informe o login da unidade.";
  } else if (loginLimpo.length < 3) {
    erros.login = "O login deve ter pelo menos 3 caracteres.";
  } else if (/\s/.test(loginLimpo)) {
    erros.login = "O login não pode conter espaços.";
  }

  if (!senha) {
    erros.senha = "Informe a senha.";
  }

  return erros;
}

export default function Login({ aoEntrar }) {
  const [valores, setValores] = useState({ login: "", senha: "" });
  const [tocados, setTocados] = useState({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroServidor, setErroServidor] = useState("");

  const erros = validar(valores);

  function alterar(evento) {
    const { name, value } = evento.target;
    setValores((atual) => ({ ...atual, [name]: value }));
    setErroServidor("");
  }

  function aoSair(evento) {
    setTocados((atual) => ({ ...atual, [evento.target.name]: true }));
  }

  async function enviar(evento) {
    evento.preventDefault();

    setTocados({ login: true, senha: true });

    if (Object.keys(erros).length > 0) return;

    setCarregando(true);
    setErroServidor("");

    try {
      await fazerLogin({ login: valores.login.trim(), senha: valores.senha });
      await aoEntrar?.();
    } catch (erro) {
      if ([400, 401, 403, 422].includes(erro.status)) {
        setErroServidor("Login ou senha incorretos.");
      } else if (erro.status) {
        setErroServidor("Erro no servidor. Tente novamente em instantes.");
      } else {
        setErroServidor("Não foi possível conectar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  }

  const classeInput = (campo) =>
    `w-full border rounded-xl px-4 py-3 outline-none transition ${
      tocados[campo] && erros[campo]
        ? "border-red-400 focus:border-red-500"
        : "border-slate-300 focus:border-blue-500"
    }`;

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <header className="bg-blue-600 shadow-sm px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Saúde Info</h1>
          <p className="text-sm text-blue-100">Painel administrativo da unidade</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900">Entrar</h2>
          <p className="text-slate-500 mt-2 mb-6">
            Acesse com o login da sua unidade de saúde.
          </p>

          <form onSubmit={enviar} noValidate className="space-y-4">
            <div>
              <label htmlFor="login" className="text-sm font-semibold text-slate-700">
                Login da unidade
              </label>

              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                placeholder="Ex.: ubs-centro"
                value={valores.login}
                onChange={alterar}
                onBlur={aoSair}
                disabled={carregando}
                className={`${classeInput("login")} mt-1`}
              />

              {tocados.login && erros.login && (
                <p className="text-sm text-red-500 mt-1">{erros.login}</p>
              )}
            </div>

            <div>
              <label htmlFor="senha" className="text-sm font-semibold text-slate-700">
                Senha
              </label>

              <div className="relative mt-1">
                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  value={valores.senha}
                  onChange={alterar}
                  onBlur={aoSair}
                  disabled={carregando}
                  className={`${classeInput("senha")} pr-24`}
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {tocados.senha && erros.senha && (
                <p className="text-sm text-red-500 mt-1">{erros.senha}</p>
              )}
            </div>

            {erroServidor && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3"
              >
                {erroServidor}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
