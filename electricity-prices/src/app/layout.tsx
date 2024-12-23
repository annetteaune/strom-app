import type { Metadata } from "next";
import "./styles/main.scss";

export const metadata: Metadata = {
  title: "Strøpris",
  description: "Dagens strømpriser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
