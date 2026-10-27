import type { Plato } from "../../types/plato";

interface PlatosSectionProps {
  platos: Plato[];
}

function PlatosSection({ platos }: PlatosSectionProps) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {platos.map((plato) => (
        <article
          key={plato.plato_id}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#191919]"
        >
          {plato.imagen_url ? (
            <img
              src={plato.imagen_url}
              alt={plato.nombre}
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="flex h-48 items-center justify-center bg-neutral-800 text-neutral-500">
              Sin imagen disponible
            </div>
          )}

          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-400">
                {plato.tipo}
              </span>

              <span className="text-xs text-neutral-500">
                ID: {plato.plato_id}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-bold">{plato.nombre}</h3>

            <p className="mt-2 text-sm leading-6 text-neutral-400">
              {plato.descripcion || "Sin descripción disponible."}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default PlatosSection;
