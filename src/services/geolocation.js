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
    return {
      name: `${locationName.city}, ${locationName.country.includes("United States") ? locationName.state : locationName.country} `,
      latitude: userLocation.lat,
      longitude: userLocation.long,
    };
  } catch (error) {
    console.error("location error", error);
  }
}

export async function searchLocations(query) {
  try {
    if (query.length < 3) return [];

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.split(",")[0])}&count=10&language=en&format=json`);

    if (!response.ok) {
      throw new Error("Error at api call");
    }

    const data = await response.json();

    const results = data.results.map((item) => {
      return {
        name: `${item.name}, ${item.country?.includes("United States") ? item.admin1 : item.country} `,
        latitude: item.latitude,
        longitude: item.longitude,
      };
    });

    console.log("Results", results);

    return results;
  } catch (error) {
    console.error("error fetching location", error);
  }
}
