import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { FaExternalLinkAlt } from 'react-icons/fa';

/**
 * Component for displaying Skywarn and NWS information
 */
const SkywarnInfo = () => {
  const [skywarnStatus, setSkywarnStatus] = useState('Inactive');
  const [nwsAlerts, setNwsAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch NWS alerts on component mount
  useEffect(() => {
    const fetchNWSAlerts = async () => {
      try {
        // In a real implementation, you would fetch actual NWS alerts
        // For demonstration purposes, we'll use simulated data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated NWS alerts
        const simulatedAlerts = [
          {
            id: 'NWS-1',
            event: 'Severe Thunderstorm Watch',
            headline: 'Severe Thunderstorm Watch issued for North Texas',
            description: 'The National Weather Service has issued a Severe Thunderstorm Watch for North Texas until 10:00 PM CDT.',
            severity: 'Moderate',
            expires: moment().add(6, 'hours').format('YYYY-MM-DD HH:mm:ss'),
            url: 'https://www.weather.gov/alerts'
          },
          {
            id: 'NWS-2',
            event: 'Flash Flood Warning',
            headline: 'Flash Flood Warning for Dallas County',
            description: 'The National Weather Service has issued a Flash Flood Warning for Dallas County until 8:00 PM CDT.',
            severity: 'Severe',
            expires: moment().add(4, 'hours').format('YYYY-MM-DD HH:mm:ss'),
            url: 'https://www.weather.gov/alerts'
          }
        ];
        
        setNwsAlerts(simulatedAlerts);
        
        // Set Skywarn status based on alerts
        if (simulatedAlerts.some(alert => alert.severity === 'Severe')) {
          setSkywarnStatus('Active');
        }
      } catch (error) {
        console.error('Error fetching NWS alerts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNWSAlerts();
  }, []);

  // Get severity class for styling
  const getSeverityClass = (severity) => {
    switch (severity.toLowerCase()) {
      case 'severe':
        return 'bg-red-700';
      case 'moderate':
        return 'bg-orange-600';
      case 'minor':
        return 'bg-yellow-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-4">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">Skywarn & NWS Information</h2>
      
      {/* Skywarn Status */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Skywarn Status</h3>
        <div className={`inline-block px-3 py-1 rounded-full font-medium ${
          skywarnStatus === 'Active' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {skywarnStatus}
        </div>
        <p className="mt-2 text-sm text-gray-400">
          <a 
            href="https://www.weather.gov/skywarn/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline flex items-center"
          >
            Skywarn Information <FaExternalLinkAlt className="ml-1" size={12} />
          </a>
        </p>
      </div>
      
      {/* NWS Alerts */}
      <div>
        <h3 className="text-lg font-semibold mb-2">NWS Alerts</h3>
        
        {loading ? (
          <p>Loading alerts...</p>
        ) : nwsAlerts.length === 0 ? (
          <p>No active alerts at this time.</p>
        ) : (
          <div className="space-y-3">
            {nwsAlerts.map(alert => (
              <div key={alert.id} className="p-3 bg-gray-700 rounded">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold">{alert.event}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${getSeverityClass(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm mt-1">{alert.headline}</p>
                <p className="text-xs text-gray-400 mt-2">Expires: {alert.expires}</p>
                <div className="mt-2">
                  <a 
                    href={alert.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm flex items-center"
                  >
                    View Details <FaExternalLinkAlt className="ml-1" size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4">
          <a 
            href="https://www.weather.gov/fwd/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline flex items-center"
          >
            NWS Fort Worth <FaExternalLinkAlt className="ml-1" size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SkywarnInfo;
