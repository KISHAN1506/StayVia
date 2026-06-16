// GeoJSON coordinates are [longitude, latitude], Leaflet coordinates are [latitude, longitude]
const lat = coordinates[1];
const lng = coordinates[0];

const map = L.map('map').setView([lat, lng], 9);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fix Leaflet marker icon paths when using CDN
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

L.marker([lat, lng])
  .addTo(map)
  .bindPopup(`<h4>${listingLocation}</h4><p>Exact location provided after booking</p>`)
  .openPopup();
