import { useEffect } from "react";

export default function Modal({ aberto, titulo, aoFechar, children }) {
  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento) {
      if (evento.key === "Escape") aoFechar();
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoFechar]);

  return (
    <div
      inert={!aberto}
      onClick={(e) => e.target === e.currentTarget && aoFechar()}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300 ${
        aberto ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 ${
          aberto ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-8"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{titulo}</h2>

          <button
            autoFocus={aberto}
            onClick={aoFechar}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
