const socket = io("http://localhost:4001");

const gridSize = 25;
const myPlayer = createPlayer(random(1, gridSize - 5), random(1, gridSize - 5));
myPlayer.getRef().style.zIndex = 99;
let otherPlayers = [];
let fires = [];
const screenRef = document.querySelector(".gameplay-area");
screenRef.appendChild(myPlayer.getRef());

socket.on("connect", () => {
  console.log(socket.id);
  socket.emit("player-pos", myPlayer.getPos());
  socket.emit("player-size", myPlayer.getSize());
});

socket.on("game-state", (state) => {
  while (fires.length > 0) {
    const removedFire = fires.pop();
    removedFire.getRef().remove();
  }
  const firesInfo = state.fires;
  firesInfo.forEach((fire) => {
    if (fire.pos) {
      const tempFire = createFire(fire.pos.x, fire.pos.y);
      screenRef.appendChild(tempFire.getRef());
      fires.push(tempFire);
    }
  });

  const found = state.players.find((player) => player.id == socket.id);
  if (found.pos) {
    myPlayer.setPos(found.pos.x, found.pos.y);
    myPlayer.setSize(found.size);
  }

  while (otherPlayers.length > 0) {
    const removedPlayer = otherPlayers.pop();
    removedPlayer.getRef().remove();
  }

  const otherPlayerInfo = state.players.filter(
    (player) => player.id != socket.id
  );
  otherPlayerInfo.forEach((player) => {
    if (player.pos) {
      const tempPlayer = createPlayer(player.pos.x, player.pos.y);
      tempPlayer.setColor("blue");
      tempPlayer.setSize(player.size);
      tempPlayer.update();
      screenRef.appendChild(tempPlayer.getRef());
      otherPlayers.push(tempPlayer);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.code.includes("Key")) {
    move(event);
  } else if (event.code.includes("Arrow")) {
    fire(event);
  }
});

function move(event) {
  //console.log(event.code);
  let pos = myPlayer.getPos();
  switch (event.code) {
    case "KeyW":
      pos.y -= 1;
      break;
    case "KeyA":
      pos.x -= 1;
      break;
    case "KeyS":
      pos.y += 1;
      break;
    case "KeyD":
      pos.x += 1;
      break;
  }
  socket.emit("player-pos", pos);
}

function fire(event) {
  //console.log(event.code);
  let vel = {
    x: 0,
    y: 0,
  };
  switch (event.code) {
    case "ArrowUp":
      vel.y -= 1;
      break;
    case "ArrowLeft":
      vel.x -= 1;
      break;
    case "ArrowDown":
      vel.y += 1;
      break;
    case "ArrowRight":
      vel.x += 1;
      break;
  }
  socket.emit("player-fire", vel);
}

function random(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const myGameLoop = function (deltaTime) {
  // ...
  myPlayer.update();
  //console.log(fires);
};

const gameLoop = gameLoopJs.createGameLoop(myGameLoop, 60);

function animate(time) {
  gameLoop.loop(time);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
