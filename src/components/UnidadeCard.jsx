const corStatus = {
  Aberta: "bg-green-100 text-green-700",
  Fechada: "bg-red-100 text-red-700",
};

export default function UnidadeCard({
  id,
  unidade,
  menorFila,
  aoAbrirDetalhes,
}) {
  const fechada = !unidade.aberto;
  const status = unidade.aberto ? "Aberta" : "Fechada";

  return (
    <div className="card-unidade bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      <div className="p-4">
        <div className="flex gap-3">

          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
            🏥
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">

              <h3 className="text-base font-bold text-slate-900">
                {unidade.nome_exibicao}
              </h3>

              {menorFila && !fechada && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                  Menor fila
                </span>
              )}

            </div>

            <p className="text-xs text-slate-500 mt-1">
              {unidade.localizacao_exibicao}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">

              <span
                className={`${
                  corStatus[status]
                } text-[11px] font-semibold px-2.5 py-1 rounded-full`}
              >
                {status}
              </span>

              <span className="text-[11px] text-slate-600">
                ◷ {unidade.horario_abertura} -{" "}
                {unidade.horario_fechamento}
              </span>

            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-slate-200">

        <div className="py-3 px-2 text-center">

          <div
            className={`${
              fechada
                ? "text-slate-400"
                : "text-green-500"
            } text-lg`}
          >
            👥
          </div>

          <p
            className={`text-lg font-bold ${
              fechada
                ? "text-slate-500"
                : "text-slate-900"
            } mt-1`}
          >
            {unidade.pessoas_fila_atendimento}
          </p>

          <p className="text-[10px] text-slate-500">
            na fila
          </p>

        </div>

        <div className="py-3 px-2 text-center border-l border-slate-200">

          <div
            className={`${
              fechada
                ? "text-slate-400"
                : "text-blue-500"
            } text-lg`}
          >
            🩺
          </div>

          <p
            className={`text-lg font-bold ${
              fechada
                ? "text-slate-500"
                : "text-slate-900"
            } mt-1`}
          >
            {unidade.pessoas_atendidas}
          </p>

          <p className="text-[10px] text-slate-500">
            atendidos hoje
          </p>

        </div>

      </div>

      <button
        onClick={() => aoAbrirDetalhes(id)}
        className="w-full bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
      >
        Ver detalhes
        <span className="ml-1">›</span>
      </button>

    </div>
  );
}