import axios from 'axios';

// QRZ API key from user's account
const API_KEY = '7CE6-74D1-A881-3D8D';

/**
 * Service for interacting with the QRZ.com API
 */
const qrzService = {
  /**
   * Look up a callsign in the QRZ database
   * @param {string} callsign - The callsign to look up
   * @returns {Promise} Promise object representing the callsign data
   */
  lookupCallsign: async (callsign) => {
    try {
      // Note: This is a simplified implementation as the actual QRZ API requires XML processing
      // and session handling. In a production environment, you would need to:
      // 1. Get a session key using the API key
      // 2. Use that session key to make callsign lookups
      
      // For demonstration purposes, we're using a direct approach
      // In a real implementation, you would need to follow the XML API documentation
      const response = await axios.get(
        `https://xmldata.qrz.com/xml/current/?s=${API_KEY};callsign=${callsign}`
      );
      
      // The response is XML, so in a real implementation you would need to parse it
      // For now, we'll return the raw response and handle parsing in the component
      return response.data;
    } catch (error) {
      console.error('Error looking up callsign:', error);
      throw error;
    }
  },
  
  /**
   * Get logbook data from QRZ
   * Note: This requires a subscription and proper authentication
   * @returns {Promise} Promise object representing the logbook data
   */
  getLogbookData: async () => {
    try {
      // This would be implemented according to the QRZ Logbook API documentation
      // For now, we'll return a placeholder
      return { message: 'QRZ Logbook API integration requires subscription' };
    } catch (error) {
      console.error('Error fetching logbook data:', error);
      throw error;
    }
  },
  
  /**
   * Calculate Maidenhead grid locator from latitude and longitude
   * @param {number} lat - Latitude in decimal degrees
   * @param {number} lon - Longitude in decimal degrees
   * @returns {string} Maidenhead grid locator (6-character precision)
   */
  calculateGridLocator: (lat, lon) => {
    // Ensure longitude is in the range -180 to 180
    lon = (lon + 180) % 360 - 180;
    
    // First pair (field): uppercase letters
    const field1 = String.fromCharCode(65 + Math.floor((lon + 180) / 20));
    const field2 = String.fromCharCode(65 + Math.floor((lat + 90) / 10));
    
    // Second pair (square): numbers
    const square1 = Math.floor((lon + 180) % 20 / 2);
    const square2 = Math.floor((lat + 90) % 10);
    
    // Third pair (subsquare): lowercase letters
    const subsquare1 = String.fromCharCode(97 + Math.floor((lon + 180) % 2 * 12));
    const subsquare2 = String.fromCharCode(97 + Math.floor((lat + 90) % 1 * 24));
    
    return field1 + field2 + square1 + square2 + subsquare1 + subsquare2;
  }
};

export default qrzService;
