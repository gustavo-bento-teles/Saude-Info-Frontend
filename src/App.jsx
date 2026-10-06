import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Painel from "./pages/Painel.jsx";
import { me } from "./services/api.js";

const Vazio = () => <div className="bg-blue-50 min-h-screen" />;

export default function App() {
  const [unidadeId, setUnidadeId] = useState(null);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    me()
      .then(setUnidadeId)
      .catch(() => setUnidadeId(null))
      .finally(() => setVerificando(false));
  }, []);

  async function entrar() {
    const id = await me();
    if (id == null) throw new Error("/auth/me não retornou o id da unidade");
    setUnidadeId(id);
  }

  return (
    <Routes>
      {/* Pública: não espera a checagem de sessão */}
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          verificando ? (
            <Vazio />
          ) : unidadeId != null ? (
            <Navigate to="/admin" replace />
          ) : (
            <Login aoEntrar={entrar} />
          )
        }
      />

      <Route
        path="/admin"
        element={
          verificando ? (
            <Vazio />
          ) : unidadeId == null ? (
            <Navigate to="/login" replace />
          ) : (
            <Painel
              key={unidadeId}
              unidadeId={unidadeId}
              aoSair={() => setUnidadeId(null)}
            />
          )
        }
      />

      {/* Qualquer URL desconhecida volta pra Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}