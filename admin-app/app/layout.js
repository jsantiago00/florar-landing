import "./globals.css";

export const metadata = {
  title: "Florar - Admin",
  description: "Panel de administración de los links de Florar"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
