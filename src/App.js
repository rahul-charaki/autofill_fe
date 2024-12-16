import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Fix the default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
    const [robots, setRobots] = useState([]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setRobots(data);
        };

        return () => ws.close();
    }, []);

    const [filter, setFilter] = useState("all");
    const filteredData = robots.filter((robot) => {
      if (filter === "online") return robot.Online_Offline === true;
      if (filter === "offline") return robot.Online_Offline === false;
      return true; // "all" filter
    });

    const highlightClass = (robot) => {
        if (!robot["Online_Offline"]) return "offline";
        if (robot["Battery Percentage"] < 20) return "low-battery";
        return "";
    };

    return (
        <div className="App">
            <h1>Fleet Monitoring Dashboard</h1>
            <div className="dashboard">
                <div className="robot-list">
                    <h2>Robot List</h2>
                    <div>
                      <button onClick={() => setFilter("all")}>All</button>
                      <button onClick={() => setFilter("online")}>Online</button>
                      <button onClick={() => setFilter("offline")}>Offline</button>
                    </div>
                    <ul>
                        {filteredData.map((robot) => (
                            <li key={robot["Robot ID"]} className={highlightClass(robot)}>
                                <p>ID: {robot["Robot ID"]}</p>
                                <p>Status: {robot["Online_Offline"] ? "Online" : "Offline"}</p>
                                <p>Battery: {robot["Battery Percentage"]}%</p>
                                <p>CPU: {robot["CPU Usage"]}%</p>
                                <p>RAM: {robot["RAM Consumption"]} MB</p>
                                <p>Last Updated: {robot["Last Updated"]}</p>
                                <p>Location: ({robot["Location Coordinates"][0]}, {robot["Location Coordinates"][1]})</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="map-view">
                    <h2>Map View</h2>
                    <MapContainer
                        center={[0, 0]}
                        zoom={2}
                        style={{ height: "500px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {robots.map((robot) => (
                            <Marker
                                key={robot["Robot ID"]}
                                position={[robot["Location Coordinates"][1], robot["Location Coordinates"][0]]}
                            >
                                <Popup>
                                    <p>ID: {robot["Robot ID"]}</p>
                                    <p>Status: {robot["Online_Offline"] ? "Online" : "Offline"}</p>
                                    <p>Battery: {robot["Battery Percentage"]}%</p>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default App;
