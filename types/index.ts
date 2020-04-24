import {PeriodData} from "./PeriodData";
import {WeatherPeriod} from "./WeatherPeriod";

export {WeatherPeriod} from './WeatherPeriod';
export {PredictedRatings} from './PredictedRatings';
export type {PeriodData} from './PeriodData';
export {Criteria} from './Criteria';
export {GlobalState} from './GlobalState';
export {LikeStatus} from './LikeStatus';


export type CondFunc = (_:WeatherPeriod) => boolean

export interface Location {
  latitude: number;
  longitude: number;
}

export type ByPointsData = {
  data: {
    properties: {
      forecast: string,
      relativeLocation: {
        properties: {
          city: string
          state: string
        }
      }
    }
  }
}

export type ForecastData = {
  data: {
    properties: {
      periods: Array<PeriodData>
    }
  }
}
