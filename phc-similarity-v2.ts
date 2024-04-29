/**
 * Calculates the PHC Similarity V2 between two strings based on a defined penalty function, a maximum penalty clamp, and specified comparison modes.
 * This function leverages a dynamic programming approach to efficiently determine the similarity, with the time complexity of O(firstText.length * secondText.length * penaltyClamp).
 * The mode parameter allows specifying the types of operations considered during comparison: 'edit', 'delete', and 'transversal'. Each mode adjusts how the similarity is calculated, 
 * allowing for more nuanced error handling based on the operational requirements.
 *
 * @param {string} firstText - The first string to compare. This could represent a name or any sequence of characters.
 * @param {string} secondText - The second string to compare. Similar to firstText, this is a sequence of characters.
 * @param {number} penaltyClamp - The maximum clamp value for penalty attempts, defining how penalties increase for retries beyond the first mismatch. This value limits the severity of the penalty applied, capping the negative impact of repeated mismatches.
 * @param {Function} penaltyFunction - A callback function that applies a penalty for each retry attempt beyond the first match. The function takes a boolean indicating if the match was successful and the number of the current attempt, returning a numerical penalty.
 * @param {Array} mode - An array of operation modes for the comparison: 'edit', 'delete', and 'transversal'. 'edit' allows character substitutions, 'delete' only allows deletions, and 'transversal' permits swapping of adjacent characters.
 * @param {Object} options - Configuration options for scores, where each operation type ('edit', 'delete', 'transversal') can have an associated score that impacts the final similarity.
 *
 * @returns {number} The calculated similarity score between 0 and 1, where 0 indicates no similarity and 1 indicates identical strings.
 *                   The score is calculated as the ratio of matched characters to the total number of operations adjusted by the penalty for retries,
 *                   taking into account the operational mode which alters the error count and penalty application.
 *
 * Example usage:
 * const similarityScoreDelete = calculatePHCSimilarity("hello", "h3llo", 3, (match, attempt) => match ? attempt * 2 : attempt * 3, ['delete'], {deleteScore: 0.1,editScore:0,transversalScore:0});
 * const similarityScoreEdit = calculatePHCSimilarity("hello", "h3llo", 3, (match, attempt) => match ? attempt * 2 : attempt * 3, ['edit', 'transversal'], {editScore: 0.2, transversalScore: 0.3,transversalScore:0});
 * console.log(similarityScoreDelete); // Outputs ~0.69
 * console.log(similarityScoreEdit); // Outputs ~0.87
 *
 * // Detailed example with 'full' mode and multiple deletions handled:
 * // Example shows the calculation when additional characters are present and how penalties are applied:
 * // "hello" compared to "h3lloooooo", with maximum retries set to 3 and penalty function as double the attempt number:
 * // - 'h' matches directly.
 * // - 'e' is substituted by '3', counting as one edit error.
 * // - Both 'l's match directly.
 * // - 'o' matches directly.
 * // - Each additional 'o' counts as a deletion error, with the penalty increasing until the max retry limit is reached and then stays constant.
 * // Penalty calculation: 2 (1st 'o' error) + 4 (2nd 'o' error) + 6 + 6 + 6 (subsequent 'o' errors with max penalty)
 * // Total penalty: 24
 * // Similarity score is then calculated as the number of matches (4) divided by the sum of matches and penalties (4 + 24):
 * console.log(calculatePHCSimilarity("hello", "h3lloooooo", 3, (match, attempt) => attempt * 2)); // Outputs ~0.35..
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
            const cost = costFunction(false, weighted * thermometerSize)
            if(cost < 0)
                throw new Error('The penalty function cannot return a value less than 0.')
            dp[i][0][a][1] = cost + dp[i - 1][0][Math.max(a - 1, 0)][1];
        }
    }
    for (let i = 1; i <= secondText.length; i++) {
        for (let a = 0; a < thermometerWidth; a++) {
            const weighted = (thermometerWidth - a - 1) / (thermometerWidth - 1)
            const cost = costFunction(false, weighted * thermometerSize)
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
                const cost = costFunction(false, weighted * thermometerSize)
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
        return ((thermometerSize + 1) - attempt) // first wrong word has more weight
    return attempt
}


const pts = calculatePedroThermoSimilarity(textA, textB, thermometerSize, costFunction, null, options)


console.log(pts)
