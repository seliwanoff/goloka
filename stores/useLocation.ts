import { useState, useEffect } from "react";
import axios from "axios";

interface Location {
  address: string;
  city: string;
  id: string;
}

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  location: Location | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationPositionError {
  code: number;
  message: string;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleGeocodingResult {
  address_components: AddressComponent[];
  formatted_address: string;
  place_id: string;
}

export const useLocationAddress = () => {
  const [locationData, setLocationData] = useState<LocationState>({
    latitude: null,
    longitude: null,
    location: null,
    error: null,
    loading: true,
  });

  const extractAddressComponents = (
    result: GoogleGeocodingResult,
  ): Location => {
    const getComponent = (types: string[]): string => {
      return (
        result.address_components.find((component) =>
          types.some((type) => component.types.includes(type)),
        )?.long_name || ""
      );
    };

    // Try to get the most specific address possible
    let address = "";

    // First try: street number + route
    const streetNumber = getComponent(["street_number"]);
    const route = getComponent(["route"]);
    if (streetNumber && route) {
      address = `${streetNumber} ${route}`;
    }

    // Second try: subpremise + premise
    if (!address) {
      const subpremise = getComponent(["subpremise"]);
      const premise = getComponent(["premise"]);
      if (subpremise && premise) {
        address = `${subpremise}, ${premise}`;
      } else if (premise) {
        address = premise;
      }
    }

    // Third try: point of interest or establishment
    if (!address) {
      const poi = getComponent(["point_of_interest", "establishment"]);
      if (poi) {
        address = poi;
      }
    }

    // Fourth try: neighborhood + sublocality
    if (!address) {
      const neighborhood = getComponent(["neighborhood"]);
      const sublocality = getComponent(["sublocality"]);
      if (neighborhood && sublocality) {
        address = `${neighborhood}, ${sublocality}`;
      } else if (neighborhood) {
        address = neighborhood;
      } else if (sublocality) {
        address = sublocality;
      }
    }

    // Final fallback: use formatted_address if we still don't have an address
    if (!address) {
      address = result.formatted_address;
    }

    // Get city (try multiple type variations)
    const city =
      getComponent(["locality"]) ||
      getComponent(["administrative_area_level_2"]) ||
      getComponent(["sublocality_level_1"]);

    return {
      address: address.trim(),
      city: city.trim(),
      id: result.place_id,
    };
  };

  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const path = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      const res = await axios.get<{ results: GoogleGeocodingResult[] }>(path);

      if (!res.data.results[0]) {
        throw new Error("No address found");
      }

      return extractAddressComponents(res.data.results[0]);
    } catch (error) {
      throw new Error("Failed to get address from coordinates");
    }
  };

  // Rest of the code remains the same...
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationData((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    setLocationData((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await getAddressFromLatLng(latitude, longitude);

          setLocationData({
            latitude,
            longitude,
            location,
            error: null,
            loading: false,
          });
        } catch (error) {
          setLocationData((prev) => ({
            ...prev,
            error: "Failed to get address from coordinates",
            loading: false,
          }));
        }
      },
      (error: GeolocationPositionError) => {
        setLocationData({
          latitude: null,
          longitude: null,
          location: null,
          error: getErrorMessage(error.code),
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  const getErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return "Permission denied. Please allow location access.";
      case 2:
        return "Position unavailable. Please try again.";
      case 3:
        return "Request timeout. Please try again.";
      default:
        return "An unknown error occurred.";
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { ...locationData, getCurrentLocation };
};
