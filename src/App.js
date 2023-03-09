import './styles/App.css';
import ProductList from './components/ProductList';
import ProductAdd from './components/ProductAdd';
import React, { useState } from 'react'

/**
 * The App component renders the ProductList and ProductAdd components based on the current route.
 * @param None
 * @return JSX element containing the ProductList or ProductAdd component and a horizontal line
 */
const App = () => {
  const SERVER_URL = 'https://domain.com'
  const API_LIST = {
    products : '/api/product/'
  }

  const [route, setRoute] = useState('/')
  const routes = [
    {
      path: '/',
      element: <ProductList setRoute={setRoute} api_url={SERVER_URL+API_LIST.products}/>
    },
    {
      path: '/add',
      element: <ProductAdd  setRoute={setRoute} api_url={SERVER_URL+API_LIST.products}/>
    }
  ]

  const currentComponent = <div></div>;
  const getComponent = () => {
    switch (route) {
      case routes[0].path:
        return routes[0].element;
        break;
      case routes[1].path:
        return routes[1].element;
        break;
    }
  }
  return (
    <div className="App">
      {getComponent()}
      <hr />
    </div>

  );
}

export default App;
