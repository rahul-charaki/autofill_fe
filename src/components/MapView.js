// components/MapView.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Define custom icons
const onlineIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [25, 25],
});
const offlineIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828665.png",
  iconSize: [25, 25],
});

function MapView({ robots }) {
  return (
    <MapContainer
      center={[20, 0]} // Center on the world
      zoom={2}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {robots.map((robot) => (
        <Marker
          key={robot.id}
          position={robot.location}
          icon={robot.status === "Online" ? onlineIcon : offlineIcon}
        >
          <Popup>
            <strong>ID:</strong> {robot.id}
            <br />
            <strong>Status:</strong> {robot.status}
            <br />
            <strong>Battery:</strong> {robot.battery}%
            <br />
            <strong>Location:</strong> ({robot.location[0].toFixed(2)},{" "}
            {robot.location[1].toFixed(2)})
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
