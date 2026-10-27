import type { Menu } from "../../services/catalogoService";

interface MenuCardProps {
  menu: Menu;
  alElegir: (menu: Menu) => void;
  formatearFecha: (fecha: string) => string;
}

function MenuCard({ menu, alElegir, formatearFecha }: MenuCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#191919]">
      {menu.imagen_url ? (
        <img
          src={menu.imagen_url}
          alt={menu.plato_principal?.nombre ?? "Menú del día"}
          className="h-52 w-full object-cover"
        />
      ) : (
        <div className="flex h-52 items-center justify-center bg-neutral-800 text-neutral-500">
          Sin imagen disponible
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
            Menú del día
          </span>

          <span className="text-xs text-neutral-400">
            {menu.cantidad_disponible > 0
              ? `${menu.cantidad_disponible} disponibles`
              : "Agotado"}
          </span>
        </div>

        <h3 className="mt-2 text-xl font-bold">
          {menu.plato_principal?.nombre ?? "Plato principal"}
        </h3>

        {menu.plato_principal?.descripcion && (
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            {menu.plato_principal.descripcion}
          </p>
        )}

        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
          {menu.bebida && (
            <p className="text-neutral-300">
              <span className="text-neutral-500">Bebida:</span>{" "}
              {menu.bebida.nombre}
            </p>
          )}

          {menu.postre && (
            <p className="text-neutral-300">
              <span className="text-neutral-500">Postre:</span>{" "}
              {menu.postre.nombre}
            </p>
          )}

          <p className="pt-2 text-xs text-neutral-500">
            Fecha: {formatearFecha(menu.fecha)}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-2xl font-bold text-orange-400">
            Bs {Number(menu.precio_menu).toFixed(2)}
          </p>

          <button
            type="button"
            disabled={menu.cantidad_disponible <= 0}
            onClick={() => alElegir(menu)}
            className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Elegir menú
          </button>
        </div>
      </div>
    </article>
  );
}

export default MenuCard;
