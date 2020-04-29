import React from 'react';
import Fetcher from "../util/Fetcher";
import Historian from "../util/Historian";
import Persister from "../util/Persister";
import SafeArea from "react-native-safe-area";
// @ts-ignore
import GetLocation from 'react-native-get-location';

import {
  Criteria,
  LikeStatus,
  WeatherPeriod,
  GlobalState,
  // Location,
} from '../types';
import {DEFAULT_LOC} from "../data";

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
    GlobalContextProvider._setPredictions(periods, history);

    this.setState({
      periods,
      currCriteria,
      criteriaList,
      history
    });

    // setTimeout(async () => {
      this.setState({
        loading: true,
        location: DEFAULT_LOC
      });

      let opts = {
        enableHighAccuracy: true,
        timeout: 5000,
      }

      setTimeout(async () => {
        await GetLocation.getCurrentPosition(opts).then(async (location: any) => {
          console.log('LOCATION:', location);
          await this.onFetchData(location, history)
        }).catch((err: any) => {
          console.log(err);
          this.setState({
            loading: false
          })
        })
      }, 200);

  }

  onDummyHistoryPressed = async (isDummyHistoryOn: boolean): Promise<void> => {
    let {history, periods} = this.state;
    history = Historian.doDummies(history, isDummyHistoryOn ? 'rem' : 'add');
    GlobalContextProvider._setPredictions(periods, history);
    this.setState({
      history,
      periods
    })
    await Persister.saveDaysInfoState(periods, history);
  }

  private static _setPredictions = (periods: WeatherPeriod[],
                                    history: WeatherPeriod[]): void => {
    if (periods.length > 0) {
      for (let p of periods) {
        p.setPredictedGoodness(history);
      }
    }
  }

  onFetchData = async (location: any, history: WeatherPeriod[]) => {
    let {periods, city} = await Fetcher.getSome(location);
    Historian.syncTodayLikeWithHistory(periods, history);
    GlobalContextProvider._setPredictions(periods, history);
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

  onChangeRain = (which: string): void => {
    this.state.currCriteria
      .onToggleRain(which, (cc: Criteria) => this.setState({
      currCriteria: cc,
    }));
  }

  onHistoryRowPressed = async (item: WeatherPeriod): Promise<void> => {
    item.likedStatus = -item.likedStatus;
    let {history, periods} = this.state;
    this.setState({
      history
    })
    GlobalContextProvider._setPredictions(periods, history);
  }

  onThumbButtonPress = async (which: LikeStatus): Promise<void> => {
    let { periods, history } = this.state;
    if (periods.length == 0) return;
    const fst = periods[0];
    fst.changeLikeStatus(which);
    history = Historian.onLikeAdjustHistory(fst, history);
    GlobalContextProvider._setPredictions(periods, history);
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
        onDummyHistoryPressed: this.onDummyHistoryPressed,
        onHistoryRowPressed: this.onHistoryRowPressed
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
