import Uuid from "react-native-uuid";
import {
  DEFAULT_HI,
  DEFAULT_LO
} from "../data";
import type {WeatherPeriod} from "./WeatherPeriod";

export class Criteria {
  static fromOther(other: Criteria): Criteria {
    return Object.assign(new Criteria(), {...other, uuid: Uuid.v1()});
  }

  constructor(public minGoodTemp: any = parseFloat(DEFAULT_LO),
              public maxGoodTemp: any = parseFloat(DEFAULT_HI),
              public rainOkay: boolean = false,
              public prevDayRainOkay: boolean = true,
              public maxWind: any = 100,
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
    return `${this.minGoodTemp}\u00B0F - ${this.maxGoodTemp}\u00B0F, ` +
      `Wet: ${this.prevDayRainOkay ? 'OK' : 'NO'}, ` +
      `Rain: ${this.rainOkay ? 'OK' : 'NO'}, ` +
      `Wind: ${this.maxWind} mph`;
  }

  public correctEmpty(): boolean {
    let corrected = false;
    if (String(this.maxWind).trim() == '') {
      this.maxWind = '50';
      corrected = true;
    }
    if (String(this.maxGoodTemp).trim() == '') {
      this.maxGoodTemp = DEFAULT_HI;
      corrected = true;
    }
    if (String(this.minGoodTemp).trim() == '') {
      this.minGoodTemp = DEFAULT_LO;
      corrected = true;
    }
    return corrected;
  }

  public correctHiLoMixup(cb: Function) {
    let min = parseFloat(
      String(this.minGoodTemp) || DEFAULT_LO);
    let max = parseFloat(
      String(this.maxGoodTemp) || DEFAULT_HI);
    if (min > max) {
      this.minGoodTemp = max;
      this.maxGoodTemp = min;
    }
    this.maxWind = parseFloat(this.maxWind || '50');
    cb(this);
  }

  public onToggleRain(which: string, cb: Function) {
    if (which === 'curr') {
      this.rainOkay = !this.rainOkay;
      if (this.rainOkay) this.prevDayRainOkay = true;
    }
    if (which === 'prev') {
      this.prevDayRainOkay = !this.prevDayRainOkay;
    }
    cb(this);
  }

  public onTextInput(t: string, which: string, cb: Function) {
    if (which === 'hi') {
      this.maxGoodTemp = t;
    } else if (which === 'lo') {
      this.minGoodTemp = t;
    } else if (which === 'mw') {
      this.maxWind = t;
    }
    cb(this);
  }
}
