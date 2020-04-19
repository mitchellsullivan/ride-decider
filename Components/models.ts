import Uuid from 'react-native-uuid';

import {byPoints} from '../data/forecast'

export const DEFAULT_HI = '72';
export const DEFAULT_LO = '60';

export const DEFAULT_LOC = {
  longitude : byPoints.data.geometry.coordinates[0],
  latitude : byPoints.data.geometry.coordinates[1]
}

export type PeriodData = {
  number: number,
  name: string,
  startTime: string,
  endTime: string,
  isDaytime: boolean,
  temperature: number,
  temperatureUnit: string,
  temperatureTrend: null,
  windSpeed: string,
  windDirection: string,
  icon: string,
  shortForecast: string,
  detailedForecast: string
}

export class Criteria {
  static fromOther(other: Criteria): Criteria {
    return Object.assign(new Criteria(), {...other, uuid: Uuid.v1()});
  }

  constructor(public minGoodTemp: any = parseFloat(DEFAULT_LO),
              public maxGoodTemp: any = parseFloat(DEFAULT_HI),
              public rainOkay: boolean = false,
              public prevDayRainOkay: boolean = true,
              public maxWind: any = 50,
              public uuid: string = Uuid.v1()) { }
  
  public compTemperature(period: WeatherPeriod): number {
    if (period.temp >= this.minGoodTemp && period.temp <= this.maxGoodTemp)
      return 0;
    else if (period.temp > this.maxGoodTemp) return 1;
    else if (period.temp < this.minGoodTemp) return -1;
    else return 0;
  }
  
  private compRain(period: WeatherPeriod): number {
    if (!period.wasYesterdayRainy && !period.isRainy) return 0;
    else if (period.wasYesterdayRainy && !this.prevDayRainOkay) return -1;
    else if (period.isRainy && !this.rainOkay) return 1;
    else return 0;
  }
  
  public compWind(period: WeatherPeriod): number {
    return (period.hiWind > this.maxWind) ? 1 : 0;
  }
  
  public passes(period: WeatherPeriod): boolean {
    let temp = this.compTemperature(period);
    let rain = this.compRain(period);
    let wind = this.compWind(period);
    return (temp === 0 && rain === 0 && wind === 0);
  }
  
  public getDisplayString(): string {
    return `Temp: ${this.minGoodTemp}\u00B0F - ${this.maxGoodTemp}\u00B0F, ` +
      `Wet: ${this.prevDayRainOkay ? 'OK' : 'NO'}, ` +
      `Rain: ${this.rainOkay ? 'OK' : 'NO'}, ` +
      `Wind: ${this.maxWind} mph`;
  }
}

export class WeatherPeriod {
  public idx: string;
  public name: string;
  public tempUnit: string;
  public temp: number;
  public hiWind: number;
  public loWind: number;
  public windString: string;
  public isRainy: boolean;
  public wasYesterdayRainy: boolean = false;
  public shortForecast: string = '';
  public isDaytime: boolean;
  public date: string;
  public userRating: number = -1;
  
  constructor(pData: PeriodData) {
    const {
      number, name, temperature, windSpeed, shortForecast,
      temperatureUnit, isDaytime, startTime
    } = pData;
    this.idx = String(number);
    this.name = name;
    this.temp = temperature;
    this.windString = windSpeed;
    this.shortForecast = shortForecast;
    this.tempUnit = temperatureUnit;
    this.isDaytime = isDaytime;
    this.date = startTime.substring(0, 10);

    let winds = this.windString
      .replace('mph', '')
      .split(' to ');

    this.loWind = parseFloat(winds[0]);
    this.hiWind = winds.length < 2 ? this.loWind : parseFloat(winds[1]);

    this.isRainy = ['shower', 'rain', 'storm']
        .some(w => this.shortForecast.toLowerCase().includes(w));
  }
  
  getDisplayString() {
    return `${this.date} ${this.name}, ${this.temp}\u00B0${this.tempUnit}, ` +
      `${this.loWind}` +
      `${this.hiWind === this.loWind ? '' : ' to ' + this.hiWind}` +
      ` mph\n${this.shortForecast}`;
  }
}