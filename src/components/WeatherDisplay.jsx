import React, { useState, useEffect } from 'react';
import { FaTemperatureHigh, FaWind, FaTint, FaCompass, FaCloudRain, FaSun, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import wundergroundService from '../services/wundergroundService';

/**
 * Component for displaying current weather conditions
 */
const WeatherDisplay = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [units, setUnits] = useState('imperial'); // 'imperial' or 'metric'

  // Fetch current weather data on component mount and when units change
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const data = await wundergroundService.getCurrentConditions();
        setCurrentWeather(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch weather data. Please try again later.');
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Toggle between imperial and metric units
  const toggleUnits = () => {
    setUnits(units === 'imperial' ? 'metric' : 'imperial');
  };

  // Convert temperature based on selected units
  const formatTemperature = (tempF) => {
    if (units === 'metric') {
      const tempC = wundergroundService.convertFtoC(tempF);
      return `${tempC.toFixed(1)}°C`;
    }
    return `${tempF.toFixed(1)}°F`;
  };

  // Convert wind speed based on selected units
  const formatWindSpeed = (speedMph) => {
    if (units === 'metric') {
      const speedKph = speedMph * 1.60934;
      return `${speedKph.toFixed(1)} km/h`;
    }
    return `${speedMph.toFixed(1)} mph`;
  };

  // Convert precipitation based on selected units
  const formatPrecipitation = (inchesValue) => {
    if (units === 'metric') {
      const mmValue = inchesValue * 25.4;
      return `${mmValue.toFixed(1)} mm`;
    }
    return `${inchesValue.toFixed(2)} in`;
  };

  // Get weather icon based on conditions
  const getWeatherIcon = (conditions) => {
    if (!conditions) return <FaSun className="text-yellow-400" size={36} />;
    
    const condition = conditions.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('shower')) {
      return <FaCloudRain className="text-blue-400" size={36} />;
    } else if (condition.includes('cloud')) {
      return <FaCloudRain className="text-gray-400" size={36} />;
    } else if (condition.includes('clear') || condition.includes('sunny')) {
      return <FaSun className="text-yellow-400" size={36} />;
    } else {
      return <FaSun className="text-yellow-400" size={36} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-4">
        <h2 className="text-xl font-bold mb-4">Current Weather</h2>
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-4">
        <h2 className="text-xl font-bold mb-4">Current Weather</h2>
        <p className="text-red-400">{error}</p>
        <p className="mt-2">Using simulated data for demonstration:</p>
        
        {/* Simulated weather data display */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <FaSun className="text-yellow-400 mr-4" size={48} />
            <div>
              <h3 className="text-2xl font-bold">72.5°F</h3>
              <p className="text-gray-400">Feels like 74.2°F</p>
            </div>
          </div>
          <div>
            <p className="text-lg">Partly Cloudy</p>
            <p className="text-gray-400">KTXMINER45</p>
          </div>
        </div>
      </div>
    );
  }

  // Use actual data if available, otherwise use simulated data
  const weatherData = currentWeather?.observations?.[0] || {
    stationID: 'KTXMINER45',
    obsTimeLocal: new Date().toLocaleString(),
    imperial: {
      temp: 72.5,
      heatIndex: 74.2,
      dewpt: 60.8,
      windChill: 72.5,
      windSpeed: 5.8,
      windGust: 12.3,
      pressure: 29.92,
      precipRate: 0,
      precipTotal: 0.05,
      elev: 500
    },
    humidity: 65,
    winddir: 180,
    uv: 4.2,
    solarRadiation: 450,
    conditions: 'Partly Cloudy'
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
        <h2 className="text-xl font-bold">Current Weather</h2>
        <button
          onClick={toggleUnits}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
        >
          {units === 'imperial' ? 'Switch to °C' : 'Switch to °F'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main weather display */}
        <div className="flex items-center">
          {getWeatherIcon(weatherData.conditions)}
          <div className="ml-4">
            <h3 className="text-2xl font-bold">
              {formatTemperature(weatherData.imperial.temp)}
            </h3>
            <p className="text-gray-400">
              Feels like {formatTemperature(weatherData.imperial.heatIndex)}
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-lg">{weatherData.conditions || 'Clear'}</p>
          <p className="text-gray-400">{weatherData.stationID}</p>
          <p className="text-xs text-gray-500">
            Last updated: {new Date(weatherData.obsTimeLocal).toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* Weather details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex items-center text-gray-400 mb-1">
            <FaTint className="mr-2" />
            <span>Humidity</span>
          </div>
          <p className="text-xl">{weatherData.humidity}%</p>
        </div>
        
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex items-center text-gray-400 mb-1">
            <FaWind className="mr-2" />
            <span>Wind</span>
          </div>
          <p className="text-xl">
            {formatWindSpeed(weatherData.imperial.windSpeed)}
          </p>
          <p className="text-sm text-gray-400">
            <FaCompass className="inline mr-1" />
            {weatherData.winddir}°
          </p>
        </div>
        
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex items-center text-gray-400 mb-1">
            <FaTemperatureHigh className="mr-2" />
            <span>Dew Point</span>
          </div>
          <p className="text-xl">
            {formatTemperature(weatherData.imperial.dewpt)}
          </p>
        </div>
        
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex items-center text-gray-400 mb-1">
            <FaCloudRain className="mr-2" />
            <span>Precipitation</span>
          </div>
          <p className="text-xl">
            {formatPrecipitation(weatherData.imperial.precipTotal)}
          </p>
          <p className="text-sm text-gray-400">
            Rate: {formatPrecipitation(weatherData.imperial.precipRate)}/hr
          </p>
        </div>
      </div>
      
      {/* Additional details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="p-2">
          <p className="text-gray-400 text-sm">Pressure</p>
          <p>{weatherData.imperial.pressure} inHg</p>
        </div>
        
        <div className="p-2">
          <p className="text-gray-400 text-sm">UV Index</p>
          <p>{weatherData.uv || 'N/A'}</p>
        </div>
        
        <div className="p-2">
          <p className="text-gray-400 text-sm">Solar Radiation</p>
          <p>{weatherData.solarRadiation || 'N/A'} W/m²</p>
        </div>
        
        <div className="p-2">
          <p className="text-gray-400 text-sm">Elevation</p>
          <p>{weatherData.imperial.elev} ft</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
