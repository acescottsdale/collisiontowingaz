import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";

type Marker = { name: string; coordinates: [number, number] };

type ShopLocation = {
  name: string;
  coordinates: [number, number];
  address?: string;
  phone?: string;
};

type LocationDetails = {
  coords: [number, number];
  address?: string;
  distanceToShopKm?: number;
  nearestCity?: { name: string; distanceKm: number };
};

interface MapProps {
  shopLocation?: ShopLocation;
  onUserLocation?: (details: LocationDetails) => void;
}

const phoenixCenter: [number, number] = [-112.074, 33.4484];
const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2FnaS1haXJ0YXhpLWlsIiwiYSI6ImNseDkzZXM2eDA1a3gya3FrdGF0OWhmc3AifQ.7oZfKX2iCD9AIa0JjPeA8Q";

const markers: Marker[] = [
  { name: "Phoenix", coordinates: [-112.074, 33.4484] },
  { name: "Mesa", coordinates: [-111.8315, 33.4152] },
  { name: "Chandler", coordinates: [-111.8413, 33.3062] },
  { name: "Scottsdale", coordinates: [-111.9261, 33.4942] },
  { name: "Glendale", coordinates: [-112.18599, 33.5387] },
  { name: "Gilbert", coordinates: [-111.789, 33.3528] },
  { name: "Tempe", coordinates: [-111.94, 33.4255] },
  { name: "Peoria", coordinates: [-112.2374, 33.5806] },
  { name: "Surprise", coordinates: [-112.451, 33.6292] },
  { name: "Avondale", coordinates: [-112.3496, 33.4356] },
  { name: "Goodyear", coordinates: [-112.3577, 33.4353] },
  { name: "Buckeye", coordinates: [-112.5863, 33.3703] },
  { name: "Queen Creek", coordinates: [-111.6343, 33.2487] },
  { name: "Apache Junction", coordinates: [-111.5496, 33.415] },
  { name: "Paradise Valley", coordinates: [-111.951, 33.5312] },
  { name: "Fountain Hills", coordinates: [-111.722, 33.604] },
  { name: "El Mirage", coordinates: [-112.3246, 33.6131] },
  { name: "Tolleson", coordinates: [-112.2557, 33.45] },
  { name: "Maricopa", coordinates: [-112.0476, 33.0581] },
  { name: "Casa Grande", coordinates: [-111.7574, 32.8795] },
];

const Map: React.FC<MapProps> = ({ shopLocation, onUserLocation }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { resolvedTheme } = useTheme();
  const shopRef = useRef<ShopLocation | undefined>(shopLocation);
  const onLocRef = useRef<typeof onUserLocation>(onUserLocation);
  const didLocateRef = useRef(false);

  useEffect(() => {
    shopRef.current = shopLocation;
    onLocRef.current = onUserLocation;
  }, [shopLocation, onUserLocation]);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        resolvedTheme === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/light-v11",
      center: phoenixCenter,
      zoom: 10,
      pitch: 0,
      bearing: 0,
      attributionControl: true,
    });
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: false }),
      "top-right"
    );
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: false,
      showAccuracyCircle: false,
    });
    map.addControl(geolocate, "top-right");
    map.scrollZoom.disable();

    map.on("load", () => {
      // city markers
      markers.forEach((m) => {
        new mapboxgl.Marker({ color: "#E21B5A" })
          .setLngLat(m.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 8 }).setText(m.name))
          .addTo(map);
      });

      // shop marker
      const shop = shopRef.current;
      if (shop) {
        const el = document.createElement("div");
        el.className =
          "relative h-4 w-4 -translate-y-1 rounded-full bg-primary ring-4 ring-primary/30 shadow-lg";
        new mapboxgl.Marker({ element: el })
          .setLngLat(shop.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 10 }).setHTML(
              `<div style="font-size:13px;line-height:1.2">
                <strong>${shop.name}</strong><br/>
                ${shop.address ? `${shop.address}<br/>` : ""}
                ${
                  shop.phone
                    ? `<a href="tel:${shop.phone.replace(
                        /[^\d+]/g,
                        ""
                      )}">Call ${shop.phone}</a>`
                    : ""
                }
              </div>`
            )
          )
          .addTo(map);
      }

      // user geolocation handler
      const handleLocated = async (coords: [number, number]) => {
        if (didLocateRef.current) return;
        didLocateRef.current = true;

        const userEl = document.createElement("div");
        userEl.className =
          "relative h-3 w-3 -translate-y-1 rounded-full bg-blue-600 ring-4 ring-blue-600/30 shadow-md";
        new mapboxgl.Marker({ element: userEl }).setLngLat(coords).addTo(map);

        const toRad = (v: number) => (v * Math.PI) / 180;
        const distanceKm = (a: [number, number], b: [number, number]) => {
          const R = 6371;
          const dLat = toRad(b[1] - a[1]);
          const dLng = toRad(b[0] - a[0]);
          const lat1 = toRad(a[1]);
          const lat2 = toRad(b[1]);
          const s1 = Math.sin(dLat / 2);
          const s2 = Math.sin(dLng / 2);
          const h = s1 * s1 + Math.cos(lat1) * Math.cos(lat2) * s2 * s2;
          return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
        };

        const shopCoords = (shopRef.current?.coordinates ?? phoenixCenter) as [
          number,
          number
        ];
        const distanceToShopKm =
          Math.round(distanceKm(coords, shopCoords) * 10) / 10;
        let nearestCity = markers[0];
        let nearestDist = distanceKm(coords, markers[0].coordinates);
        for (let i = 1; i < markers.length; i++) {
          const d = distanceKm(coords, markers[i].coordinates);
          if (d < nearestDist) {
            nearestCity = markers[i];
            nearestDist = d;
          }
        }

        let address: string | undefined;
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${MAPBOX_TOKEN}`
          );
          const json = await res.json();
          address = json?.features?.[0]?.place_name as string | undefined;
        } catch {
          // ignore reverse geocoding errors
        }

        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(coords);
        bounds.extend(shopCoords);
        map.fitBounds(bounds, { padding: 48, maxZoom: 12, duration: 800 });

        onLocRef.current?.({
          coords,
          address,
          distanceToShopKm,
          nearestCity: {
            name: nearestCity.name,
            distanceKm: Math.round(nearestDist * 10) / 10,
          },
        });
      };

      geolocate.on("geolocate", (e: GeolocationPosition) => {
        handleLocated([e.coords.longitude, e.coords.latitude]);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => handleLocated([pos.coords.longitude, pos.coords.latitude]),
          () => {},
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    });

    return () => map.remove();
  }, [resolvedTheme]);

  return (
    <div
      className="relative w-full h-full"
      aria-label="Service areas coverage map"
    >
      <div
        ref={mapContainer}
        className="absolute inset-0 overflow-hidden rounded-xl shadow-premium"
      />
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-background/10" />
    </div>
  );
};

export default Map;
