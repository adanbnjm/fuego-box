function CocinaPage() {
  return (
    <main className="min-h-screen bg-[#101010] p-8 text-white">
      <p className="text-sm font-bold tracking-[0.25em] text-orange-500">
        FUEGOBOX
      </p>
      <h1 className="mt-3 text-3xl font-bold">Panel de cocina</h1>
      <p className="mt-2 text-neutral-400">
        Aquí podrás consultar los pedidos pendientes y actualizar sus estados.
      </p>

      <section className="mt-8 rounded-2xl border border-white/10 bg-[#191919] p-6">
        <h2 className="text-xl font-semibold">Pedidos de cocina</h2>
        <p className="mt-3 text-sm text-neutral-400">
          En el siguiente paso conectaremos este panel con la API.
        </p>
      </section>
    </main>
  );
}

export default CocinaPage;
