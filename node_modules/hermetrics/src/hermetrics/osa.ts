import LevenshteinCostOptions from '../interfaces/levenshtein-opts.interface'
import Levenshtein from './levenshtein'

class OSA extends Levenshtein {
  constructor (name: string = 'OSA') {
    super(name)
  }

  public distance (source: string, target: string, { deletionCost, insertionCost, substitutionCost, transpositionCost, cost = 1 }: LevenshteinCostOptions = {}): number {
    const sourceLength: number = source.length
    const targetLength: number = target.length

    const removeCost: number = deletionCost ?? cost
    const insertCost: number = insertionCost ?? cost
    const subtractCost: number = substitutionCost ?? cost
    const transposCost: number = transpositionCost ?? cost
    const rows: number = sourceLength + 1
    const cols: number = targetLength + 1

    const distanceMatrix: number[][] = Array<number>(rows).fill(0).map(() => Array<number>(cols).fill(0))

    for (let i = 1; i < rows; i++) {
      distanceMatrix[i][0] = i * removeCost
    }

    for (let i = 1; i < cols; i++) {
      distanceMatrix[0][i] = i * insertCost
    }

    let deletion: number = 0
    let insertion: number = 0
    let substitution: number = 0

    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        deletion = distanceMatrix[i - 1][j] + removeCost
        insertion = distanceMatrix[i][j - 1] + insertCost
        substitution = distanceMatrix[i - 1][j - 1]

        if (source[i - 1] !== target[j - 1]) {
          substitution += subtractCost
        }

        distanceMatrix[i][j] = Math.min(deletion, insertion, substitution)

        if (i > 1 && j > 1 && source[i - 1] === target[j - 2] && source[i - 2] === target[j - 1]) {
          distanceMatrix[i][j] = Math.min(distanceMatrix[i][j], distanceMatrix[i - 2][j - 2] + transposCost)
        }
      }
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

  public maxDistanceWithTranspositions (source: string, target: string, { deletionCost, insertionCost, substitutionCost, transpositionCost, cost = 1 }: LevenshteinCostOptions = {}): number {
    const sourceLength: number = source.length
    const targetLength: number = target.length
    const removeCost: number = deletionCost ?? cost
    const insertCost: number = insertionCost ?? cost
    let subtractCost: number = substitutionCost ?? cost
    let transposCost: number = transpositionCost ?? cost

    subtractCost = Math.min(subtractCost, removeCost + insertCost)
    transposCost = Math.min(transposCost, subtractCost * 2)

    const maxDel: number = Math.max(sourceLength - targetLength, 0)
    const maxIns: number = Math.max(targetLength - sourceLength, 0)
    const maxSub: number = Math.min(sourceLength, targetLength)
    const maxTra: number = Math.trunc(maxSub / 2)

    const delDist: number = maxDel * removeCost
    const insDist: number = maxIns * insertCost
    const subDist: number = maxSub * subtractCost
    const traDist: number = maxTra * transposCost

    return delDist + insDist + Math.min(subDist, traDist)
  }
}

export default OSA
