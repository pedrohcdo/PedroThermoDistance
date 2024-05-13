import LevenshteinCostOptions from '../interfaces/levenshtein-opts.interface'

class Metric {
  private readonly _name: string;

  constructor (name = 'Generic') {
    this._name = name
  }

  /**
  * distance
  */
  public distance (source: string, target: string, { deletionCost, insertionCost, substitutionCost }: LevenshteinCostOptions = {}): number {
    return source === target ? 0 : 1
  }

  public maxDistance (source: string, target: string, { deletionCost, insertionCost, substitutionCost }: LevenshteinCostOptions = {}): number {
    return (source.length === 0 && target.length === 0) ? 0 : 1
  }

  /**
   *
   * @param source
   * @param target
   * @param cost
   */
  public minDistance (source: string, target: string, { deletionCost, insertionCost, substitutionCost }: LevenshteinCostOptions = {}): number {
    return 0
  }

  public normalize (x: number, low: number = 0, high: number = 1): number {
    // const norm : number = 0
    if (high <= low) {
      return 0
    }
    if (x >= high) {
      return 1
    }
    if (x <= low) {
      return 0
    }

    return (x - low) / (high - low)
  }

  public normalizedDistance (source: string, target: string, { deletionCost, insertionCost, substitutionCost }: LevenshteinCostOptions = {}): number {
    const x: number = this.distance(source, target, { deletionCost, insertionCost, substitutionCost })
    const min: number = this.minDistance(source, target, { deletionCost, insertionCost, substitutionCost })
    const max: number = this.maxDistance(source, target, { deletionCost, insertionCost, substitutionCost })
    return this.normalize(x, min, max)
  }

  /**
   * similarity
   */
  public similarity (source: string, target: string, costs: LevenshteinCostOptions = {}): number {
    return 1 - this.normalizedDistance(source, target, costs)
  }

  get name (): string {
    return this._name
  }
}

export default Metric
