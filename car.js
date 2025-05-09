class Car{
    constructor(x,y,width,height,controlType,maxSpeed=10){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;  

        this.speed=0;
        this.acc=0.2;
        this.maxspeed=maxSpeed;
        this.friction=0.03;
        this.angle=0;
        this.damage=false;

        this.useBrain=controlType=="AI";
        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork([this.sensor.rayCount,8,4]);
        }
        this.control=new Controls(controlType);

    }



    update(roadBorders,traffic){
        if(!this.damage)
        {
            this.#move();
            this.polygon=this.#createPolygon();
            this.damage=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets =this.sensor.readings.map(s=>s==null?0:
                1-s.offset);
            
            const output=NeuralNetwork.feedForward(offsets,this.brain);
            console.log(output);

            if(this.useBrain){
                this.control.forward=output[0];
                this.control.left=output[1];
                this.control.right=output[2];
                this.control.backward=output[3];

            }

        }
    } 

    #assessDamage(roadBorders,traffic)
    {
        for(let i=0;i<roadBorders.length;i++)
        {
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++)
        {
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;

    }

    #createPolygon()
    {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });

        return points;
    }


    #move(){
        if(this.control.forward){
            this.speed+=this.acc;
        }
        if(this.control.backward){
            this.speed-=this.acc;
        }

        if(this.speed>this.maxspeed){
            this.speed=this.maxspeed;
        }
        if(this.speed<-this.maxspeed){
            this.speed=-this.maxspeed;
        }
        if(this.speed>0){
            this.speed-=this.friction
        }
        if(this.speed<0){
            this.speed+=this.friction
        }
        if(this.speed!=0)
        {
            const flip=this.speed>0?1:-1;
            if(this.control.left){
            this.angle+=0.02*flip;
            }
            if(this.control.right){
            this.angle-=0.02*flip;
            }
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;

    }

    draw(ctx,color) {

        if(this.damage){
            ctx.fillStyle="grey";
        }
        else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        ctx.closePath();
        ctx.fill();
        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}