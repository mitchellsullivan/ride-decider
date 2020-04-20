
export class RatingUtils {
    public static calculateDotProduct(a: Array<number>, b: Array<number>): number {
        let sum = 0;
        let vectorSize = a.length;
        for (let i = 0; i < vectorSize; i++) {
            sum += a[i] * b[i];
        }

        return sum;
    }

    public static normalizeVector(a: Array<number>): number {
        let normalized = 0;
        let vectorSize = a.length;
        for (let i = 0; i < vectorSize; i++) {
            normalized += a[i] * a[i];
        }

        return normalized;
    }

    public static calculateCosineSimilarity(dotProduct: number, normA: number, normB: number): number {
        if (dotProduct == 0 || normA == 0 || normB == 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    public static subtractRawMeanFromVector(a: Array<number>): void {
        let rawMean = this.getRawMean(a);
        let vectorSize = a.length;
        for (let i = 0; i < vectorSize; i++) {
            if (a[i] == 0) continue;
            a[i] -= rawMean;
        }
    }

    public static getSubtractRawMeanFromVector(a: Array<number>): Array<number> {
        let result: Array<number> = [];
        let rawMean = this.getRawMean(a);
        let vectorSize = a.length;
        for (let i = 0; i < vectorSize; i++) {
            result.push(a[i]);
            if (a[i] == 0) continue;
            result[i] -= rawMean;
        }

        return result;
    }

    public static getMean(ratings: Array<Array<number>>): number {
        let sum = 0;
        let counter = 0;

        let ratingsSize = ratings.length;
        for (let i = 0; i < ratingsSize; i++) {
            let currentRowSize = ratings[i].length;
            for (let j = 0; j < currentRowSize; j++) {
                if (ratings[i][j] === 0) continue;
                sum += ratings[i][j];
                counter++;
            }
        }

        return sum / counter;
    }

    public static getRowMean(userRatings: Array<number>): number {
        let sum = 0;
        let counter = 0;
        let userRatingsSize = userRatings.length;
        for (let i = 0; i < userRatingsSize; i++) {
            if (userRatings[i] === 0) continue;
            sum += userRatings[i];
            counter++;
        }

        return sum / counter;
    }

    public static getRawMean(a: Array<number>): number {
        let sum = 0;
        let nonZeros = 0;
        let vectorSize = a.length;
        for (let i = 0; i < vectorSize; i++) {
            if (a[i] == 0) continue;
            sum += a[i];
            nonZeros++;
        }

        return sum / nonZeros;
    }

    public static getColMean(ratings: Array<Array<number>>, colIndex: number) {
        let sum = 0;
        let counter = 0;
        let ratingsSize = ratings.length;
        for (let i = 0; i < ratingsSize; i++) {
            if (ratings[i][colIndex] === 0) continue;
            sum += ratings[i][colIndex];
            counter++;
        }

        return sum / counter;
    }
}