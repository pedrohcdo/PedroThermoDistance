/**
 * Calculates the PHC Similarity between two strings based on a defined penalty function, a maximum penalty clamp, and a specified comparison mode.
 * This function leverages a dynamic programming approach to efficiently determine the similarity, with the time complexity of O(firstText * secondText * penaltyClamp).
 * The mode parameter allows the function to operate in either 'delete' or 'levenshtein' mode. In 'delete' mode, only deletions are counted as errors, while 'levenshtein' mode also considers substitutions and insertions, potentially reducing the total error count for similar characters.
 *
 * @param {string} firstText - The first string to compare. This could represent a name or any sequence of characters.
 * @param {string} secondText - The second string to compare. Similar to firstText, this is a sequence of characters.
 * @param {number} penaltyClamp - The maximum clamp value for penalty attempts, defining how penalties increase for retries beyond the first mismatch. This value limits the severity of the penalty applied, capping the negative impact of repeated mismatches.
 * @param {Function} penaltyFunction - A callback function that applies a penalty for each retry attempt beyond the first match.
 *                                      The function takes the number of the current attempt as an argument and returns a numerical penalty.
 * @param {'delete' | 'levenshtein'} mode - The mode of operation for the comparison: 'delete' only allows character deletions, while 'levenshtein' allows deletions, insertions, and substitutions.
 *
 * @returns {number} The calculated similarity score between 0 and 1, where 0 indicates no similarity and 1 indicates identical strings.
 *                   The score is calculated as the ratio of matched characters to the total number of characters adjusted by the penalty for retries,
 *                   taking into account the operational mode which alters the error count and penalty application.
 *
 * Example usage:
 * const similarityScoreDelete = calculatePHCSimilarity("hello", "h3llo", 3, (attempt) => attempt * 2, 'delete');
 * const similarityScoreEdit = calculatePHCSimilarity("hello", "h3llo", 3, (attempt) => attempt * 2, 'edit');
 * console.log(similarityScoreDelete); // Outputs 0.4 - Might be lower because 'e' and '3' are treated as separate errors.
 * console.log(similarityScoreEdit); // Outputs 0.666... - Higher as 'e' can be substituted by '3' counting as a single error.
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
 * console.log(calculatePHCSimilarity("hello", "h3lloooooo", 3, (attempt) => attempt * 2, 'full')); // Outputs 0.1333..
 */
function calculatePHCSimilarity(
        firstText: string, 
        secondText: string, 
        penaltyClamp: number, 
        penaltyFunction: (match: boolean, attempt: number) => number, 
        mode: ('edit' | 'delete' | 'transversal')[] | null = ['edit', 'delete', 'transversal'],
        options: { editScore: number, deleteScore: number, transversalScore: number } = {
            editScore: 0.1,
            deleteScore: 0,
            transversalScore: 0.3
        }
    ) {
    
    mode ||= ['edit', 'delete', 'transversal']

    const barometer = penaltyClamp * 2 + 1

    const dp: [number, number][][][] = new Array(firstText.length + 1).fill(0).map(() => 
        new Array(secondText.length + 1).fill(0).map(() => {
            return new Array(barometer).fill(0).map(() => {
                return [0, 0]
            })
        })
    );

    const similarity = ([corrects, wrongs]: [number, number]) => {
        if(corrects + wrongs === 0) return 0
        return corrects / (corrects + wrongs);
    }

    const clamp = penaltyClamp - 1;

    // Laterals
    for(let i=1; i<=firstText.length; i++) {
        for(let a=0; a<barometer; a++) {
            const centered = Math.min(a - penaltyClamp, -1)
            const worst = Math.max(centered + penaltyClamp - 1, 0)
        
            dp[i][0][a][1] = penaltyFunction(false, Math.abs(centered)) + dp[i - 1][0][worst][1];
        }
    }
    for(let i=1; i<=secondText.length; i++) {
        for(let a=0; a<barometer; a++) {
            const centered = Math.min(a - penaltyClamp, -1)
            const worst = Math.max(centered + penaltyClamp - 1, 0)

            dp[0][i][a][1] = penaltyFunction(false, Math.abs(centered)) + dp[0][i - 1][worst][1];
        }
    }

    //
    for(let i=0; i<firstText.length; i++) {
        for(let j=0; j<secondText.length; j++) {
            for(let a=0; a<barometer; a++) {
          
                const cutsCandidates: [number, number][] = []

                //
                if(firstText.charAt(i) === secondText.charAt(j)) {
                    const centered = Math.max(1, a - penaltyClamp)
                    const best = Math.min(barometer - 1, centered + penaltyClamp + 1)
                    const cost = penaltyFunction(true, centered)

                    cutsCandidates.push([dp[i][j][best][0] + cost, dp[i][j][best][1]])

                }

                //
                const transversal = (i >= 1 && j >= 1) 
                                    && (firstText.charAt(i-1) === secondText.charAt(j) 
                                    && firstText.charAt(i) === secondText.charAt(j-1))

                const centered = Math.min(a - penaltyClamp, -1)
                const worst = Math.max(centered + penaltyClamp - 1, 0)
                const cost = penaltyFunction(false, Math.abs(centered))

                
                if(mode.includes('edit')) {
                    cutsCandidates.push([dp[i][j][worst][0] + (options?.editScore || 0), cost + dp[i][j][worst][1]])
                }
                if(mode.includes('delete')) {
                    cutsCandidates.push([dp[i+1][j][worst][0] + (options?.deleteScore || 0), cost + dp[i+1][j][worst][1]])
                    cutsCandidates.push([dp[i][j+1][worst][0] + (options?.deleteScore || 0), cost + dp[i][j+1][worst][1]])
                }
                if(mode.includes('transversal') && transversal) {
                    cutsCandidates.push([dp[i-1][j-1][worst][0] + (options?.transversalScore || 0), cost + dp[i-1][j-1][worst][1]])
                }

                const bestCut = cutsCandidates
                                    .sort((a, b) => similarity(b) - similarity(a))
                                    .shift()! || [0, 0]
                
                dp[i+1][j+1][a][0] = bestCut[0]
                dp[i+1][j+1][a][1] = bestCut[1]

                //if(similarity(dp[i+1][j+1][Math.max(a-1, 0)]) > similarity(dp[i+1][j+1][a])) {
                //    dp[i+1][j+1][a] = [...dp[i+1][j+1][Math.max(a-1, 0)]]
                //}
            }
        }
    }

    let best = similarity(dp[firstText.length][secondText.length][0])
    for(let i=0; i<barometer; i++) {
        best = Math.max(best, similarity(dp[firstText.length][secondText.length][i]))
    }
    //
    return best;
}




console.log(calculatePHCSimilarity("hello", "h3llo", 3, (attempt) => attempt * 2)); 
console.log(calculatePHCSimilarity("hello", "h3llo", 3, (attempt) => attempt * 2));
console.log(calculatePHCSimilarity("hello", "h3lloooooo", 3, (attempt) => Math.sqrt(attempt/3)));
