export function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 mt-2">{subtitle}</p>
      )}
    </div>
  );
}
