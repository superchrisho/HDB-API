// !exp modules
import * as React from 'react';
import axios from 'axios';

// !exp styles
import './styles/App.css';

// !exp own components
import DisplayData from './components/DisplayData';
import apiResource from './data/resource';

function App() {

  // !var states
  const [data, setData] = React.useState();
  const [query, setQuery] = React.useState(null);
  const [maxRecords, setMaxRecords] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [apiUrl, setApiUrl] = React.useState(
    `https://data.gov.sg/api/action/datastore_search?resource_id=`
  );


  // !exp handlers
  const inputHandler = e => {
    const inputVal = e.target.value;
    setQuery(inputVal);
  };

  const enterHandler = e => {
    if (e.which == 13) {
      fetchQuery();
    }
  };

  const buttonHandler = () => {
    fetchQuery();
  };

  // !exp fetch API
  const fetchQuery = async () => {
    if (query) {
      const result = await axios(apiUrl + `&q=${query}&limit=${maxRecords}`);
      setData(result.data.result.records);
    } else {
      setData('');
    }
  };

  const fetchData = async () => {
    apiResource.forEach(ele => {
      axios(`${apiUrl + ele.resourceID} `)
    }).then(result => {
      const records = result.data.result;
      setData()
    })
  }

  const fetchTotal = async () => {
    let grandTotal=0
    apiResource.forEach(ele => {
      axios(`${apiUrl + ele.resourceID}`)
        .then(result => {
          let total = result.data.result.total;
          grandTotal += total;
          console.log(`Element period: ${ele.period} total: ${total}`)
          setMaxRecords(grandTotal);
          setIsLoading(false);
      }).catch(err=>console.log(err))
    })
    
  };

  React.useEffect(() => {
    fetchTotal();
  }, []);

  return (
    <div className='App'>
      <h1>HDB Resale API query</h1>
      <div>
        <label htmlFor='search'>Search:</label>
        <input
          type='text'
          name='search '
          onChange={inputHandler}
          autoComplete='off'
          onKeyPress={enterHandler}
        />
        <button onClick={buttonHandler}>Search</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <DisplayData maxRecords={maxRecords} data={data} />
      )}
    </div>
  );
}

export default App;
