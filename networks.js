class NeuralNetwork {
    constructor(neuronCounts) {
        this.level= [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.level.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    static feedForward(givenInputs, network) {
        let output = Level.feedForward(givenInputs, network.level[0]);
        for (let i = 1; i < network.level.length; i++) {
            output = Level.feedForward(output, network.level[i]);
        }
        return output;
    }
    static mutate(network,amount=0.2){
        network.level.forEach(level =>{
            for (let i=0;i<level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],Math.random()*2-1,amount    
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,amount
                    )
                }
            }
        });

    }

}




class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.output = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        this.randomize();
    }

    randomize() {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                this.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < this.biases.length; i++) {
            this.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.output.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if(sum>level.biases[i]){
                level.output[i]=1;
            }
            else{
                level.output[i]=0;
            }
        }

        return level.output;
    }
}
