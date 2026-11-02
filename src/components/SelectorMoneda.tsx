import { useMoneda } from "../hooks/useMoneda";

export function SelectorMoneda() {
  const { moneda, cambiarMoneda, bsPorDolar } = useMoneda();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-orange-400">
        {moneda === "BOB" ? "Ver en USD" : "Ver en BOB"}
      </span>

      <button
        type="button"
        onClick={cambiarMoneda}
        disabled={bsPorDolar === null}
        title="Cambiar moneda"
        aria-label="Cambiar moneda"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/40 text-xl font-bold text-orange-400 transition hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        $
      </button>
    </div>
  );
}
