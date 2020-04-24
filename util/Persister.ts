import {Criteria, GlobalState, WeatherPeriod} from "../types";
import {AsyncStorage} from "react-native";
import Uuid from "react-native-uuid";

export default class Persister {
  public static async saveCriteria(criteriaList: Criteria[],
                                   currCriteria: Criteria) {
    try {
      await AsyncStorage.setItem(
        'curr', JSON.stringify(currCriteria));
      await AsyncStorage.setItem(
        'criteriaList', JSON.stringify(criteriaList));
    } catch (error) {
    }
  }

  private static _loadSavedState = async () => {
    let ret = new GlobalState();
    try {
      ret.currCriteria = JSON.parse(
        await AsyncStorage.getItem('curr') as string)
        || ret.currCriteria;
      ret.currCriteria.uuid = Uuid.v1();
      ret.periods = JSON.parse(
        await AsyncStorage.getItem('periods') as string)
        || ret.periods;
      ret.criteriaList = JSON.parse(
        await AsyncStorage.getItem('criteriaList') as string)
        || ret.criteriaList;
      ret.history = JSON.parse(
        await AsyncStorage.getItem('history') as string)
        || ret.history;
    } catch (error) {
    }
    return ret;
  }

  private static _toClass = (obj: any, proto: object) => {
    obj.__proto__ = proto;
    return obj;
  }

  public static async loadInit(): Promise<any> {
    let stored = await this._loadSavedState();
    // SET
    let periods: WeatherPeriod[] = (stored.periods || [])
      .map(v => this._toClass(v, WeatherPeriod.prototype));
    let criteriaList: Criteria[] = (stored.criteriaList || [])
      .map(v => this._toClass(v, Criteria.prototype));
    let currCriteria: Criteria = Object.assign(
      new Criteria(), stored.currCriteria);
    let history = (stored.history || [])
      .map(v => this._toClass(v, WeatherPeriod.prototype));
    return {periods, criteriaList, currCriteria, history}
  }

  public static async saveDaysInfoState(periods: WeatherPeriod[],
                                        history: WeatherPeriod[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        'periods', JSON.stringify(periods));
      await AsyncStorage.setItem(
        'history', JSON.stringify(history));
    } catch (error) {
    }
  };

  public static async saveHistory(history: WeatherPeriod[]): Promise<void> {
    await AsyncStorage.setItem('history', JSON.stringify(history));
  }
}
