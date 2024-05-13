import LevenshteinCostOptions from '../interfaces/levenshtein-opts.interface'
import Levenshtein from './levenshtein'

class DamerauLevenshtein extends Levenshtein {
  constructor (name: string = 'Damerau-Levenshtein') {
    super(name)
  }

  public distance (source: string, target: string, { deletionCost, insertionCost, substitutionCost, transpositionCost }: LevenshteinCostOptions = {}): number {
    const sourceLength: number = source.length
    const targetLength: number = target.length

    const removeCost: number = deletionCost ?? 1
    const insertCost: number = insertionCost ?? 1
    const subtractCost: number = substitutionCost ?? 1
    const transposCost: number = transpositionCost ?? 1
    const rows: number = sourceLength + 2
    const cols: number = targetLength + 2

    const UPPER: number = Math.max(removeCost, insertCost, subtractCost, transposCost) * (sourceLength + targetLength)

    const distanceMatrix: number[][] = Array<number>(rows).fill(0).map(() => Array<number>(cols).fill(0))

    for (let i = 0; i < rows; i++) {
      distanceMatrix[i][0] = UPPER
    }
    for (let j = 0; j < cols; j++) {
      distanceMatrix[0][j] = UPPER
    }
    for (let i = 1; i < rows; i++) {
      distanceMatrix[i][1] = (i - 1) * insertCost
    }
    for (let j = 1; j < cols; j++) {
      distanceMatrix[1][j] = (j - 1) * insertCost
    }

    let lastMatchCol: number = 0
    let lastMatchRow: number = 0
    let sourceSymbol: string = ''
    let targetSymbol: string = ''
    let optSubCost: number = 0
    let deletion: number = 0
    let insertion: number = 0
    let substitution: number = 0
    let transpotition: number = 0

    const lastRow = Object.create(null)

    for (let i = 1; i < sourceLength + 1; i++) {
      sourceSymbol = source[i - 1]
      lastMatchCol = 0

      for (let j = 1; j < targetLength + 1; j++) {
        targetSymbol = target[j - 1]
        lastMatchRow = lastRow[targetSymbol] !== undefined ? lastRow[targetSymbol] : 0
        optSubCost = sourceSymbol === targetSymbol ? 0 : subtractCost

        deletion = distanceMatrix[i][j + 1] + removeCost
        insertion = distanceMatrix[i + 1][j] + insertCost
        substitution = distanceMatrix[i][j] + optSubCost

        transpotition = distanceMatrix[lastMatchRow][lastMatchCol] +
                                Math.max((i - lastMatchRow) * removeCost, (j - lastMatchCol) * insertCost) + transposCost
        distanceMatrix[i + 1][j + 1] = Math.min(deletion, insertion, substitution, transpotition)

        if (optSubCost === 0) {
          lastMatchCol = j
        }
      }
      lastRow[sourceSymbol] = i
    }

    return distanceMatrix[rows - 1][cols - 1]
  }

  /**
     *
     * @param source
     * @param target
     * @param param2
     */
  public maxDistance (source: string, target: string, { deletionCost, insertionCost, substitutionCost, cost = 1 }: LevenshteinCostOptions = {}): number {
    return super.maxDistance(source, target, { deletionCost, insertionCost, substitutionCost, cost })
  }
}

export default DamerauLevenshtein
