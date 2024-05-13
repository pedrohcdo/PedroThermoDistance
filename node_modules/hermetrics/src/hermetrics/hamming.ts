import Metric from './../hermetrics/metric'
import MetricCostOptions from './../interfaces/metric-opts.interface'
class Hamming extends Metric {
  constructor (name: string = 'Hamming') {
    super(name)
  }

  public distance (source: string, target: string, { cost }: MetricCostOptions = {}): number {
    const costHamming: number = cost ?? 1
    const lengthSource: number = source.length
    const lengthTarget: number = target.length
    const lengthDifference: number = Math.abs(lengthSource - lengthTarget)
    const minuminDistance: number = Math.min(lengthSource, lengthTarget)
    var distance: number = 0

    for (var i = 0; i < minuminDistance; i++) {
      distance += source[i] !== target[i] ? 1 : 0
    }

    return (lengthDifference + distance) * costHamming
  }

  public maxDistance (source: string, target: string, { cost }: MetricCostOptions = {}): number {
    const costHamming: number = cost ?? 1
    const lengthSource: number = source.length
    const lengthTarget: number = target.length
    return Math.max(lengthSource, lengthTarget) * costHamming
  }
}

export default Hamming
