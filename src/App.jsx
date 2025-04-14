import React, { useState } from 'react';
import HamRadioInfo from './components/HamRadioInfo.jsx';
import SkywarnInfo from './components/SkywarnInfo.jsx';
import WeatherDisplay from './components/WeatherDisplay.jsx';
import WeatherHistory from './components/WeatherHistory.jsx';
import WeatherForecast from './components/WeatherForecast.jsx';
import { FaGithub } from 'react-icons/fa';

function App() {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center md:text-left">
            Ham Radio Weather Station
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Ham Radio Info Section - Always visible */}
        <HamRadioInfo />
        
        {/* Skywarn Info Section - Always visible */}
        <SkywarnInfo />
        
        {/* Weather Tabs */}
        <div className="mt-6">
          <div className="flex border-b border-gray-700">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'current'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Current
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'forecast'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('forecast')}
            >
              Forecast
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'history'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'current' && <WeatherDisplay />}
            {activeTab === 'forecast' && <WeatherForecast />}
            {activeTab === 'history' && <WeatherHistory />}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                Weather data provided by Wunderground API
              </p>
              <p className="text-gray-400">
                Station ID: KTXMINER45
              </p>
            </div>
            <div className="flex items-center">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white flex items-center"
              >
                <FaGithub className="mr-2" size={20} />
                View on GitHub
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} KJ5IRQ Ham Radio Weather Station</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
