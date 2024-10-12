import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface Location {
  label: string;
  lat: string;
  lng: string;
  states?: {
    label: string;
    lat: string;
    lng: string;
    lgas: any[];
  }[];
}

interface LocationMapProps {
  locations: Location[];
}

const LocationMap: React.FC<LocationMapProps> = ({ locations }) => {
  // Find the center of the map (using the first location)
  const center: [number, number] =
    locations?.length > 0
      ? [parseFloat(locations[0]?.lat), parseFloat(locations[0]?.lng)]
      : [0, 0];

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: "200px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations?.map((location, index) => (
        <React.Fragment key={index}>
          <Marker
            position={[parseFloat(location?.lat), parseFloat(location?.lng)]}
          >
            <Popup>{location?.label}</Popup>
          </Marker>
          {location?.states?.map((state, stateIndex) => (
            <Marker
              key={`${index}-${stateIndex}`}
              position={[parseFloat(state.lat), parseFloat(state.lng)]}
            >
              <Popup>{state.label}</Popup>
            </Marker>
          ))}
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default LocationMap;
