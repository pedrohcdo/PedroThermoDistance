import { describe, it } from 'mocha'
import { expect } from 'chai'
import Dice from '../../src/hermetrics/dice'


describe('Dice tests', function() {
    describe('Distance tests', function() {
        
        it('should return 0 with source = abc and target = abc', function() {
            
            const dice = new Dice()

            const result = dice.distance('abc', 'abc');

            expect(result).equal(0)
        })

        it('should return 1 with source = abc and target  = def', function() {
            
            const dice = new Dice()

            const result = dice.distance('abc', 'def');

            expect(result).equal(1)
        })

        it('should return 1 with source = abc and empty target', function() {
            
            const dice = new Dice()

            const result = dice.distance('abc', '');

            expect(result).equal(1)
        })

        it('should return 1 with empty source and target = abc', function() {
            
            const dice = new Dice()

            const result = dice.distance('', 'abc');

            expect(result).equal(1)
        })

        it('should return 0 with empty source and empty target', function() {
            
            const dice = new Dice()

            const result = dice.distance('', '');

            expect(result).equal(0)
        })

        it('should return 0 with  source = abcd and  target = dcba', function() {
            
            const dice = new Dice()

            const result = dice.distance('abcd', 'dcba');

            expect(result).equal(0)
        })

        it('should return ~ 0.429 with  source = abcd and  target = abe', function() {
            
            const dice = new Dice()

            let result: number = dice.distance('abcd', 'abe');
            result = Number(result.toPrecision(3)) // Fixed decimals

            expect(result).to.be.closeTo(0.429, 1e-6)
        })

        it('should return 0.5 with  source = abcd and  target = abef', function() {
            
            const dice = new Dice()

            const result: number = dice.distance('abcd', 'abef');

            expect(result).to.be.closeTo(0.5, 1e-6)
        })

        it('should return 0.2 with  source = ["hello","world"] and  target = ["hello","cruel","world"]', function() {
            
            const dice = new Dice()

            const result: number = dice.distance(["hello","world"], ["hello","cruel","world"]);

            expect(result).to.be.closeTo(0.2, 1e-6)
        })

    })
})