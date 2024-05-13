import Metric from './metric'
import LevenshteinCostOptions from '../interfaces/levenshtein-opts.interface'

class Levenshtein extends Metric {
  constructor (name: string = 'Levenshtein') {
    super(name)
  }

  public distance (source: string, target: string, { deletionCost, insertionCost, substitutionCost }: LevenshteinCostOptions = {}): number {
    const sourceLength: number = source.length
    const targetLength: number = target.length
    const removeCost: number = deletionCost ?? 1
    const insertCost: number = insertionCost ?? 1
    const subtractCost: number = substitutionCost ?? 1
    const rows: number = sourceLength + 1
    const cols: number = targetLength + 1

    const distanceMatrix: number[][] = Array<number>(cols).fill(0).map(() => Array<number>(rows).fill(0))

    for (let i = 0; i <= sourceLength; i++) {
      distanceMatrix[0][i] = i * removeCost
    }

    for (let j = 0; j <= targetLength; j++) {
      distanceMatrix[j][0] = j * insertCost
    }

    for (let j = 1; j <= targetLength; j++) {
      for (let i = 1; i <= sourceLength; i++) {
        let indicator: number = 0
        if (source[i - 1] !== target[j - 1]) { indicator += subtractCost }
        distanceMatrix[j][i] = Math.min(
          distanceMatrix[j][i - 1] + removeCost,
          distanceMatrix[j - 1][i] + insertCost,
          distanceMatrix[j - 1][i - 1] + indicator
        )
      }
    }

    return distanceMatrix[targetLength][sourceLength]
  }

  public maxDistance (source: string, target: string, { deletionCost, insertionCost, substitutionCost, cost = 1 }: LevenshteinCostOptions = {}): number {
    const sourceLength: number = source.length
    const targetLength: number = target.length
    const delCost: number = deletionCost ?? cost
    const insCost: number = insertionCost ?? cost
    const subCost: number = substitutionCost ?? cost

    const maxDel: number = Math.max(sourceLength - targetLength, 0)
    const maxIns: number = Math.max(targetLength - sourceLength, 0)
    const maxSub: number = Math.min(sourceLength, targetLength)

    return maxDel * delCost + maxIns * insCost + maxSub * subCost
  }
}

export default Levenshtein
