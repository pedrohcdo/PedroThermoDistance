import { describe, it } from 'mocha'
import { expect } from 'chai'
import Hamming from '../../src/hermetrics/hamming';

describe('Hamming Metric', function()
{
    describe('Distance tests', function()
    {
        it('should return 1 for abcd - abce', function()
        {
            const haw = new Hamming();
            const distance = haw.distance('abcd', 'abce');
            expect(distance.toFixed(3)).equal('1.000')
        });
    })
    describe('Similarity tests', function()
    {
        it('should return 0.75 for abcd - abce', function()
        {
            const haw = new Hamming();
            const distance = haw.similarity('abcd', 'abce');
            expect(distance.toFixed(3)).equal('0.750');
        });
    });
    describe('Noralize distance tests', function () 
    {
        it('should return 0.25 for abcd - abce', function()
        {
            const ham = new Hamming();
            const distance = ham.normalizedDistance('abcd', 'abce');
            expect(distance.toFixed(3)).equal('0.250');
        });
    });
});