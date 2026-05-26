"use client";

import { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14, { animate: true });
  }, [lat, lng, map]);
  return null;
}

const userPinIcon = L.icon({
  iconUrl: "/user-pin.svg",
  iconSize: [36, 36],
  iconAnchor: [18, 36],   // bottom-center of the pin
  popupAnchor: [0, -36],
});

export default function UserLocation({ position }) {
  if (!position) return null;

  return (
    <>
      <RecenterMap lat={position.lat} lng={position.lng} />
      <Marker position={[position.lat, position.lng]} icon={userPinIcon}>
        <Popup>
          <strong>📍 You are here</strong>
          <br />
          {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </Popup>
      </Marker>
    </>
  );
}
