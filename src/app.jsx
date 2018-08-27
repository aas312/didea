import React from 'react';
import { ListContainer } from './components/ListContainer'

const App = () => (
  <div className='App'>
    <ListContainer onlyInState={[1]} />
  </div>
);

export default App
