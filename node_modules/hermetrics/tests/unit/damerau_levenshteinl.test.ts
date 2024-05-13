import { describe, it } from 'mocha'
import { expect } from 'chai'
import DamerauLevenshtein from '../../src/hermetrics/damerau_levenshtein'
const ERROR : number = 1e-4
describe('Damerau - Levenshtein Distance', function()
{
    describe('Distance Test', function()
    {
        it('should return 2 for abcd - cbad', function()
        {   
            const dam = new DamerauLevenshtein();
            const distance = dam.distance('abcd', 'cbad');
            expect(distance).equal(2);
        });

        it('should return 2 for ace - abcde and (0.75, 1, 1.25, 1.5)', function()
        {   
            const dam = new DamerauLevenshtein();
            const distance = dam.distance('ace', 'abcde', {deletionCost:0.75, insertionCost:1,substitutionCost:1.25,transpositionCost:1.5});
            expect(distance).equal(2);
        });
        it('should return 3 for abc - def', function()
        {   
            const dam = new DamerauLevenshtein();
            const distance = dam.distance('abc', 'def');
            expect(distance).equal(3);
        });
    });

    describe('Similarity test', function()
    {
        it('should return 0.5 for abcd - cbad', function()
        {   
            const dam = new DamerauLevenshtein();
            const similarity = dam.similarity('abcd', 'cbad');
            const expApp = (0.5-ERROR < similarity && similarity < 0.5+ERROR) ? true : false
            expect(expApp).equal(true);
        });

        it('should return 0.6522 for ace - abcde and (0.75, 1, 1.25, 1.5)', function()
        {   
            const dam = new DamerauLevenshtein();
            const similarity = dam.similarity('ace', 'abcde', {deletionCost:0.75, insertionCost:1,substitutionCost:1.25,transpositionCost:1.5});
            const expApp = (0.6522-ERROR < similarity && similarity < 0.6522+ERROR) ? true : false
            expect(expApp).equal(true);
        });
    })
    describe('Normalized test', function()
    {
        it('should return 0.5 for abcd - cbad', function()
        {   
            const dam = new DamerauLevenshtein();
            const similarity = dam.normalizedDistance('abcd', 'cbad');
            const expApp = (0.5-ERROR < similarity && similarity < 0.5+ERROR) ? true : false
            expect(expApp).equal(true);
        });

        it('should return 0.3478 for ace - abcde and (0.75, 1, 1.25, 1.5)', function()
        {   
            const dam = new DamerauLevenshtein();
            const similarity = dam.normalizedDistance('ace', 'abcde', {deletionCost:0.75, insertionCost:1,substitutionCost:1.25,transpositionCost:1.5});
            const expApp = (0.3478-ERROR < similarity && similarity < 0.3478+ERROR) ? true : false
            expect(expApp).equal(true);
        });
    })
});