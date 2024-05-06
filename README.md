# Pedro Thermo Distance

[![DOI](https://zenodo.org/badge/792886788.svg)](https://zenodo.org/doi/10.5281/zenodo.11078496)

## Introduction
The PedroThermoDistance algorithm calculates the similarity between two strings using a dynamic programming approach, which integrates a 'thermometer' mechanism to adjust for matching sensitivities dynamically. This approach allows the algorithm to adjust the penalty or reward during the string comparison based on heating and cooling rates, reflecting the dynamic nature of textual comparisons.

## Description
The algorithm utilizes a novel method called the 'thermometer' mechanism to efficiently determine the similarity between two strings. The time complexity of PedroThermoDistance is O(firstText * secondText * thermometerSize), making it suitable for real-time analyses where efficiency is crucial.

## Live Demo

Experience the PedroThermoDistance algorithm live! Click the link below to access an interactive user interface where you can input strings and compare them using different thermometer sizes and heating or cooling rates.

[Try PedroThermoDistance Live](https://pedrohcdo.github.io/PedroThermoDistance/)

Use the text fields to input the strings you want to compare, adjust the thermometer size, and modify the heating and cooling rates. Then, click the "Calculate Similarity" button to see the similarity score between the two strings.

### Operation Modes
- **Local Similarity**: Computes the local similarity score using the PedroThermoDistance algorithm.
- **Global Similarity**: Computes the global similarity score that accounts for the overall matching quality across the entire strings.

### Configuration Parameters
- **`thermometerSize`:** This parameter defines the range and granularity of the thermometer mechanism, influencing how penalties and rewards are applied.
- **`heating`:** This is the rate at which the 'thermometer' heats up after a match, increasing sensitivity to subsequent matches.
- **`cooling`:** This is the rate at which the 'thermometer' cools down after a mismatch, decreasing sensitivity to subsequent matches.

## Usage Examples

### Simple Local Similarity Example
Here is how you might use the algorithm to compare two strings for local similarity:

yyyjavascript
const ptd = PedroThermoDistance.from("hello", "hallo", 5, { heating: 3, cooling: 1 });
const localSimilarityScore = ptd.localSimilarity(1);
console.log(localSimilarityScore); // Expected output may vary
yyy

### Detailed Global Similarity Example
This example demonstrates how the PedroThermoDistance calculates global similarity:

yyyjavascript
// Comparison between "hello" and "hallo" with a thermometer size of 5:
const ptd = PedroThermoDistance.from("hello", "hallo", 5, { heating: 3, cooling: 2 });
const globalSimilarityScore = ptd.similarity(1);

// Detailed outputs:
console.log(globalSimilarityScore); // Example output: 0.75
yyy

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
