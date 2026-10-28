export default function StatsBanner() {
  const stats = [
    { value: "500+", label: "Restaurants" },
    { value: "10K+", label: "Happy customers" },
    { value: "50K+", label: "Orders delivered" },
    { value: "4.9★", label: "Average rating" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-500 p-8 sm:p-12 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                {s.value}
              </p>
              <p className="text-sm text-white/90 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}