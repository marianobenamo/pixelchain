import { useState, useEffect } from "react";
import "./css/styles.css";
import Asset from "./Asset.js";

export default function App() {
  // States and variables declaration
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const totalAssets = 4500;
  // Amount will be the default number or the minimum to complete the total asset when reaching last fetch
  const amount = Math.min(15, totalAssets - offset);

  useEffect(() => {
    // Load assets and add scroll event listener
    const loadAssets = async () => {
      try {
        // Check if it is valid to make a new asset request
        if (offset < totalAssets) {
          setLoading(true);
          // Fetch the api using corresponding offset and limit
          const options = {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-API-KEY": "0e090a5d0169429c9c96839dc9b24ec5",
            },
          };
          const response = await fetch(
            `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=${amount}&collection=pixelchain`,
            options
          );

          // Return error if exists
          if (!response.ok) {
            throw new Error(`HTTP Request error: ${response.status}`);
          }

          // Save the new assets in a temporary variable
          let actualAssets = await response.json();

          // Merge the old and new assets and set the state
          setAssets((oldAssets) => [...oldAssets, ...actualAssets.assets]);

          // Change the offset according to the current position of the query
          setOffset((offset) => offset + amount);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        // Set the loading state to false to show the loader
        setLoading(false);
      }
    };

    const handleScroll = () => {
      // Calculate when user reaches bottom of the screen on scroll to load assets
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadAssets();
      }
    };
    
    // Add event listener and call the function for first fetch
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Clean the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset, amount]);

  return (
    <div className="App">
      <div className="header">
        <a
          href="https://pixelchain.art/"
          target="_blank"
          rel="noreferrer"
          className="logo"
        >
          <img src="/images/logo.png" alt="Logo" />
          <h1>PixelChain</h1>
        </a>
      </div>
      <div className="container">
        {/* Create the assets using a map of the assets array */}
        {error && (
          <div>{`There was a problem fetching the assets - ${error}`}</div>
        )}
        <div id="assets">
          {assets &&
            assets.map(({ image_url, name }, i) => (
              <Asset img={image_url} name={name} key={i} />
            ))}
        </div>
      </div>

      {/* Loader */}
      <div className={loading ? "loader active" : "loader"}>
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h4>Fetching assets...</h4>
      </div>
    </div>
  );
}
