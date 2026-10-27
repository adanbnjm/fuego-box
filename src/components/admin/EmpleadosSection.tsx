interface Empleado {
  usuario_id: number;
  email: string;
  nombre_completo: string;
  telefono: string | null;
  rol_id: number;
  rol_nombre: string;
  zona_reparto_id: number | null;
  zona_nombre: string | null;
}

interface EmpleadosSectionProps {
  empleados: Empleado[];
}

function EmpleadosSection({ empleados }: EmpleadosSectionProps) {
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Equipo de FUEGOBOX</h3>
          <p className="mt-1 text-sm text-gray-400">
            Personal registrado en la plataforma.
          </p>
        </div>

        <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-400">
          {empleados.length} usuarios registrados
        </span>
      </div>

      {empleados.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#191919] p-10 text-center text-gray-400">
          No hay empleados registrados.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {empleados.map((empleado) => (
            <article
              key={empleado.usuario_id}
              className="rounded-2xl border border-white/10 bg-[#191919] p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-xl font-bold text-orange-400">
                  {(empleado.nombre_completo ?? "E")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                    {empleado.rol_nombre}
                  </span>

                  <h4 className="mt-2 break-words text-lg font-bold">
                    {empleado.nombre_completo}
                  </h4>

                  <p className="mt-1 break-all text-sm text-gray-400">
                    {empleado.email}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Teléfono
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    {empleado.telefono || "No registrado"}
                  </p>
                </div>

                {empleado.rol_nombre.toLowerCase() === "delivery" && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Zona de reparto
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      {empleado.zona_nombre || "Sin zona asignada"}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  ID de usuario: #{empleado.usuario_id}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default EmpleadosSection;
