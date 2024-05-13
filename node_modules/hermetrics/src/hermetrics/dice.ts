import Jaccard from './jaccard'
import ILevenshteinCostOptions from '../interfaces/levenshtein-opts.interface'

class Dice extends Jaccard {
  constructor (name: string = 'Dice') {
    super(name)
  }

  public similarity (source: string | String[], target: string | String[], costs: ILevenshteinCostOptions = {}): number {
    if (source.length === 0 && target.length === 0) return 1
    const j = super.similarity(source, target, costs)
    return (2 * j) / (1 + j)
  }

  public distance (source: string | String[], target: string | String[], costs: ILevenshteinCostOptions = {}): number {
    return 1 - this.similarity(source, target, costs)
  }
}

export default Dice
