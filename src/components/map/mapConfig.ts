export const MAPLIBRE_STYLE = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster",
      source: "osm-tiles",
    },
  ],
};

export const DEFAULT_CAMERA = {
  center: {
    latitude: 24.4539,
    longitude: 54.3773,
  },
  zoom: 14.5,
};

export function regionToCamera(region: {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}): { center: { latitude: number; longitude: number }; zoom: number } {
  const avgDelta = (region.latitudeDelta + region.longitudeDelta) / 2;
  const zoom = Math.max(2, Math.min(22, 14 - Math.log2(avgDelta)));
  return {
    center: {
      latitude: region.latitude,
      longitude: region.longitude,
    },
    zoom,
  };
}

export function deltaToZoom(delta: number): number {
  return Math.max(2, Math.min(22, 14 - Math.log2(delta)));
}
