import { Activity, BatteryFull, CloudRain, Mountain, Thermometer, Wifi, Wind } from "lucide-react";

type DeviceProps = {
  temperature?: number | null;
  risk?: string;
  headline?: string;
  detail?: string;
  mode?: "normal" | "warning" | "danger";
  compact?: boolean;
};

export function Device({ temperature = 32.4, risk = "Normal", headline = "Earthquake", detail = "Low Activity", mode = "normal", compact = false }: DeviceProps) {
  return (
    <div className={`device-wrap ${compact ? "device-wrap-compact" : ""}`} aria-label={`Sesmiopod device display: ${headline}, ${detail}; ${risk} risk`}>
      <div className="device-shell">
        <div className="device-screen">
          <div className="screen-top"><span>GeoSense</span><span className="flex items-center gap-1"><BatteryFull size={12} /> 78% <Wifi size={12} /></span></div>
          <div className="screen-grid">
            <div className="screen-main">
              <Activity className={`screen-wave ${mode === "normal" ? "text-signal" : "text-alert"}`} strokeWidth={1.4} />
              <strong>{headline}</strong><small>{detail}</small>
            </div>
            <div className="screen-side">
              <div><Thermometer className="text-screen-muted" size={19} /><span><strong>{temperature == null ? "--" : temperature.toFixed(1)}°C</strong><small>Temp. nearby</small></span></div>
              <div><CloudRain className="text-sky" size={19} /><span><strong>{risk}</strong><small>Flood risk</small></span></div>
              <div><Mountain className="text-screen-muted" size={19} /><span><strong>{mode === "normal" ? "Low" : "Elevated"}</strong><small>Hazard level</small></span></div>
            </div>
          </div>
          <div className="screen-status"><span className={`status-led ${mode}`} /><span>{mode === "normal" ? "All systems normal" : mode === "danger" ? "Take precautions now" : "Conditions need attention"}</span><Wind size={12} /></div>
        </div>
        <div className="device-slit" />
        <div className="device-button"><div /></div>
      </div>
    </div>
  );
}
