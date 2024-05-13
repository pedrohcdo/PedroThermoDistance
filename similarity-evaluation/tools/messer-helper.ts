function repeatChar(char: string, len: number) {
    let newText = char
    while (newText.length < len) {
        newText += char
    }
    return newText
}

export function generateMessyWord(
    word: string,
    changes: number,
    operations: ('repeat' | 'messy' | 'swap' | 'messy-insert' | 'messy-delete')[] = ['repeat', 'messy', 'swap']
) {
    const chars = word.split('').map((char) => ({
        char,
        changed: false
    }))
    while (changes > 0) {
        //
        const unchangeds = chars.filter((c) => !c.changed)
        if (unchangeds.length === 0) break

        const validOperations: ('repeat' | 'messy' | 'swap')[] = []
        if (operations.includes('repeat')) validOperations.push('repeat')
        if (operations.includes('messy')) validOperations.push('messy')
        if (operations.includes('swap') && unchangeds.length >= 2) validOperations.push('swap')
        const op = validOperations[Math.round(Math.random() * (validOperations.length - 1))]
        if (!op) break
        //

        if (op === 'swap') {
            while (true) {
                const i1 = Math.round(Math.random() * (unchangeds.length - 1))
                const i2 = Math.round(Math.random() * (unchangeds.length - 1))
                if (i1 === i2) continue
                const temp = unchangeds[i1].char
                unchangeds[i1].char = unchangeds[i2].char
                unchangeds[i2].char = temp
                unchangeds[i1].changed = true
                unchangeds[i2].changed = true
                changes -= 2
                break
            }
        } else if (op === 'repeat') {
            const i = Math.round(Math.random() * (unchangeds.length - 1))
            const nextChangeLen = Math.max(1, Math.round(Math.random() * changes))
            unchangeds[i].char = repeatChar(unchangeds[i].char, nextChangeLen + 1)
            unchangeds[i].changed = true
            changes -= nextChangeLen
        } else if (op === 'messy') {
            const i = Math.round(Math.random() * (unchangeds.length - 1))
            if (Math.random() >= 0.6) {
                const nextChangeLen = Math.max(1, Math.round(Math.random() * changes))
                unchangeds[i].char = repeatChar('#', nextChangeLen + 1)
                unchangeds[i].changed = true
                changes -= nextChangeLen
            } else if (Math.random() >= 0.3) {
                unchangeds[i].char = "#"
                unchangeds[i].changed = true
                changes -= 1
            } else {
                unchangeds[i].char = ""
                unchangeds[i].changed = true
                changes -= 1
            }
        } else if (op === 'messy-insert') {
            const i = Math.round(Math.random() * (unchangeds.length - 1))
            const nextChangeLen = Math.max(1, Math.round(Math.random() * changes))
            unchangeds[i].char = unchangeds[i].char + repeatChar('#', nextChangeLen)
            unchangeds[i].changed = true
            changes -= nextChangeLen
        } else if (op === 'messy-delete') {
            const i = Math.round(Math.random() * (unchangeds.length - 1))
            unchangeds[i].char = ''
            unchangeds[i].changed = true
            changes -= 1
        }
    }

    return chars.map((v) => v.char).join('')
}

export function confuseWord(word: string) {
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
    return result
}