import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imerge Corporate Center | Guatemala",
  description: "Espacios, tecnología y experiencias para eventos que dejan marca."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
