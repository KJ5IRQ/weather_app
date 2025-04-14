import axios from 'axios';

const API_KEY = 'c00d56c126dc470a8d56c126dc970aee';
const STATION_ID = 'KTXMINER45';

// Base URL for Wunderground API
const BASE_URL = 'https://api.weather.com/v2';

/**
 * Service for interacting with the Wunderground API
 */
const wundergroundService = {
  /**
   * Get current conditions from the weather station
   * @returns {Promise} Promise object representing the current conditions
   */
  getCurrentConditions: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/pws/observations/current`,
        {
          params: {
            stationId: STATION_ID,
            format: 'json',
            units: 'e', // e for English (imperial), m for Metric
            apiKey: API_KEY
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current conditions:', error);
      throw error;
    }
  },

  /**
   * Get historical data for the weather station
   * @param {number} numDays - Number of days of history to retrieve
   * @returns {Promise} Promise object representing the historical data
   */
  getHistoricalData: async (numDays = 7) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/pws/history/daily`,
        {
          params: {
            stationId: STATION_ID,
            format: 'json',
            units: 'e', // e for English (imperial), m for Metric
            apiKey: API_KEY,
            numDays
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },

  /**
   * Get hourly forecast for the weather station location
   * @returns {Promise} Promise object representing the hourly forecast
   */
  getHourlyForecast: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/pws/forecast/hourly`,
        {
          params: {
            stationId: STATION_ID,
            format: 'json',
            units: 'e', // e for English (imperial), m for Metric
            apiKey: API_KEY
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching hourly forecast:', error);
      throw error;
    }
  },

  /**
   * Get daily forecast for the weather station location
   * @param {number} days - Number of days to forecast (1-10)
   * @returns {Promise} Promise object representing the daily forecast
   */
  getDailyForecast: async (days = 5) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/pws/forecast/daily`,
        {
          params: {
            stationId: STATION_ID,
            format: 'json',
            units: 'e', // e for English (imperial), m for Metric
            apiKey: API_KEY,
            days
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching daily forecast:', error);
      throw error;
    }
  },

  /**
   * Convert temperature from Fahrenheit to Celsius
   * @param {number} fahrenheit - Temperature in Fahrenheit
   * @returns {number} Temperature in Celsius
   */
  convertFtoC: (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9;
  },

  /**
   * Convert temperature from Celsius to Fahrenheit
   * @param {number} celsius - Temperature in Celsius
   * @returns {number} Temperature in Fahrenheit
   */
  convertCtoF: (celsius) => {
    return (celsius * 9 / 5) + 32;
  }
};

export default wundergroundService;
