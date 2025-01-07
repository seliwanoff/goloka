import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Define interfaces for the location data
interface LGA {
  label: string;
  lat: string;
  lng: string;
}

interface State {
  label: string;
  lat: string;
  lng: string;
  lgas: LGA[];
}

interface Location {
  label: string;
  lat: string;
  lng: string;
  states: State[];
}

interface MapProps {
  location: Location;
}

const Map: React.FC<MapProps> = ({ location }) => {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        libraries: ["places"],
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = await loader.importLibrary("marker");

      const centerLat =
        location.states.length > 0
          ? parseFloat(location.states[0].lat)
          : parseFloat(location.lat);
      const centerLng =
        location.states.length > 0
          ? parseFloat(location.states[0].lng)
          : parseFloat(location.lng);

      // Comprehensive map styles to hide all labels
      const mapStyles = [
        // Hide administrative area labels
        {
          featureType: "administrative",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        // Hide landscape labels
        {
          featureType: "landscape",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        // Hide point of interest labels
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        // Hide road labels
        {
          featureType: "road",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        // Hide transit labels
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        // Hide water area labels
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        // Optional: If you want to make the map appear more minimal
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }],
        },
      ];

      const mapOptions: google.maps.MapOptions = {
        center: { lat: centerLat, lng: centerLng },
        zoom: 7,
        mapId: "goloka",
        styles: mapStyles,
        disableDefaultUI: false, // Optionally remove all default UI controls
      };

      const map = new Map(mapRef.current!, mapOptions);

      // Custom marker icon
      const markerIcon = {
        url: "/assets/pin.png",
        scaledSize: new google.maps.Size(40, 40),
      };

      // Add markers for each state and its LGAs
      const markers: google.maps.Marker[] = location.states.flatMap((state) => [
        // State marker
        new Marker({
          position: {
            lat: parseFloat(state.lat),
            lng: parseFloat(state.lng),
          },
          map: map,
          title: state.label,
          icon: markerIcon,
        }),
        // LGA markers
        ...state.lgas.map(
          (lga) =>
            new Marker({
              position: {
                lat: parseFloat(lga.lat),
                lng: parseFloat(lga.lng),
              },
              map: map,
              title: `${state.label} - ${lga.label}`,
              icon: markerIcon,
            }),
        ),
      ]);
    };

    initMap();
  }, [location]);

  return (
    <div
      className="h-full w-full overflow-hidden rounded-lg bg-gray-200"
      ref={mapRef}
    />
  );
};

export default Map;