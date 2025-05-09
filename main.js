const carCanvas = document.getElementById("carCanvas");
carCanvas.width=400;

const NetworkCanvas = document.getElementById("NetworkCanvas");
NetworkCanvas.width=400;

const carCtx = carCanvas.getContext("2d");
const networkCtx = NetworkCanvas.getContext("2d");


const road= new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=1;
const cars= generateCar(N);
let bestCar=cars[0];

if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.06);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(0),-100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-400,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-500,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-600,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-800,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-700,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-900,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-300,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-1100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-1200,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-1400,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-1500,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-1600,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-1800,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-1700,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-2300,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-2100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-2200,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-2400,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-2500,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-2600,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-2800,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-2700,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-3300,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-3100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-3200,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-4300,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-5300,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-3600,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-3800,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-3700,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-4100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-4100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-4100,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-4400,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-4500,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(2),-4600,60,60,"DUMMY",1.5),
    new Car(road.getLaneCenter(0),-4800,60,60,"DUMMY",1.5),



];

animate();

function save(){

    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));

}

function discard(){

    localStorage.removeItem("bestBrain");

}

function generateCar(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time)
{
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar=cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));
    carCanvas.height=window.innerHeight;
    NetworkCanvas.height=window.innerHeight;


    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++)
    {
        traffic[i].draw(carCtx,"black");
    }

    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"green");   
    }
    carCtx.globalAlpha=1;

    carCtx.restore();

    networkCtx.lineDashOffset=-time/60;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}