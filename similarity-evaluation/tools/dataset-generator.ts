import { confuseWord, generateMessyWord } from "./messer-helper"

export type WordPredicatePair = { label: string, pred: string, equals: boolean }

export function generateMessyWords(words: string[]) {
    const validWords1: WordPredicatePair[] = words
        .map((w) => generateMessyWord(w, Math.round(w.length * 0.1)))
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords2: WordPredicatePair[] = words
        .map((w) => {
            const p1 = generateMessyWord(w, Math.round(w.length * 0.6), ["repeat"])
            return generateMessyWord(p1, Math.round(p1.length * 0.3), ["messy"])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords3: WordPredicatePair[] = words
        .map((w) => generateMessyWord(w, Math.round(w.length * 0.2)))
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords4: WordPredicatePair[] = words
        .map((w) => {
            const p1 = generateMessyWord(w, Math.round(w.length * 0.5), ['repeat'])
            return generateMessyWord(p1, Math.round(w.length * 0.2), ['messy', "swap"])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const validWords5: WordPredicatePair[] = words
        .map((w) => {
            const p1 = generateMessyWord(w, Math.round(w.length * 0.8), ['repeat'])
            return generateMessyWord(p1, Math.round(w.length * 0.3), ['messy', "swap"])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: true
        }))

    const invalidWords1: WordPredicatePair[] = words
        .map((w) => {
            const p1 = generateMessyWord(w, Math.floor(0.3 * w.length), ['messy'])
            const p2 = generateMessyWord(p1, p1.length, ['swap'])
            return generateMessyWord(p2, Math.round(w.length * 0.2), ['messy-insert'])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords2: WordPredicatePair[] = words
        .map((w) => {
            const p1 = generateMessyWord(w, w.length, ['swap'])
            const p2 = generateMessyWord(p1, Math.floor(0.6 * p1.length), ['messy-insert'])
            return generateMessyWord(p2, w.length, ['repeat'])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords3: WordPredicatePair[] = words
        .map((w) => {
            const p0 = w.split('').reverse().join('')
            const p1 = generateMessyWord(p0, p0.length, ['swap'])
            const p2 = generateMessyWord(p1, Math.floor(0.4 * p1.length), ['repeat'])
            const p3 = generateMessyWord(p2, Math.floor(0.5 * p2.length), ['messy-insert'])
            const p4 = generateMessyWord(p3, p2.length, ['repeat'])
            return generateMessyWord(p4, Math.floor(0.5 * p4.length), ['messy-insert'])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords4: WordPredicatePair[] = words
        .map((w) => {
            const p1 = generateMessyWord(w, Math.floor(w.length * 0.5), ['messy-delete'])
            return generateMessyWord(p1, Math.floor(0.5 * p1.length), ['swap'])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords5: WordPredicatePair[] = words
        .map((w) => {
            const p1 = generateMessyWord(w, Math.floor(w.length * 0.6), ['messy-delete'])
            const p2 = generateMessyWord(p1, Math.floor(0.5 * p1.length), ['swap'])
            return generateMessyWord(p2, Math.floor(0.5 * p2.length), ['repeat'])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords6: WordPredicatePair[] = words
        .map((w) => {
            const p1 = confuseWord(w)
            return generateMessyWord(p1, w.length * 2, ['messy', "swap"])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords7: WordPredicatePair[] = words
        .map((w) => confuseWord(w))
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords8: WordPredicatePair[] = words
        .map((w) => {
            const p1 = confuseWord(w)
            return generateMessyWord(p1, Math.floor(0.3 * w.length), ['repeat'])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    const invalidWords9: WordPredicatePair[] = words
        .map((w) => {
            const p1 = confuseWord(w)
            return generateMessyWord(p1, w.length * 2, ['messy-insert'])
        })
        .map((pred, i) => ({
            label: words[i],
            pred: pred,
            equals: false
        }))

    return [
        ...validWords1,
        ...validWords2,
        ...validWords3,
        ...validWords4,
        ...validWords5,
        ...invalidWords1,
        ...invalidWords2,
        ...invalidWords3,
        ...invalidWords4,
        ...invalidWords5,
        ...invalidWords6,
        ...invalidWords7,
        ...invalidWords8,
        ...invalidWords9
    ]
}
