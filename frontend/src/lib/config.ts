export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return (configured || "http://localhost:8080").replace(/\/$/, "");
}

export function getPortfolioUserName() {
  return process.env.NEXT_PUBLIC_PORTFOLIO_USERNAME?.trim() ?? "";
}
