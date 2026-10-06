const corStatus = {
  Aberta: "bg-green-100 text-green-700",
  "Movimento alto": "bg-orange-100 text-orange-700",
  Fechada: "bg-red-100 text-red-700",
};

function ListaProfissionais({ medicos }) {
  if (!medicos || medicos.length === 0) {
    return (
      <div className="py-5 text-center">
        <p className="text-sm text-slate-500">
          Nenhum profissional cadastrado nesta unidade.
        </p>
      </div>
    );
  }

  return medicos.map((medico, index) => {
    const ultimo = index === medicos.length - 1;

    return (
      <div
        key={medico.id}
        className={`flex items-center justify-between py-4 ${
          ultimo ? "" : "border-b border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            🩺
          </div>

          <div>
            <p className="font-semibold text-slate-900">{medico.nome}</p>

            <p className="text-sm text-slate-500">{medico.especializacao}</p>
          </div>
        </div>

        <span
          className={
            medico.atendendo
              ? "bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full"
              : "bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full"
          }
        >
          {medico.atendendo ? "Disponível" : "Indisponível"}
        </span>
      </div>
    );
  });
}

function ListaMedicamentos({ medicamentos }) {
  if (!medicamentos || medicamentos.length === 0) {
    return (
      <div className="py-5 text-center">
        <p className="text-sm text-green-700 font-medium">
          Nenhum medicamento em falta informado no momento.
        </p>
      </div>
    );
  }

  return medicamentos.map((medicamento) => (
    <div key={medicamento.id} className="flex items-center gap-3 py-4">
      <div className="w-10 h-10 shrink-0 rounded-full bg-red-100 flex items-center justify-center">
        💊
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 break-words">
          {medicamento.nome}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {medicamento.dosagem} • {medicamento.forma}
        </p>

        <p className="text-xs text-red-600 mt-1">Em falta</p>
      </div>

      <span className="shrink-0 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
        Indisponível
      </span>
    </div>
  ));
}

export default function DetalhesModal({ unidade, aberto, aoFechar }) {
  if (!unidade) {
    return null;
  }

  const status = unidade.aberto ? "Aberta" : "Fechada";

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          aoFechar();
        }
      }}
      className={`fixed inset-0 z-50 bg-black/40 flex items-end justify-center
        transition-opacity duration-300
        ${aberto ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`w-full max-w-md bg-slate-50 rounded-t-3xl max-h-[92vh] overflow-y-auto
          transition-transform duration-300
          ${aberto ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex justify-center pt-3">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Cabeçalho */}
        <header className="bg-white border-b border-slate-200">
          <div className="px-4 py-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg">
              {unidade.nome_exibicao}
            </h2>

            <button
              onClick={aoFechar}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition"
            >
              ×
            </button>
          </div>
        </header>

        <main className="px-4 py-4 pb-8">
          {/* Informações da unidade */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                🏥
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">
                  {unidade.nome_exibicao}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {unidade.localizacao_exibicao}
                </p>

                {unidade.localizacao_link_mapa && (
                  <a
                    href={unidade.localizacao_link_mapa}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-3 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                  >
                    📍 Ver no Google Maps
                  </a>
                )}

                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span
                    className={`${
                      corStatus[status]
                    } text-xs font-semibold px-3 py-1 rounded-full`}
                  >
                    {status}
                  </span>

                  <span className="text-xs text-slate-600">
                    ◷ {unidade.horario_abertura} - {unidade.horario_fechamento}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 mt-4 pt-3 text-center">
              <p className="text-xs text-slate-500">
                ID da unidade: {unidade.id}
              </p>
            </div>
          </section>

          {/* Fila */}
          <section className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Fila de atendimento
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 rounded-xl py-4 px-2 text-center shadow-sm">
                <div className="text-green-500 text-xl">👥</div>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {unidade.pessoas_fila_atendimento}
                </p>

                <p className="text-[11px] text-slate-600 mt-1">Aguardando</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl py-4 px-2 text-center shadow-sm">
                <div className="text-indigo-500 text-xl">✓</div>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {unidade.pessoas_atendidas}
                </p>

                <p className="text-[11px] text-slate-600 mt-1">
                  Atendidos hoje
                </p>
              </div>
            </div>
          </section>

          {/* Médicos */}
          <section className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Profissionais
            </h3>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4">
              <ListaProfissionais medicos={unidade.medicos} />
            </div>
          </section>

          {/* Medicamentos */}
          <section className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Medicamentos
            </h3>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="divide-y divide-slate-200">
                <ListaMedicamentos medicamentos={unidade.medicamentos} />
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-sm text-blue-600">
                  ⓘ A lista acima mostra os medicamentos cadastrados nesta
                  unidade.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
