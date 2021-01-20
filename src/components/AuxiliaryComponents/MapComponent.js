import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: 'auto',
    height: '400px'
};

const center = {
    lat: 44.535417,
    lng: 26.171885
};

function MapComponent({ address }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        language: 'ro',
        region: 'ro',
    })

    return isLoaded && address?.data ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: address?.data?.latitude || center.lat, lng: address?.data?.longitude || center.lng }}
            zoom={15}
            tilt={0}
        >
            <Marker
                position={{ lat: address?.data?.latitude || center.lat, lng: address?.data?.longitude || center.lng }}
            />
        </GoogleMap>
    ) : <></>
}

export default React.memo(MapComponent)