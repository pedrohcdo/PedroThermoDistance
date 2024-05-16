import { Dice, Hamming, Jaccard, Jaro, JaroWinkler, Levenshtein, OSA } from "hermetrics"
import { WordPredicatePair, generateMessyWords } from "./tools/dataset-generator"
import { WordsSample } from "./words-sample"
import { PedroThermoDistance } from "../pedro-thermo-distance-and-similarity"
import damerauLevenshtein from "damerau-levenshtein"

function textSimilarityEvaluation(
    dataset: WordPredicatePair[],
    normalization: (label: string, pred: string) => number,
    threshold: (label: string, pred: string) => number,
): number {
    let tp = 0, fp = 0, fn = 0, tn = 0;

    dataset.forEach((data: WordPredicatePair) => {
        const { label, pred, equals } = data;

        const normalized = normalization(pred, label);
        const equalsTest = normalized >= threshold(pred, label)
        
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

//
const levenshtein = new Levenshtein()
const osa = new OSA()
const jaro = new Jaro()
const jaroWinkler = new JaroWinkler()
const dice = new Dice()
const jaccard = new Jaccard()
const hamming = new Hamming()

interface Algorithm {
    normalization: (label: string, pred: string) => number;
    threshold: (label: string, pred: string) => number;
}
interface Algorithms {
    [key: string]: Algorithm;
}

const algorithmsEvaluation: Algorithms = {
    levenshtein: {
        normalization: (label: string, pred: string): number => {
            return Math.max(label.length, pred.length) - levenshtein.distance(pred, label)
        },
        threshold: (label: string, pred: string): number => {
            return (Math.min(label.length, pred.length) * 2) / 3
        }
    },
    damerauLevenshtein: {
        normalization: (label: string, pred: string): number => {
            return Math.max(label.length, pred.length) - damerauLevenshtein(pred, label).steps
        },
        threshold: (label: string, pred: string): number => {
            return (Math.min(label.length, pred.length) * 2) / 3
        }
    },
    osa: {
        normalization: (label: string, pred: string): number => {
            return osa.maxDistance(label, pred) - osa.distance(pred, label)
        },
        threshold: (label: string, pred: string): number => {
            return (Math.min(label.length, pred.length) * 2) / 3
        }
    },
    jaro: {
        normalization: (label: string, pred: string): number => {
            // You could transform the similarity into distance (similarity * maxDistance) to use like the others,
            // but the problem is that it doesn't have the maximum distance
            return jaro.similarity(label, pred)
        },
        threshold: (): number => {
            return 0.7
        }
    },
    jaroWinkler: {
        normalization: (label: string, pred: string): number => {
            // Could transform the similarity into distance (similarity * maxDistance) to use like the others,
            // but the problem is that it doesn't have the maximum distance
            return jaroWinkler.similarity(label, pred)
        },
        threshold: (): number => {
            return 0.7
        }
    },
    dice: {
        normalization: (label: string, pred: string): number => {
            // Could transform the similarity into distance (similarity * maxDistance) to use like the others,
            // but the problem is that it doesn't have the maximum distance
            return dice.similarity(label, pred)
        },
        threshold: (): number => {
            return 0.7
        }
    },
    jaccard: {
        normalization: (label: string, pred: string): number => {
             // Could transform the similarity into distance (similarity * maxDistance) to use like the others,
            // but the problem is that it doesn't have the maximum distance
            return jaccard.similarity(label, pred)
        },
        threshold: (label: string, pred: string): number => {
            return 0.7
        }
    },
    hamming: {
        normalization: (label: string, pred: string): number => {
            return hamming.maxDistance(label, pred) - hamming.distance(pred, label)
        },
        threshold: (label: string, pred: string): number => {
            return Math.min(label.length, pred.length) / 2
        }
    },
    pedroThermoSimilarity: {
        normalization: (label: string, pred: string): number => {
            return PedroThermoDistance.from(label, pred, 10, { heating: 1, cooling: 1}).localSimilarity(0.5)
        },
        threshold: (label: string, pred: string): number => {
            return 0.7
        }
    }
}

console.log("Generating messy words..")
const dataset: WordPredicatePair[] = generateMessyWords(WordsSample)
console.log("Generated messy words")

for(const algName of Object.keys(algorithmsEvaluation)) {
    const { normalization, threshold } = algorithmsEvaluation[algName]
    console.log(algName, textSimilarityEvaluation(dataset, normalization, threshold))
}