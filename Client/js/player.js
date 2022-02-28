function createPlayer(x, y) {
  let id = null;
  const getId = () => id;
  const setId = (sid) => {
    id = sid;
  };

  let pos = {
    x,
    y,
  };
  const getPos = () => pos;
  const setPos = (x, y) => {
    pos.x = x;
    pos.y = y;
  };

  let size = 5;
  const getSize = () => size;
  const setSize = (s) => {
    size = s;
  };

  let color = "yellow";
  const getColor = () => color;
  const setColor = (c) => {
    color = c;
  };

  const ref = document.createElement("div");
  ref.dataset.player = "";
  const getRef = () => ref;

  const update = () => {
    ref.style.gridRow = `${pos.y} / span ${size}`;
    ref.style.gridColumn = `${pos.x} / span ${size}`;
    ref.style.backgroundColor = color;
  };

  update();

  return {
    getId,
    setId,
    getPos,
    setPos,
    getSize,
    setSize,
    getColor,
    setColor,
    getRef,
    update,
  };
}
