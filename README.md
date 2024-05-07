# Pedro Thermo Distance

[![DOI](https://zenodo.org/badge/792886788.svg)](https://zenodo.org/doi/10.5281/zenodo.11078496)


Aqui está uma versão revisada e aprimorada da introdução e descrição do algoritmo PedroThermoDistance, agora incluindo os detalhes e exemplos que você forneceu:

## Introduction
The ```PedroThermoDistance``` algorithm introduces a dynamic thermometer approach to calculating string similarity. Using a dynamic programming, it incorporates a unique 'thermometer' mechanism that dynamically adjusts penalties and rewards during the string comparison process. This mechanism simulates a thermometer's behavior, where consecutive matches increase the 'temperature' (leading to rewards), and mismatches decrease it (resulting in penalties). This design allows the algorithm to adapt to the flow of textual similarities and differences, making it ideal for applications that require differentiated text analysis that involve, for example: nuances, misspellings, and etc. With it, it is also possible to generate aligned texts, which makes it even more useful for some use cases that need detailed comparisons and reconciliations of textual data.

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

### Operation Modes

- **Local Similarity**: 
  This mode computes a ```local similarity``` using the current distance similarity and also all measurements acquired on the best path dynamically. It leverages a nuanced assessment of similarity, taking into account not only the direct match/mismatch by max distance but also their distribution across the string. The local similarity is determined by the proximity of the similarity score to 0 or 1, indicating more definitive matching or mismatching. It adjusts for variability in matching quality using the standard deviation weighted by the proximity of the similarity to the center, the closer the similarity approaches a center (that is greater than 0 and less than 1) the more the standard deviation is considered, which reflects the deviation from a median similarity level. This is only possible due to the way in which the algorithm was designed, making it possible to capture these temperature variations. This method is particularly reliable for confirming the quality of matches or mismatches, making it suitable for applications where precise text alignment and comparison are crucial.
- **Distance Similarity**: 
  This mode calculates a direct similarity score based on the overall distance between two strings which is the sum of the measured temperatures divided by the maximum cost it would have between the two strings, without additional adjustments. It reflects the aggregate quality of the match across the entire length of the strings, providing a holistic view of their similarity. This mode is useful for general text similarity assessments where detailed local variations are less critical.

### Configuration Parameters

- **thermometerSize**:
  Defines the range and granularity of the thermometer mechanism. A larger size allows for a more nuanced response to sequences of matches or mismatches, influencing the sensitivity and stability of the temperature adjustments during text comparison.
- **heating**:
  Specifies the rate at which the thermometer's temperature increases after each match. Higher heating rates enhance the algorithm's responsiveness to correct sequences, amplifying the impact of consecutive matches.
- **cooling**:
  Determines the rate at which the thermometer's temperature decreases following a mismatch. Higher cooling rates intensify the penalty for mismatches, significantly impacting the algorithm's sensitivity to errors and increasing the weight of each error in the overall similarity calculation.

## Usage Examples

### Local Similarity
Here is how you might use the algorithm to compare two strings for local similarity ```localSimilarity(impulse, softness=1)```:

  - **impulse**: The impulse determines how good or bad the thermometer will start, where 0 is very bad, any error at the beginning would already charge ```thermometerSize``` and 1 is very good, any error at the beginning would charge 1.
  - **softness**: Used in the calculations to weight the standard deviation, that is, how much it should influence the similarity, higher values ​​create a smoother curve.
  
  ```javascript
  // example
  const ptd = PedroThermoDistance.from("Hello World", "elowHlolrWd", 5, { heating: 1, cooling: 1 });
  const localSimilarityScore = ptd.localSimilarity(0);
  console.log(localSimilarityScore); // ~0.49
  ```

### Distance Similarity
This example demonstrates how the PedroThermoDistance calculates global similarity ```similarity(impulse)```:

  - **impulse**: The impulse determines how good or bad the thermometer will start, where 0 is very bad, any error at the beginning would already charge ```thermometerSize``` and 1 is very good, any error at the beginning would charge 1.
  
  ```javascript
  // example
  const ptd = PedroThermoDistance.from("Hello World", "elowHlolrWd", 5, { heating: 1, cooling: 1 });
  const distanceSimilarityScore = ptd.similarity(0);
  console.log(distanceSimilarityScore); // ~0.69
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
