import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);       // send lat/lng to parent
      map.flyTo(e.latlng, 17);  // Zoom into selected location
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon}>
      <Popup>
        Latitude: {position.lat.toFixed(5)}, Longitude: {position.lng.toFixed(5)}
      </Popup>
    </Marker>
  );
}

export default function MapSelector({ onLocationSelect }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Default center: India
      zoom={5}                    // Initial zoom (country-level)
      style={{ height: "400px", width: "100%", marginBottom: "20px" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        // High-detail tiles for street-level visibility
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker onSelect={onLocationSelect} />
    </MapContainer>
  );
}
