import { DamerauLevenshtein, Dice, Hamming, Jaccard, Jaro, JaroWinkler, Levenshtein, OSA } from "hermetrics"
import { WordPredicatePair, generateMessyWords } from "./tools/dataset-generator"
import { WordsSample } from "./words-sample"
import { PedroThermoDistance } from "../pedro-thermo-distance-and-similarity"

const levenshtein = new Levenshtein()
const damerauLevenshtein = new DamerauLevenshtein()
const osa = new OSA()
const jaro = new Jaro()
const jaroWinkler = new JaroWinkler()
const dice = new Dice()
const jaccard = new Jaccard()
const hamming = new Hamming()


function textSimilarityEvaluation(
    dataset: WordPredicatePair[],
    threshold: number = 0.8,
    callback: CallableFunction = (a: string, b: string) => levenshtein.distance(a, b)
): number {
    let tp = 0, fp = 0, fn = 0, tn = 0;

    dataset.forEach((data: WordPredicatePair) => {
        const { label, pred, equals } = data;

        const equalsTest = callback(label, pred) >= threshold;
        if (equalsTest && equals) tp++;
        else if (equalsTest && !equals) fp++;
        else if (!equalsTest && equals) fn++;
        else if (!equalsTest && !equals) tn++;
    });

    const precision = tp / (tp + fp);
    const recall = tp / (tp + fn);
    const f1Score = 2 * (precision * recall) / (precision + recall);

    return f1Score
}


const threshold = 0.9

const dataset: WordPredicatePair[] = generateMessyWords(WordsSample)

console.log("Levenshtain: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => levenshtein.similarity(a, b)))
console.log("Damerau-Levenshtain: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => damerauLevenshtein.similarity(a, b)))
console.log("OSA: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => osa.similarity(a, b)))
console.log("Jaro: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => jaro.similarity(a, b)))
console.log("Jaro-Winkler: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => jaroWinkler.similarity(a, b)))
console.log("Dice: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => dice.similarity(a, b)))
console.log("Jaccard: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => jaccard.similarity(a, b)))
console.log("Hamming: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => hamming.similarity(a, b)))
console.log("Pedro Thermo Similarity: ", textSimilarityEvaluation(dataset, threshold, (a: string, b: string) => {
    const phc = PedroThermoDistance.from(a, b, 10, { heating: 1, cooling: 1 })
    return phc.localSimilarity(0.5)
}))