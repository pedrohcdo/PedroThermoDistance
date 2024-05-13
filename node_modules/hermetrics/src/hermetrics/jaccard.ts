import Metric from './metric'
import ILevenshteinCostOptions from '../interfaces/levenshtein-opts.interface'

class Jaccard extends Metric {
  constructor (name: string = 'Jaccard') {
    super(name)
  }

  public similarity (source: string | String[], target: string | String[], costs: ILevenshteinCostOptions = {}): number {
    if (source.length === 0 && target.length === 0) return 1
    const s = new Set(source)
    const t = new Set(target)

    const result: number = ((this.intersection(s, t)).length / (this.union(s, t)).length)
    return result
  }

  private intersection (source: Set<String>, target: Set<String>): String[] {
    const s = Array.from(source)
    const t = Array.from(target)

    const intersection: String[] = s.filter(item => t.includes(item))

    return intersection
  }

  private union (source: Set<String> | String[], target: Set<String> | String[]): String[] {
    const s = Array.from(source)
    const t = Array.from(target)

    const stringsUnion = new Set(s.concat(t))

    return Array.from(stringsUnion)
  }

  public distance (source: string | String[], target: string | String[], costs: ILevenshteinCostOptions = {}): number {
    return 1 - this.similarity(source, target, costs)
  }
}

export default Jaccard
