function clamp(n, min, max) {
  if (n > max) {
    return max;
  } else if (n < min) {
    return min;
  } else {
    return n;
  }
}

module.exports = {
  clamp,
};
