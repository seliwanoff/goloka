import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Define interfaces for the location data
interface LGA {
  label: string;
  lat: string;
  lng: string;
  running_campaigns_count?: number;
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

      const { Map, InfoWindow } = await loader.importLibrary("maps");
      const { Marker } = await loader.importLibrary("marker");
      //  const {  InfoWindow } = await loader.importLibrary("marker");
      const centerLat =
        location.states.length > 0
          ? parseFloat(location.states[0].lat)
          : parseFloat(location.lat);
      const centerLng =
        location.states.length > 0
          ? parseFloat(location.states[0].lng)
          : parseFloat(location.lng);

      const mapStyles = [
        {
          featureType: "administrative",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "landscape",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
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
        disableDefaultUI: false,
      };

      const map = new Map(mapRef.current!, mapOptions);

      const markerIcon = {
        url: "/assets/pin.png",
        scaledSize: new google.maps.Size(40, 40),
      };

      location?.states?.forEach((state) => {
        state?.lgas?.forEach((lga) => {
          const marker = new Marker({
            position: {
              lat: parseFloat(lga.lat),
              lng: parseFloat(lga.lng),
            },
            map: map,
            title: `${state.label} - ${lga.label}`,
            icon: markerIcon,
          });

          const infoWindow = new InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold">${state.label} - ${lga.label}</h3>
                <p>Running Campaigns: ${lga.running_campaigns_count || 0}</p>
              </div>
            `,
          });

          // Open info window on marker click
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      });
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
