import { describe, it } from 'mocha'
import { expect } from 'chai'
import OSA from '../../src/hermetrics/osa'
const ERROR : number = 1e-4
describe('OSA Distance', function()
{
    describe('Distance Test', function()
    {
        it('should return 1 for abcd - abdc', function()
        {   
            const osa = new OSA();
            const distance = osa.distance('abcd', 'abdc');
            expect(distance).equal(1);
        });

        it('should return 2 for ace - abcde and (0.75, 1, 1.25, 1.5)', function()
        {   
            const osa = new OSA();
            const distance = osa.distance('ace', 'abcde', {deletionCost:0.75, insertionCost:1,substitutionCost:1.25,transpositionCost:1.5});
            expect(distance).equal(2);
        });
        it('should return 3 for abc - def', function()
        {   
            const osa = new OSA();
            const distance = osa.distance('abc', 'def');
            expect(distance).equal(3);
        });
    });

    describe('Similarity test', function()
    {
        it('should return 0.75 for abcd - abdc', function()
        {   
            const osa = new OSA();
            const similarity = osa.similarity('abcd', 'abdc');
            const expApp = (0.75-ERROR < similarity && similarity < 0.75+ERROR) ? true : false
            expect(expApp).equal(true);
        });

        it('should return 0.3478 for ace - abcde and (0.75, 1, 1.25, 1.5)', function()
        {   
            const osa = new OSA();
            const similarity = osa.similarity('ace', 'abcde', {deletionCost:0.75, insertionCost:1,substitutionCost:1.25,transpositionCost:1.5});
            const expApp = (0.6522-ERROR < similarity && similarity < 0.6522+ERROR) ? true : false

            expect(expApp).equal(true);
        });
    })
    describe('Normalized test', function()
    {
        it('should return 0.25 for abcd - cbad', function()
        {   
            const osa = new OSA();
            const similarity = osa.normalizedDistance('abcd', 'abdc');
            const expApp = (0.25-ERROR < similarity && similarity < 0.25+ERROR) ? true : false
            expect(expApp).equal(true);
        });

        it('should return 0.6522 for ace - abcde and (0.75, 1, 1.25, 1.5)', function()
        {   
            const osa = new OSA();
            const similarity = osa.normalizedDistance('ace', 'abcde', {deletionCost:0.75, insertionCost:1,substitutionCost:1.25,transpositionCost:1.5});
            const expApp = (0.3478-ERROR < similarity && similarity < 0.3478+ERROR) ? true : false
            expect(expApp).equal(true);
        });
    })
});