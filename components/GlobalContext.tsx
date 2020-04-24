import React from 'react';
import Fetcher from "../util/Fetcher";
import Historian from "../util/Historian";
import Persister from "../util/Persister";
import SafeArea from "react-native-safe-area";

import {
  Criteria,
  LikeStatus,
  WeatherPeriod,
  GlobalState,
  Location,
} from '../types';

const GlobalContext = React.createContext({});


export class GlobalContextProvider extends React.Component<any, GlobalState> {
  constructor(props: any) {
    super(props);
    this.state = new GlobalState()
  }

  onAppInit = async() => {
    this.setState({
      safeAreaInsets: await SafeArea.getSafeAreaInsetsForRootView()
    })
    let {history, periods, currCriteria, criteriaList} = await Persister.loadInit()
    history = Historian.doDummies(history, 'rem');
    this.setPredictions(periods, history);

    this.setState({
      periods,
      currCriteria,
      criteriaList,
      history
    });

    setTimeout(async () => {
      let location = await this.requestLocation();
      await this.onFetchData(location, history);
    }, 250);
  }

  adjustDummyHistory = async (isDummyHistoryOn: boolean): Promise<void> => {
    let {history, periods} = this.state;
    history = Historian.doDummies(history, isDummyHistoryOn ? 'rem' : 'add');
    this.setPredictions(periods, history);
    this.setState({
      history,
      periods
    })
    await Persister.saveDaysInfoState(periods, history);
  }

  setPredictions = (periods: WeatherPeriod[], history: WeatherPeriod[]) => {
    if (periods.length > 0) {
      for (let p of periods) {
        p.setPredictedGoodness(history);
      }
    }
  }

  onFetchData = async (location: Location, history: WeatherPeriod[]) => {
    let {periods, city} = await Fetcher.getSome(location);
    Historian.syncTodayLikeWithHistory(periods, history);
    this.setPredictions(periods, history);
    this.setState({
      location,
      periods,
      loading: false,
      city
    });
  }

  onAddCriteria = async () => {
    this.state.currCriteria.correctHiLoMixup((cc: Criteria) => {
      this.setState({
        criteriaList: [cc, ...this.state.criteriaList],
        currCriteria: Criteria.fromOther(cc)
      })
    })
    await this.onSaveCriteria();
  }

  onDelCriteria = async (uuid: string) => {
    this.setState({
      criteriaList: this.state.criteriaList.filter(v => v.uuid !== uuid)
    });
    await this.onSaveCriteria();
  }

  onSaveCriteria = async () => {
    let {criteriaList, currCriteria} = this.state;
    if (currCriteria.correctEmpty()) {
      this.setState({currCriteria})
    }
    await Persister.saveCriteria(criteriaList, currCriteria);
  }

  requestLocation = async(): Promise<Location> => {
    this.setState({
      loading: true,
      location: {latitude: 0, longitude: 0}
    });
    return await Fetcher.findMe(() => {
      this.setState({
        loading: false
      })
    });
  }

  onChangeRain = (which: string) => {
    let {currCriteria} = this.state;
    currCriteria.onToggleRain(which);
    this.setState({
      currCriteria,
    })
  }

  onThumbButtonPress = async (which: LikeStatus): Promise<void> => {
    let { periods, history } = this.state;
    if (periods.length == 0) return;
    const fst = periods[0];
    fst.changeLikeStatus(which);
    history = Historian.onLikeAdjustHistory(fst, history);
    this.setPredictions(periods, history);
    this.setState({
      history,
      periods
    })
    await Persister.saveHistory(history);
  }

  onChangeCriteriaTxtBox = (t: string, which: string) => {
    this.state.currCriteria.onTextInput(t, which, (cc: Criteria) => {
      this.setState({
        currCriteria: cc
      })
    })
  }

  private get _globalStuff() {
    return {
      value: {
        ...this.state,
        saveState: Persister.saveDaysInfoState,
        saveCriteria: this.onSaveCriteria,
        onChangeCriteriaTxtBox: this.onChangeCriteriaTxtBox,
        onChangeRain: this.onChangeRain,
        addCriteria: this.onAddCriteria,
        delCriteria: this.onDelCriteria,
        appInit: this.onAppInit,
        onThumbButtonPress: this.onThumbButtonPress,
        onDummyHistoryPressed: this.adjustDummyHistory
      }
    }
  }

  render () {
    return (
      <GlobalContext.Provider {...this._globalStuff}>
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

// create the consumer as higher order component
export const withGlobalContext = (ChildComponent: any) => (props: any) => (
  <GlobalContext.Consumer>
    {
      context => <ChildComponent {...props} global={context}  />
    }
  </GlobalContext.Consumer>
);
