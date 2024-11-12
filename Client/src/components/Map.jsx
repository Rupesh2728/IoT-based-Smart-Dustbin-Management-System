import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './maps.css';

const Map = () => {
  const [dustbinData, setDustbinData] = useState({});
  const [showOptimizedPath, setShowOptimizedPath] = useState(false);
  const [optimizedPath, setOptimizedPath] = useState([]);
  const [optimizedCost, setOptimizedCost] = useState(null);
  const [initialEdges, setInitialEdges] = useState([]);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  useEffect(() => {
    fetchDustbinData();

    const edges = [
      ["start", "A"],
      ["start", "B"],
      ["start", "C"],
      ["A", "B"],
      ["A", "C"],
      ["A", "D"],
      ["B", "D"],
      ["C", "D"],
      ["C", "B"]
    ];
    setInitialEdges(edges);
  }, []);

  useEffect(() => {
    if (showOptimizedPath) {
      axios.get('http://localhost:8000/optimize-path')
        .then((response) => {
          const { path, cost } = response.data.path;
          const filteredPath = path.filter((loc, idx) => !(loc === "start" && idx !== 0));
          setOptimizedPath(filteredPath);
          setOptimizedCost(cost);
        })
        .catch((error) => {
          console.error("Error fetching optimized path: ", error);
        });
    }
  }, [showOptimizedPath]);

  const fetchDustbinData = () => {
    axios.get('http://localhost:8000')
      .then((response) => {
        const data = response.data.data;
        // Set negative fill values to zero
        const processedData = {
          fill_A: Math.max(0, data.fill_A),
          fill_B: Math.max(0, data.fill_B),
          fill_C: Math.max(0, data.fill_C),
          fill_D: Math.max(0, data.fill_D)
        };
        setDustbinData(processedData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  setTimeout(() => {
     fetchDustbinData();
  }, 500);

  const handleHover = (location) => {
    axios.get(`http://localhost:8000/dustbin/${location}`)
      .then((response) => {
        setDustbinData(prevData => ({
          ...prevData,
          [`fill_${location}`]: Math.max(0, response.data.fillLevel)
        }));
      })
      .catch((error) => {
        console.error(`Error fetching data for ${location}:`, error);
      });
  };

  const locations = [
    { id: 0, name: 'Start Node', image: '/van.jpg', data: '', position: { top: '10%', left: '10%' } },
    { id: 1, name: 'A', image: '/location.jpg', data: dustbinData.fill_A, position: { top: '20%', left: '30%' } },
    { id: 2, name: 'B', image: '/location.jpg', data: dustbinData.fill_B, position: { top: '35%', left: '50%' } },
    { id: 3, name: 'C', image: '/location.jpg', data: dustbinData.fill_C, position: { top: '50%', left: '30%' } },
    { id: 4, name: 'D', image: '/location.jpg', data: dustbinData.fill_D, position: { top: '65%', left: '50%' } },
  ];

  const handleShowOptimizedPath = () => {
    setShowOptimizedPath(!showOptimizedPath);
  };

  return (
    <div className="map-container" ref={mapRef}>
      <button className="show-line-button" onClick={handleShowOptimizedPath}>
        {showOptimizedPath ? 'Hide Optimized Path' : 'Show Optimized Path'}
      </button>

      {showOptimizedPath && optimizedCost !== null && (
        <div className="optimized-cost">Optimized Path Cost: {optimizedCost}</div>
      )}

{showOptimizedPath && optimizedCost !== null && (
        <div className="optimized-path">Optimized Path: {optimizedPath.map((ele)=>{return (ele+',')})}</div>
      )}



      <img src="/maps.jpg" alt="Map Background" className="background-image" />

      {locations.map((location, index) => (
        <div
          key={location.id}
          className="marker"
          style={{ top: location.position.top, left: location.position.left }}
          ref={(el) => (markerRefs.current[index] = el)}
          onMouseEnter={() => handleHover(location.name)}
        >
          <img
            src={location.image}
            alt={location.name}
            className="location-image"
          />
          <div className="popup">
            <p>{location.name}</p>
            {location.name !=="Start Node" && <p>Fill Level(%): {location.data ?? 'Loading...'}</p>}
          </div>
        </div>
      ))}

      <RandomEdges markerRefs={markerRefs} mapRef={mapRef} initialEdges={initialEdges} />

      {showOptimizedPath && <OptimizedPath markerRefs={markerRefs} mapRef={mapRef} optimizedPath={optimizedPath} />}
    </div>
  );
};

const RandomEdges = ({ markerRefs, mapRef, initialEdges }) => {
  const [edgeCoordinates, setEdgeCoordinates] = useState([]);

  useEffect(() => {
    if (mapRef.current && markerRefs.current.length) {
      const mapRect = mapRef.current.getBoundingClientRect();

      const coordinates = initialEdges.map(([start, end]) => {
        const startIndex = start === "start" ? 0 : ["A", "B", "C", "D"].indexOf(start) + 1;
        const endIndex = end === "start" ? 0 : ["A", "B", "C", "D"].indexOf(end) + 1;

        const startMarker = markerRefs.current[startIndex];
        const endMarker = markerRefs.current[endIndex];
        if (startMarker && endMarker) {
          const startRect = startMarker.getBoundingClientRect();
          const endRect = endMarker.getBoundingClientRect();
          const x1 = startRect.left - mapRect.left + startRect.width / 2;
          const y1 = startRect.top - mapRect.top + startRect.height / 2;
          const x2 = endRect.left - mapRect.left + endRect.width / 2;
          const y2 = endRect.top - mapRect.top + endRect.height / 2;
          return { x1, y1, x2, y2 };
        }
        return null;
      }).filter(Boolean);

      setEdgeCoordinates(coordinates);
    }
  }, [initialEdges, markerRefs, mapRef]);

  return (
    <svg className="line-overlay">
      {edgeCoordinates.map((coord, index) => (
        <line
          key={index}
          x1={coord.x1}
          y1={coord.y1}
          x2={coord.x2}
          y2={coord.y2}
          stroke="gray"
          strokeWidth="2"
          strokeDasharray="4"
        />
      ))}
    </svg>
  );
};

const OptimizedPath = ({ markerRefs, mapRef, optimizedPath }) => {
  const [lineCoordinates, setLineCoordinates] = useState([]);

  useEffect(() => {
    if (mapRef.current && markerRefs.current && optimizedPath.length) {
      const mapRect = mapRef.current.getBoundingClientRect();

      const coordinates = optimizedPath.map((loc) => {
        const index = loc === "start" ? 0 : ["A", "B", "C", "D"].indexOf(loc) + 1;
        const marker = markerRefs.current[index];
        if (marker) {
          const markerRect = marker.getBoundingClientRect();
          const x = markerRect.left - mapRect.left + markerRect.width / 2;
          const y = markerRect.top - mapRect.top + markerRect.height / 2;
          return `${x},${y}`;
        }
        return null;
      }).filter(Boolean);

      // Add a line connecting the last point back to start
      const startMarker = markerRefs.current[0];
      if (startMarker) {
        const startRect = startMarker.getBoundingClientRect();
        const startX = startRect.left - mapRect.left + startRect.width / 2;
        const startY = startRect.top - mapRect.top + startRect.height / 2;
        coordinates.push(`${startX},${startY}`);
      }

      setLineCoordinates(coordinates);
    }
  }, [optimizedPath, markerRefs, mapRef]);

  return (
    <svg className="line-overlay">
      <polyline
        points={lineCoordinates.join(' ')}
        stroke="blue"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
};

export default Map;
