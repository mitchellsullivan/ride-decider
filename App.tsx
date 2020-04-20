import React from 'react';

import {GlobalContextProvider} from './Components/GlobalContext';
import AppContainer from "./Components/AppContainer";

export default class App extends React.Component {
  render() {
    return (
      <GlobalContextProvider>
        <AppContainer/>
      </GlobalContextProvider>
    )
  }
}

