import {Criteria} from './Criteria';
import {WeatherPeriod} from "./WeatherPeriod";

import {DEFAULT_LOC} from "../data";
import SafeAreaInsets from "react-native-safe-area";

export class GlobalState {
  public currCriteria: Criteria = new Criteria();
  public criteriaList: Array<Criteria> = [];
  public periods: Array<WeatherPeriod> = [];
  public loading: boolean = false;
  public history: Array<WeatherPeriod> = [];
  public location = DEFAULT_LOC;
  public safeAreaInsets: SafeAreaInsets =
    {top: 20, bottom: 0, left: 0, right: 0}
  public city: string = 'Loading...';
}
