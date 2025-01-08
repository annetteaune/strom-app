import Credit from "../Credit";

interface FooterProps {
  showMVA: boolean;
}

export default function Footer({ showMVA }: FooterProps) {
  return (
    <footer>
      <Credit />
      <p>
        {showMVA
          ? "Priser er vist inkl. MVA, men uten andre avgifter og strømstøtte."
          : "Priser vist er uten MVA, avgifter og strømstøtte."}
      </p>
    </footer>
  );
}
