import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const Map = () => {
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

      const mapOptions: google.maps.MapOptions = {
        center: { lat: 9.0765, lng: 7.3986 }, // Abuja, Nigeria
        zoom: 12,
        mapId: "goloka",
        styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
        ],
      };

      const map = new Map(mapRef.current!, mapOptions);

      // Custom marker icon
      const markerIcon = {
        url: "/assets/pin.png",
        scaledSize: new google.maps.Size(40, 40),
      };

      // Add markers
      const markers: google.maps.Marker[] = [
        new Marker({
          position: { lat: 9.0765, lng: 7.3986 },
          map: map,
          icon: markerIcon,
        }),
        new Marker({
          position: { lat: 9.0667, lng: 7.4667 },
          map: map,
          icon: markerIcon,
        }),
        new Marker({
          position: { lat: 9.0833, lng: 7.5333 },
          map: map,
          icon: markerIcon,
        }),
        new Marker({
          position: { lat: 9.1, lng: 7.35 },
          map: map,
          icon: markerIcon,
        }),
        new Marker({
          position: { lat: 9.05, lng: 7.4 },
          map: map,
          icon: markerIcon,
        }),
      ];
    };
    initMap();
  }, []);

  return (
    <div
      className="h-full w-full overflow-hidden rounded-lg bg-gray-200"
      ref={mapRef}
    />
  );
};

export default Map;
