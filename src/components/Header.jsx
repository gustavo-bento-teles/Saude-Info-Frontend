export default function Header() {
  return (
    <header className="bg-blue-600 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Saúde Info</h1>
          <p className="text-sm text-blue-100">Informações das unidades de saúde</p>
        </div>

        <div className="text-xs text-blue-100 text-right">
          Portal do
          <br />
          Cidadão
        </div>
      </div>
    </header>
  );
}
