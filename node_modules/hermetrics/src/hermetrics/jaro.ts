import Metric from './metric'
import JaroCostOptions from './../interfaces/jaro-opts.interface'

class Jaro extends Metric {
  constructor (name: string = 'Jaro') {
    super(name)
  }

  /**
   * Jaro Similarity
   * @param source
   * @param target
   * @param cost
   */
  public similarity (source: string, target: string, { deletionCost, insertionCost, substitutionCost }: JaroCostOptions = {}): number {
    const sourceLength: number = source.length
    const targetLength: number = target.length

    if (sourceLength === 0 && targetLength === 0) {
      return 1
    }

    const matchDistance: number = Math.floor(Math.max(sourceLength, targetLength) / 2) - 1
    const sourceMatches: boolean[] = new Array(sourceLength)
    const targetMatches: boolean[] = new Array(targetLength)

    let matches: number = 0
    let transpositions: number = 0
    let start: number = 0
    let end: number = 0

    for (let i = 0; i < sourceLength; i++) {
      start = Math.max(0, i - matchDistance)
      end = Math.min(i + matchDistance + 1, targetLength)

      for (let j = start; j < end; j++) {
        if (targetMatches[j]) continue
        if (source[i] === target[j]) {
          sourceMatches[i] = true
          targetMatches[j] = true
          matches++
          break
        }
      }
    }
    if (matches === 0) return 0

    let k: number = 0

    for (let i = 0; i < sourceLength; i++) {
      if (!sourceMatches[i]) continue
      while (!targetMatches[k]) k++
      if (source[i] !== target[k]) transpositions++
      k++
    }

    return ((matches / sourceLength) + (matches / targetLength) + ((matches - transpositions / 2) / matches)) / 3
  }

  /**
   * Jaro distance
   * @param source
   * @param target
   * @param cost
   */
  public distance (source: string, target: string, { deletionCost, insertionCost, substitutionCost }: JaroCostOptions = {}): number {
    return 1 - this.similarity(source, target, { deletionCost, insertionCost, substitutionCost })
  }
}

export default Jaro
