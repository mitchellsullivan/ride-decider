import {ByPointsData, ForecastData, LikeStatus, Location, WeatherPeriod} from "../types";
import {DEFAULT_LOC, DUMMY_DAYS} from "../data";
import axios from "axios";
// @ts-ignore
import GetLocation from 'react-native-get-location';

export default class Fetcher {
  public static async getWeatherData(location: Location) {
    let long = location.longitude.toFixed(1);
    let lat = location.latitude.toFixed(1);
    let url = `https://api.weather.gov/points/${lat},${long}`;
    let data: ByPointsData = await axios.get(url);
    let forecastUrl = data.data.properties.forecast;
    let dataFc: ForecastData = await axios.get(forecastUrl);
    return {
      data, dataFc
    }
  }


  public static async getSome(location: Location) {
    let {data, dataFc} = await Fetcher.getWeatherData(location);
    let {data:{properties:{relativeLocation:{properties:{city, state}}}}} = data;
    let periods = Fetcher.processFreshForecastData(dataFc);
    return {
      periods,
      city: `${city}, ${state}`
    }
  }

  public static processFreshForecastData(dataFc: ForecastData): WeatherPeriod[] {
    let periods = dataFc.data.properties.periods
      .map((p: any) => new WeatherPeriod(p))
      .filter(p => p.isDaytime);
    periods[0].pData.name = periods[0].realName;
    periods.forEach((v, i, a) => {
      if (v.isRainy && i < a.length - 1) {
        a[i + 1].wasYesterdayRainy = true;
      }
    })
    return periods;
  }
}
