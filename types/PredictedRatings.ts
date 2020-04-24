export class PredictedRatings {
  constructor(public tempRating: number = 0.5,
              public skyRating: number = 0.5,
              public windRating: number = 0.5) {
  }

  public get tempRatingStr() {
    return this.tempRating.toFixed(2)
  }

  public get skyRatingStr() {
    return this.skyRating.toFixed(2)
  }

  public get windRatingStr() {
    return this.windRating.toFixed(2)
  }
}
