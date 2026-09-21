mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom: 9,
    center: coordinates // [longitude, latitude]
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .addTo(map);