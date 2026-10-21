import type { Metadata } from "next";
import { PublicPortfolio } from "@/components/portfolio/public-portfolio";

export const metadata: Metadata = {
  title: { absolute: "manoj.dossier" },
  description: "Professional portfolio.",
};

export default function HomePage() {
  return <PublicPortfolio />;
}
