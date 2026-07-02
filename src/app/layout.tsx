// Root layout is intentionally a pass-through: the <html>/<body> live in
// app/[locale]/layout.tsx (locale-aware), and app/not-found.tsx renders its own.
// This root exists only so the global not-found has a root layout to attach to.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
