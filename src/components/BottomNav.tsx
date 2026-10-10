"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Galeri", icon: "🖼️" },
  { href: "/map", label: "Peta", icon: "🗺️" },
  { href: "/upload", label: "Tambah", icon: "📷" },
];

export default function BottomNav() {
  return <NavBar pathname={usePathname()} />;
}

// Rendered without a pathname as the Suspense fallback on dynamic routes.
export function NavBar({ pathname }: { pathname: string | null }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1000] border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : !!pathname?.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex h-16 flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
