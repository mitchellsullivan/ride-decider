import React from 'react';
import Uuid from 'react-native-uuid';

import {byPoints} from '../data/forecast'
import {descs} from "../data/descs";
import {CollaborativeFilter, PredictedRatings} from "../util/CollaborativeFilter";

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
  detailedForecast: string,
  likedStatus: number
}

export class Criteria {
  static fromOther(other: Criteria): Criteria {
    return Object.assign(new Criteria(),
        {...other, uuid: Uuid.v1()});
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

export enum LikeStatus {
  DISLIKED = -1,
  NEUTRAL = 0,
  LIKED = 1,
}

export class WeatherPeriod {
  public get idx(): string { return String(this.pData.number)}
  public get tempUnit(): string { return this.pData.temperatureUnit }
  public get temp(): number { return this.pData.temperature }
  public get shortForecast(): string { return this.pData.shortForecast}
  public get isDaytime(): boolean { return this.pData.isDaytime}
  public get name(): string { return this.pData.name };

  public get xtrashortfc(): string {
    let icon = this.pData.icon;
    let spl: string = icon.split(/[\/,?]/g)[6];
    return descs[spl].split(/\s+\(/g)[0];
  }

  public abbr: string;

  public get date(): string {
    return this.pData.startTime.substring(0, 10);
  }
  public get isRainy(): boolean {
    return ['shower', 'rain', 'storm']
        .some(w => this.shortForecast.toLowerCase().includes(w));
  }

  public prediction: PredictedRatings = new PredictedRatings();

  public hiWind: number;
  public loWind: number;
  public windString: string;
  public wasYesterdayRainy: boolean = false;
  public likedStatus: LikeStatus = LikeStatus.NEUTRAL;

  constructor(public pData: PeriodData) {
    const { windSpeed } = pData;
    this.windString = windSpeed;
    let winds = windSpeed
      .replace('mph', '')
      .split(' to ');
    this.loWind = parseFloat(winds[0]);
    this.hiWind = winds.length < 2 ? this.loWind : parseFloat(winds[1]);
    let icon = this.pData.icon;
    this.abbr = icon.split(/[\/,?]/g)[6];
    this.likedStatus = pData.likedStatus;
  }

  getDisplayString() {
    return `${this.date} ${this.name}, ${this.temp}\u00B0${this.tempUnit}, ` +
      `${this.loWind}` +
      `${this.hiWind === this.loWind ? '' : ' to ' + this.hiWind}` +
      ` mph\n${this.shortForecast}`;
  }

  public setPredictedGoodness(history: WeatherPeriod[]) {
    this.prediction = CollaborativeFilter.predict(history, this);
    // console.log(this.prediction);
  }

  public get forHistory(): any {
    return {}
  }
}
