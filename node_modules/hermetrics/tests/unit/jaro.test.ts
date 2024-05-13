import { describe, it } from 'mocha'
import { expect } from 'chai'
import Jaro from '../../src/hermetrics/jaro'

describe('Jaro Metric', function()
{
    describe('Distance tests', function()
    {
        it('should return 0.278 for abcd - abe', function()
        {
            const jaro = new Jaro();
            const distance = jaro.distance('abcd', 'abe');
            expect(distance.toFixed(3)).equal('0.278')
        })
    })
    describe('Similarity tests', function()
    {
        it('should return 0.722 for abcd - abe', function()
        {
            const jaro = new Jaro();
            const distance = jaro.similarity('abcd', 'abe');
            expect(distance.toFixed(3)).equal('0.722')
        })
    })
});