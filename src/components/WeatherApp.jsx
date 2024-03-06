import React, { useState, useEffect } from "react";
import { FaSoundcloud, FaCloud } from "react-icons/fa";
import { FaCloudSun } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import { IoRainySharp } from "react-icons/io5";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [city, setCity] = useState("Ho Chi Minh");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      setError(false);
      try {
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=df47cfcdc9ee16651de3a359aa31819d`
        );
        response = await response.json();
        setData(
          response.list.filter((item, index) => index % 8 === 0).slice(0, 4)
        );
      } catch (error) {
        setError(true);
        console.error("Error fetching weather data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
    iconWeather();
    format();

  }, [city]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  function iconWeather(description) {
    switch (description) {
      case "few clouds":
        return <FaCloudSun  className="weatherIcon"/>;
      case "overcast clouds":
        return <FaCloud  className="weatherIcon"/>;
      case "clear sky":
        return <IoSunnySharp  className="weatherIcon"/>;
      case "broken clouds":
      case "scattered clouds":
        return <FaSoundcloud  className="weatherIcon"/>;
      case "moderate rain":
      case "light rain":
        return <IoRainySharp  className="weatherIcon"/>;
      default:
        return null;
    }
  }

  function format(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    let day = date.getDate();
    const monthIndex = date.getMonth();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    day =  day>10? day :`0${day}`

    if (date.toDateString() === today.toDateString()) {
      return "Current Weather";
    } else {
      return `${day}/${months[monthIndex]}`;
    }
  };

  return (
    <div>


      <h1 className="heading">Weather Forecast Web App</h1>
      <h2 className="sub-heading">Next 3 days weather of your city {city}:</h2>
      <>

      {
        !error? 
        
         data.length > 0 && (
          <div className="container">
            <select
              className="select-box"
              value={city}
              onChange={handleCityChange}
            >
              {[
                "Ho Chi Minh",
                "Singapore",
                "Kuala Lumpur",
                "Tokyo",
                "Athens",
              ].map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {loading ? (
              <div className="skeleton-loader">
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
              </div>
            ) : (
              <div className="card-box">
                {data.map((forecast, index) => (
                  <div key={index} className="firstbox">
                    <p>{format(forecast.dt_txt)}</p>
                    <div>
                      <p>{(forecast.main.temp - 273).toFixed(2)}°C</p>
                      
                        {iconWeather(forecast.weather[0].description)}
                
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ):<p className="error-title">Something Went Wrong</p>
      }
      
      </>
      
    </div>
  );
};

export default WeatherApp;
