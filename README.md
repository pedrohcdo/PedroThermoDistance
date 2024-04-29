# Pedro Penalty Similarity & Thermo Similarity Algorithms

[![DOI](https://zenodo.org/badge/792886788.svg)](https://zenodo.org/doi/10.5281/zenodo.11078496)

## Introduction
The PedroPenaltySimilarity and PedroThermoSimilarity Algorithm was developed to calculate the similarity between two strings based on a defined cost function and a maximum penalty clamp or thermometer size. The algorithm can operate in different modes, adjusting to various text comparison scenarios.

## Description
The algorithm utilizes a dynamic programming approach to efficiently determine the similarity between two strings. The time complexity of the algorithm is O(firstText * secondText * penaltyClamp) for PedroPenaltySimilarity and O(firstText * secondText * thermometer) for PedroThermoSimilarity, making it suitable for real-time analyses where efficiency is crucial.

## Live Demo

Try the PedroPenaltySimilarity algorithm live! Click the link below to access the interactive user interface where you can input texts and compare them using different penalty settings and penalty clamp limits.

[Try PHC Similarity Live](https://pedrohcdo.github.io/PHC-Similarity/)

Use the text fields to input the strings you want to compare, adjust the slider to set the maximum penalty clamp, and modify the penalty function as needed. Then, click the "Calculate Similarity" button to see the similarity score between the two strings.

### Operation Modes
- **Delete**: This mode counts only deletions as errors.
- **Edit**: Allows deletions and substitutions.
- **Full**: Includes deletions, insertions, and substitutions.

### Penalty Function
The penalty function is applied to each attempt beyond the first match and is crucial for adjusting the sensitivity of the algorithm to errors.

### Argument Description
The function `calculatePHCSimilarity` accepts five arguments, each playing a crucial role in calculating the similarity between two strings. Here is a detailed description of each argument:

- **`firstText: string`**: The first text to be compared. It represents the base string in the comparison. It can be any sequence of characters, such as a name, phrase, or any other type of textual data.

- **`secondText: string`**: The second text to be compared against the first. Similar to `firstText`, it must be a sequence of characters and is treated as the target text in the comparison.

- **`penaltyClamp: number`**: The maximum clamp value for penalty attempts, which sets a limit on the severity of penalties applied after the first mismatch. This helps control the negative impact of increasing penalties on the similarity score, ensuring that excessive mismatches don't disproportionately affect the outcome.

- **`penaltyFunction: (attempt: number) => number`**: A callback function that defines the penalty for each attempt beyond the first match. This function takes the current attempt number as an argument and returns a numerical penalty. The form of the penalty function can vary depending on the use case, and it significantly influences the similarity calculation by penalizing imperfect matches.

- **`mode: 'delete' | 'edit' | 'full'`**: Defines the mode of operation of the function. The 'delete' mode allows only deletions, the 'edit' mode includes deletions and substitutions, and the 'full' mode covers deletions, insertions, and substitutions, offering the most flexible and comprehensive approach to string comparison.

## Usage Examples

### Basic Comparison
Here is how you would use the algorithm in 'delete' mode to compare two strings:

```typescript
const similarityScore = calculatePHCSimilarity("hello", "h3llo", 3, attempt => attempt * 2, 'delete');
console.log(similarityScore); // Expected output may vary
```

### Full Mode with Calculation Details
This detailed example demonstrates how the algorithm calculates similarity in 'full' mode, considering multiple deletions and a substitution, with a penalty function that increases with the number of attempts:

```typescript
// Comparison between "hello" and "h3lloooooo" with up to 3 penalty clamps and double penalty per attempt:
const fullModeScore = calculatePHCSimilarity("hello", "h3lloooooo", 3, attempt => attempt * 2, 'full');

// Calculation details:
// - 'h' matches directly.
// - 'e' is substituted by '3', counting as one edit error.
// - Both 'l's match directly.
// - 'o' matches directly.
// - Each additional 'o' counts as a deletion error, with the penalty increasing until the max penalty clamp is reached and then stays constant.
// Penalty calculation: 2 (1st 'o' error) + 4 (2nd 'o' error) + 6 + 6 + 6 (subsequent 'o' errors with max penalty)
// Total penalty: 26
// Similarity score is calculated as the number of matches (4) divided by the sum of matches and penalties (4 + 26):
console.log(fullModeScore); // Example output: 0.13
```

## License

MIT License

Copyright (c) [ano] [nome completo do detentor dos direitos autorais]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
