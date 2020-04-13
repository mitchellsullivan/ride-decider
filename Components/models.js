import {byPoints} from '../data/forecast'

export const DEFAULT_HI = '72';
export const DEFAULT_LO = '60';

export const DEFAULT_LOC = {
  longitude : byPoints.data.geometry.coordinates[0],
  latitude : byPoints.data.geometry.coordinates[1]
}

export class Criterium {
  maxGoodTemp: number;
  minGoodTemp: number;
  rainOkay: boolean;
  prevDayRainOkay: boolean;
  
  constructor(minGoodTemp: number = parseFloat(DEFAULT_LO),
              maxGoodTemp: number = parseFloat(DEFAULT_HI),
              rainOkay: boolean = false,
              prevDayRainOkay: boolean = true) {
    this.minGoodTemp = minGoodTemp;
    this.maxGoodTemp = maxGoodTemp;
    this.rainOkay = rainOkay;
    this.prevDayRainOkay = prevDayRainOkay;
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
  wasYesterdayRainy: boolean;
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