import type { Metadata } from "next";
import "./styles/main.scss";

export const metadata: Metadata = {
  title: "Strømpris",
  description: "Dagens strømpriser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body>{children}</body>
    </html>
  );
}
