# Sesmiopod website and device simulator

## What visitors will get
- A Sesmiopod home page that closely reproduces the supplied desktop composition: full cyan backdrop, white condensed labels and UCET mark, translucent outlined bars, giant pale SESMIOPOD wordmark, and the large angled white device over it. Recreate these as responsive interface elements rather than embedding the entire screenshot.
- Smooth, continuous entrance and ambient motion for the device and supporting interface, subtle state transitions throughout the simulator, and reduced-motion support. The product and text remain readable during animation.
- A dedicated **Simulator** where visitors choose a location, see live current weather and short-range forecast readings, and switch among normal, severe-weather, flood-risk, heat, and earthquake scenarios. The on-screen device display, status, readings, and alert explanation update together.
- A dedicated **How it’s built** page explaining a *proposed* sensor, processor, connectivity, power, display, and alert architecture, with a clear flow from measurement to warning. No unprovided hardware specification will be presented as fact.

## Alert integrity
- Fetch live weather from a public weather/geocoding service and recent earthquakes from a public seismic feed. Label their source and update time; handle unavailable data visibly.
- Distinguish three things in the interface: **observed live conditions**, **derived risk indicators** based on stated thresholds, and **simulated scenarios**. Simulated alerts never masquerade as a real warning or an official emergency notice.
- Include a concise safety note that this concept demo is not a substitute for official emergency services or local alerts.

## Technical approach
- Build responsive, accessible pages at `/`, `/simulator`, and `/components` using the existing TanStack Start app and semantic design tokens.
- Use browser-side public data requests for location search and weather/seismic feeds, with sensible loading, empty, failure, and refresh states; no account or persistent storage is required for this demo.
- Recreate the device faithfully as a separate visual element with a live interactive dark display, keeping the original reference’s white shell, orientation, proportions, and emergency-readout language. Adapt the same visual language to mobile without overlap.
- Add unique titles and sharing descriptions to each page, and check desktop/mobile layouts and simulator interactions in the running preview.
