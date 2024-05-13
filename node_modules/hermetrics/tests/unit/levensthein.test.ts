import { describe, it } from 'mocha'
import { expect } from 'chai'
import Levenshtein from '../../src/hermetrics/levenshtein'

describe('Levenshtein metric', function() {

    describe('Distance tests', function() {
         it('should return 0 if the words are equals', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const equalWordsResult = levenshtein.distance('abc', 'abc');

            // Assert
            expect(equalWordsResult).equal(0);
         });
         it('should return 3 if the words doesn\'t have the same characters', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const notEqualWordsResult = levenshtein.distance('abc', 'def');

            // Assert
            expect(notEqualWordsResult).equal(3);
         });

         it('should return 3 with just the source word', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const justTargetWordResult = levenshtein.distance('abc', '');

            // Assert
            expect(justTargetWordResult).equal(3);
         });

         it('should return 3 with just the target word', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const justTargetWordResult = levenshtein.distance('', 'abc');

            // Assert
            expect(justTargetWordResult).equal(3);
         });

         it('should return 0 with empty words', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const noWordsResult = levenshtein.distance('', '');

            // Assert
            expect(noWordsResult).equal(0);
         });

         it('should return 5 with different length words', function() {
            // Arrange
            const levenshtein = new Levenshtein();
          
            // Act
            const differentLengthWordsResult = levenshtein.distance('start', 'end');

            // Assert
            expect(differentLengthWordsResult).equal(5);
         });

         it('should return 2 with similar length words', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const similarWordsResult = levenshtein.distance('end', 'ended');

            // Assert
            expect(similarWordsResult).equal(2);
         });

         it('should return 4 if the target word contains the source word', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const sourceContainsTargetWordsResult = levenshtein.distance('end', 'weekend');

            // Assert
            expect(sourceContainsTargetWordsResult).equal(4);
         });
         
         it('should return 4 if the words are in camel case', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const camelCaseWordsResult = levenshtein.distance('ABCDEFGH', 'A*C*E*G*');

            // Assert
            expect(camelCaseWordsResult).equal(4);
         });

         it('should return 1 if the source word have trailing space', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const spacesBetweenWordsResult = levenshtein.distance('hello world', 'helloworld');

            // Assert
            expect(spacesBetweenWordsResult).equal(1);
         });

         it('should return 2 if the words have a lot of similar characters', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const oneDifferenceCharWords = levenshtein.distance('survey', 'surgery');

            // Assert
            expect(oneDifferenceCharWords).equal(2);
         });
    });

    describe('Max distance test', function() {
        it('should return 3 if the words are equals', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const equalWordsResult = levenshtein.maxDistance('abc', 'abc');

            // Assert
            expect(equalWordsResult).equal(3);
         });
         it('should return 3 if the words doesn\'t have the same characters', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const notEqualWordsResult = levenshtein.maxDistance('abc', 'xyz');

            // Assert
            expect(notEqualWordsResult).equal(3);
         });
         it('should return 3 with just the source word', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const justTargetWordResult = levenshtein.maxDistance('abc', '');

            // Assert
            expect(justTargetWordResult).equal(3);
         });

         it('should return 3 with just the target word', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const justTargetWordResult = levenshtein.maxDistance('', 'xyz');

            // Assert
            expect(justTargetWordResult).equal(3);
         });
         it('should return 0 with empty words', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const emptyWordsResult = levenshtein.maxDistance('', '');

            // Assert
            expect(emptyWordsResult).equal(0);
         });
         it('should return 5 with different length words', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const differentLengthWordsResult = levenshtein.maxDistance('start', 'end');

            // Assert
            expect(differentLengthWordsResult).equal(5);
         });
         it('should return 5 with different length words inverted', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const differentLengthWordsResult = levenshtein.maxDistance('end', 'start');

            // Assert
            expect(differentLengthWordsResult).equal(5);
         });
         it('should return 8 if the words are in camel case', function() {
            // Arrange
            const levenshtein = new Levenshtein();

            // Act
            const camelCaseWordsResult = levenshtein.maxDistance('ABCDEFGH', 'A*C*E*G*');

            // Assert
            expect(camelCaseWordsResult).equal(8);
         });

    });
});