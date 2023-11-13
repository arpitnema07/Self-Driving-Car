const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 250;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const cars = generateCar(1000);
let bestCar = cars[0];
if (localStorage.getItem("bestCar")) {
  bestCar.brain = JSON.parse(localStorage.getItem("bestCar"));
}
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(0), -300, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(2), -300, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(1), -100, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(1), -400, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(0), -800, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(0), -1000, 30, 50, "TRAFFIC", 1.5),

  new Car(road.getLaneCenter(2), -800, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(2), -1000, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(0), -1200, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(0), -1400, 30, 50, "TRAFFIC", 1.5),

  new Car(road.getLaneCenter(2), -700, 30, 50, "TRAFFIC", 1.5),
  new Car(road.getLaneCenter(1), -1300, 30, 50, "TRAFFIC", 1.5),
];
animate();

function save() {
  localStorage.setItem("bestCar", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestCar");
}

function generateCar(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }

  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);
  carCtx.restore();
  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
