import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RobotList.css"; // Add CSS for styling

const RobotList = () => {
  const [robots, setRobots] = useState([]);
  const [filter, setFilter] = useState("all"); // State for selected filter

  useEffect(() => {
    // Fetch robots from the backend
    axios
      .get("http://localhost:8000/robots") // Update with your backend URL
      .then((response) => {
        setRobots(response.data);
      })
      .catch((error) => {
        console.error("Error fetching robots:", error);
      });
  }, []);

  // Filter robots based on the selected filter
  const filteredRobots = robots.filter((robot) => {
    if (filter === "all") return true;
    if (filter === "offline") return robot.status === "Offline";
    if (filter === "low_battery") return robot.battery < 20;
    return true;
  });

  return (
    <div>
      <div className="filter-container">
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === "offline" ? "active" : ""}`}
          onClick={() => setFilter("offline")}
        >
          Offline
        </button>
        <button
          className={`filter-button ${filter === "low_battery" ? "active" : ""}`}
          onClick={() => setFilter("low_battery")}
        >
          Low Battery
        </button>
      </div>
      <div className="robot-list">
        {filteredRobots.map((robot) => (
          <div
            key={robot.id}
            className={`robot-card ${
              robot.status === "Offline" ? "offline" : "online"
            }`}
          >
            <p><strong>ID:</strong> {robot.id}</p>
            <p><strong>Status:</strong> {robot.status}</p>
            <p><strong>Battery:</strong> {robot.battery}%</p>
            <p><strong>CPU:</strong> {robot.cpu}%</p>
            <p><strong>RAM:</strong> {robot.ram} MB</p>
            <p><strong>Last Updated:</strong> {robot.last_updated}</p>
            <p>
              <strong>Location:</strong> ({robot.location[0]}, {robot.location[1]})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RobotList;
