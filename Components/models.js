import Uuid from 'react-native-uuid';

import {byPoints} from '../data/forecast'

export const DEFAULT_HI = '72';
export const DEFAULT_LO = '60';

export const DEFAULT_LOC = {
  longitude : byPoints.data.geometry.coordinates[0],
  latitude : byPoints.data.geometry.coordinates[1]
}

export class Criteria {
  constructor(minGoodTemp: number = parseFloat(DEFAULT_LO),
              maxGoodTemp: number = parseFloat(DEFAULT_HI),
              rainOkay: boolean = false,
              prevDayRainOkay: boolean = true,
              maxWind: number = 50,
              uuid: string = Uuid.v1()) {
    this.minGoodTemp = minGoodTemp;
    this.maxGoodTemp = maxGoodTemp;
    this.rainOkay = rainOkay;
    this.prevDayRainOkay = prevDayRainOkay;
    this.maxWind = maxWind;
    this.uuid = uuid;
  }
  
  compTemperature(period: WeatherPeriod): number {
    if (period.temp >= this.minGoodTemp && period.temp <= this.maxGoodTemp)
      return 0;
    else if (period.temp > this.maxGoodTemp) return 1;
    else if (period.temp < this.minGoodTemp) return -1;
  }
  
  compRain(period: WeatherPeriod): number {
    if (!period.wasYesterdayRainy && !period.isRainy) return 0;
    else if (period.wasYesterdayRainy && !this.prevDayRainOkay) return -1;
    else if (period.isRainy && !this.rainOkay) return 1;
    else return 0;
  }
  
  compWind(period: WeatherPeriod): number {
    if (period.hiWind > this.maxWind) {
      return 1;
    } else {
      return 0;
    }
  }
  
  passes(period: WeatherPeriod, dest: object): boolean {
    let temp = this.compTemperature(period);
    let rain = this.compRain(period);
    let wind = this.compWind(period);
    // alert(temp, rain, wind);
    return (temp === 0 && rain === 0 && wind === 0);
  }
  
  
  ratePeriodColor(period: WeatherPeriod): string {
    let color = 'white'
    switch (this.compTemperature(period)) {
      case -1: color = 'lightblue'; break;
      case  0: color = 'white'; break;
      case  1: color = 'salmon'; break;
    }
    switch (this.compRain(period)) {
      case -1: color = '#aaa'; break;
      case  0: break;
      case  1: color = 'gray'; break;
    }
    return color;
  }
  
  getDisplayString(): string {
    return `Temp: ${this.minGoodTemp}\u00B0F - ${this.maxGoodTemp}\u00B0F, ` +
      `Wet: ${this.prevDayRainOkay ? 'OK' : 'NO'}, ` +
      `Rain: ${this.rainOkay ? 'OK' : 'NO'}, ` +
      `Wind: ${this.maxWind} mph`;
  }
}

export class WeatherPeriod {
  idx: number;
  name: string;
  tempUnit: string;
  temp: number;
  hiWind: number;
  loWind: number;
  windString: string;
  isRainy: boolean;
  wasYesterdayRainy: boolean = false;
  shortForecast: string = '';
  isDaytime: boolean;
  
  constructor(pData) {
    this.idx = String(pData['number']);
    this.name = pData['name'];
    this.temp = parseFloat(pData['temperature']);
    this.windString = pData['windSpeed'];
    let winds = this.windString
      .replace('mph', '')
      .split(' to ');
    this.loWind = parseFloat(winds[0]);
    this.hiWind = winds.length < 2 ? this.loWind : parseFloat(winds[1]);
    this.shortForecast = pData['shortForecast'];
    this.tempUnit = pData['temperatureUnit'];
    let lfc = this.shortForecast.toLowerCase();
    this.isRainy = lfc.includes('shower') ||
      lfc.includes('rain') ||
      lfc.includes('storm');
    this.isDaytime = pData['isDaytime'];
  }
  
  getDisplayString() {
    return `${this.name}, ${this.temp}\u00B0${this.tempUnit}, ` +
      `${this.loWind}` +
      `${this.hiWind === this.loWind ? '' : ' to ' + this.hiWind}` +
      `\n${this.shortForecast}`;
  }
}