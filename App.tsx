import React, {Component} from 'react';
import 'react-native';

import {GlobalContextProvider} from './components/GlobalContext';
import AppContainer from "./components/AppContainer";

export default class App extends Component {
  render() {
    return (
      <GlobalContextProvider>
        <AppContainer/>
      </GlobalContextProvider>
    )
  }
}
