export default interface LevenshteinCostOptions {
  cost?: number
  deletionCost?: number
  insertionCost?: number
  substitutionCost?: number
  transpositionCost?: number

}
