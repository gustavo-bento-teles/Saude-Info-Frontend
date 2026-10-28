import { useCallback, useEffect, useState } from "react";

import Modal from "../components/Modal.jsx";
import {
  logout,
  buscarUnidade,
  atualizarUnidade,
  criarMedico,
  atualizarMedico,
  deletarMedico,
  criarMedicamento,
  deletarMedicamento,
} from "../services/api.js";

const hora = (valor) => (valor ?? "").slice(0, 5); // "07:00:00" -> "07:00"

export default function Painel({ unidadeId, aoSair }) {
  const [unidade, setUnidade] = useState(null);
  const [agora, setAgora] = useState(new Date());

  const [modal, setModal] = useState(null); // "profissionais" | "medicamentos" | null
  const [nomeProfissional, setNomeProfissional] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  const [nomeMedicamento, setNomeMedicamento] = useState("");
  const [dosagemMedicamento, setDosagemMedicamento] = useState("");
  const [formaMedicamento, setFormaMedicamento] = useState("");

  const [abertura, setAbertura] = useState("");
  const [fechamento, setFechamento] = useState("");

  const carregar = useCallback(async () => {
    try {
      const dados = await buscarUnidade(unidadeId);
      setUnidade(dados);
      setAbertura(hora(dados.horario_abertura) || "07:00");
      setFechamento(hora(dados.horario_fechamento) || "17:00");
    } catch (erro) {
      console.error("Erro ao buscar unidade:", erro);
      if (erro.status === 401) aoSair?.(); // sessão expirada
    }
  }, [unidadeId, aoSair]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!unidade) {
    return <div className="bg-blue-50 min-h-screen" />;
  }

  const fila = unidade.pessoas_fila_atendimento ?? 0;
  const atendimento = unidade.pessoas_atendidas ?? 0;
  const aberta = unidade.aberto === true;
  const profissionais = unidade.medicos ?? [];
  const medicamentos = unidade.medicamentos ?? [];

  // Atualiza a tela na hora (otimista) e sincroniza com o backend
  async function atualizar(campos) {
    setUnidade((atual) => ({ ...atual, ...campos }));
    try {
      await atualizarUnidade(campos);
    } catch (erro) {
      console.error("Erro ao atualizar unidade:", erro);
      carregar(); // desfaz se o servidor recusar
    }
  }

  const adicionarFila = () => atualizar({ pessoas_fila_atendimento: fila + 1 });

  const iniciarAtendimento = () => {
    if (fila > 0) {
      atualizar({
        pessoas_fila_atendimento: fila - 1,
        pessoas_atendidas: atendimento + 1,
      });
    }
  };

  const finalizarAtendimento = () => {
    if (atendimento > 0) {
      atualizar({
        pessoas_atendidas: atendimento - 1,
      });
    }
  };

  const alternarStatus = () =>
    atualizar({
      aberto: !aberta,
      pessoas_fila_atendimento: 0,
      pessoas_atendidas: 0,
    });

  async function alternarStatusMedico(id, statusAtual) {
    console.log(id);
    console.log(statusAtual);
    
    try {
      // Passa um único objeto com o medico_id e o status_medico para a API
      await atualizarMedico({ 
        medico_id: id,
        status_medico: !statusAtual,
      });
      await carregar(); // Recarrega a lista
    } catch (erro) {
      console.error("Erro ao alterar status do médico:", erro);
    }
  }

  async function adicionarProfissional() {
    const nome = nomeProfissional.trim();
    const esp = especialidade.trim();

    if (!nome || !esp) {
      alert("Preencha o nome e a especialidade.");
      return;
    }

    try {
      await criarMedico({ nome, especializacao: esp });
      await carregar();
      setNomeProfissional("");
      setEspecialidade("");
      setModal(null);
    } catch (erro) {
      console.error("Erro ao adicionar profissional:", erro);
    }
  }

  async function removerProfissional(id) {
    try {
      await deletarMedico(id);
      await carregar();
    } catch (erro) {
      console.error("Erro ao remover profissional:", erro);
    }
  }

  async function adicionarMedicamento() {
    const nome = nomeMedicamento.trim();
    const dosagem = dosagemMedicamento.trim();
    const forma = formaMedicamento.trim();

    if (!nome || !dosagem || !forma) {
      alert("Informe todas as opções requiridas!");
      return;
    }

    try {
      await criarMedicamento({ nome, dosagem, forma });
      await carregar();
      setNomeMedicamento("");
      setDosagemMedicamento("");
      setFormaMedicamento("");
      setModal(null);
    } catch (erro) {
      console.error("Erro ao adicionar medicamento:", erro);
    }
  }

  async function removerMedicamento(id) {
    try {
      await deletarMedicamento(id);
      await carregar();
    } catch (erro) {
      console.error("Erro ao remover medicamento:", erro);
    }
  }

  async function sair() {
    try {
      await logout(); // o servidor invalida a sessão e limpa os cookies
    } catch (erro) {
      console.error("Erro ao fazer logout:", erro);
    } finally {
      aoSair?.(); // volta pro login de qualquer forma
    }
  }

  const dataHora = agora.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* TOPO */}
      <header className="bg-blue-600 shadow-sm px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Saúde Info</h1>
            <p className="text-sm text-blue-100">
              Painel administrativo da unidade
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-blue-100">Unidade atual</p>
              <p className="font-semibold text-white">
                {unidade.nome_exibicao}
              </p>
            </div>

            <button
              onClick={sair}
              className="border border-blue-300 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* CABEÇALHO */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Olá, Administrador!
            </h2>
            <p className="text-slate-500 mt-2">
              Gerencie as informações da unidade de saúde.
            </p>
          </div>

          <div className="bg-white border border-blue-200 rounded-xl px-5 py-3 shadow-sm">
            <p className="text-sm text-blue-600 font-semibold">Data atual</p>
            <p className="font-semibold text-slate-800">{dataHora}</p>
          </div>
        </div>
        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white border border-blue-200 rounded-xl p-5">
            <p className="text-blue-600 font-semibold">Aguardando na Fila</p>
            <h3 className="text-4xl font-bold text-blue-700 mt-2">{fila}</h3>
            <p className="text-sm text-slate-500 mt-1">pessoas aguardando</p>
          </div>

          <div className="bg-white border border-green-200 rounded-xl p-5">
            <p className="text-green-600 font-semibold">Em Atendimento</p>
            <h3 className="text-4xl font-bold text-green-700 mt-2">
              {atendimento}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              pessoas em atendimento
            </p>
          </div>

          <div className="bg-white border border-purple-200 rounded-xl p-5">
            <p className="text-purple-600 font-semibold">Situação da Unidade</p>

            <h3
              className={`text-3xl font-bold mt-2 ${
                aberta ? "text-green-600" : "text-red-500"
              }`}
            >
              {aberta ? "Aberta" : "Fechada"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {hora(unidade.horario_abertura) || abertura} -{" "}
              {hora(unidade.horario_fechamento) || fechamento}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={alternarStatus}
                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                  aberta ? "bg-green-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                    aberta ? "left-6" : "left-1"
                  }`}
                />
              </button>

              <span
                className={`text-sm font-semibold ${
                  aberta ? "text-green-600" : "text-red-500"
                }`}
              >
                {aberta ? "Unidade aberta" : "Unidade fechada"}
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-8">
            Fila de Atendimento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fila */}
            <div className="text-center md:border-r border-slate-200">
              <p className="text-blue-600 font-semibold">Aguardando na Fila</p>

              <div className="mx-auto mt-4 w-48 bg-blue-50 border border-blue-200 rounded-xl py-4">
                <span className="text-5xl font-bold text-blue-700">{fila}</span>
              </div>

              <button
                onClick={adicionarFila}
                disabled={!aberta}
                className={`mt-5 w-14 h-14 text-3xl rounded-xl transition ${
                  aberta
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                ↑
              </button>

              <p className="font-semibold mt-3">Adicionar à Fila</p>

              <p className="text-sm text-slate-500">+1 pessoa</p>
            </div>

            {/* Atendimento */}
            <div className="text-center md:border-r border-slate-200">
              <p className="text-green-600 font-semibold">Em Atendimento</p>

              <div className="mx-auto mt-4 w-48 bg-green-50 border border-green-200 rounded-xl py-4">
                <span className="text-5xl font-bold text-green-700">
                  {atendimento}
                </span>
              </div>

              <button
                onClick={iniciarAtendimento}
                disabled={!aberta}
                className={`mt-5 w-14 h-14 text-3xl rounded-xl transition ${
                  aberta
                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                ↓
              </button>

              <p className="font-semibold mt-3">Iniciar Atendimento</p>

              <p className="text-sm text-slate-500">Mover para atendimento</p>
            </div>

            {/* Finalizar */}
            <div className="text-center">
              <p className="text-orange-500 font-semibold">
                Finalizar atendimento
              </p>

              <button
                onClick={finalizarAtendimento}
                disabled={!aberta}
                className={`mt-5 w-14 h-14 text-2xl rounded-xl transition ${
                  aberta
                    ? "bg-orange-100 text-orange-500 hover:bg-orange-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                ✓
              </button>

              <p className="font-semibold mt-3">Finalizar Atendimento</p>

              <p className="text-sm text-slate-500">+1 atendimento</p>
            </div>
          </div>
        </section>

        {/* PARTE INFERIOR */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PROFISSIONAIS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-900">
                Profissionais em Atendimento
              </h3>
              <button
                onClick={() => setModal("profissionais")}
                className="border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Gerenciar
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {profissionais.map((p) => (
                <div key={p.id} className="flex justify-between py-3">
                  <span>{p.nome}</span>
                  <span className="text-slate-500">{p.especialidade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MEDICAMENTOS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-900">
                Medicamentos em Falta
              </h3>
              <button
                onClick={() => setModal("medicamentos")}
                className="border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Gerenciar
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {medicamentos.map((m) => (
                <p key={m.id} className="py-3 text-red-500">
                  {m.nome}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* MODAL PROFISSIONAIS */}
      <Modal
        aberto={modal === "profissionais"}
        titulo="Gerenciar Profissionais"
        aoFechar={() => setModal(null)}
      >
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Profissionais cadastrados
          </p>

          <div className="divide-y divide-slate-200">
            {profissionais.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p
                    className={`font-medium ${!p.atendendo ? "text-slate-400 line-through" : ""}`}
                  >
                    {p.nome}
                  </p>
                  <p className="text-sm text-slate-500">{p.especializacao}</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Botão de Ativo / Inativo */}
                  <button
                    onClick={() => alternarStatusMedico(p.id, p.atendendo)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                      p.atendendo
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {p.atendendo ? "🟢 Ativo" : "🔴 Inativo"}
                  </button>

                  {/* Botão de Deletar */}
                  <button
                    onClick={() => removerProfissional(p.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome do profissional"
            value={nomeProfissional}
            onChange={(e) => setNomeProfissional(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Especialidade"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={adicionarProfissional}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition"
          >
            Adicionar Profissional
          </button>
        </div>
      </Modal>

      {/* MODAL MEDICAMENTOS */}
      <Modal
        aberto={modal === "medicamentos"}
        titulo="Gerenciar Medicamentos"
        aoFechar={() => setModal(null)}
      >
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Medicamentos em falta
          </p>

          <div className="divide-y divide-slate-200">
            {medicamentos.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between py-3"
              >
                <span>{m.nome}</span>

                <button
                  onClick={() => removerMedicamento(m.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome do medicamento"
            value={nomeMedicamento}
            onChange={(e) => setNomeMedicamento(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Forma do medicamento (Comprimido ou Gota)"
            value={formaMedicamento}
            onChange={(e) => setFormaMedicamento(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Dosagem do medicamento -> ex: 500ml"
            value={dosagemMedicamento}
            onChange={(e) => setDosagemMedicamento(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={adicionarMedicamento}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition"
          >
            Adicionar Medicamento
          </button>
        </div>
      </Modal>
    </div>
  );
}
