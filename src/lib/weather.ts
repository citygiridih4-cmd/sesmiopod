export type Location = { name: string; country: string; admin1?: string; latitude: number; longitude: number };
export type WeatherData = {
  current: { time: string; temperature_2m: number; relative_humidity_2m: number; apparent_temperature: number; precipitation: number; weather_code: number; wind_speed_10m: number };
  current_units: { temperature_2m: string; wind_speed_10m: string; precipitation: string };
  hourly: { time: string[]; precipitation_probability: number[]; precipitation: number[]; temperature_2m: number[] };
  timezone: string;
};
export type Quake = { id: string; properties: { mag: number | null; place: string; time: number; url: string }; geometry: { coordinates: number[] } };
export async function searchLocations(query: string, signal?: AbortSignal): Promise<Location[]> {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`, { signal });
  if (!response.ok) throw new Error("Location search is unavailable right now.");
  const json = await response.json();
  return (json.results ?? []) as Location[];
}
export async function getWeather(location: Location, signal?: AbortSignal): Promise<WeatherData> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m", hourly: "precipitation_probability,precipitation,temperature_2m", forecast_days: "2", timezone: "auto" }).toString();
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Live weather is unavailable right now.");
  return response.json() as Promise<WeatherData>;
}
export async function getQuakes(location: Location, signal?: AbortSignal): Promise<Quake[]> {
  const start = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);
  const url = new URL("https://earthquake.usgs.gov/fdsnws/event/1/query");
  url.search = new URLSearchParams({ format: "geojson", latitude: String(location.latitude), longitude: String(location.longitude), maxradiuskm: "500", starttime: start, orderby: "time", limit: "5" }).toString();
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Recent earthquake data is unavailable right now.");
  const data = await response.json();
  return (data.features ?? []) as Quake[];
}
export function weatherLabel(code: number) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}
