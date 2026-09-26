import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function SiteHeader({ light = false }: { light?: boolean }) {
  return <header className={`site-header ${light ? "site-header-light" : ""}`}>
    <Link to="/" className="brand">SESMIOPOD</Link>
    <span className="site-motto">KNOW THE RISK, BEFORE THE CRISIS</span>
    <nav aria-label="Main navigation" className="site-nav">
      <Link to="/simulator" activeProps={{ className: "nav-active" }}>Simulator <ArrowUpRight size={14} /></Link>
      <Link to="/components" activeProps={{ className: "nav-active" }}>How it’s built <ArrowUpRight size={14} /></Link>
    </nav>
    <div className="ucet-mark">UCET</div>
  </header>;
}
