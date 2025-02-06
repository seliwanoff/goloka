import { FC, useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Polygon,
  Polyline,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

interface RawCoordinate {
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

interface MapWidgetProps {
  coordinates?: RawCoordinate[] | null;
  shapeType: "polygon" | "line";
}

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const GoogleMapWidget: FC<MapWidgetProps> = ({ coordinates, shapeType }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);

  // ✅ Normalize coordinates (convert `latitude` → `lat` and `longitude` → `lng`)
  const validCoordinates = (coordinates || []).map((coord) => ({
    lat: coord.lat ?? coord.latitude ?? 0,
    lng: coord.lng ?? coord.longitude ?? 0,
  }));

  console.log(validCoordinates);

  useEffect(() => {
    if (validCoordinates.length > 0 && isLoaded) {
      setMapCenter(validCoordinates[0]);

      if (mapRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        validCoordinates.forEach((coord) => bounds.extend(coord));
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [validCoordinates, shapeType, isLoaded]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={12}
      onLoad={handleMapLoad}
    >
      {validCoordinates.map((coord, index) => (
        <Marker key={index} position={coord} />
      ))}

      {shapeType === "line" ? (
        <Polyline
          path={validCoordinates}
          options={{ strokeColor: "#FF0000", strokeWeight: 3 }}
        />
      ) : (
        <Polygon
          paths={validCoordinates}
          options={{
            fillColor: "#FF0000",
            fillOpacity: 0.3,
            strokeColor: "#FF0000",
            strokeWeight: 2,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default GoogleMapWidget;
