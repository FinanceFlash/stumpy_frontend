import React, { useState, useEffect } from 'react';

import './Graphs.css';
import CandlestickChart from '../../components/CandlestickChart/CandlestickChart';
// import { FetchData } from '../../components/DataFetcher';


const GraphPage = () => {
  const [selectedStock, setselectedStock] = useState('');
  const [selectedOption, setSelectedOption] = useState('15 min');
  const [stockData, setStockData] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [stockNames, setStockNames] = useState([]);
  const [searchQuery] = useState('');
  
  
  const radioOptions = [15, 30, 60, 120, 180, 240, 360, 375];
  // const radioOptions = ['15 min', '30 min', '1 hour', '2 hour', '3 hour', '4 hour', '6 hour', '1 day'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stock names
        const stockNamesResponse = await fetch('http://127.0.0.1:5000/get_all_stock_name');
        const stockNamesData = await stockNamesResponse.json();
        // const dataArray = JSON.parse(stockNamesData);
        setStockNames(stockNamesData);

        // Fetch snapshot_data
        // const data = await FetchData();
        // console.log("Fetched data:", data);
        // setStockData(data);
      } catch (error) {
        // console.error("Error fetching data:", error);
        throw error;
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  const handleStockChange = (e) => {
    setselectedStock(e.target.value);
  };

  const handleRadioChange = (value) => {
    setSelectedOption(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Perform POST request here using selectedStock and selectedOption
      const response = await fetch('http://82.165.211.74/get_stock_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: selectedStock, interval: selectedOption }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response: ', data)
      setStockData(data); // Update stockData state with fetched data
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const filteredStockNames = stockNames.filter((stock) =>
    stock.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // if (!stockData.length && !formSubmitted) {
  //   return <div>Loading...</div>;
  // }
  

  return (
    <div>
      <div className='graph-container'>
        <form onSubmit={handleSubmit}>
          <div className='graph-inner-container'>
              <label className='custom-label'>Enter stock name:</label>
              <input type="text" value={selectedStock} onChange={handleStockChange} list="stockNames"/>

              <datalist id="stockNames">
                {filteredStockNames.map((stock, index) => ( <option key={index} value={stock} /> ))}
              </datalist>              
          </div>
          
          <div className='graph-inner-container'>
              <label className='custom-label'>TimeStamps:</label>
              {radioOptions.map((option, index) => (
              <label key={index}>
                  <input
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleRadioChange(option)}
                  />
                  {option}
              </label>
              ))}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
      
      {formSubmitted && (
        <div>
          <CandlestickChart stockData={ stockData } selectedOption={selectedOption}/>
        </div>
      )}

    </div>
  );
};

export default GraphPage;
