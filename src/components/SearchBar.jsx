export default function SearchBar({ valor, aoAlterar }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-slate-900">Selecione a unidade de saúde</h2>

      <p className="text-sm text-slate-500 mt-1">
        Confira as informações e escolha a melhor opção para você.
      </p>

      <div className="relative mt-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>

        <input
          type="text"
          value={valor}
          onChange={(e) => aoAlterar(e.target.value)}
          placeholder="Buscar unidade ou bairro..."
          className="w-full bg-white border border-slate-200 rounded-xl
                     py-3 pl-10 pr-4 text-sm text-slate-700
                     outline-none focus:border-blue-400
                     focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>
    </div>
  );
}
