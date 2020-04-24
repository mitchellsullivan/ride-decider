import {LikeStatus, WeatherPeriod} from "../types";
import {DUMMY_DAYS} from "../data";

export default class Historian {
  public static syncTodayLikeWithHistory(periods: WeatherPeriod[],
                                         history: WeatherPeriod[]) {
    if (periods.length > 0 && history.length > 0) {
      if (periods[0].date == history[0].date) {
        periods[0].likedStatus = history[0].likedStatus;
        history[0] = periods[0];
      }
    }
  }

  public static onLikeAdjustHistory(fst: WeatherPeriod, history: WeatherPeriod[]) {
    let existing = history.find(h => h.date == fst.date);
    if (!existing) {
      history = [fst, ...history];
    } else {
      if (fst.likedStatus == LikeStatus.NEUTRAL ) {
        let d = existing.date || '';
        history = history.filter(h => h.date !== d);
      } else {
        existing.likedStatus = fst.likedStatus;
      }
    }
    return history;
  }

  public static doDummies(history: WeatherPeriod[], action: string) {
    let dummies = DUMMY_DAYS
      .map((p: any) => new WeatherPeriod(p))
      .filter(p => p.isDaytime);
    if (action == 'add') {
      history = [...history, ...dummies]
    } else if (action == 'rem') {
      let dates = dummies.map(d => d.date);
      history = history.filter(h => !dates.includes(h.date));
    }
    return history;
  }

}
