!(function (e, o) {
  "object" == typeof exports && "undefined" != typeof module
    ? o(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], o)
    : o(
        ((e =
          "undefined" != typeof globalThis
            ? globalThis
            : e || self).gameLoopJs = {})
      );
})(this, function (e) {
  "use strict";
  (e.createGameLoop = function (e, o = 60) {
    let t = 0,
      n = 0,
      f = 0,
      i = 0,
      s = 0,
      p = 0;
    function u(e) {
      (t = e), (n = 1e3 / t);
    }
    return (
      u(o),
      {
        get fps() {
          return t;
        },
        set fps(e) {
          u(e);
        },
        loop(o) {
          (p = o - f),
            p >= n &&
              ((s = i), (i = p % n), (f = o - i), (p -= s), (p *= 0.001), e(p));
        },
      }
    );
  }),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
