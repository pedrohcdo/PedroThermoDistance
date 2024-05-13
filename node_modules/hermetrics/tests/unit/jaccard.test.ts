import { describe, it } from 'mocha'
import { expect } from 'chai'
import Jacccard from '../../src/hermetrics/jaccard'

describe('Jaccard tests', function() {
    describe('Distance tests', function() {
        it('should return 0 with source = abc and target = abc', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.distance('abc', 'abc');

            // Assert
            expect(result).equal(0)
        })
        it('should return 1 with source = abc and target = def', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.distance('abc', 'def');

            // Assert
            expect(result).equal(1)
        })
        it('should return 1 with source = abc and empty target', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.distance('abc', '');

            // Assert
            expect(result).equal(1)
        })
        it('should return 1 with empty source and target = abc', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.distance('', 'abc');

            // Assert
            expect(result).equal(1)
        })
        it('should return 0 with empty source and empty target', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.distance('', '');

            // Assert
            expect(result).equal(0)
        })
        it('should return 0 with source = abcd and target = dcba', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.distance('abcd', 'dcba');

            // Assert
            expect(result).equal(0)
        })
        it('should return ~ 0.6 with source = abcd and target = abe', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.distance('abcd', 'abe');

            // Assert
            expect(result).to.be.closeTo(0.6, 1e-6)
        })
        it('should return ~ 0.3 with source = ["hello","world"] and target = ["hello","cruel","world"]', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.distance(["hello","world"], ["hello","cruel","world"]);

            // Assert
            expect(result).to.be.closeTo(0.333333, 1e-6)
        })
    })
    describe('Similarity tests', function() {

        it('should return 1 with source = abc and target = abc', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.similarity('abc', 'abc');

            // Assert
            expect(result).equal(1)
        })
        it('should return 0 with source = abc and target = def', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.similarity('abc', 'def');

            // Assert
            expect(result).equal(0)
        })
        it('should return 0 with source = abc and empty target', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.similarity('abc', '');

            // Assert
            expect(result).equal(0)
        })
        it('should return 0 with empty source and target = abc', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.similarity('', 'abc');

            // Assert
            expect(result).equal(0)
        })
        it('should return 1 with empty source and empty target', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.similarity('', '');

            // Assert
            expect(result).equal(1)
        })
        it('should return 1 with source = abcd and target = dcba', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.similarity('abcd', 'dcba');

            // Assert
            expect(result).equal(1)
        })
        it('should return ~ 0.4 with source = abcd and target = abe', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.similarity('abcd', 'abe');

            // Assert
            expect(result).to.be.closeTo(0.4, 1e-6)
        })
        it('should return ~ 0.6 with source = ["hello","world"] and target = ["hello","cruel","world"]', function() {
            // Arrange
            const jaccard =  new Jacccard();

            //Act
            const result: number = jaccard.similarity(["hello","world"], ["hello","cruel","world"]);

            // Assert
            expect(result).to.be.closeTo(0.666666, 1e-6)
        })
    })
})