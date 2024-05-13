import { describe, it } from 'mocha'
import { expect } from 'chai'
import JaroWinkler from '../../src/hermetrics/jaro_winkler';

describe('Jaro Winkler Metric', function()
{
    describe('Distance tests', function()
    {
        it('should return 0.222 for abcd - abe', function()
        {
            const jaw = new JaroWinkler();
            const distance = jaw.distance('abcd', 'abe');
            expect(distance.toFixed(3)).equal('0.222')
        })
    })
    describe('Similarity tests', function()
    {
        it('should return 0.778 for abcd - abe', function()
        {
            const jaw = new JaroWinkler();
            const distance = jaw.similarity('abcd', 'abe');
            expect(distance.toFixed(3)).equal('0.778');
        });

        it('should return 0.750 for abcd - abe with ro = 0.05', function()
        {
            const jaw = new JaroWinkler();
            const distance = jaw.similarity('abcd', 'abe', {roCost:0.05});
            expect(distance.toFixed(3)).equal('0.750');
        });

        it('should return 0.750 for abcd - abe with ro = 0.15', function()
        {
            const jaw = new JaroWinkler();
            const distance = jaw.similarity('abcd', 'abe', {roCost:0.15});
            expect(distance.toFixed(3)).equal('0.806');
        });

        it('should return 0.750 for abcd - abe with ro = 0.25', function()
        {
            const jaw = new JaroWinkler();
            const distance = jaw.similarity('abcd', 'abe', {roCost:0.25});
            expect(distance.toFixed(3)).equal('0.861');
        });
    });
});