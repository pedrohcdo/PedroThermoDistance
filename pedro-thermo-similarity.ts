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
function PedroThermoSimilarityPass(
    firstText: string,
    secondText: string,
    thermometerSize: number,
    costFunction: (match: boolean, attempt: number) => number,
    mode: ('edit' | 'delete' | 'transversal')[] | null = ['edit', 'delete', 'transversal'],
    options: { editScore?: number, deleteScore?: number, transversalScore?: number } = {
        editScore: 0.1,
        deleteScore: 0,
        transversalScore: 0.3
    }
) {

    mode ||= ['edit', 'delete', 'transversal']

    const thermometerWidth = thermometerSize * 2 + 1

    const dp: [number, number][][][] = new Array(firstText.length + 1).fill(0).map(() =>
        new Array(secondText.length + 1).fill(0).map(() => {
            return new Array(thermometerWidth).fill(0).map(() => {
                return [0, 0]
            })
        })
    );

    const similarity = ([corrects, wrongs]: [number, number]) => {
        if (corrects + wrongs === 0) return 0
        return corrects / (corrects + wrongs);
    }

    // Laterals
    for (let i = 1; i <= firstText.length; i++) {
        for (let a = 0; a < thermometerWidth; a++) {
            const weighted = (thermometerWidth - a - 1) / (thermometerWidth - 1)
            const cost = costFunction(false, weighted * thermometerSize + 1)
            if(cost < 0)
                throw new Error('The penalty function cannot return a value less than 0.')
            dp[i][0][a][1] = cost + dp[i - 1][0][Math.max(a - 1, 0)][1];
        }
    }
    for (let i = 1; i <= secondText.length; i++) {
        for (let a = 0; a < thermometerWidth; a++) {
            const weighted = (thermometerWidth - a - 1) / (thermometerWidth - 1)
            const cost = costFunction(false, weighted * thermometerSize + 1)
            if(cost < 0)
                throw new Error('The penalty function cannot return a value less than 0.')
            dp[0][i][a][1] = cost + dp[0][i - 1][Math.max(a - 1, 0)][1];
        }
    }

    //
    for (let i = 0; i < firstText.length; i++) {
        for (let j = 0; j < secondText.length; j++) {
            for (let a = 0; a < thermometerWidth; a++) {
                const cutsCandidates: [number, number][] = []

                if (firstText.charAt(i) === secondText.charAt(j)) {
                    const weighted = a / (thermometerWidth - 1)
                    const cost = costFunction(true, weighted * thermometerSize + 1)
                    if(cost < 0)
                        throw new Error('The penalty function cannot return a value less than 0.')
                    const cold = Math.min(a + 1, thermometerWidth - 1)
                    cutsCandidates.push([dp[i][j][cold][0] + cost, dp[i][j][cold][1]])
                }

                const transversal = (i >= 1 && j >= 1)
                    && (firstText.charAt(i - 1) === secondText.charAt(j)
                    && firstText.charAt(i) === secondText.charAt(j - 1))

                const weighted = (thermometerWidth - a - 1) / (thermometerWidth - 1)
                const cost = costFunction(false, weighted * thermometerSize + 1)
                if(cost < 0)
                    throw new Error('The penalty function cannot return a value less than 0.')
                const cold = Math.max(a - 1, 0)

               
                if (mode.includes('edit')) {
                    cutsCandidates.push([dp[i][j][cold][0] + (options?.editScore || 0), cost + dp[i][j][cold][1]])
                }
                if (mode.includes('delete')) {
                    cutsCandidates.push([dp[i + 1][j][cold][0] + (options?.deleteScore || 0), cost + dp[i + 1][j][cold][1]])
                    cutsCandidates.push([dp[i][j + 1][cold][0] + (options?.deleteScore || 0), cost + dp[i][j + 1][cold][1]])
                }
                if (mode.includes('transversal') && transversal) {
                    cutsCandidates.push([dp[i - 1][j - 1][cold][0] + (options?.transversalScore || 0), cost + dp[i - 1][j - 1][cold][1]])
                }


                let bestCut = cutsCandidates?.[0] || [0, 0]
                for(let k=0; k<cutsCandidates.length; k++) {
                    const candidate = cutsCandidates[k]
                    if(similarity(candidate) >= similarity(bestCut)) 
                        bestCut = candidate
                }

                dp[i + 1][j + 1][a][0] = bestCut[0]
                dp[i + 1][j + 1][a][1] = bestCut[1]
            }
        }
    }

    //
    return similarity(dp[firstText.length][secondText.length][thermometerSize]);
}

/**
 * This function wraps the PedroThermoSimilarityPass function to calculate similarity scores from four different perspectives: 
 * original to original, reversed to reversed, original to reversed, and reversed to original. This approach provides a robust 
 * measure of similarity that accounts for variations in the order of characters and potential symmetrical relationships in strings.
 *
 * @param {string} firstText - The original first string for comparison.
 * @param {string} secondText - The original second string for comparison.
 * @param {number} thermometerSize - The size of the thermometer, which determines the granularity of the penalty mechanism.
 * @param {Function} costFunction - A function that applies a penalty based on the match success and attempt number.
 * @param {('edit' | 'delete' | 'transversal')[]} mode - Allowed modes of operation for string comparison; defaults to all modes if null.
 * @param {Object} options - Scoring options for different types of operations, influencing the final similarity score.
 *
 * @returns {number} The highest similarity score obtained from the four different comparisons, offering a comprehensive measure of similarity.
 *
 * Example usage:
 * const similarityScore = calculatePedroThermoSimilarity("helloooo", "xxhexllooxxoo", 5, (match, attempt) => match ? attempt : (6 - attempt), null, {editScore: 0.2, transversalScore: 0.3});
 * console.log(similarityScore); // Outputs the best similarity score among the four calculated perspectives.
 */
function calculatePedroThermoSimilarity(
    firstText: string,
    secondText: string,
    thermometerSize: number,
    costFunction: (match: boolean, attempt: number) => number,
    mode: ('edit' | 'delete' | 'transversal')[] | null = ['edit', 'delete', 'transversal'],
    options: { editScore?: number, deleteScore?: number, transversalScore?: number } = {
        editScore: 0.1,
        deleteScore: 0,
        transversalScore: 0.3
    }
) {
    const reversedFirstText = firstText.split('').reverse().join('')
    const reversedSecondText = secondText.split('').reverse().join('')

    const ltr1 = PedroThermoSimilarityPass(firstText, secondText, thermometerSize, costFunction, mode, options)
    const rtl1 = PedroThermoSimilarityPass(reversedFirstText, reversedSecondText, thermometerSize, costFunction, mode, options)
    const ltr2 = PedroThermoSimilarityPass(firstText, reversedSecondText, thermometerSize, costFunction, mode, options)
    const rtl2 = PedroThermoSimilarityPass(reversedFirstText, secondText, thermometerSize, costFunction, mode, options)

    return Math.max(ltr1, rtl1, ltr2, rtl2)
}


const textA = "helloooo"
const textB = "xxhexllooxxoo"

const thermometerSize = 5

const options = {
    deleteScore: 0,
    editScore: 0,
    transversalScore: 0
}

const costFunction = (match: boolean, attempt: number) => {
    if(!match) 
        return ((thermometerSize + 2) - attempt) // first wrong word has more weight
    return attempt
}


const pts = calculatePedroThermoSimilarity(textA, textB, thermometerSize, costFunction, null, options)


console.log(pts)
