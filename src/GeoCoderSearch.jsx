import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useControl } from 'react-map-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const Geocoder = ({setLat, setLng}) => {
  const ctrl = new MapBoxGeocoder({
    accessToken: import.meta.env.VITE_REACT_APP_MAPS_API_KEY,
    marker: false,
    collapsed: false,
  });
  useControl(() => ctrl);
  ctrl.on('result', (e) => {
    const coords = e.result.geometry.coordinates;
    console.log(coords);
    setLng(coords[0])
    setLat(coords[1])
  });
  return null;
};

export default Geocoder;