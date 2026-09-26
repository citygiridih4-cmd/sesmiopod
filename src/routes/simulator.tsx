import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, ArrowRight, Check, ChevronDown, CloudRain, Droplets, ExternalLink, LocateFixed, MapPin, RefreshCw, Search, Thermometer, Wind, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Device } from "@/components/device";
import { SiteHeader } from "@/components/site-header";
import { getQuakes, getWeather, searchLocations, weatherLabel, type Location } from "@/lib/weather";

export const Route = createFileRoute("/simulator")({
  head: () => ({ meta: [
    { title: "Sesmiopod Simulator — Live Weather & Disaster Scenarios" },
    { name: "description", content: "Explore live weather, recent earthquake reports, derived risk signals, and clearly labeled hypothetical Sesmiopod disaster scenarios." },
    { property: "og:title", content: "Sesmiopod Simulator" },
    { property: "og:description", content: "Test the Sesmiopod concept with live conditions and hypothetical risk scenarios." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }
  ] }), component: Simulator,
});

const initialLocation: Location = { name: "New Delhi", admin1: "Delhi", country: "India", latitude: 28.6139, longitude: 77.2090 };
const scenarios = [
  { id: "live", name: "Live conditions", description: "Observed weather + recent reports", icon: LocateFixed },
  { id: "storm", name: "Severe storm", description: "Hypothetical intense wind and rain", icon: Wind },
  { id: "flood", name: "Flood risk", description: "Hypothetical heavy rainfall", icon: CloudRain },
  { id: "heat", name: "Extreme heat", description: "Hypothetical high heat index", icon: Thermometer },
  { id: "quake", name: "Earthquake", description: "Hypothetical seismic event", icon: Activity },
] as const;
type Scenario = typeof scenarios[number]["id"];

function Simulator() {
  const [location, setLocation] = useState<Location>(initialLocation);
  const [scenario, setScenario] = useState<Scenario>("live");
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [geoError, setGeoError] = useState("");
  useEffect(() => { const id = setTimeout(() => setDebounced(term.trim()), 300); return () => clearTimeout(id); }, [term]);
  const locationResults = useQuery({ queryKey: ["locations", debounced], queryFn: ({ signal }) => searchLocations(debounced, signal), enabled: debounced.length >= 2, staleTime: 300000 });
  const weather = useQuery({ queryKey: ["weather", location.latitude, location.longitude], queryFn: ({ signal }) => getWeather(location, signal), refetchInterval: 300000, staleTime: 120000 });
  const quakes = useQuery({ queryKey: ["quakes", location.latitude, location.longitude], queryFn: ({ signal }) => getQuakes(location, signal), refetchInterval: 300000, staleTime: 120000 });
  const observed = weather.data?.current;
  const forecast = useMemo(() => {
    if (!weather.data) return null;
    const { hourly, current } = weather.data;
    const start = hourly.time.findIndex(t => t >= current.time.slice(0, 13));
    const offset = Math.max(0, start);
    return { chance: Math.max(0, ...hourly.precipitation_probability.slice(offset, offset + 12)), rain: hourly.precipitation.slice(offset, offset + 12).reduce((a, b) => a + b, 0) };
  }, [weather.data]);
  const risk = !observed ? { label: "Awaiting data", level: "normal" as const, explanation: "Waiting for a live observation." } : observed.wind_speed_10m >= 60 ? { label: "Elevated wind", level: "warning" as const, explanation: "Wind speed is at least 60 km/h in the current observation." } : (forecast?.rain ?? 0) >= 30 ? { label: "Elevated rainfall", level: "warning" as const, explanation: "At least 30 mm of rain is forecast over the next 12 hours." } : observed.apparent_temperature >= 40 ? { label: "Elevated heat", level: "warning" as const, explanation: "The current feels-like temperature is at least 40°C." } : { label: "No threshold crossed", level: "normal" as const, explanation: "Wind below 60 km/h, next 12h rain below 30 mm, and feels-like temperature below 40°C." };
  const display = scenario === "storm" ? { headline: "Storm alert", detail: "Severe conditions", risk: "High", temperature: 25.6, mode: "danger" as const, title: "Severe storm scenario", message: "Strong winds and intense rain are simulated. Seek sturdy shelter and avoid exposed areas." } : scenario === "flood" ? { headline: "Flood warning", detail: "Heavy rainfall", risk: "High", temperature: 27.2, mode: "danger" as const, title: "Flood risk scenario", message: "Sustained heavy rainfall is simulated. Avoid low-lying areas and never enter floodwater." } : scenario === "heat" ? { headline: "Heat alert", detail: "Extreme heat", risk: "Elevated", temperature: 43.8, mode: "warning" as const, title: "Extreme heat scenario", message: "Dangerous heat is simulated. Move to a cool place, hydrate, and check on vulnerable people." } : scenario === "quake" ? { headline: "Earthquake", detail: "Strong shaking", risk: "Elevated", temperature: observed?.temperature_2m ?? 32.4, mode: "danger" as const, title: "Earthquake scenario", message: "Strong shaking is simulated. Drop, cover, and hold on; move away from windows." } : { headline: "Environment", detail: weather.data ? weatherLabel(observed?.weather_code ?? 0) : "Checking conditions", risk: risk.level === "warning" ? "Elevated" : "Normal", temperature: observed?.temperature_2m ?? null, mode: risk.level, title: risk.label, message: risk.explanation };
  const updateLocation = (place: Location) => { setLocation(place); setSearchOpen(false); setTerm(""); setGeoError(""); setScenario("live"); };
  const locate = () => {
    if (!navigator.geolocation) { setGeoError("Location is not available in this browser."); return; }
    setGeoError("");
    navigator.geolocation.getCurrentPosition(({ coords }) => updateLocation({ name: "Your location", country: "Current position", latitude: coords.latitude, longitude: coords.longitude }), () => setGeoError("Location access was not granted. Search for a city instead."), { timeout: 10000 });
  };
  return <main className="sim-page">
    <div className="content-container"><SiteHeader />
      <div className="sim-heading"><div><div className="section-kicker"><span className="live-dot" /> INTERACTIVE CONCEPT / 01</div><h1>Read the room.<br /><em>Change the conditions.</em></h1></div><p>See what Sesmiopod could show in changing conditions. Live observations stay separate from simulated alerts.</p></div>
      <div className="sim-toolbar"><div className="location-control"><span className="toolbar-label">LOCATION</span><Button variant="ghost" className="location-button" onClick={() => setSearchOpen(!searchOpen)} aria-expanded={searchOpen}><MapPin size={17} /> <span>{location.name}{location.name === "Your location" ? "" : `, ${location.country}`}</span><ChevronDown size={15} /></Button>
        {searchOpen && <div className="location-popover"><div className="search-row"><Search size={17} /><input autoFocus value={term} onChange={e => setTerm(e.target.value)} placeholder="Search for a city" aria-label="Search for a city" /><Button variant="ghost" size="icon" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={16} /></Button></div><Button variant="ghost" className="use-location" onClick={locate}><LocateFixed size={16} /> Use my location</Button>{geoError && <p className="search-feedback">{geoError}</p>}{debounced.length >= 2 && <div className="search-results">{locationResults.isPending ? <p className="search-feedback">Searching…</p> : locationResults.isError ? <p className="search-feedback">Location search is unavailable right now.</p> : locationResults.data.length === 0 ? <p className="search-feedback">No locations found.</p> : locationResults.data.map((place, index) => <Button variant="ghost" key={`${place.latitude}-${place.longitude}-${index}`} onClick={() => updateLocation(place)}><MapPin size={14} /><span>{place.name}{place.admin1 ? `, ${place.admin1}` : ""} <small>{place.country}</small></span></Button>)}</div>}</div>}
      </div><div className="toolbar-right"><span className="toolbar-label">SOURCE: OPEN-METEO + USGS</span><Button variant="outline" size="icon" title="Refresh live data" aria-label="Refresh live data" onClick={() => { void weather.refetch(); void quakes.refetch(); }} disabled={weather.isFetching || quakes.isFetching}><RefreshCw className={weather.isFetching || quakes.isFetching ? "spin" : ""} size={16} /></Button></div></div>
      <div className="sim-layout"><aside className="scenario-panel"><div className="panel-label">01 / SELECT A MODE</div><h2>Conditions</h2><div className="scenario-list">{scenarios.map(({ id, name, description, icon: Icon }) => <Button key={id} variant="ghost" className={`scenario-item ${scenario === id ? "selected" : ""}`} onClick={() => setScenario(id)} aria-pressed={scenario === id}><span className="scenario-icon"><Icon size={20} strokeWidth={1.7} /></span><span className="scenario-copy"><strong>{name}</strong><small>{description}</small></span>{scenario === id ? <Check size={16} /> : <ArrowRight size={16} />}</Button>)}</div><div className="scenario-note"><AlertTriangle size={16} /><span>Scenarios are hypothetical demonstrations, not real emergency warnings.</span></div></aside>
      <section className="sim-stage" aria-label="Device simulation"><div className="sim-stage-top"><span>SESMIOPOD / LIVE PREVIEW</span><span className="stage-indicator"><span className={scenario === "live" ? "live-dot" : "demo-dot"} /> {scenario === "live" ? "LIVE MODE" : "SIMULATION"}</span></div><div className="stage-device"><Device key={scenario} compact temperature={display.temperature} headline={display.headline} detail={display.detail} risk={display.risk} mode={display.mode} /></div><div className="sim-stage-bottom"><span>DEVICE STATUS / {display.mode === "normal" ? "NORMAL" : "ATTENTION"}</span><span>CONCEPT PROTOTYPE / NOT A PHYSICAL DEVICE</span></div></section>
      <aside className="readings-panel"><div className="panel-label">02 / CURRENT READOUT</div><h2>{scenario === "live" ? "Observed now" : "Simulated event"}</h2><div className={`alert-readout ${display.mode}`}><div className="alert-label"><span className={scenario === "live" ? "live-dot" : "demo-dot"} /> {scenario === "live" ? "DERIVED INDICATOR" : "HYPOTHETICAL ALERT"}</div><h3>{display.title}</h3><p>{display.message}</p></div>{scenario === "live" ? <><div className="reading-list"><div><span><Thermometer size={17} /> Temperature</span><strong>{observed ? `${observed.temperature_2m.toFixed(1)}°C` : "—"}</strong></div><div><span><Droplets size={17} /> Humidity</span><strong>{observed ? `${observed.relative_humidity_2m}%` : "—"}</strong></div><div><span><Wind size={17} /> Wind speed</span><strong>{observed ? `${observed.wind_speed_10m.toFixed(1)} km/h` : "—"}</strong></div><div><span><CloudRain size={17} /> Rain chance / 12h</span><strong>{forecast ? `${forecast.chance}%` : "—"}</strong></div><div><span><CloudRain size={17} /> Forecast rain / 12h</span><strong>{forecast ? `${forecast.rain.toFixed(1)} mm` : "—"}</strong></div></div>{weather.isPending && <p className="data-note">Loading live weather…</p>}{weather.isError && <p className="data-error" role="alert">Live weather could not load. Try refreshing.</p>}<p className="data-note">Weather: Open-Meteo · observed {observed ? `${observed.time.replace("T", " ")} (${weather.data?.timezone})` : "not available"}</p></> : <div className="simulated-details"><span>SCENARIO INPUT</span><strong>{scenario === "storm" ? "Wind 88 km/h · rain 42 mm/h" : scenario === "flood" ? "Rain 74 mm / 12h" : scenario === "heat" ? "Feels like 47°C" : "Hypothetical strong shaking"}</strong><small>These values are invented for testing; they are not local measurements.</small></div>}</aside></div>
      <div className="sim-lower"><section className="quake-panel"><div className="panel-label">03 / RECENT SEISMIC REPORTS</div><h2>Nearby activity <span>Within 500 km · past 7 days</span></h2>{quakes.isPending ? <p className="data-note">Checking recent reports…</p> : quakes.isError ? <p className="data-error" role="alert">Recent earthquake reports are unavailable right now.</p> : quakes.data.length === 0 ? <p className="data-note">No earthquakes reported within 500 km in the past seven days.</p> : <div className="quake-list">{quakes.data.slice(0, 3).map(quake => <a href={quake.properties.url} target="_blank" rel="noopener noreferrer" key={quake.id}><span className="quake-mag">M {quake.properties.mag?.toFixed(1) ?? "?"}</span><span className="quake-place">{quake.properties.place}<small>{new Date(quake.properties.time).toLocaleString()}</small></span><ExternalLink size={16} /></a>)}</div>}<p className="data-note">Source: USGS Earthquake Hazards Program. Recent reports are not earthquake predictions.</p></section><section className="threshold-panel"><div className="panel-label">04 / HOW THE SIGNAL WORKS</div><h2>Simple thresholds.<br />Clear context.</h2><p>The live indicator highlights wind ≥ 60 km/h, forecast rain ≥ 30 mm over 12 hours, or feels-like temperature ≥ 40°C. These are illustrative thresholds, not official warning criteria.</p><p className="data-note">For real emergencies, follow your local weather agency and emergency services. This concept cannot predict disasters.</p></section></div>
    </div><footer className="site-footer"><span>SESMIOPOD / CONCEPT PROJECT</span><span>NOT AN OFFICIAL ALERT SERVICE</span></footer>
  </main>;
}
