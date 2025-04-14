import React, { useState, useEffect } from 'react';
import { FaSun, FaCloudRain, FaCloud, FaCloudSun, FaWind, FaTemperatureHigh, FaTemperatureLow } from 'react-icons/fa';
import wundergroundService from '../services/wundergroundService';

/**
 * Component for displaying weather forecast
 */
const WeatherForecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [units, setUnits] = useState('imperial'); // 'imperial' or 'metric'
  const [forecastType, setForecastType] = useState('daily'); // 'daily' or 'hourly'

  // Fetch forecast data on component mount and when forecast type changes
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch actual forecast data
        // const data = forecastType === 'daily' 
        //   ? await wundergroundService.getDailyForecast(5)
        //   : await wundergroundService.getHourlyForecast();
        
        // For demonstration, we'll use simulated data
        const simulatedData = forecastType === 'daily' 
          ? generateSimulatedDailyForecast() 
          : generateSimulatedHourlyForecast();
        
        setForecastData(simulatedData);
        setError('');
      } catch (err) {
        setError('Failed to fetch forecast data. Please try again later.');
        console.error('Error fetching forecast data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [forecastType]);

  // Generate simulated daily forecast data
  const generateSimulatedDailyForecast = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Generate random but realistic weather data
      const tempHigh = Math.round(70 + Math.random() * 15);
      const tempLow = Math.round(tempHigh - 10 - Math.random() * 8);
      const precipChance = Math.round(Math.random() * 100);
      const windSpeed = Math.round(Math.random() * 15 * 10) / 10;
      
      // Determine conditions based on precipitation chance
      let conditions;
      if (precipChance > 70) {
        conditions = 'Rain';
      } else if (precipChance > 40) {
        conditions = 'Partly Cloudy';
      } else {
        conditions = 'Sunny';
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tempHigh,
        tempLow,
        precipChance,
        windSpeed,
        conditions
      });
    }
    
    return data;
  };

  // Generate simulated hourly forecast data
  const generateSimulatedHourlyForecast = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() + i);
      
      // Generate random but realistic weather data with a daily pattern
      const hourOfDay = date.getHours();
      const baseTemp = 65 + Math.sin((hourOfDay - 14) * Math.PI / 12) * 10; // Peak at 2pm
      const temp = Math.round(baseTemp + Math.random() * 5);
      const precipChance = Math.round(Math.random() * 100);
      const windSpeed = Math.round(Math.random() * 15 * 10) / 10;
      
      // Determine conditions based on precipitation chance
      let conditions;
      if (precipChance > 70) {
        conditions = 'Rain';
      } else if (precipChance > 40) {
        conditions = 'Partly Cloudy';
      } else {
        conditions = 'Clear';
      }
      
      data.push({
        date: date.toISOString(),
        hour: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp,
        precipChance,
        windSpeed,
        conditions
      });
    }
    
    return data;
  };

  // Toggle between imperial and metric units
  const toggleUnits = () => {
    setUnits(units === 'imperial' ? 'metric' : 'imperial');
  };

  // Toggle between daily and hourly forecast
  const toggleForecastType = () => {
    setForecastType(forecastType === 'daily' ? 'hourly' : 'daily');
  };

  // Convert temperature for display based on selected units
  const formatTemperature = (tempF) => {
    if (units === 'metric') {
      return wundergroundService.convertFtoC(tempF).toFixed(1);
    }
    return tempF.toFixed(1);
  };

  // Convert wind speed based on selected units
  const formatWindSpeed = (speedMph) => {
    if (units === 'metric') {
      const speedKph = speedMph * 1.60934;
      return `${speedKph.toFixed(1)} km/h`;
    }
    return `${speedMph.toFixed(1)} mph`;
  };

  // Get weather icon based on conditions
  const getWeatherIcon = (conditions) => {
    if (!conditions) return <FaSun className="text-yellow-400" size={24} />;
    
    const condition = conditions.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('shower')) {
      return <FaCloudRain className="text-blue-400" size={24} />;
    } else if (condition.includes('cloud')) {
      return <FaCloud className="text-gray-400" size={24} />;
    } else if (condition.includes('partly')) {
      return <FaCloudSun className="text-yellow-300" size={24} />;
    } else if (condition.includes('clear') || condition.includes('sunny')) {
      return <FaSun className="text-yellow-400" size={24} />;
    } else {
      return <FaSun className="text-yellow-400" size={24} />;
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
        <h2 className="text-xl font-bold">Weather Forecast</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleForecastType}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm font-medium"
          >
            {forecastType === 'daily' ? 'Show Hourly' : 'Show Daily'}
          </button>
          <button
            onClick={toggleUnits}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
          >
            {units === 'imperial' ? 'Switch to °C' : 'Switch to °F'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Loading forecast data...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          {forecastType === 'daily' ? (
            // Daily forecast display
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecastData.map((day) => (
                <div key={day.date} className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-center mb-2">
                    <p className="font-bold">{day.dayOfWeek}</p>
                    <p className="text-sm text-gray-400">{new Date(day.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex justify-center mb-3">
                    {getWeatherIcon(day.conditions)}
                  </div>
                  
                  <p className="text-center mb-2">{day.conditions}</p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FaTemperatureHigh className="text-red-400 mr-1" />
                      <span>{formatTemperature(day.tempHigh)}{units === 'imperial' ? '°F' : '°C'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaTemperatureLow className="text-blue-400 mr-1" />
                      <span>{formatTemperature(day.tempLow)}{units === 'imperial' ? '°F' : '°C'}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <p className="flex items-center mb-1">
                      <FaCloudRain className="mr-1" /> {day.precipChance}% chance
                    </p>
                    <p className="flex items-center">
                      <FaWind className="mr-1" /> {formatWindSpeed(day.windSpeed)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Hourly forecast display
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {forecastData.slice(0, 24).map((hour, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-center mb-1">
                    <p className="font-bold">{hour.hour}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(hour.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(hour.conditions)}
                  </div>
                  
                  <p className="text-center font-bold mb-1">
                    {formatTemperature(hour.temp)}{units === 'imperial' ? '°F' : '°C'}
                  </p>
                  
                  <div className="text-xs text-gray-400">
                    <p className="flex items-center justify-center mb-1">
                      <FaCloudRain className="mr-1" /> {hour.precipChance}%
                    </p>
                    <p className="flex items-center justify-center">
                      <FaWind className="mr-1" /> {formatWindSpeed(hour.windSpeed)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
