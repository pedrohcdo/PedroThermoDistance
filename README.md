# Pedro Thermo Distance & Similarity

[![DOI](https://zenodo.org/badge/792886788.svg)](https://zenodo.org/doi/10.5281/zenodo.11078496)

## Introduction
The ```PedroThermoDistance``` algorithm introduces a dynamic thermometer approach to calculating string similarity. Using a dynamic programming, it incorporates a unique 'thermometer' mechanism that dynamically adjusts penalties during the string comparison process. This mechanism simulates a thermometer's behavior, where consecutive matches increase the 'temperature', and mismatches decrease it (resulting in penalties based on current temperature). This design allows the algorithm to adapt to the flow of textual similarities and differences, making it ideal for applications that require differentiated text analysis that involve, for example: nuances, misspellings, and etc. With it, it is also possible to generate aligned texts, which makes it even more useful for some use cases that need detailed comparisons and reconciliations of textual data.

It also proved to be more effective in calculating similarity compared to other algorithms. Below are some demonstrations, I used the 'hermetrics' library to compare, the Dice, Hamming, Jaccard, Jaro, Jaro-Winkler algorithms did not prove to be as reliable in all cases.

```javascript
// In both examples, the basic PTD configuration was used, thermometer=5, heating=1, cooling=1 and impulse=0

// Comparision 1
// TextA: "Hello World"
// textB: "H!eeelxxlwoo Woorldssss"
{
  "PedroThermoSimilarity":  0.6722206685686631
  "LevenshtainDistance":  0.4782608695652174
  "Damerau-LevenshtainDistance":  0.4782608695652174
  "OSA":  0.4782608695652174
  "JaroDistance":  0.7806324110671937
  "JaroWinklerDistance":  0.8025691699604743
}

// Comparision 2
// TextA: "Hello World"
// textB: "elowHlolrWd"
{
  "PedroThermoSimilarity":  0.38584465653394745
  "LevenshtainDistance":  0.36363636363636365
  "Damerau-LevenshtainDistance":  0.36363636363636365
  "OSA":  0.36363636363636365
  "JaroDistance":  0.806060606060606 // no much reliable
  "JaroWinklerDistance":  0.806060606060606 // no much reliable
}
```

## Usage Examples
### PedroThermoDistance: O(N\*M) for a constant T

Before the examples you will need to create an instance of ```PedroThermoDistance```

```javascript
const ptd = PedroThermoDistance.from("Hello World", "elowHlolrWd", 5, { heating: 1, cooling: 1 });
```

Most of the examples below use a parameter called ```impulse```, the ```impulse``` determines how good or bad the thermometer will start, where 0 is very bad, any error at the beginning would already charge ```thermometerSize``` and 1 is very good, any error at the beginning would charge 1.
    
### Distance: O(1)
Here is how you might use the algorithm to calculate strings distance ```distance(impulse)```:

  ```javascript
  // example
  console.log(ptd.distance(0)); // 34
  console.log(ptd.maxDistance(0)) // 110
  ```

### MaxDistance: O(N+M)
Here is how you might use the algorithm to calculate strings max distance ```maxDistance(impulse)```:

  ```javascript
  // example
  console.log(ptd.maxDistance(0)) // 110
  ```

### Local Similarity O(N+M)
Here is how you might use the algorithm to compare two strings for local similarity ```localSimilarity(impulse, softness=0.5)```:

  - **softness**: Used in the calculations to weight the standard deviation, that is, how much it should influence the similarity, higher values ​​create a smoother curve.
  
  ```javascript
  // example
  const ptd = PedroThermoDistance.from("Hello World", "elowHlolrWd", 5, { heating: 1, cooling: 1 });
  const localSimilarityScore = ptd.localSimilarity(0);
  console.log(localSimilarityScore); // ~0.38
  ```

### Distance Similarity: O(N+M)
This example demonstrates how the PedroThermoDistance calculates similarity ```similarity(impulse)```:
```Distance similarity is simpler but is a crucial part of local similarity, but if you want to use something simpler and more performative.```

  ```javascript
  // example
  const ptd = PedroThermoDistance.from("Hello World", "elowHlolrWd", 5, { heating: 1, cooling: 1 });
  const distanceSimilarityScore = ptd.similarity(0);
  console.log(distanceSimilarityScore); // ~0.69
  ```

### Traverse: O(N+M)
This example demonstrates how the PedroThermoDistance traverse the best solution with ```traverse(impulse)```:
  
  ```javascript
  // example
  const ptd = PedroThermoDistance.from("testing", "eztzzng", 5, { heating: 1, cooling: 1 });
  // This returns an object with two parameters, representing the traversal from right to left (rtl) and from left to right (ltr)
  // In both objects, they will contain 3 attributes, matchedText1 and matchedText2 which are the aligned texts and the temperature measurements
  const traversed = ptd.traverse(0)
  console.log(traversed.ltr.matchedText1); // "-e-t-ng" 
  console.log(traversed.ltr.matchedText2); // "e-t--ng"
  console.log(traversed.ltr.measurements); // [0, 0, 3, 4, 5, 0, 4, 5, 0, 4] 
  ```

## Description
PedroThermoDistance leverages a dynamic programming approach to determine the similarity between two strings. The core of its innovation lies in the 'thermometer' mechanism, which visualizes the string matching process as temperature variations. As strings are compared character by character, the algorithm adjusts the 'temperature' based on matching outcomes: successful matches heat up the 'temperature,' while mismatches cool it down.

This temperature adjustment is constrained by the thermometerSize, which sets the maximum positive and negative bounds, akin to a thermometer’s maximum and minimum readings. These bounds prevent excessive penalties or rewards for long sequences of consecutive matches or mismatches, ensuring a balanced and fair assessment of similarity.

- ### Example Visualization
  Consider two strings, ```s1 = "testee"``` and ```s2 = "txxxstee"```. Given a thermometerSize of ```3```, the ```PedroThermoDistance``` algorithm might produce a sequence of temperature changes as follows:  
  t e - - - s t e e q  
  t - x x x s t e e u  

  Starting at ```impulse=1``` (This implies that the thermometer starts hot at the limit which would be 3, this means that it starts out good, as if it had already hit several letters before.) ->  
    
  Match 't' - thermometer remains at maximum (when you get it right, there is no penalty, even the temperature is below 0): **+0**  
  Mismatch 'e' - cools the thermometer by 1 and penalty the current temperature: **+1**  
  Mismatch 'x' - cools the thermometer by 1 and penalty the current temperature: **+2**  
  Mismatch 'x' - cools the thermometer by 1 (the temperature reached its minimum), penalty the current temperature: **+3**  
  Mismatch 'x' - cools the thermometer by 1 (the temperature reached its minimum), penalty the current temperature: **+3**  
  Match 's' - the temperature heats up by 1 point (when you get it right, there is no penalty): **+0**  
  Match 't' - the temperature heats up by 1 point (when you get it right, there is no penalty): **+0**  
  Match 'e' - thermometer remains at maximum (when you get it right, there is no penalty): **+0**  
  Match 'e' - thermometer remains at maximum (when you get it right, there is no penalty): **+0**  
  Match 'q' - cools the thermometer by 1 and penalty the current temperature): **+1**  
  Match 'u' - cools the thermometer by 1 and penalty the current temperature): **+2**  
    
  This sequence of temperature measures, ```[0, 1, 2, 3, 3, 0, 0, 0, 0, 1, 2]```, demonstrates how the thermometer adapts during the comparison. Adjusting the ```cooling``` and ```heating``` rates can further fine-tune this behavior, making the algorithm flexible to different textual contexts and comparison needs. PedroThermoDistance is capable of calculating the similarity of strings using the sum of temperature measurements over the maximum distance, it also provides local similarity using temperature measurements, standard deviation and some other considerations. Local similarity has shown itself to be very promising for several use cases.  
    
  The time complexity of PedroThermoDistance is O(firstText * secondText * thermometerSize) where thermometerSize can be easily disregarded as it is a constant in most use cases, and it allow efficient real-time analyses. This efficiency, combined with its dynamic adaptability, makes it an excellent tool for applications in data processing where text similarity assessments are crucial.  

## Live Demo

Experience the PedroThermoDistance algorithm live! Click the link below to access an interactive user interface where you can input strings and compare them using different thermometer sizes and heating or cooling rates.

[Try PedroThermoDistance Live](https://pedrohcdo.github.io/PedroThermoDistance/)

Use the text fields to input the strings you want to compare, adjust the thermometer size, and modify the heating and cooling rates to see the similarity score between the two strings and at the bottom you can compare different algorithms (such as levenshtain, jara, .. ), to use in string clustering (in the example a simple knn was used).

## PedroThermoDistance Configuration Parameters
  - **thermometerSize**:
    Defines the range and granularity of the thermometer mechanism. A larger size allows for a more nuanced response to sequences of matches or mismatches, influencing the sensitivity and stability of the temperature adjustments during text comparison.
  - **heating**:
    Specifies the rate at which the thermometer's temperature increases after each match. Higher heating rates enhance the algorithm's responsiveness to correct sequences, amplifying the impact of consecutive matches.
  - **cooling**:
    Determines the rate at which the thermometer's temperature decreases following a mismatch. Higher cooling rates intensify the penalty for mismatches, significantly impacting the algorithm's sensitivity to errors and increasing the weight of each error in the overall similarity calculation.

### Operation Modes
  - **Local Similarity**: 
    This mode computes a ```local similarity``` using the current distance similarity and also all measurements acquired on the best path dynamically. It leverages a nuanced assessment of similarity, taking into account not only the direct match/mismatch by max distance but also their distribution across the string. The local similarity is determined by the proximity of the similarity score to 0 or 1, indicating more definitive matching or mismatching. It adjusts for variability in matching quality using the standard deviation weighted by the proximity of the similarity to the center, the closer the similarity approaches a center (that is greater than 0 and less than 1) the more the standard deviation is considered, which reflects the deviation from a median similarity level. This is only possible due to the way in which the algorithm was designed, making it possible to capture these temperature variations. This method is particularly reliable for confirming the quality of matches or mismatches, making it suitable for applications where precise text alignment and comparison are crucial.
  - **Similarity**: 
    This mode calculates a direct similarity score based on the overall distance between two strings which is the sum of the measured temperatures divided by the maximum cost it would have between the two strings, without additional adjustments. It reflects the aggregate quality of the match across the entire length of the strings, providing a holistic view of their similarity. This mode is useful for general text similarity assessments where detailed local variations are less critical.

## F-Score Evaluation Setup and Execution
To accurately assess the F-Score of various similarity algorithms using the PedroThermoSimilarity system.
The script employs a series of algorithms to determine text similarity, each of which can treat word variations differently. To do this, a dataset is generated using a list of word examples, this dataset represents this list of words with some modifications, from subtle modifications to gross modifications, all modifications are random, the same generated dataset is used for all algorithms to generate the score fairly. The algorithms used were: **Levenshtein, Damerau-Levenshtein, OSA, Jaro, Jaro-Winkler, Dice, Jaccard Index, Hamming Distance and Pedro Thermo Similarity**, to run the evaluation follow the steps:
    
  - ### Step 1: Install ts-node
  `ts-node` is required to execute TypeScript files directly from the command line. Install it globally using npm with the following command:
  ```bash
  npm install -g ts-node
  ```
  
  - ### Step 2: Clone the Repository
  Clone the PedroThermoDistance repository from GitHub to your local machine using the following git command:
  ```bash
  git clone git@github.com:pedrohcdo/PedroThermoDistance.git
  ```
  
  - ### Step 3: Install Dependencies
  Navigate to the cloned repository directory and install the necessary npm packages:
  ```bash
  cd PedroThermoDistance
  npm install
  ```
  
  - ### Step 4: Run the Similarity Evaluation Script
  Execute the similarity assessment script using `ts-node`. This script evaluates the F1-Score for various algorithms by generating a dataset based on a sample of words:
  ```bash
  ts-node ./similarity-evaluation/text-similarity-evaluation.ts
  ```

  - ### Sample of output
  These algorithms are sourced from the `hermetrics` library, which provides well-tested implementations.
  ```javascript
  {
    "Levenshtain":  0.14260249554367205,
    "Damerau-Levenshtain":  0.14260249554367205,
    "OSA":  0.1524822695035461,
    "Jaro":  0.4017341040462427,
    "Jaro-Winkler":  0.5194109772423026,
    "Dice":  0.4380833851897946,
    "Jaccard":  0.3398409255242227,
    "Hamming":  0.0450281425891182,
    "Pedro Thermo Similarity":  0.7417519908987484
  }
  ```

## License

MIT License

Copyright (c) [2024] [Pedro Henrique Chaves de Oliveira]

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
