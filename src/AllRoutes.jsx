import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Graphs from './pages/Graphs/Graphs'
import StockData from './pages/StockData/StockData'
import { FetchData } from './components/DataFetcher';



const AllRoutes = () => {

  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await FetchData();
        setStockData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <Routes>
      <Route exact path='/' element={<Home />}/>
      <Route exact path='/graphs' element={<Graphs />}/>
      <Route exact path='/fetch_data' element={<StockData stockData={stockData}/>}/>
    </Routes>
  )
}

export default AllRoutes