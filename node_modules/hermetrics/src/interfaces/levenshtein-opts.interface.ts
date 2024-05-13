export default interface LevenshteinCostOptions {
  deletionCost?: number
  insertionCost?: number
  substitutionCost?: number
  transpositionCost?: number
  cost?: number
}
