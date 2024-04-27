/**
 * Calculates the PHC Similarity between two strings based on a defined penalty function, a maximum number of retry attempts, and a specified comparison mode.
 * This function uses dynamic programming to efficiently determine the similarity, with the time complexity of O(firstText * secondText * maxAttempts).
 * The mode parameter allows the function to operate in different modes: 'delete' only counts deletions, 'edit' allows deletions and substitutions, and 'full' includes deletions, insertions, and substitutions.
 *
 * @param {string} firstText - The first string to compare. This could represent a name or any sequence of characters.
 * @param {string} secondText - The second string to compare. Similar to firstText, this is a sequence of characters.
 * @param {number} maxAttempts - The maximum number of retry attempts allowed when characters between the two strings do not match.
 * @param {Function} penaltyFunction - A callback function that applies a penalty for each retry attempt beyond the first match.
 *                                      The function takes the number of the current attempt as an argument and returns a numerical penalty.
 * @param {'delete' | 'edit' | 'full'} mode - The mode of operation for the comparison: 'delete' for deletions only, 'edit' for deletions and substitutions, and 'full' for deletions, insertions, and substitutions.
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
function calculatePHCSimilarity(firstText: string, secondText: string, maxAttempts: number, penaltyFunction: (attempt: number) => number, mode: 'edit' | 'delete' | 'full' = 'full') {

    const dp: [number, number][][][] = new Array(firstText.length + 1).fill(0).map(() => 
        new Array(secondText.length + 1).fill(0).map(() => {
            return new Array(maxAttempts).fill(0).map(() => {
                return [0, 0]
            })
        })
    );

    const similarity = ([corrects, wrongs]: [number, number]) => {
        if(corrects + wrongs === 0) return 0
        return corrects / (corrects + wrongs);
    }

    const attempts = maxAttempts - 1;

    // Laterals
    for(let i=1; i<=firstText.length; i++) {
        for(let a=0; a<maxAttempts; a++) {
            dp[i][0][a][1] = penaltyFunction(maxAttempts - a) + dp[i - 1][0][Math.max(a - 1, 0)][1];
        }
    }
    for(let i=1; i<=secondText.length; i++) {
        for(let a=0; a<maxAttempts; a++) {
            dp[0][i][a][1] = penaltyFunction(maxAttempts - a) + dp[0][i - 1][Math.max(a - 1, 0)][1];
        }
    }
    
    //
    for(let i=0; i<firstText.length; i++) {
        for(let j=0; j<secondText.length; j++) {
            for(let a=0; a<maxAttempts; a++) {
                if(firstText.charAt(i) === secondText.charAt(j)) {
                    dp[i+1][j+1][a][0] = 1 + dp[i][j][attempts][0]
                    dp[i+1][j+1][a][1] = dp[i][j][attempts][1]
                } else {
                    const retry = Math.max(a-1, 0);
                    const cuts = []
                    if(['edit', 'full'].includes(mode)) cuts.push(dp[i][j][retry])
                    if(['delete', 'full'].includes(mode)) cuts.push(dp[i+1][j][retry], dp[i][j+1][retry])
                    const bestCut = cuts.sort((a, b) => similarity(b) - similarity(a)).shift()!
                    dp[i+1][j+1][a][0] = bestCut[0]
                    dp[i+1][j+1][a][1] = penaltyFunction(maxAttempts - a) + bestCut[1]
                }
            }
        }
    }

    //
    return similarity(dp[firstText.length][secondText.length][attempts]);
}



console.log(calculatePHCSimilarity("hello", "h3llo", 3, (attempt) => attempt * 2, 'delete')); 
console.log(calculatePHCSimilarity("hello", "h3llo", 3, (attempt) => attempt * 2, 'edit'));
console.log(calculatePHCSimilarity("hello", "h3lloooooo", 3, (attempt) => Math.sqrt(attempt/3), 'full'));
