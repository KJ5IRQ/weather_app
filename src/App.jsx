// App.jsx (Main entry point for your tactical dashboard)

import React, { useEffect, useState } from 'react';
import './App.css';

// Component stubs (you'll build these out later)
const AllStarStatus = () => <div className="p-2">AllStar Node Status</div>;
const NWSAlerts = () => <div className="p-2 border-2 border-yellow-400">NWS Alerts Placeholder</div>;
const YouTubeEmbed = ({ url }) => (
  <div className="aspect-video w-full">
    <iframe
      className="w-full h-full"
      src={url}
      title="YouTube Live Feed"
      allowFullScreen
    />
  </div>
);
const HFPropagation = () => (
  <div className="p-2">
    <center>
      <a href="https://www.hamqsl.com/solar.html">
        <img src="https://www.hamqsl.com/solar101sc.php" alt="HF Propagation" />
      </a>
    </center>
  </div>
);
const NewsFeed = () => <div className="p-2">RSS News Feed Placeholder</div>;
const Radar = () => <div className="p-2">Radar Placeholder</div>;
const Forecast = () => <div className="p-2">3-Day Forecast Placeholder</div>;
const SkywarnTools = () => <div className="p-2">Skywarn Field Tools Placeholder</div>;

function HeaderClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

  const utc = new Date(now.toUTCString());

  return (
    <div className="grid grid-cols-3 gap-4 bg-gray-800 text-white p-4 text-center">
      <div className="text-xl font-bold">KJ5IRQ</div>
      <div>
        <div>{formatDate(now)}</div>
      </div>
      <div>
        <div>Local: {formatTime(now)}</div>
        <div>UTC: {formatTime(utc)}</div>
      </div>
    </div>
  );
}

function App() {
  const [youtubeUrl] = useState("https://www.youtube.com/embed/live_stream?channel=UC_example");

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <HeaderClock />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <AllStarStatus />
        <NWSAlerts />
        <YouTubeEmbed url={youtubeUrl} />
        <HFPropagation />
        <div className="p-2">Solar Snapshot Placeholder</div>
        <NewsFeed />
        <Radar />
        <Forecast />
        <SkywarnTools />
      </div>
    </div>
  );
}

export default App;
