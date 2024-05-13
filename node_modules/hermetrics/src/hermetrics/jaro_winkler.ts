import Jaro from './jaro'
import JaroCostOptions from './../interfaces/jaro-opts.interface'

class JaroWinkler extends Jaro {
  constructor (name: string = 'JaroWinkler') {
    super(name)
  }

  /**
     * Jaro Winkler Similarity
     * @param source
     * @param target
     * @param cost
     * @param p
     */
  public similarity (source: string, target: string, { insertionCost, deletionCost, substitutionCost, lambdaCost, roCost }: JaroCostOptions = {}): number {
    const p: number = roCost ?? 0.1

    if (!(p >= 0 && p <= 0.25)) {
      throw new Error('The p parameter must be between 0 and 0.25')
    }

    let l: number = 0
    const maxL: number = lambdaCost ?? 4

    for (let i = 0; i < maxL; i++) {
      if (source[i] !== target[i]) break
      l++
    }

    const j: number = super.similarity(source, target, { insertionCost, deletionCost, substitutionCost })
    return j + l * p * (1 - j)
  }

  /**
     * Jaro Winkler distance
     * @param source
     * @param target
     * @param cost
     * @param p
     */
  public distance (source: string, target: string, { insertionCost, deletionCost, substitutionCost, lambdaCost, roCost }: JaroCostOptions = {}): number {
    return 1 - this.similarity(source, target, { insertionCost, deletionCost, substitutionCost, lambdaCost, roCost })
  }
}
export default JaroWinkler
