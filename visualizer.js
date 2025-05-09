class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHieght=height/network.level.length;

        for(let i=network.level.length-1;i>=0;i--){
            const levelTop=top+lerp(height-levelHieght,0,network.level.length==1?0.5:i/(network.level.length-1));
            ctx.setLineDash([6,3]);

            Visualizer.drawLevel(ctx,network.level[i],left,levelTop,
                width,levelHieght,
                i==network.level.length-1?["↑", "←", "→", "↓"]:[]
            );
            

        }    
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels = []) {
        const right = left + width;
        const bottom = top + height;

        const {inputs,output,weights,biases}=level;

            for(let i=0;i<inputs.length;i++){
                for(let j=0;j<output.length;j++){
                    ctx.beginPath();
                    ctx.moveTo(
                        Visualizer.#getNodex(inputs,i,left,right),bottom);
                    ctx.lineTo(
                        Visualizer.#getNodex(output,j,left,right),top);
                    ctx.lineWidth=2;
                    ctx.strokeStyle=getRGBA(weights[i][j]);
                    ctx.stroke();
                }
            }

        const nodeRadius = 20;
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodex(inputs,i,left,right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius*0.5, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }
        for (let i = 0; i < output.length; i++) {
            const x = Visualizer.#getNodex(output,i,left,right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius*0.5, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(output[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth=1.5;
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.strokeStyle=getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white";
                ctx.font = (nodeRadius * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top);
            }

        }

    }

    static #getNodex(nodes,index,left,right){
        return lerp(
            left,
            right,
            nodes.length==1
                ?0.5:index/(nodes.length-1)
        );
    }
}
