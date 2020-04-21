import React, {Component} from 'react';
import 'react-native';

import {GlobalContextProvider} from './Components/GlobalContext';
import AppContainer from "./Components/AppContainer";

export default class App extends Component {
  render() {
    return (
      <GlobalContextProvider>
        <AppContainer/>
      </GlobalContextProvider>
    )
  }
}
