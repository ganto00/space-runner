export class Misure {
  constructor(renderer) {
    this.renderer = renderer
    this.frames = 0;
    this.elapsed = 0;
    this.frameMs = 0;
    this.buildOverlay();
  }

  buildOverlay() {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; top: 10px; left: 10px; z-index: 100;
      font-family: monospace; font-size: 13px; line-height: 1.5;
      color: #7CFC00; background: rgba(0,0,0,0.6);
      padding: 8px 12px; border-radius: 6px; white-space: pre;
      pointer-events: none;`;
    document.body.appendChild(el);
    this.el = el;
  }
  beginFrame() {
    this.t0 = performance.now();
  }

  // da chiamare a ogni frame, dopo renderer.render()
  endFrame(dt) {
    // tempo speso in questo frame, in ms
    this.frameMs += performance.now() - this.t0;
    this.frames++;
    this.elapsed += dt;

    // aggiorna il display ogni 0.5
    if (this.elapsed >= 0.5) {
      const fps = this.frames / this.elapsed;
      const ms = this.frameMs / this.frames;
      const info = this.renderer.info.render;

      this.el.textContent =
        `FPS:        ${fps.toFixed(0)}\n` +
        `Frame:      ${ms.toFixed(2)} ms\n` +
        `Draw calls: ${info.calls}\n` +
        `Triangoli:  ${info.triangles.toLocaleString()}`;
      this.frames = 0;
      this.elapsed = 0;
      this.frameMs = 0;
    }
  }
}