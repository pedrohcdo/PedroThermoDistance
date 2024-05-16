import { WordMesser, repeatAlphabet } from "./messer-helper"

export type WordPredicatePair = { label: string, pred: string, equals: boolean }

export function generateMessyWords(words: string[]) {
    const validWords0: WordPredicatePair[] = words
        .map((pred, i) => ({
            label: pred,
            pred: pred,
            equals: true
        }))

    const validWords1: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.2, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords2: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.5, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))
    const validWords3: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.7, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords4: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(1, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))
        
    const validWords5: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.2, ['messy-delete']).pass()
                .mess(0.6, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords6: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['messy-delete']).pass()
                .mess(0.6, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords7: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['messy-delete', 'messy-insert']).pass()
                .mess(0.4, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords8: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords9: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose'])
                .mess(0.4, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords10: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose'])
                .mess(0.1, ['messy-delete'])
                .mess(0.3, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords11: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.4, ['transpose', 'messy-delete', 'messy-delete'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords12: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose'])
                .mess(0.2, ['messy-delete', 'messy-insert', 'swap'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords13: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.4, ['transpose'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords14: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose'])
                .mess(0.2, ['messy-delete'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords15: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose']).pass()
                .mess(1, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords16: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.1, ['transpose'])
                .mess(0.3, ['messy-delete']).pass()
                .mess(1, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords17: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.1, ['transpose'])
                .mess(0.15, ['messy-insert'])
                .mess(0.15, ['messy-delete']).pass()
                .mess(1, ['repeat'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords18: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.1, ['transpose'])
                .mess(0.01, ['swap'])
                .pass()
                .mess(0.5, ['repeat'])
                .mess(0.01, ['messy-delete']).pass()
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords19: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose'])
                .mess(0.1, ['repeat'])
                .pass()
                .mess(0.1, ['messy-delete']).pass()
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const invalidWords0: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w).maskPass("*").getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords1: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose']).pass()
                .mess(0.5, ['messy-delete']).pass()
                .mess(0.6, ['messy-insert']).pass()
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords2: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(1, ['transpose']).pass()
                .mess(0.6, ['messy-insert']).pass()
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords3: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(1, ['transpose']).pass()
                .mess(1, ['repeat']).pass()
                .mess(0.1, ['messy-delete']).pass()
                .mess(0.1, ['messy-insert']).pass()
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords4: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .confusePass()
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))
        
    const invalidWords5: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .confusePass()
                .mess(1, ['repeat']).pass()
                .mess(0.3, ['messy-insert'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords6: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .confusePass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat', 'messy-insert'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords7: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.8, ['transpose'])
                // Without .pass() it continues in the remaining spaces, the ones it finds and repeats more words
                .mess(1, ['messy-insert'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords8: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(1, ['transpose'])
                .mess(0.4, ['free-messy-insert'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))
        
    const invalidWords9: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.2, ['messy-delete', 'messy-insert']).pass()
                .mess(0.9, ['transpose'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords10: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.2, ['messy-delete']).pass()
                .mess(1, ['transpose'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords11: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.2, ['messy-insert']).pass()
                .mess(1, ['transpose'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords12: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.5, ['messy-delete']).pass()
                .mess(0.5, ['transpose'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords13: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.6, ['messy-delete']).pass()
                .mess(0.5, ['transpose'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords14: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['messy-delete']).pass()
                .mess(0.7, ['transpose'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords15: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.4, ['messy-delete']).pass()
                .mess(0.6, ['transpose'])
                .mess(0.4, ['free-messy-insert'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords16: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['swap'])
                .mess(0.5, ['transpose'])
                .mess(0.2, ['free-messy-insert'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords17: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.4, ['swap'])
                .mess(0.6, ['transpose'])
                .mess(0.4, ['free-messy-insert'])
                .getWord()
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 
    
    const repeatedAlphabet = WordMesser.from(repeatAlphabet(20))
                            .mess(0.8, ['messy-delete'])
                            .getWord()
                            
    const invalidWords18: WordPredicatePair[] = words
        .map((w) => {
            return repeatedAlphabet
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords19: WordPredicatePair[] = words
        .map(() => {
            return WordMesser.from(repeatedAlphabet)
                .mess(0.3, ['swap'])
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords20: WordPredicatePair[] = words
        .map(() => {
            return WordMesser.from(repeatedAlphabet)
                .mess(0.5, ['swap'])
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords21: WordPredicatePair[] = words
        .map(() => {
            return WordMesser.from(repeatedAlphabet)
                .mess(0.8, ['swap'])
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords22: WordPredicatePair[] = words
        .map(() => {
            return WordMesser.from(repeatedAlphabet)
                .mess(0.3, ['repeat'])
                .mess(0.8, ['swap'])
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords23: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords24: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .confusePass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords25: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(repeatedAlphabet)
                .mess(0.3, ['messy-delete'])
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 


    const invalidWords26: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(repeatedAlphabet)
                .mess(0.3, ['messy-delete'])
                .mess(0.2, ['transpose'])
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords27: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(repeatedAlphabet)
                .mess(0.2, ['transpose'])
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 

    const invalidWords28: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.3, ['transpose'])
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))   

    const invalidWords29: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.4, ['transpose'])
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))
        
    const invalidWords30: WordPredicatePair[] = words
        .map((w) => {
            return WordMesser.from(w)
                .mess(0.5, ['transpose'])
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .mess(1, ['repeat']).pass()
                .getWord()
                
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        })) 
    return [
        ...validWords0,
        ...validWords1,
        ...validWords2,
        ...validWords3,
        ...validWords4,
        ...validWords5,
        ...validWords6,
        ...validWords7,
        ...validWords8,
        ...validWords9,
        ...validWords10,
        ...validWords11,
        ...validWords12,
        ...validWords13,
        ...validWords14,
        ...validWords15,
        ...validWords16,
        ...validWords17,
        ...validWords18,
        ...validWords19,
        ...invalidWords0,
        ...invalidWords1,
        ...invalidWords3,
        ...invalidWords4,
        ...invalidWords5,
        ...invalidWords6,
        ...invalidWords7,
        ...invalidWords8,
        ...invalidWords9,
        ...invalidWords10,
        ...invalidWords11,
        ...invalidWords12,
        ...invalidWords13,
        ...invalidWords14,
        ...invalidWords15,
        ...invalidWords16,
        ...invalidWords17,
        ...invalidWords18,
        ...invalidWords19,
        ...invalidWords20,
        ...invalidWords21,
        ...invalidWords22,
        ...invalidWords23,
        ...invalidWords24,
        ...invalidWords25,
        ...invalidWords26,
        ...invalidWords27,
        ...invalidWords28,
        ...invalidWords29,
        ...invalidWords30
    ]
}
