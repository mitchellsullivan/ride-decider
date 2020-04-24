import {Recommender} from "./rater/Recommender";
import {CondFunc, WeatherPeriod, PredictedRatings} from '../types'

export const CLEAR = ['skc', 'few', 'sct', 'wind_skc', 'wind_few', 'wind_sct']
export const PARTLY = ['few', 'sct', 'bkn', 'wind_few', 'wind_sct', 'wind_bkn']
export const CLOUDY = ['bkn', 'ovc', 'sct', 'wind_sct', 'wind_bkn', 'wind_ovc', 'fog', 'haze']
export const ALL = [...CLEAR, ...PARTLY, ...CLOUDY]


export default class CollaborativeFilter {
  public static tempConds: CondFunc[] = [
    ({temp}) => temp >= 92,
    ({temp}) => 80 <= temp && temp <= 93,
    ({temp}) => 70 <= temp && temp <= 83,
    ({temp}) => 60 <= temp && temp <= 73,
    ({temp}) => 50 <= temp && temp <= 63,
    ({temp}) => 40 <= temp && temp <= 53,
    ({temp}) => 30 <= temp && temp <= 43,
    ({temp}) => temp <= 35,
  ];

  public static skyConds: CondFunc[] = [
    ({abbr}) => CLEAR.includes(abbr),
    ({abbr}) => PARTLY.includes(abbr),
    ({abbr}) => CLOUDY.includes(abbr),
    ({abbr}) => !ALL.includes(abbr),
  ];

  public static windConds: CondFunc[] = [
    ({hiWind}) => 15 <= hiWind,
    ({hiWind}) =>  5 <= hiWind && hiWind <= 15,
    ({hiWind}) =>  0 <= hiWind && hiWind <= 10,
  ]

  public static get allConds(): CondFunc[] {
    return [...this.tempConds, ...this.skyConds, ...this.windConds];
  }

  public static predict(prevDays: WeatherPeriod[], testDay: WeatherPeriod) {
    let mtx = this._getRatingHistoryMtx(prevDays);
    // new row with default value of 50 and set to zero
    // at spots we need to predict
    // console.log(mtx);
    return this._predict(mtx, testDay);
  }

  public static setRating(prevDays: WeatherPeriod[], day: WeatherPeriod): void {
    // let mtx = this._getRatingHistoryMtx(prevDays);
    // let res = this.allConds.map(c => this._getMtxVal(c, day));
    prevDays.push(day);
    // mtx.push(res);
  }

  private static _getMtxVal(c: CondFunc, day: WeatherPeriod): number {
    if (c(day)) {
      if (day.likedStatus == -1) {
        return 1;
      } else if (day.likedStatus == 0) {
        return 50;
      } else if (day.likedStatus == 1) {
        return 100;
      }
    }
    return 50;
  }

  private static _avgScore(scores: number[]): number {
    let filtered = scores.filter(s => s != 0);
    let n = filtered.length;
    let sum = filtered.reduce((a: number, b: number) => a + b);
    return sum / n;
  }

  private static _getRatingHistoryMtx(prevDays: WeatherPeriod[]): number[][] {
    let res = [];
    for (let prevDay of prevDays) {
      let trow = this.tempConds.map(c => this._getMtxVal(c, prevDay));
      let srow = this.skyConds.map(c => this._getMtxVal(c, prevDay));
      let wrow = this.windConds.map(c => this._getMtxVal(c, prevDay))
      res.push([...trow, ...srow, ...wrow]);
    }
    return res;
  }

  private static _avgScoresByCategory(scores: number[]): PredictedRatings {
    // done predicting
    let tempScores: number[] = [];
    let skyScores: number[] = [];
    let windScores: number[] = [];
    let tcl = this.tempConds.length;
    let scl = this.skyConds.length;

    for (let i = 0; i < scores.length; ++i) {
      if (scores[i] != 0) {
        if (i < tcl) {
          tempScores.push(scores[i]);
        } else if (i >= tcl && i < tcl + scl) {
          skyScores.push(scores[i]);
        } else {
          windScores.push(scores[i]);
        }
      }
    }

    return new PredictedRatings(this._avgScore(tempScores),
      this._avgScore(skyScores),
      this._avgScore(windScores));
  }

  private static _predict(mtx: number[][], testDay: WeatherPeriod): PredictedRatings {
    let dummyRow = this.allConds.map(c => c(testDay) ? 0 : 50);
    mtx.push(dummyRow);
    let h = mtx.length;
    let w = mtx[0].length;
    let scores = new Array(w).fill(0);

    mtx[h - 1].forEach((v:number, i:number) => {
      if (v == 0) {
        scores[i] = Recommender.getRatingPrediction(mtx, h - 1, i);
        // console.log('scored', i, scores[i]);
      }
    })

    // lastRow =
    mtx.pop();
    return this._avgScoresByCategory(scores);
  }
}
