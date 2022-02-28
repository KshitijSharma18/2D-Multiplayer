function isColliding(a, b) {
  return (
    a.pos.x < b.pos.x + b.size &&
    a.pos.x + a.size > b.pos.x &&
    a.pos.y < b.pos.y + b.size &&
    a.size + a.pos.y > b.pos.y
  );
}

module.exports = {
  isColliding,
};
