import { useState, useEffect } from "react";
import "./css/styles.css";
import Asset from './Asset.js';

export default function App() {
  // States and variables declaration
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let offset = 0;
  let limit = 15;
  let totalAssets = 4500;
    
  const loadAssets = async () => {
    try {
      // Check if it is valid to make a new asset request
      if((offset + limit <= totalAssets && totalAssets !== offset + limit) || offset > totalAssets - limit){ 
        setLoading(true);
        // Fetch the api using corresponding offset and limit
        const options = {
          method: 'GET',
          headers: {Accept: 'application/json', 'X-API-KEY': '0e090a5d0169429c9c96839dc9b24ec5'}
        };
        const response = await fetch(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=${limit}&collection=pixelchain`, options);
        
        // Return error if exists
        if (!response.ok) {
          throw new Error(
            `HTTP Request error: ${response.status}`
          );
        }
        // Save the new assets in a temporary variable
        let actualAssets = await response.json(); 

        // Merge the old and new assets and set the state
        setAssets((oldAssets) => [...oldAssets, ...actualAssets.assets]);
      }
      setError(null);    
    } catch(err) {
      setError(err.message);
    } finally {
      // Change the offset and limit according to the current position of the query
      if(offset + limit <= totalAssets && totalAssets !== offset + limit){
        offset += limit;
      }else if(offset > totalAssets - limit){
        limit = totalAssets - offset;
      }

      // Set the loading state to false to show the loader
      setLoading(false);
    }  
  }

  const handleScroll  = (e) =>{
    // Create the necessary variables to calculate when the scroll reaches the bottom of the site
    let scrollTop = e.target.documentElement.scrollTop;
    let innerHeight = window.innerHeight;
    let scrollHeight = e.target.documentElement.scrollHeight;

    // Calculate when the scroll reaches the bottom and execute the api call
    if (scrollTop + innerHeight + 1 > scrollHeight){
      loadAssets();
    }
  }
  
  useEffect(() => {
    // Load assets and add scroll event listener
    loadAssets();
    window.addEventListener('scroll', handleScroll);
  }, [])

  return (
    <div className="App">
      <div className="header">
        <a href="https://pixelchain.art/" target="_blank" rel="noreferrer" className="logo">
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
              <Asset img={image_url} name={name} index={i} />
            ))
          }      
        </div>
      </div>

      <div className={loading ? 'loader active' : 'loader'}>
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        <h4>Fetching assets...</h4>
      </div>      
    </div>
  );
}