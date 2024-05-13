import Metric from './metric'
import Levenshtein from './levenshtein'
import Jaro from './jaro'
import JaroWinkler from './jaro_winkler'
import ComparatorSimilarity from '../interfaces/comparator-opts.interface'
import Jaccard from './jaccard'
import Hamming from '../hermetrics/hamming'
import Dice from '../hermetrics/dice'
import DamerauLevenshtein from '../hermetrics/damerau_levenshtein'
import OSA from './osa'

class MetricComparator {
  constructor (private readonly metrics: Metric[] = [
    new Levenshtein(),
    new Jaro(),
    new JaroWinkler(),
    new Jaccard(),
    new Hamming(),
    new Dice(),
    new DamerauLevenshtein(),
    new OSA()
  ]) {
    this.metrics = metrics
  }

  /**
   * similarity
   */
  public similarity (source: string, target: string): ComparatorSimilarity[] {
    const results: ComparatorSimilarity[] = []

    this.metrics.forEach(metric => {
      const metricItem: ComparatorSimilarity = {
        metric: {
          name: 'Generic',
          similarityValue: 0
        }
      }
      metricItem.metric.name = metric.name
      metricItem.metric.similarityValue = metric.similarity(source, target)
      results.push(metricItem)
    })

    return results
  }
}

export default MetricComparator
