import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, ArrowUpRight, BatteryCharging, BellRing, Cpu, Monitor, RadioTower, Thermometer, Waves } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Device } from "@/components/device";

export const Route = createFileRoute("/components")({
  head: () => ({ meta: [
    { title: "How Sesmiopod Could Be Built — Proposed Components" },
    { name: "description", content: "Explore the proposed sensors, processing, connectivity, power, and warning flow behind the Sesmiopod concept." },
    { property: "og:title", content: "Inside Sesmiopod — Proposed Components" },
    { property: "og:description", content: "A transparent look at the proposed Sesmiopod hardware and how observations become alerts." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }
  ] }), component: ComponentsPage,
});

const parts = [
  { number: "01", icon: Thermometer, title: "Environmental sensors", body: "Temperature, humidity, barometric pressure, and rain sensors would track local conditions at the device." },
  { number: "02", icon: Activity, title: "Motion sensing", body: "An accelerometer could register local movement. It cannot predict an earthquake; verified earthquake reports need an external seismic source." },
  { number: "03", icon: Cpu, title: "Processing unit", body: "A low-power microcontroller would read sensors, filter noise, compare thresholds, and coordinate the screen and alerts." },
  { number: "04", icon: RadioTower, title: "Connectivity", body: "Wi-Fi or cellular connectivity would bring in weather forecasts and trusted external reports, and keep information current." },
  { number: "05", icon: BatteryCharging, title: "Power system", body: "A rechargeable battery and power-management circuit would keep the handheld concept operating between charges." },
  { number: "06", icon: Monitor, title: "Display & alerts", body: "A compact display, indicator, and sound or vibration would turn raw readings into plain-language status and warnings." },
];
function ComponentsPage() {
  return <main className="interior-page">
    <div className="interior-top"><div className="content-container"><SiteHeader /><div className="page-heading"><div className="section-kicker"><Waves size={13} /> UNDER THE SHELL / CONCEPT 02</div><h1>Built to sense.<br /><em>Designed to respond.</em></h1><p>A proposed blueprint for the device in our vision. These components are illustrative, not a confirmed production specification.</p></div></div></div>
    <section className="components-section content-container"><div className="components-intro"><span className="section-kicker">THE SYSTEM / 06 LAYERS</span><h2>From signal<br />to clarity.</h2><p>Each layer has one job: observe, understand, connect, and communicate. Together, they form a possible path from environmental change to a useful response.</p></div><div className="parts-grid">{parts.map((part) => <article className="part" key={part.number}><div className="part-top"><span>{part.number} / 06</span><part.icon size={26} strokeWidth={1.5} /></div><h3>{part.title}</h3><p>{part.body}</p></article>)}</div></section>
    <section className="flow-section"><div className="content-container"><div className="section-kicker">THE INFORMATION FLOW</div><h2>Read. Interpret. Inform.</h2><div className="flow-steps"><div><Thermometer /><strong>Sense</strong><span>Local environmental readings</span></div><ArrowRight className="flow-arrow" /><div><Cpu /><strong>Evaluate</strong><span>Thresholds and external context</span></div><ArrowRight className="flow-arrow" /><div><BellRing /><strong>Communicate</strong><span>Clear, labeled status and alerts</span></div></div><p className="fine-print">Safety-critical alerts would require validated sensors, reliable connectivity, and official sources. This site demonstrates an idea, not a certified warning system.</p></div></section>
    <section className="components-outro"><div className="content-container outro-grid"><div><span className="section-kicker">SEE IT IN ACTION</span><h2>Now put the idea<br />to the test.</h2><Link to="/simulator" className="dark-cta">Launch simulator <ArrowUpRight size={18} /></Link></div><div className="outro-device"><Device compact /></div></div></section>
    <footer className="site-footer"><span>SESMIOPOD / CONCEPT PROJECT</span><Link to="/">BACK TO HOME ↑</Link></footer>
  </main>;
}
