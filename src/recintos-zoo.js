class RecintosZoo {
    constructor() {
        // Dados dos recintos
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: { 'MACACO': 3 } },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: {} },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: { 'GAZELA': 1 } },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: {} },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: { 'LEAO': 1 } }
        ];

        // Dados dos animais
        this.animais = {
            'LEAO': { tamanho: 3, bioma: 'savana' },
            'LEOPARDO': { tamanho: 2, bioma: 'savana' },
            'CROCODILO': { tamanho: 3, bioma: 'rio' },
            'MACACO': { tamanho: 1, bioma: 'savana ou floresta' },
            'GAZELA': { tamanho: 2, bioma: 'savana' },
            'HIPOPOTAMO': { tamanho: 4, bioma: 'savana ou rio' }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Verificar se o animal é válido
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }

        // Verificar se a quantidade é válida
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animalDados = this.animais[animal];
        const recintosViaveis = [];

        // Verificar cada recinto
        for (const recinto of this.recintos) {
            const biomaValido = (recinto.bioma.includes(animalDados.bioma) ||
                (animalDados.bioma === 'savana ou floresta' && recinto.bioma === 'floresta') ||
                (animalDados.bioma === 'savana ou rio' && (recinto.bioma === 'savana' || recinto.bioma === 'rio')));

            if (biomaValido) {
                const espaçoOcupadoAtual = this.calculaEspacoOcupado(recinto);
                const espaçoNecessario = quantidade * animalDados.tamanho + (this.quantidadeEspécies(recinto) > 1 ? 1 : 0);
                const espaçoLivre = recinto.tamanhoTotal - espaçoOcupadoAtual - espaçoNecessario;

                // Verificar regras específicas para cada animal
                if (animal === 'MACACO') {
                    if (quantidade === 1 || this.quantidadeEspécies(recinto) === 0) {
                        continue;
                    }
                }

                if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
                    continue;
                }

                if (animal === 'LEAO' || animal === 'LEOPARDO') {
                    if (this.contaEspécies(recinto, animal) > 0) {
                        continue;
                    }
                }

                if (espaçoLivre >= 0) {
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espaçoLivre} total: ${recinto.tamanhoTotal})`);
                }
            }
        }

        // Verificar se há recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }

    calculaEspacoOcupado(recinto) {
        let espaçoOcupado = 0;
        for (const [animal, quantidade] of Object.entries(recinto.animais)) {
            espaçoOcupado += this.animais[animal].tamanho * quantidade;
        }
        return espaçoOcupado;
    }

    quantidadeEspécies(recinto) {
        return Object.keys(recinto.animais).length;
    }

    contaEspécies(recinto, especie) {
        return recinto.animais[especie] || 0;
    }
}

export { RecintosZoo };
