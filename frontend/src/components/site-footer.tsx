/** Site-wide footer shell. Content intentionally blank for now. */
export function SiteFooter({ className = "" }: { className?: string }) {
  return <footer className={`site-footer-shell ${className}`.trim()} aria-label="Site footer" />;
}
