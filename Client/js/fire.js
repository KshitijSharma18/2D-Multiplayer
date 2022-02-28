function createFire(x, y) {
  let pos = {
    x,
    y,
  };
  const getPos = () => pos;
  const setPos = (x, y) => {
    pos.x = x;
    pos.y = y;
  };

  let size = 1;
  const getSize = () => size;
  const setSize = (s) => {
    size = s;
  };

  let color = "white";
  const getColor = () => color;
  const setColor = (c) => {
    color = c;
  };

  const ref = document.createElement("div");
  ref.dataset.fire = "";
  const getRef = () => ref;

  const update = () => {
    ref.style.gridRow = `${pos.y} / span ${size}`;
    ref.style.gridColumn = `${pos.x} / span ${size}`;
    ref.style.backgroundColor = color;
  };

  update();

  return {
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
