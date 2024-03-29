mapboxgl.accessToken = mapToken; 
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: campground.geometry.coordinates,
  zoom: 10
});

const marker = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
      `<h3>${campground.title}</h3>`
    )
  )
  .addTo(map)
