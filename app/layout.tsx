import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Madurez y adopción de AI",
  description: "Exploración interactiva basada en respuestas de clase"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
