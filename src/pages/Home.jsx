import { useEffect, useMemo, useState } from "react";

import Header from "../components/Header.jsx";
import SearchBar from "../components/SearchBar.jsx";
import UnidadeCard from "../components/UnidadeCard.jsx";
import DetalhesModal from "../components/DetalhesModal.jsx";

export default function Home() {
  const [unidades, setUnidades] = useState([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    async function buscarUnidades() {
      try {
        const resposta = await fetch("http://127.0.0.1:8000/unidade-saude/");

        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        setUnidades(dados);
      } catch (erro) {
        console.error("Erro ao buscar unidades:", erro);
      }
    }

    buscarUnidades();
  }, []);

  const unidadesFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return unidades;
    }

    return unidades.filter((unidade) => {
      const texto = `
        ${unidade.nome_exibicao}
        ${unidade.localizacao_exibicao}
      `.toLowerCase();

      return texto.includes(termo);
    });
  }, [busca, unidades]);

  const idMenorFila = useMemo(() => {
    const abertas = unidades.filter((unidade) => unidade.aberto === true);

    if (abertas.length === 0) {
      return null;
    }

    const menorFila = abertas.reduce((menor, unidade) => {
      if (unidade.pessoas_fila_atendimento < menor.pessoas_fila_atendimento) {
        return unidade;
      }

      return menor;
    });

    return menorFila.id;
  }, [unidades]);

  async function abrirDetalhes(id) {
    try {
      const resposta = await fetch(`http://127.0.0.1:8000/unidade-saude/${id}`);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }

      const dados = await resposta.json();

      setUnidadeSelecionada(dados);
      setModalAberto(true);
    } catch (erro) {
      console.error("Erro ao buscar detalhes da unidade:", erro);
    }
  }

  function fecharDetalhes() {
    setModalAberto(false);
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />

      <main className="max-w-md mx-auto px-4 py-6">
        <SearchBar valor={busca} aoAlterar={setBusca} />

        {unidadesFiltradas.length === 0 && (
          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Nenhuma unidade encontrada.
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Tente buscar por outro nome ou localização.
            </p>
          </div>
        )}

        <section className="flex flex-col gap-4 mt-4">
          {unidadesFiltradas.map((unidade) => (
            <UnidadeCard
              key={unidade.id}
              id={unidade.id}
              unidade={unidade}
              menorFila={unidade.id === idMenorFila}
              aoAbrirDetalhes={abrirDetalhes}
            />
          ))}
        </section>
      </main>

      <DetalhesModal
        unidade={unidadeSelecionada}
        aberto={modalAberto}
        aoFechar={fecharDetalhes}
      />
    </div>
  );
}
