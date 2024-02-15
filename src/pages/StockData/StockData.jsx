function StockData ({ stockData }) {

  return (
    <table>
      <thead>
        <tr>
          <th>Stock</th>
          <th>Date</th>
          <th>Time</th>
          <th>Open</th>
          <th>High</th>
          <th>Low</th>
          <th>Close</th>
          <th>Volume</th>
          <th>S</th>
        </tr>
      </thead>
      <tbody>
        {stockData.map((stock, index) => (
          <tr key={index}>
            <td>{stock.stock}</td>
            <td>{stock.date}</td>
            <td>{stock.time}</td>
            <td>{stock.open}</td>
            <td>{stock.high}</td>
            <td>{stock.low}</td>
            <td>{stock.close}</td>
            <td>{stock.volume}</td>
            <td>{stock.s}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockData;