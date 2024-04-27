# PHC Similarity Algorithm

## Introdução
O algoritmo PHC Similarity (Pedro Henrique Chaves Similarity) foi desenvolvido para calcular a similaridade entre duas strings com base em uma função de penalidade definida e um número máximo de tentativas de correspondência. O algoritmo pode operar em diferentes modos, ajustando-se a vários cenários de comparação de texto.

## Descrição
O PHC Similarity utiliza uma abordagem de programação dinâmica para determinar a similaridade entre duas strings de maneira eficiente. A complexidade de tempo do algoritmo é O(firstText * secondText * maxAttempts), tornando-o adequado para análises em tempo real onde a eficiência é crucial.

### Modos de Operação
- **Delete**: Este modo conta apenas as deleções como erros.
- **Edit**: Permite deleções e substituições.
- **Full**: Inclui deleções, inserções e substituições.

### Função de Penalidade
A função de penalidade é aplicada a cada tentativa além da primeira correspondência e é crucial para ajustar a sensibilidade do algoritmo a erros.

### Descrição dos Argumentos
A função `calculatePHCSimilarity` aceita cinco argumentos, cada um desempenhando um papel crucial no cálculo da similaridade entre duas strings. Aqui está uma descrição detalhada de cada argumento:

- **`firstText: string`**: O primeiro texto a ser comparado. Representa a string base na comparação. Pode ser qualquer sequência de caracteres, como um nome, frase ou qualquer outro tipo de dado textual.

- **`secondText: string`**: O segundo texto a ser comparado contra o primeiro. Assim como `firstText`, deve ser uma sequência de caracteres e é tratado como o texto-alvo na operação de comparação.

- **`maxAttempts: number`**: O número máximo de tentativas de correspondência permitidas. Este parâmetro define o limite para quantas vezes o algoritmo tentará fazer uma correspondência após o primeiro desacordo encontrado. É crucial para controlar o comportamento da função de penalidade e o impacto dos erros na pontuação final de similaridade.

- **`penaltyFunction: (attempt: number) => number`**: Uma função de callback que define a penalidade para cada tentativa além da primeira correspondência. Esta função recebe o número da tentativa atual como argumento e retorna um valor numérico que será usado como penalidade. A forma da função de penalidade pode variar dependendo do caso de uso, e ela influencia significativamente o cálculo da similaridade ao penalizar as correspondências imperfeitas.

- **`mode: 'delete' | 'edit' | 'full'`**: Define o modo de operação da função. O modo 'delete' permite apenas deleções, o modo 'edit' inclui deleções e substituições, e o modo 'full' abrange deleções, inserções e substituições, oferecendo a abordagem mais flexível e abrangente na comparação de strings.

## Exemplos de Uso

### Comparação Básica
Aqui está como você usaria o algoritmo no modo 'delete' para comparar duas strings:

```typescript
const similarityScore = calculatePHCSimilarity("hello", "h3llo", 3, attempt => attempt * 2, 'delete');
console.log(similarityScore); // Saída esperada pode variar
```

### Modo Full com Detalhes de Cálculo
Este exemplo detalhado demonstra como o algoritmo calcula a similaridade no modo 'full', considerando múltiplas deleções e uma substituição, com uma função de penalidade que aumenta com o número de tentativas:

```typescript
// Comparação entre "hello" e "h3lloooooo" com até 3 tentativas e penalidade dobrada por tentativa:
const fullModeScore = calculatePHCSimilarity("hello", "h3lloooooo", 3, attempt => attempt * 2, 'full');

// Detalhes do cálculo:
// - 'h' matches directly.
// - 'e' is substituted by '3', counting as one edit error.
// - Both 'l's match directly.
// - 'o' matches directly.
// - Each additional 'o' counts as a deletion error, with the penalty increasing until the max retry limit is reached and then stays constant.
// Penalty calculation: 2 (1st 'o' error) + 4 (2nd 'o' error) + 6 + 6 + 6 (subsequent 'o' errors with max penalty)
// Total penalty: 26
// Similarity score is calculated as the number of matches (4) divided by the sum of matches and penalties (4 + 26):
console.log(fullModeScore); // Exemplo de saída: 0.13
```

## Licença

Este projeto é licenciado sob a Licença MIT. A licença MIT é uma licença permissiva que é curta e simples. Ela permite que o software seja livremente usado, modificado, redistribuído e vendido, tanto em versões originais quanto modificadas. A licença também protege o autor ao limitar a responsabilidade.

A licença completa pode ser encontrada no arquivo `LICENSE` incluído no diretório raiz deste repositório.

### Texto da Licença MIT (Exemplo)

```plaintext
MIT License

Copyright (c) [ano] [nome completo do detentor dos direitos autorais]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
