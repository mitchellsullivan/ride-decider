import {RatingUtils} from "./RatingUtils";

class MyPair<K, V> {
    constructor(public first: K,
                public second: V) {}
}

export class Rating {
    public static getRatingPrediction(ratings: Array<Array<number>>,
                                      rowIndex: number,
                                      colIndex: number, ) {

        let originalRatings: Array<Array<number>> = [];
        let ratingsSize = ratings.length;
        for (let i = 0; i < ratingsSize; i++) {
            originalRatings.push(ratings[i]);
        }
        let similaritiesSum = 0;
        let ratingsSum = 0;
        let neighbourhood: Array<MyPair<number, number>> =
            this.getNeighbourhood(rowIndex, colIndex, ratings, originalRatings);
        let neighbourhoodSize = neighbourhood.length;
        if (!neighbourhoodSize) return 0;
        for (let i = 0; i < neighbourhoodSize; i++) {
            similaritiesSum += neighbourhood[i].second;
            ratingsSum += originalRatings[neighbourhood[i].first][colIndex] * neighbourhood[i].second;
        }

        let res = ratingsSum / similaritiesSum;
        return res;
    }

    public static getGlobalBaselineRatingPrediction(ratings: Array<Array<number>>,
                                                    rowIndex: number,
                                                    colIndex: number) {
        let meanRating = RatingUtils.getMean(ratings);
        let userMeanRating = RatingUtils.getRowMean(ratings[rowIndex]);
        let itemMeanRating = RatingUtils.getColMean(ratings, colIndex);

        let result = Math.abs(meanRating + (itemMeanRating - meanRating) + (userMeanRating - meanRating));
        if (isNaN((result))) return 0;
        return result;
    }

    public static getNeighbourhood(
        rowIndex: number,
        colIndex: number,
        ratings: Array<Array<number>>,
        originalRatings: Array<Array<number>>
    ): Array<MyPair<number, number>> {
        // console.log(JSON.stringify(ratings));
        let normA: number = RatingUtils.normalizeVector(ratings[rowIndex]);
        let similarities: Array<MyPair<number, number>> =
            this.getSimilarities(ratings, normA, rowIndex, colIndex, originalRatings);
        similarities.sort((a, b) =>
            (a.second > b.second) ? -1 : 1)
        return similarities;
    }

    public static getNeighbourhoodTop(
        rowIndex: number,
        ratings: Array<Array<number>>,
        originalRatings: Array<Array<number>>
    ): Array<MyPair<number, number>> {
        // console.log(JSON.stringify(ratings));
        let normA: number = RatingUtils.normalizeVector(ratings[rowIndex]);
        let similarities: Array<MyPair<number, number>> =
            this.getSimilaritiesTop(ratings, normA, rowIndex, originalRatings);
        similarities.sort((a, b) =>
            (a.second > b.second) ? -1 : 1)
        return similarities;
    }

    public static getSimilarities(
        ratings: Array<Array<number>>,
        normA: number,
        rowIndex: number,
        colIndex: number,
        originalRatings: Array<Array<number>>
    ): Array<MyPair<number, number>> {
        let similarities: MyPair<number, number>[] = [];
        let ratingsSize = ratings.length;
        for (let i = 0; i < ratingsSize; i++) {
            if (i == rowIndex) continue;
            if (originalRatings[i][colIndex] != 0) {
                let dotProduct: number =
                    RatingUtils.calculateDotProduct(originalRatings[rowIndex], originalRatings[i]);
                let subtractedRawMeanVector: Array<number> =
                    RatingUtils.getSubtractRawMeanFromVector(ratings[i]);
                let normB: number = RatingUtils.normalizeVector(subtractedRawMeanVector);
                let cosineSimilarity: number =
                    RatingUtils.calculateCosineSimilarity(dotProduct, normA, normB);
                similarities.push(new MyPair<number, number>(i, cosineSimilarity));
            }
        }
        return similarities;
    }

    public static getSimilaritiesTop(
        ratings: Array<Array<number>>,
        normA: number,
        rowIndex: number,
        originalRatings: Array<Array<number>>
    ): Array<MyPair<number, number>> {
        let similarities: MyPair<number, number>[] = [];
        let ratingsSize = ratings.length;
        for (let i = 0; i < ratingsSize; i++) {
            if (i == rowIndex) continue;
            let dotProduct: number =
                RatingUtils.calculateDotProduct(originalRatings[rowIndex], originalRatings[i]);
            let subtractedRawMeanVector: Array<number> =
                RatingUtils.getSubtractRawMeanFromVector(ratings[i]);
            let normB: number = RatingUtils.normalizeVector(subtractedRawMeanVector);
            let cosineSimilarity: number =
                RatingUtils.calculateCosineSimilarity(dotProduct, normA, normB);
            similarities.push(new MyPair<number, number>(i, cosineSimilarity));
        }
        return similarities;
    }

    public static getTopCFRecommendations(ratings: Array<Array<number>>, rowIndex: number) {
        let recommendations: Array<MyPair<number, number>> = new Array<MyPair<number, number>>();
        let originalRatings: Array<Array<number>> = new Array<Array<number>>();
        let ratingsSize = ratings.length;
        for (let i = 0; i < ratingsSize; i++) {
            originalRatings.push(ratings[i].map(r => r));
            if (i == rowIndex) {
                RatingUtils.subtractRawMeanFromVector(ratings[rowIndex]);
            }
        }

        let neighbourhood: Array<MyPair<number, number>> =
            this.getNeighbourhoodTop(rowIndex, ratings, originalRatings);
        let neighbourhoodSize = (neighbourhood || []).length;
        if (!neighbourhoodSize) return recommendations;

        let userRowSize = ratings[rowIndex].length;
        for (let i = 0; i < userRowSize; i++) {
            let similaritiesSum = 0;
            let ratingsSum = 0;
            for (let j = 0; j < neighbourhoodSize; j++) {
                similaritiesSum += neighbourhood[j].second;
                ratingsSum += originalRatings[neighbourhood[j].first][i] * neighbourhood[j].second;
            }

            let predictedRating = ratingsSum / similaritiesSum;
            if (!isNaN(predictedRating))
                recommendations.push(new MyPair<number, number>(i, predictedRating));
        }

        let recommendationsSize = recommendations.length;
        if (!recommendationsSize) return recommendations;

        recommendations.sort((a, b) =>
            (a.second > b.second) ? -1 : 1)


        return recommendations;
    }
}