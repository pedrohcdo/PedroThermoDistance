/**
 * Computes a detailed similarity score between two strings using a dynamic programming approach with a novel 'thermometer' mechanism.
 * This function allows specifying comparison modes (edit, delete, transversal) and incorporates a custom penalty function that dynamically affects the similarity scoring based on 'thermometerSize'.
 * The 'thermometerSize' defines the range and granularity of penalty application, influencing the impact of each string operation.
 * Each character operation can either increase or decrease the similarity score based on the operational mode and the applied penalties.
 *
 * @param {string} firstText - The first string to compare, typically a sequence of characters.
 * @param {string} secondText - The second string to compare.
 * @param {number} thermometerSize - Defines the granularity and range of the thermometer mechanism which is central to calculating penalties.
 * @param {Function} costFunction - A callback function to calculate the penalty based on the match success and the attempt number, which reflects how 'hot' or 'cold' the match is in the thermometer context.
 * @param {('edit' | 'delete' | 'transversal')[]} mode - An array of operation modes that specify allowable character operations. The default includes all modes.
 * @param {Object} options - Configuration options for scores, with individual scores assignable to each operation type (edit, delete, transversal).
 *
 * @returns {number} A similarity score between 0 and 1, calculated based on the ratio of correct matches to total operations, adjusted for penalties.
 *
 * Example usage:
 * const similarityScore = PedroThermoSimilarityPass("hello", "h3llo", 3, (match, attempt) => match ? attempt * 2 : attempt * 3, ['edit', 'transversal'], {editScore: 0.2, transversalScore: 0.3});
 * console.log(similarityScore); // ~0.89
 */
class PedroThermoDistance {

    private constructor(
        private firstText: string,
        private secondText: string,
        private thermometerSize: number,
        private dp: [number, number][][][],
        private options: {
            heating?: number,
            cooling?: number
        } | undefined = {
                heating: 1,
                cooling: 1
            }
    ) { }

    static from(
        firstText: string,
        secondText: string,
        thermometerSize: number,
        options: {
            heating?: number,
            cooling?: number
        } | undefined = {
                heating: 1,
                cooling: 1
            }
    ) {
        const thermometerWidth = thermometerSize * 2 + 1

        // [ltr, rtl][firstTextLen][secondTextLen][thermometerWidth]
        const dp: [number, number][][][] = new Array(firstText.length + 1).fill(0).map(() =>
            new Array(secondText.length + 1).fill(0).map(() => {
                return new Array(thermometerWidth).fill(0).map(() => [0, 0])
            })
        );

        // Laterals
        for (let i = 1; i <= firstText.length; i++) {
            for (let a = 0; a < thermometerWidth; a++) {
                dp[i][0][a][0] = dp[i - 1][0][Math.max(a - (options?.cooling || 1), 0)][0] + (thermometerWidth - a);
                dp[i][0][a][1] = dp[i - 1][0][Math.max(a - (options?.cooling || 1), 0)][1] + (thermometerWidth - a);
            }
        }
        for (let i = 1; i <= secondText.length; i++) {
            for (let a = 0; a < thermometerWidth; a++) {
                dp[0][i][a][0] = dp[0][i - 1][Math.max(a - (options?.cooling || 1), 0)][0] + (thermometerWidth - a);
                dp[0][i][a][1] = dp[0][i - 1][Math.max(a - (options?.cooling || 1), 0)][1] + (thermometerWidth - a);
            }
        }

        //
        for (let i = 0; i < firstText.length; i++) {
            for (let j = 0; j < secondText.length; j++) {
                for (let a = 0; a < thermometerWidth; a++) {

                    const cost = thermometerWidth - a
                    const heat = Math.min(a + (options?.heating || 1), thermometerWidth - 1)
                    const cold = Math.max(a - (options?.cooling || 1), 0)

                    // Left to Right
                    {
                        const cutsCandidatesLTR: number[] = []

                        // Normal Compare
                        if (firstText.charAt(i) === secondText.charAt(j))
                            cutsCandidatesLTR.push(dp[i][j][heat][0])

                        // Delete
                        cutsCandidatesLTR.push(dp[i + 1][j][cold][0] + cost)
                        cutsCandidatesLTR.push(dp[i][j + 1][cold][0] + cost)

                        // Transversal Compare
                        const transversal = (i >= 1 && j >= 1)
                            && (firstText.charAt(i - 1) === secondText.charAt(j)
                                && firstText.charAt(i) === secondText.charAt(j - 1))
                        if (transversal)
                            cutsCandidatesLTR.push(dp[i - 1][j - 1][cold][0])

                        dp[i + 1][j + 1][a][0] = Math.min(...cutsCandidatesLTR)
                    }

                    // Right to Left
                    {
                        const cutsCandidatesRTL: number[] = []

                        // Normal Compare
                        if (firstText.charAt(firstText.length - i - 1) === secondText.charAt(secondText.length - j - 1))
                            cutsCandidatesRTL.push(dp[i][j][heat][1])

                        // Delete
                        cutsCandidatesRTL.push(dp[i + 1][j][cold][1] + cost)
                        cutsCandidatesRTL.push(dp[i][j + 1][cold][1] + cost)

                        // Transversal Compare
                        const transversal = (i >= 1 && j >= 1)
                            && (firstText.charAt(firstText.length - i) === secondText.charAt(secondText.length - j - 1)
                                && firstText.charAt(firstText.length - i - 1) === secondText.charAt(secondText.length - j))
                        if (transversal)
                            cutsCandidatesRTL.push(dp[i - 1][j - 1][cold][1])

                        dp[i + 1][j + 1][a][1] = Math.min(...cutsCandidatesRTL)
                    }
                }
            }
        }

        return new PedroThermoDistance(firstText, secondText, thermometerSize, dp, options)
    }

    get thermometerWidth() {
        return this.thermometerSize * 2 + 1
    }

    private traverseTo(impulse: number = 1, directionDim: 0 | 1 = 0) {
        let i = this.firstText.length - 1
        let j = this.secondText.length - 1

        let temperature = Math.max(0, Math.min(this.thermometerWidth - 1, (this.thermometerWidth - 1) * impulse))
        let measurements: number[] = []

        let matchedText1 = ""
        let matchedText2 = ""
        while (i >= 0 || j >= 0) {
            if (i === -1) {
                measurements.push(this.thermometerWidth - temperature)
                matchedText2 = `-` + matchedText2
                j--
                temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
                continue
            } else if (j === -1) {
                measurements.push(this.thermometerWidth - temperature)
                matchedText1 = '-' + matchedText1
                i--
                temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
                continue
            }

            let charPositionI = directionDim === 0 ? i : (this.firstText.length - i - 1)
            let charPositionJ = directionDim === 0 ? j : (this.secondText.length - j - 1)

            if (this.firstText.charAt(charPositionI) === this.secondText.charAt(charPositionJ)) {
                measurements.push(0)
                matchedText1 = this.firstText.charAt(charPositionI) + matchedText1
                matchedText2 = this.secondText.charAt(charPositionJ) + matchedText2
                temperature = Math.min(temperature + (this.options?.heating || 1), this.thermometerWidth - 1)
                i--
                j--
                continue
            }

            let tDirection = directionDim === 0 ? -1 : 1
            const transversal = (i >= 1 && j >= 1)
                && (this.firstText.charAt(charPositionI + tDirection) === this.secondText.charAt(charPositionJ)
                    && this.firstText.charAt(charPositionI) === this.secondText.charAt(charPositionJ + tDirection))

            if (transversal) {
                measurements.push(0)
                matchedText1 = this.firstText.charAt(charPositionI) + this.firstText.charAt(charPositionI + tDirection) + matchedText1
                matchedText2 = this.firstText.charAt(charPositionI) + this.firstText.charAt(charPositionI + tDirection) + matchedText2
                i -= 2
                j -= 2
            } else if (this.dp[i + 1][j][temperature][directionDim] <= this.dp[i][j + 1][temperature][directionDim]) {
                measurements.push(this.thermometerWidth - temperature)
                matchedText2 = `-` + matchedText2
                temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
                j--
            } else {
                measurements.push(this.thermometerWidth - temperature)
                matchedText1 = '-' + matchedText1
                temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
                i--
            }
        }

        //
        return {
            matchedText1,
            matchedText2,
            measurements
        }
    }

    traverse(impulse: number = 1) {
        const ltr = this.traverseTo(impulse, 0)
        const rtl = this.traverseTo(impulse, 1)
        return {
            ltr,
            rtl
        }
    }

    distance(impulse: number = 1, direction: 'ltr' | 'rtl' = 'ltr') {
        const startOn = Math.max(0, Math.min(this.thermometerWidth - 1, (this.thermometerWidth - 1) * impulse))
        return this.dp[this.firstText.length][this.secondText.length][startOn][direction === 'ltr' ? 0 : 1]
    }

    maxDistance(impulse: number = 1) {
        let maxDistance = 0
        let temperature = Math.max(0, Math.min(this.thermometerWidth - 1, (this.thermometerWidth - 1) * impulse))

        for (let i = 0; i < (this.firstText.length + this.secondText.length); i++) {
            maxDistance += this.thermometerWidth - temperature
            temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
        }

        return maxDistance
    }

    similarityTo(impulse: number = 1, direction: 'ltr' | 'rtl' = 'ltr') {
        return 1 - this.distance(impulse, direction) / this.maxDistance(impulse)
    }

    similarity(impulse: number = 1) {
        return Math.max(this.similarityTo(impulse, 'ltr'), this.similarityTo(impulse, 'rtl'))
    }

    localSimilarity(impulse: number) {
        //
        function standardDeviation(measurements: number[]) {
            let mean = measurements.reduce((prev, curr) => prev + curr, 0) / measurements.length
            return Math.sqrt(measurements.reduce((prev, curr) => prev + Math.pow(curr - mean, 2), 0) / (measurements.length - 1))
        }
    
        //
        const { ltr, rtl } = this.traverse(impulse)
    
        const similarity1 = this.similarityTo(impulse, 'ltr')
        const similarity1W = 1 - Math.abs(0.5 - similarity1) / 0.5
        const standardDeviation1W = standardDeviation(ltr.measurements) * Math.pow(similarity1W, 2)
        const localSimilarity1 = Math.min(1, similarity1 / Math.max(1, standardDeviation1W))
    
        const similarity2 = this.similarityTo(impulse, 'rtl')
        const similarity2W = 1 - Math.abs(0.5 - similarity2) / 0.5
        const standardDeviation2W = standardDeviation(rtl.measurements) * Math.pow(similarity2W, 2)
        const localSimilarity2 = Math.min(1, similarity2 / Math.max(1, standardDeviation2W))
    
        return Math.max(localSimilarity1, localSimilarity2)
    }
}

const textA = "Coca Cola"
const textB = "xxxxCxolx"

const thermometerSize = 5
const impulse = 0

let ptd = PedroThermoDistance.from(textA, textB, thermometerSize, {
    heating: 5,
    cooling: 2
})

console.log({
    localSimilarity: ptd.localSimilarity(impulse),
    similarity: ptd.similarity(impulse)
})
