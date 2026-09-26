import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, CircleDot, Radio, ShieldAlert } from "lucide-react";
import { Device } from "@/components/device";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sesmiopod — Know the risk, before the crisis" },
    { name: "description", content: "Explore Sesmiopod, a concept disaster awareness device. Try its live-weather simulator and discover how it could be built." },
    { property: "og:title", content: "Sesmiopod — Know the risk, before the crisis" },
    { property: "og:description", content: "Explore a concept disaster awareness device, live weather, and interactive risk scenarios." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }
  ] }),
  component: Home,
});

function Home() {
  return <main>
    <section className="hero">
      <div className="hero-inner">
        <SiteHeader light />
        <div className="hero-rail hero-rail-top"><span className="emblem" aria-hidden="true">✳</span><span className="rail-meta">01 / AWARENESS IN YOUR HAND</span></div>
        <div className="hero-word" aria-hidden="true">SESMIOPOD</div>
        <div className="hero-device"><Device /></div>
        <div className="hero-rail hero-rail-bottom"><span className="rail-meta">REAL-TIME ENVIRONMENTAL INTELLIGENCE</span></div>
        <p className="hero-description">A COMPACT DEVICE THAT DETECTS<br />EARLY DISASTER ALERT USING<br />SENSITIVE SENSORS</p>
        <div className="hero-actions">
          <Link to="/simulator" className="hero-action">Explore the simulator <ArrowUpRight size={18} /></Link>
          <Link to="/components" className="hero-text-link">Inside the device <ArrowUpRight size={16} /></Link>
        </div>
        <a href="#overview" className="hero-scroll" aria-label="Scroll to overview"><ArrowDown size={18} /></a>
      </div>
    </section>
    <section className="overview" id="overview">
      <div className="content-container">
        <div className="section-kicker"><CircleDot size={13} /> THE IDEA</div>
        <div className="overview-grid"><h2>Make the invisible<br /><em>impossible to ignore.</em></h2><div><p>Sesmiopod brings environmental signals into one immediate, readable view. From changing weather to nearby seismic activity, the concept is designed to help people understand what is happening around them.</p><p className="fine-print">Concept demonstration. This site does not issue official emergency warnings or predict earthquakes.</p></div></div>
        <div className="overview-links"><Link to="/simulator" className="overview-link"><Radio size={25} /><span><strong>Experience the simulator</strong><small>Live conditions. Hypothetical scenarios.</small></span><ArrowUpRight /></Link><Link to="/components" className="overview-link"><ShieldAlert size={25} /><span><strong>How it could be built</strong><small>A look inside the proposed architecture.</small></span><ArrowUpRight /></Link></div>
      </div>
    </section>
    <footer className="site-footer"><span>SESMIOPOD / CONCEPT PROJECT</span><span>KNOW THE RISK, BEFORE THE CRISIS</span></footer>
  </main>;
}
