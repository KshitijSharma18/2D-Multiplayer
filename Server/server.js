const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const Loop = require("accurate-game-loop");
const gridSize = 25;

const { clamp } = require("./helper");
const { isColliding } = require("./collision");

server.listen(4001, () => {
  console.log("http://localhost:4001");
});

const state = {
  players: [],
  fires: [],
};

io.on("connection", (socket) => {
  console.log("user connected " + socket.id);
  state.players.push({ id: socket.id });

  socket.on("player-size", (size) => {
    const found = state.players.find((player) => player.id == socket.id);
    found.size = size;
  });

  socket.on("player-pos", (newPos) => {
    const myPlayer = state.players.find((player) => player.id == socket.id);
    newPos.x = clamp(newPos.x, 1, gridSize + 1 - myPlayer.size);
    newPos.y = clamp(newPos.y, 1, gridSize + 1 - myPlayer.size);

    const otherPlayers = state.players.filter(
      (player) => player.id != socket.id
    );

    if (myPlayer.pos && myPlayer.size) {
      const clash = otherPlayers.some((player) =>
        isColliding(
          {
            pos: newPos,
            size: myPlayer.size,
          },
          player
        )
      );
      if (!clash) {
        myPlayer.pos = newPos;
      }
    } else {
      myPlayer.pos = newPos;
    }
  });

  socket.on("player-fire", (vel) => {
    if (state.fires.find((fire) => fire.id == socket.id)) return;

    const myFire = { pos: {} };
    const myPlayer = state.players.find((player) => player.id == socket.id);
    myFire.pos.x = myPlayer.pos.x + Math.floor((myPlayer.size - 1) / 2);
    myFire.pos.y = myPlayer.pos.y + Math.floor((myPlayer.size - 1) / 2);
    myFire.id = socket.id;
    myFire.vel = vel;
    myFire.size = 1;
    myFire.damagedPlayers = [];
    state.fires.push(myFire);
  });

  socket.on("disconnect", () => {
    console.log("user dc " + socket.id);
    state.players = state.players.filter((player) => player.id != socket.id);
  });
});
const timesPerSecond = 60;
const update = () => {
  updateFires();
  io.emit("game-state", state);
};

function updateFires() {
  state.fires = state.fires.filter(
    (fire) =>
      fire.pos.x < gridSize &&
      fire.pos.x > 1 &&
      fire.pos.y < gridSize &&
      fire.pos.y > 1
  );

  state.fires.forEach((fire) => {
    fire.pos.x += fire.vel.x;
    fire.pos.y += fire.vel.y;
  });

  state.players.forEach((player) => {
    const collidingFire = state.fires.find((fire) => isColliding(player, fire));
    if (
      collidingFire &&
      player.id != collidingFire.id &&
      !collidingFire.damagedPlayers.includes(player.id)
    ) {
      console.log(collidingFire);
      if (player.size > 2) {
        player.size -= 1;
        collidingFire.damagedPlayers.push(player.id);
      }
    }
  });
}

const loop = new Loop(update, timesPerSecond);
loop.start();

//16, 13
//11, 13
