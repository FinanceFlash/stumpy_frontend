export const FetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/ohlc_data');
      const jsonData = await response.json();
      const dataArray = JSON.parse(jsonData);
      return dataArray;      
    } catch (error) {
      console.log("Error fetching data: ", error);
      throw error;
    }
}