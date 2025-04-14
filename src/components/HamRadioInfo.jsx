import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import qrzService from '../services/qrzService';

// User's ham radio information
const USER_CALLSIGN = 'KJ5IRQ';
const USER_LAT = 32.7767; // Example latitude for Dallas, TX
const USER_LON = -96.7970; // Example longitude for Dallas, TX

/**
 * Component for displaying ham radio operator information
 */
const HamRadioInfo = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [gridLocator, setGridLocator] = useState('');
  const [lookupCallsign, setLookupCallsign] = useState('');
  const [callsignData, setCallsignData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update the UTC time every second
  useEffect(() => {
    const updateTime = () => {
      const now = moment().utc();
      setCurrentTime(now.format('HH:mm:ss UTC DD MMM YYYY'));
    };

    // Calculate grid locator on component mount
    setGridLocator(qrzService.calculateGridLocator(USER_LAT, USER_LON));
    
    // Set initial time
    updateTime();
    
    // Update time every second
    const interval = setInterval(updateTime, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle callsign lookup
  const handleLookupCallsign = async (e) => {
    e.preventDefault();
    
    if (!lookupCallsign) {
      setError('Please enter a callsign');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, you would parse the XML response
      // For now, we'll simulate a successful response
      // const data = await qrzService.lookupCallsign(lookupCallsign);
      
      // Simulated response for demonstration
      const simulatedData = {
        callsign: lookupCallsign.toUpperCase(),
        name: 'John Doe',
        country: 'United States',
        state: 'TX',
        grid: 'EM12dx',
        class: 'Amateur Extra',
        expires: '2030-12-31'
      };
      
      setCallsignData(simulatedData);
    } catch (err) {
      setError('Error looking up callsign. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      {/* Header with callsign and time */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
        <h2 className="text-xl font-bold">{USER_CALLSIGN}</h2>
        <div className="text-right">
          <div className="text-lg font-mono">{currentTime}</div>
        </div>
      </div>
      
      {/* Location information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <h3 className="text-gray-400 text-sm">Latitude</h3>
          <p className="font-mono">{USER_LAT.toFixed(4)}°N</p>
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">Longitude</h3>
          <p className="font-mono">{USER_LON.toFixed(4)}°W</p>
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">Grid Locator</h3>
          <p className="font-mono">{gridLocator}</p>
        </div>
      </div>
      
      {/* QRZ Callsign Lookup */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">QRZ Callsign Lookup</h3>
        <form onSubmit={handleLookupCallsign} className="flex space-x-2">
          <input
            type="text"
            value={lookupCallsign}
            onChange={(e) => setLookupCallsign(e.target.value)}
            placeholder="Enter callsign"
            className="flex-1 px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Lookup'}
          </button>
        </form>
        
        {error && <p className="text-red-400 mt-2">{error}</p>}
        
        {callsignData && (
          <div className="mt-4 p-3 bg-gray-700 rounded">
            <h4 className="text-xl font-bold">{callsignData.callsign}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <p><span className="text-gray-400">Name:</span> {callsignData.name}</p>
                <p><span className="text-gray-400">Location:</span> {callsignData.state}, {callsignData.country}</p>
                <p><span className="text-gray-400">Grid:</span> {callsignData.grid}</p>
              </div>
              <div>
                <p><span className="text-gray-400">Class:</span> {callsignData.class}</p>
                <p><span className="text-gray-400">Expires:</span> {callsignData.expires}</p>
                <p>
                  <a 
                    href={`https://www.qrz.com/db/${callsignData.callsign}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View on QRZ.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HamRadioInfo;
