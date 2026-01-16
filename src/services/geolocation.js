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
      }
    );
  });
}

async function getLocationName(lat, lon) {
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
  const data = await response.json();

  console.log("Geocoding response:", data); // ← Add this

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
      latitude: userLocation.lat,
      longitude: userLocation.long,
      city: locationName.city,
      state: locationName.state,
      country: locationName.country,
    };
  } catch (error) {
    console.error("location error", error);
  }
}
