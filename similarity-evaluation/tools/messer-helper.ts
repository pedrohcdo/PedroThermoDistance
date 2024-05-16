function repeatChar(char: string, len: number) {
    let newText = char
    while (newText.length < len) {
        newText += char
    }
    return newText
}

export function repeatAlphabet(len: number) {
    let alphabet = ""
    let result = ""
    for(let i='a'.charCodeAt(0); i<='z'.charCodeAt(0); i++) {
        alphabet += String.fromCharCode(i)
    }
    for(let i=0; i<len; i++) {
        result += alphabet
    }
    return result
}

export type MessyWordOperation = 'repeat' | 'messy' | 'swap' | 'transpose' | 'messy-insert' | 
                                    'messy-delete' | 'free-messy-insert' | 'free-messy-delete'

type CharGuide = {char: string, index: number, changed: boolean}

export class WordMesser {

    constructor(private charGuides: CharGuide[]) {}

    static parseToGuides(word: string): CharGuide[] {
        return word.split('').map((char, index) => ({
            char,
            index,
            changed: false
        }))
    }
    
    static from(text: string) {
        return new WordMesser(WordMesser.parseToGuides(text))
    }

    // Guarantees a list of non-modifiable items that are always neighbors (2 or more), the rest, even if available,
    // do not enter this list
    private getNeighborsGuides(): CharGuide[][] {
        const unchangedGuides = this.charGuides.filter((c) => !c.changed)
        if(unchangedGuides.length <= 1) return []
        const groups: CharGuide[][]  = []
        let group: CharGuide[] = [
            unchangedGuides[0]
        ]
        for (let i = 1; i < unchangedGuides.length; i++) {
            if (unchangedGuides[i].index === unchangedGuides[i-1].index + 1) {
                group.push(unchangedGuides[i])
            } else {
                if(group.length > 1)
                    groups.push(group)
                group = [unchangedGuides[i]]
            }
        }
        if(group.length > 1)
            groups.push(group)
        return groups
    }
    
    mess(
        density: number,
        operations: MessyWordOperation[] = ['repeat', 'messy', 'swap']
    ) {
        let changes = Math.max(1, Math.round(this.charGuides.length * density))
        
        while (changes > 0) {
            // used to transpose operation
            const neighborGuides = this.getNeighborsGuides()
            const unchangedGuides = this.charGuides.filter((c) => !c.changed)

            //
            const validOperations: MessyWordOperation[] = []
            if (operations.includes('repeat') && unchangedGuides.length > 0) validOperations.push('repeat')
            if (operations.includes('messy') && unchangedGuides.length > 0) validOperations.push('messy')
            if (operations.includes('swap') && unchangedGuides.length > 1) validOperations.push('swap')
            if (operations.includes('transpose') && neighborGuides.length > 0) validOperations.push('transpose')
            if (operations.includes('messy-insert') && unchangedGuides.length > 0) validOperations.push('messy-insert')
            if (operations.includes('messy-delete') && unchangedGuides.length > 0) validOperations.push('messy-delete')
            if (operations.includes('free-messy-insert')) validOperations.push('free-messy-insert')
            if (operations.includes('free-messy-delete')) validOperations.push('free-messy-delete')

            const op = validOperations[Math.round(Math.random() * (validOperations.length - 1))]
            if (!op) break
            //
    
            if (op === 'swap') {
                while (true) {
                    const i1 = Math.round(Math.random() * (unchangedGuides.length - 1))
                    const i2 = Math.round(Math.random() * (unchangedGuides.length - 1))
                    if (i1 === i2) continue
                    const temp = unchangedGuides[i1].char
                    unchangedGuides[i1].char = unchangedGuides[i2].char
                    unchangedGuides[i2].char = temp
                    unchangedGuides[i1].changed = true
                    unchangedGuides[i2].changed = true
                    changes -= 2
                    break
                }
            } else if (op === 'transpose') {
                const nGuide = neighborGuides[Math.round(Math.random() * (neighborGuides.length - 1))]
                const evenGuides = nGuide.filter((c, index) => c.index % 2 === 0 && index < nGuide.length - 1)
                const oddGuides = nGuide.filter((c, index) => c.index % 2 === 1 && index < nGuide.length - 1)
                
                // give preference to even positions
                const selectFrom = evenGuides.length > 0 ? evenGuides : oddGuides
                const i = Math.round(Math.random() * (selectFrom.length - 1))

                const drawnIndex = selectFrom[i].index

                // Join the letters together to be able to apply operations such as later insertion and deletion without 
                // cancel the transpositions
                this.charGuides[drawnIndex].char = this.charGuides[drawnIndex+1].char + this.charGuides[drawnIndex].char
                this.charGuides[drawnIndex+1].char = ""

                //
                this.charGuides[drawnIndex].changed = true
                this.charGuides[drawnIndex+1].changed = true

                changes -= 2
            } else if (op === 'repeat') {
                const i = Math.round(Math.random() * (unchangedGuides.length - 1))
                const nextChangeLen = Math.min(Math.max(1, Math.round(Math.random() * changes)), Math.ceil(changes * 0.3))
                unchangedGuides[i].char = repeatChar(unchangedGuides[i].char, nextChangeLen + 1)
                unchangedGuides[i].changed = true
                changes -= nextChangeLen
            } else if (op === 'messy') {
                const i = Math.round(Math.random() * (unchangedGuides.length - 1))
                if (Math.random() >= 0.6) {
                    const nextChangeLen = Math.max(1, Math.round(Math.random() * changes))
                    unchangedGuides[i].char = repeatChar('#', nextChangeLen + 1)
                    unchangedGuides[i].changed = true
                    changes -= nextChangeLen
                } else if (Math.random() >= 0.3) {
                    unchangedGuides[i].char = "#"
                    unchangedGuides[i].changed = true
                    changes -= 1
                } else {
                    unchangedGuides[i].char = ""
                    unchangedGuides[i].changed = true
                    changes -= 1
                }
            } else if (op === 'messy-insert') {
                const i = Math.round(Math.random() * (unchangedGuides.length - 1))
                const nextChangeLen = Math.min(Math.max(1, Math.round(Math.random() * changes)), Math.ceil(changes * 0.3))
                unchangedGuides[i].char = unchangedGuides[i].char + repeatChar('#', nextChangeLen)
                unchangedGuides[i].changed = true
                changes -= nextChangeLen
            } else if (op === 'free-messy-insert') {
                const i = Math.round(Math.random() * (this.charGuides.length - 1))
                const nextChangeLen = Math.max(1, Math.round(Math.random() * changes))
                this.charGuides[i].char = this.charGuides[i].char + repeatChar('#', nextChangeLen)
                this.charGuides[i].changed = true
                changes -= nextChangeLen
            } else if (op === 'messy-delete') {
                const i = Math.round(Math.random() * (unchangedGuides.length - 1))
                unchangedGuides[i].char = ''
                unchangedGuides[i].changed = true
                changes -= 1
            } else if (op === 'free-messy-delete') {
                const i = Math.round(Math.random() * (this.charGuides.length - 1))
                this.charGuides[i].char = ''
                this.charGuides[i].changed = true
                changes -= 1
            }
        }

        return this
    }

    maskPass(replaceBy: string = "*") {
        return WordMesser.from(repeatChar(replaceBy, this.getWord().length))
    }

    confusePass() {
        const word = this.getWord()
        let result = ""
        let swap = false
        for (let i = 0; i < word.length >> 1; i++) {
            if (!swap) {
                result += word[i]
                result += word[word.length - i - 1]
            } else {
                result += word[word.length - i - 1]
                result += word[i]
            }
            swap = !swap
        }
        return WordMesser.from(result)
    }

    pass() {
        return WordMesser.from(this.getWord())
    }

    getWord() {
        return this.charGuides.map((c) => c.char).join('')
    }

    get length() {
        return this.charGuides.length
    }
}


