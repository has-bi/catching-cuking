export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
    </header>
  );
}
