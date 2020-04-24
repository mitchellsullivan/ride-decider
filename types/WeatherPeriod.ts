import {XTRA_SHORT_DESCRIPTIONS} from "../data";

import CollaborativeFilter from "../util/CollaborativeFilter";

import {
  LikeStatus,
} from "./LikeStatus";

import {
  PredictedRatings
} from "./PredictedRatings";

import {
  PeriodData
} from "./PeriodData";

export class WeatherPeriod {
  public get idx(): string { return String(this.pData.number)}
  public get tempUnit(): string { return this.pData.temperatureUnit }
  public get temp(): number { return this.pData.temperature }
  public get shortForecast(): string { return this.pData.shortForecast}
  public get isDaytime(): boolean { return this.pData.isDaytime}
  public get name(): string { return this.realName };
  public get realName(): string {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'];
    let d = new Date(this.date).getUTCDay();
    return days[d];
  }
  public get isTomorrow(): boolean {
    return new Date().getDay() < new Date(this.date).getUTCDay();
  }

  public get xtrashortfc(): string {
    let icon = this.pData.icon;
    let spl: string = icon.split(/[\/,?]/g)[6];
    return XTRA_SHORT_DESCRIPTIONS[spl].split(/\s+\(/g)[0];
  }

  public abbr: string;

  public get date(): string {
    return this.pData.endTime.substring(0, 10);
  }
  public get isRainy(): boolean {
    return ['shower', 'rain', 'storm', 'snow', 'tornado', 'hurricane', 'sleet']
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

  public get displayString() {
    return `${this.date} ${this.name}, ${this.temp}\u00B0${this.tempUnit}, ` +
      `${this.loWind}` +
      `${this.hiWind === this.loWind ? '' : ' to ' + this.hiWind}` +
      ` mph\n${this.xtrashortfc}`;
  }

  public setPredictedGoodness(history: WeatherPeriod[]) {
    if (history.length == 0) {
      this.prediction = new PredictedRatings();
    } else {
      this.prediction = CollaborativeFilter.predict(history, this);
    }
  }

  public changeLikeStatus(whichPressed: LikeStatus) {
    let curr = this.likedStatus;
    if (whichPressed == curr) {
      this.likedStatus = LikeStatus.NEUTRAL;
    } else if (whichPressed == -curr) {
      this.likedStatus = -this.likedStatus;
    } else {
      this.likedStatus = whichPressed;
    }
  }
}
