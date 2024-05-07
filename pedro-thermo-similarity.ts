/**
 * PedroThermoDistance is used for computing detailed similarity scores between two strings using a dynamic programming approach with a novel 'thermometer' mechanism.
 * The similarity score is calculated based on the ratio of correct matches to total operations, adjusted for penalties, and can be influenced by various parameters such as thermometer size, heating, and cooling.
 */
class PedroThermoDistance {
    
    /**
     * Constructs a PedroThermoDistance instance.
     * @param {string} firstText - The first string to compare.
     * @param {string} secondText - The second string to compare.
     * @param {number} thermometerSize - Defines the granularity and range of the thermometer mechanism, which influences the penalty application.
     * @param {Object} [options] - Configuration options for heating and cooling rates.
     * @param {number} [options.heating=1] - The rate at which the 'thermometer' heats up during matching attempts.
     * @param {number} [options.cooling=1] - The rate at which the 'thermometer' cools down between matching attempts.
     */
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
    
     /**
     * Constructs a PedroThermoDistance instance from given parameters.
     * @param {string} firstText - The first string to compare.
     * @param {string} secondText - The second string to compare.
     * @param {number} thermometerSize - Defines the granularity and range of the thermometer mechanism.
     * @param {Object} [options] - Configuration options for heating and cooling rates.
     * @param {number} [options.heating=1] - The rate at which the 'thermometer' heats up during matching attempts.
     * @param {number} [options.cooling=1] - The rate at which the 'thermometer' cools down between matching attempts.
     * @returns {PedroThermoDistance} A new instance of PedroThermoDistance class.
     */
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
        const heatings = options?.heating ?? 1
        const cooling = options?.cooling ?? 1

        if(thermometerSize < 1)
            throw new Error('Thermometer size must be equal to or above 1.')
        else if(heatings < 1 || (heatings%1) !== 0)
            throw new Error('Heating must be equal to or greater than 1 and must be integer.')
        else if(cooling < 1 || (cooling%1) !== 0)
            throw new Error('Cooling must be equal to or greater than 1 and must be integer.')

        // [ltr, rtl][firstTextLen][secondTextLen][thermometerWidth]
        const dp: [number, number][][][] = new Array(firstText.length + 1).fill(0).map(() =>
            new Array(secondText.length + 1).fill(0).map(() => {
                return new Array(thermometerSize).fill(0).map(() => [0, 0])
            })
        );

        // Laterals
        for (let i = 1; i <= firstText.length; i++) {
            for (let a = 0; a < thermometerSize; a++) {
                dp[i][0][a][0] = dp[i - 1][0][Math.max(a - (options?.cooling || 1), 0)][0] + (thermometerSize - a);
                dp[i][0][a][1] = dp[i - 1][0][Math.max(a - (options?.cooling || 1), 0)][1] + (thermometerSize - a);
            }
        }
        for (let i = 1; i <= secondText.length; i++) {
            for (let a = 0; a < thermometerSize; a++) {
                dp[0][i][a][0] = dp[0][i - 1][Math.max(a - (options?.cooling || 1), 0)][0] + (thermometerSize - a);
                dp[0][i][a][1] = dp[0][i - 1][Math.max(a - (options?.cooling || 1), 0)][1] + (thermometerSize - a);
            }
        }

        //
        for (let i = 0; i < firstText.length; i++) {
            for (let j = 0; j < secondText.length; j++) {
                for (let a = 0; a < thermometerSize; a++) {

                    const cost = thermometerSize - a
                    const heat = Math.min(a + (options?.heating || 1), thermometerSize - 1)
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

    /**
     * Traverses the alignment path between two strings from one direction to calculate similarity scores.
     * @param {number} [impulse=1] - The impulse factor influencing the traversal.
     * @returns {Object} An object containing information about the alignment path and measurements.
     */
    private traverseTo(impulse: number = 1, directionDim: 0 | 1 = 0) {
        let i = this.firstText.length - 1
        let j = this.secondText.length - 1

        let temperature = Math.max(0, Math.min(this.thermometerSize - 1, (this.thermometerSize - 1) * impulse))
        let measurements: number[] = []

        let matchedText1 = ""
        let matchedText2 = ""
        while (i >= 0 || j >= 0) {
            if (i === -1) {
                measurements.push(this.thermometerSize - temperature)
                matchedText2 = `-` + matchedText2
                j--
                temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
                continue
            } else if (j === -1) {
                measurements.push(this.thermometerSize - temperature)
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
                temperature = Math.min(temperature + (this.options?.heating || 1), this.thermometerSize - 1)
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
                measurements.push(this.thermometerSize - temperature)
                matchedText2 = `-` + matchedText2
                temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
                j--
            } else {
                measurements.push(this.thermometerSize - temperature)
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
    
    /**
     * Traverses the alignment path between two strings from left to right and right to left direction to calculate similarity scores.
     * @param {number} [impulse=1] - The impulse factor influencing the traversal.
     * @returns {Object} An object containing information about the alignment path and measurements.
     */
    traverse(impulse: number = 1) {
        const ltr = this.traverseTo(impulse, 0)
        const rtl = this.traverseTo(impulse, 1)
        return {
            ltr,
            rtl
        }
    }

    /**
     * Computes the distance between two strings in either left-to-right (ltr) or right-to-left (rtl) direction.
     * @param {number} [impulse=1] - The impulse factor influencing the distance calculation.
     * @param {string} [direction='ltr'] - The direction of comparison, either 'ltr' (left-to-right) or 'rtl' (right-to-left).
     * @returns {number} The distance between the two strings.
     */
    distance(impulse: number = 1, direction: 'ltr' | 'rtl' = 'ltr') {
        const startOn = Math.max(0, Math.min(this.thermometerSize - 1, (this.thermometerSize - 1) * impulse))
        return this.dp[this.firstText.length][this.secondText.length][startOn][direction === 'ltr' ? 0 : 1]
    }
    
    /**
     * Computes the maximum possible distance between two strings.
     * @param {number} [impulse=1] - The impulse factor influencing the maximum distance calculation.
     * @returns {number} The maximum possible distance between the two strings.
     */
    maxDistance(impulse: number = 1) {
        let maxDistance = 0
        let temperature = Math.max(0, Math.min(this.thermometerSize - 1, (this.thermometerSize - 1) * impulse))

        for (let i = 0; i < (this.firstText.length + this.secondText.length); i++) {
            maxDistance += this.thermometerSize - temperature
            temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
        }

        return maxDistance
    }
    
    /**
     * Computes the similarity score in a specific direction between two strings.
     * @param {number} [impulse=1] - The impulse factor influencing the similarity calculation.
     * @param {string} [direction='ltr'] - The direction of comparison, either 'ltr' (left-to-right) or 'rtl' (right-to-left).
     * @returns {number} The similarity score between 0 and 1.
     */
    similarityTo(impulse: number = 1, direction: 'ltr' | 'rtl' = 'ltr') {
        return 1 - this.distance(impulse, direction) / this.maxDistance(impulse)
    }
    
    /**
     * Computes the global similarity score between two strings using a dynamic programming approach with a 'thermometer' mechanism.
     * Global similarity is calculated based on the ratio of correct matches to total operations across the entire strings, adjusted for penalties.
     * @param {number} impulse - The impulse factor influencing the global similarity calculation.
     * @returns {number} The global similarity score between 0 and 1.
     */
    similarity(impulse: number = 1) {
        return Math.max(this.similarityTo(impulse, 'ltr'), this.similarityTo(impulse, 'rtl'))
    }
    
    /**
     * Computes the local similarity score between two strings using a dynamic programming approach with a 'thermometer' mechanism.
     * Local similarity is calculated based on the ratio of correct matches to total operations within a local context, adjusted for penalties.
     * @param {number} impulse - The impulse factor influencing the local similarity calculation.
     * @param {number} softness - Used in the calculations to weight the standard deviation, that is, how much it should influence the similarity, higher values ​​create a smoother curve.
     * @returns {number} The local similarity score between 0 and 1.
     */
    localSimilarity(impulse: number, softness: number=1) {
        //
        function standardDeviation(measurements: number[]) {
            let mean = measurements.reduce((prev, curr) => prev + curr, 0) / measurements.length
            return Math.sqrt(measurements.reduce((prev, curr) => prev + Math.pow(curr - mean, 2), 0) / (measurements.length - 1))
        }
    
        //
        const { ltr, rtl } = this.traverse(impulse)
    
        const similarity1 = this.similarityTo(impulse, 'ltr')
        const similarity1W = 1 - Math.abs(0.5 - similarity1) / 0.5
        const standardDeviation1W = standardDeviation(ltr.measurements) * Math.pow(similarity1W, softness)
        const localSimilarity1 = Math.min(1, similarity1 / Math.max(1, standardDeviation1W))

        const similarity2 = this.similarityTo(impulse, 'rtl')
        const similarity2W = 1 - Math.abs(0.5 - similarity2) / 0.5
        const standardDeviation2W = standardDeviation(rtl.measurements) * Math.pow(similarity2W, softness)
        const localSimilarity2 = Math.min(1, similarity2 / Math.max(1, standardDeviation2W))
        
        return Math.max(localSimilarity1, localSimilarity2)
    }
}


// Sample
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
