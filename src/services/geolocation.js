function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser."'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
}

async function getLocationName(lat, lon) {
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
  const data = await response.json();

  // console.log("Geocoding response:", data);

  return {
    city: data.city,
    state: data.principalSubdivision, // State/Province
    country: data.countryName,
  };
}

export async function fetchLocation() {
  try {
    const userLocation = await getUserLocation();
    const locationName = await getLocationName(userLocation.lat, userLocation.long);
    console.log("Name:", locationName);

    const isUS = locationName.country?.toLowerCase().includes("united states");
    const location = isUS ? locationName.state : locationName.country;

    return {
      name: `${locationName.city}, ${location}`,
      latitude: userLocation.lat,
      longitude: userLocation.long,
    };
  } catch (error) {
    console.error("location error", error);
  }
}

export async function searchLocations(query) {
  if (query.length < 3) return [];

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    const data = await response.json();

    return (
      data.results?.map((place) => {
        const isUS = place.country?.toLowerCase().includes("united states");
        const location = isUS ? place.admin1 : place.country;

        return {
          name: `${place.name}, ${location}`,
          latitude: place.latitude,
          longitude: place.longitude,
        };
      }) ?? []
    );
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}
