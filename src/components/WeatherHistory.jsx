import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import wundergroundService from '../services/wundergroundService';

/**
 * Component for displaying historical weather data with charts
 */
const WeatherHistory = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [units, setUnits] = useState('imperial'); // 'imperial' or 'metric'
  const [days, setDays] = useState(7); // Number of days to display

  // Fetch historical weather data on component mount and when days or units change
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch actual historical data
        // const data = await wundergroundService.getHistoricalData(days);
        
        // For demonstration, we'll use simulated data
        const simulatedData = generateSimulatedHistoricalData(days);
        setHistoricalData(simulatedData);
        setError('');
      } catch (err) {
        setError('Failed to fetch historical data. Please try again later.');
        console.error('Error fetching historical data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [days]);

  // Generate simulated historical data
  const generateSimulatedHistoricalData = (numDays) => {
    const data = [];
    const today = new Date();
    
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random but realistic weather data
      const tempHigh = Math.round(70 + Math.random() * 15);
      const tempLow = Math.round(tempHigh - 10 - Math.random() * 8);
      const humidity = Math.round(50 + Math.random() * 40);
      const precip = Math.round(Math.random() * 100) / 100;
      const windSpeed = Math.round(Math.random() * 15 * 10) / 10;
      
      data.push({
        date: date.toISOString().split('T')[0],
        tempHigh,
        tempLow,
        humidity,
        precip,
        windSpeed
      });
    }
    
    return data;
  };

  // Toggle between imperial and metric units
  const toggleUnits = () => {
    setUnits(units === 'imperial' ? 'metric' : 'imperial');
  };

  // Convert temperature for display based on selected units
  const formatTemperature = (tempF) => {
    if (units === 'metric') {
      return wundergroundService.convertFtoC(tempF).toFixed(1);
    }
    return tempF.toFixed(1);
  };

  // Format data for charts with unit conversion
  const getChartData = () => {
    return historicalData.map(day => ({
      ...day,
      tempHighDisplay: parseFloat(formatTemperature(day.tempHigh)),
      tempLowDisplay: parseFloat(formatTemperature(day.tempLow)),
      precipDisplay: units === 'metric' ? day.precip * 25.4 : day.precip,
      windSpeedDisplay: units === 'metric' ? day.windSpeed * 1.60934 : day.windSpeed
    }));
  };

  // Handle days selection change
  const handleDaysChange = (e) => {
    setDays(parseInt(e.target.value));
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <FaChartLine className="mr-2" /> Historical Weather
        </h2>
        <div className="flex space-x-2">
          <select
            value={days}
            onChange={handleDaysChange}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          >
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
          <button
            onClick={toggleUnits}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
          >
            {units === 'imperial' ? 'Switch to °C' : 'Switch to °F'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Loading historical data...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          {/* Temperature Chart */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Temperature History</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getChartData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ccc"
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="#ccc"
                    label={{ 
                      value: units === 'imperial' ? 'Temperature (°F)' : 'Temperature (°C)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: '#ccc' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }}
                    formatter={(value) => [`${value} ${units === 'imperial' ? '°F' : '°C'}`, '']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tempHighDisplay" 
                    name="High" 
                    stroke="#f87171" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tempLowDisplay" 
                    name="Low" 
                    stroke="#60a5fa" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Precipitation Chart */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Precipitation History</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getChartData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ccc"
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="#ccc"
                    label={{ 
                      value: units === 'imperial' ? 'Precipitation (in)' : 'Precipitation (mm)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: '#ccc' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }}
                    formatter={(value) => [`${value.toFixed(2)} ${units === 'imperial' ? 'in' : 'mm'}`, '']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="precipDisplay" 
                    name="Precipitation" 
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Data Table */}
          <div className="mt-8 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">Historical Data</h3>
            <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">High</th>
                  <th className="px-4 py-2 text-left">Low</th>
                  <th className="px-4 py-2 text-left">Humidity</th>
                  <th className="px-4 py-2 text-left">Precipitation</th>
                  <th className="px-4 py-2 text-left">Wind Speed</th>
                </tr>
              </thead>
              <tbody>
                {getChartData().map((day, index) => (
                  <tr key={day.date} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-750'}>
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-red-400">
                      {day.tempHighDisplay} {units === 'imperial' ? '°F' : '°C'}
                    </td>
                    <td className="px-4 py-2 text-blue-400">
                      {day.tempLowDisplay} {units === 'imperial' ? '°F' : '°C'}
                    </td>
                    <td className="px-4 py-2">{day.humidity}%</td>
                    <td className="px-4 py-2">
                      {units === 'imperial' ? day.precip.toFixed(2) + ' in' : (day.precip * 25.4).toFixed(1) + ' mm'}
                    </td>
                    <td className="px-4 py-2">
                      {units === 'imperial' ? day.windSpeed.toFixed(1) + ' mph' : (day.windSpeed * 1.60934).toFixed(1) + ' km/h'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherHistory;
