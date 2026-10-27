interface MenuDia {
  menu_dia_id: number;
  fecha: string;
  plato_principal_id: number;
  bebida_id: number | null;
  postre_id: number | null;
  cantidad_disponible: number;
  precio_menu: string;
  imagen_url: string | null;
  publicado: boolean;
}

interface MenusSectionProps {
  menus: MenuDia[];
  formatearFecha: (fecha: string) => string;
}

function MenusSection({ menus, formatearFecha }: MenusSectionProps) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {menus.map((menu) => (
        <article
          key={menu.menu_dia_id}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#191919]"
        >
          {menu.imagen_url ? (
            <img
              src={menu.imagen_url}
              alt={`Menú del ${formatearFecha(menu.fecha)}`}
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="flex h-48 items-center justify-center bg-neutral-800 text-neutral-500">
              Sin imagen disponible
            </div>
          )}

          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  menu.publicado
                    ? "bg-green-500/15 text-green-400"
                    : "bg-neutral-500/15 text-neutral-400"
                }`}
              >
                {menu.publicado ? "Publicado" : "No publicado"}
              </span>

              <span className="text-xs text-neutral-500">
                ID: {menu.menu_dia_id}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-bold">
              Menú del {formatearFecha(menu.fecha)}
            </h3>

            <p className="mt-3 text-2xl font-black text-orange-400">
              Bs {Number(menu.precio_menu).toFixed(2)}
            </p>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-neutral-400">
              <p>Plato principal ID: {menu.plato_principal_id}</p>
              <p>Bebida ID: {menu.bebida_id ?? "Sin bebida"}</p>
              <p>Postre ID: {menu.postre_id ?? "Sin postre"}</p>
              <p>Disponibles: {menu.cantidad_disponible}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default MenusSection;
