import { describe, it } from 'mocha'
import { expect } from 'chai'
import MetricComparator from '../../src/hermetrics/metric-comparator'
import ComparatorSimilarity from '../../src/interfaces/comparator-opts.interface'

describe('Metric comparator', function() {
    describe('Metrics tests', function() {           
       it('should return 0.5 with Levenshtein metric', function() {
            // Arrange
        const metricComparator = new MetricComparator()

        // Act
        const result = metricComparator.similarity('hardin', 'martinez')
        const levenshteinResult: Array<ComparatorSimilarity>  = result.filter(item => item.metric.name === 'Levenshtein')

        // Assert
        expect(levenshteinResult[0].metric.similarityValue).equal(0.5)
       })
    
       it('should return ~ 0.72 with Jaro metric', function() {
            // Arrange
            const metricComparator = new MetricComparator()

            // Act
            const result = metricComparator.similarity('hardin', 'martinez')
            const levenshteinResult: Array<ComparatorSimilarity>  = result.filter(item => item.metric.name === 'Jaro')

            // Assert
            expect(levenshteinResult[0].metric.similarityValue).to.be.closeTo(0.722222, 1e-6)
        })

        it('should return ~ 0.72 with JaroWinkler metric', function() {
                // Arrangejua
                const metricComparator = new MetricComparator()
     
                // Act
                const result = metricComparator.similarity('hardin', 'martinez')
                const levenshteinResult: Array<ComparatorSimilarity>  = result.filter(item => item.metric.name === 'JaroWinkler')
    
                // Assert
                expect(levenshteinResult[0].metric.similarityValue).to.be.closeTo(0.722222, 1e-6)
        })
        it('should return ~ 0.4 with Jaccard metric', function() {
            // Arrangejua
            const metricComparator = new MetricComparator()
 
            // Act
            const result = metricComparator.similarity('hardin', 'martinez')
            const levenshteinResult: Array<ComparatorSimilarity>  = result.filter(item => item.metric.name === 'Jaccard')

            // Assert
            expect(levenshteinResult[0].metric.similarityValue).to.be.closeTo(0.4, 1e-6)
        })
        it('should return ~ 0.571 with Dice metric', function() {
            // Arrange
            const metricComparator = new MetricComparator()

            // Act
            const result = metricComparator.similarity('hardin', 'martinez')
            const levenshteinResult: Array<ComparatorSimilarity>  = result.filter(item => item.metric.name === 'Dice') 

            // Assert
            expect(levenshteinResult[0].metric.similarityValue).to.be.closeTo(0.571428, 1e-6)
        })
        it('should return ~ 0.5 with Damerau-Levenshtein metric', function() {
            // Arrange
            const metricComparator = new MetricComparator()

            // Act
            const result = metricComparator.similarity('hardin', 'martinez')
            const levenshteinResult: Array<ComparatorSimilarity>  = result.filter(item => item.metric.name === 'Damerau-Levenshtein') 

            // Assert
            expect(levenshteinResult[0].metric.similarityValue).to.be.closeTo(0.5, 1e-6)
        })
        it('should return ~ 0.5 with Hamming metric', function() {
            // Arrange
            const metricComparator = new MetricComparator()

            // Act
            const result = metricComparator.similarity('hardin', 'martinez')
            const levenshteinResult: Array<ComparatorSimilarity>  = result.filter(item => item.metric.name === 'Hamming') 

            // Assert
            expect(levenshteinResult[0].metric.similarityValue).to.be.closeTo(0.5, 1e-6)
        })
        it('should return ~ 0.5 with OSA metric', function() {
            // Arrange
            const metricComparator = new MetricComparator()

            // Act
            const result = metricComparator.similarity('hardin', 'martinez')
            const levenshteinResult: Array<ComparatorSimilarity>  = result.filter(item => item.metric.name === 'OSA') 

            // Assert
            expect(levenshteinResult[0].metric.similarityValue).to.be.closeTo(0.5, 1e-6)
        })
    })
})