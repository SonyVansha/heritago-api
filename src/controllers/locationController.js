const geolib = require('geolib');

// Daftar lokasi tetap
const locations = [
  { id: 1, name: "Toko A - Jakarta", latitude: -6.200000, longitude: 106.816666 },
  { id: 2, name: "Toko B - Surabaya", latitude: -7.250445, longitude: 112.768845 },
  { id: 3, name: "Toko C - Bandung", latitude: -6.914744, longitude: 107.609810 }
];

const locationsNearby = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ message: "Latitude dan longitude harus berupa angka." });
  }

  const nearbyLocations = locations.map(loc => {
    const distance = geolib.getDistance(
      { latitude, longitude },
      { latitude: loc.latitude, longitude: loc.longitude }
    );

    return {
      ...loc,
      distanceInMeters: distance,
      distanceInKm: (distance / 1000).toFixed(2)
    };
  });

  // Urutkan dari lokasi terdekat ke terjauh
  nearbyLocations.sort((a, b) => a.distanceInMeters - b.distanceInMeters);

  res.json(nearbyLocations);
}

module.exports = {
  locationsNearby
};