// Painterly (not flat-cartoon) portrait of Mr. Lau, built from layered
// gradients + soft shading rather than solid vector fills.
export function drawPortrait(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  // moody backdrop
  const bg = ctx.createRadialGradient(w * 0.4, h * 0.35, 10, w * 0.5, h * 0.5, w * 0.75);
  bg.addColorStop(0, '#242c1e');
  bg.addColorStop(0.6, '#141a10');
  bg.addColorStop(1, '#050705');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5, neckY = h * 0.62;

  // torch key-light direction: warm light from lower-left, cool fill from upper-right
  ctx.save();
  ctx.translate(cx, neckY);

  // shoulders / shirt (navy, with soft fabric shading)
  const shirtGrad = ctx.createLinearGradient(-70, 0, 70, 90);
  shirtGrad.addColorStop(0, '#3a5080');
  shirtGrad.addColorStop(0.45, '#22304f');
  shirtGrad.addColorStop(1, '#131c30');
  ctx.fillStyle = shirtGrad;
  ctx.beginPath();
  ctx.moveTo(-62, 90);
  ctx.quadraticCurveTo(-58, 18, -26, 4);
  ctx.quadraticCurveTo(0, -6, 26, 4);
  ctx.quadraticCurveTo(58, 18, 62, 90);
  ctx.closePath();
  ctx.fill();
  // fabric wrinkle highlights
  ctx.strokeStyle = 'rgba(140,165,210,0.15)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-40 + i * 22, 20 + i * 4);
    ctx.quadraticCurveTo(-30 + i * 22, 45, -46 + i * 22, 80);
    ctx.stroke();
  }

  // tan tie with sheen
  const tieGrad = ctx.createLinearGradient(-10, -4, 10, 70);
  tieGrad.addColorStop(0, '#e8c377');
  tieGrad.addColorStop(0.5, '#c99a49');
  tieGrad.addColorStop(1, '#a97f36');
  ctx.fillStyle = tieGrad;
  ctx.beginPath();
  ctx.moveTo(-9, -3);
  ctx.lineTo(9, -3);
  ctx.lineTo(6, 24);
  ctx.lineTo(0, 34);
  ctx.lineTo(-6, 24);
  ctx.closePath();
  ctx.fill();

  // green lanyard
  ctx.strokeStyle = '#3f6b3a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-24, -10);
  ctx.quadraticCurveTo(-14, 30, -6, 46);
  ctx.moveTo(24, -10);
  ctx.quadraticCurveTo(14, 30, 6, 46);
  ctx.stroke();
  // id badge
  const badgeGrad = ctx.createLinearGradient(-10, 44, 10, 70);
  badgeGrad.addColorStop(0, '#f3ecd6');
  badgeGrad.addColorStop(1, '#c9c2a6');
  ctx.fillStyle = badgeGrad;
  ctx.fillRect(-11, 44, 22, 28);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-11, 44, 22, 28);
  ctx.fillStyle = 'rgba(70,80,60,0.5)';
  ctx.fillRect(-7, 50, 14, 4);
  ctx.fillRect(-7, 57, 10, 3);

  // neck
  ctx.fillStyle = '#b98a63';
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(12, 0);
  ctx.lineTo(10, -18);
  ctx.lineTo(-10, -18);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // ---------- head ----------
  const headY = h * 0.34;
  ctx.save();
  ctx.translate(cx, headY);

  // base face shape with soft two-tone shading (warm torch light left, cool shadow right)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, 46, 56, 0, 0, Math.PI * 2);
  ctx.clip();

  const faceGrad = ctx.createLinearGradient(-46, -20, 46, 20);
  faceGrad.addColorStop(0, '#e2b184');
  faceGrad.addColorStop(0.45, '#c89468');
  faceGrad.addColorStop(1, '#8f6448');
  ctx.fillStyle = faceGrad;
  ctx.fillRect(-60, -70, 120, 140);

  // cheekbone highlight
  const hi = ctx.createRadialGradient(-18, 8, 2, -18, 8, 30);
  hi.addColorStop(0, 'rgba(255,224,180,0.35)');
  hi.addColorStop(1, 'rgba(255,224,180,0)');
  ctx.fillStyle = hi;
  ctx.beginPath();
  ctx.arc(-18, 8, 30, 0, Math.PI * 2);
  ctx.fill();

  // shadow side
  const sh = ctx.createRadialGradient(30, 6, 4, 30, 6, 40);
  sh.addColorStop(0, 'rgba(30,20,15,0.35)');
  sh.addColorStop(1, 'rgba(30,20,15,0)');
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.arc(30, 6, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // end clip

  // ears
  ctx.fillStyle = '#c08e64';
  ctx.beginPath();
  ctx.ellipse(-45, 4, 6, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(45, 4, 6, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // hair (short, dark, slightly textured)
  ctx.fillStyle = '#100d09';
  ctx.beginPath();
  ctx.moveTo(-46, -6);
  ctx.quadraticCurveTo(-50, -48, 0, -54);
  ctx.quadraticCurveTo(50, -48, 46, -6);
  ctx.quadraticCurveTo(30, -30, 0, -32);
  ctx.quadraticCurveTo(-30, -30, -46, -6);
  ctx.closePath();
  ctx.fill();
  // hair strand texture
  ctx.strokeStyle = 'rgba(50,45,35,0.5)';
  ctx.lineWidth = 1;
  for (let i = -40; i < 40; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, -48 + Math.abs(i) * 0.15);
    ctx.lineTo(i * 0.8, -30);
    ctx.stroke();
  }

  // eyebrows
  ctx.strokeStyle = '#1a140f';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-30, -12);
  ctx.quadraticCurveTo(-18, -16, -8, -12);
  ctx.moveTo(8, -12);
  ctx.quadraticCurveTo(18, -16, 30, -12);
  ctx.stroke();

  // glasses (dark rim, subtle lens reflection)
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(-32, -8, 24, 18, 4);
  ctx.roundRect(8, -8, 24, 18, 4);
  ctx.moveTo(-8, 0);
  ctx.lineTo(8, 0);
  ctx.moveTo(-32, -2);
  ctx.lineTo(-42, -6);
  ctx.moveTo(32, -2);
  ctx.lineTo(42, -6);
  ctx.stroke();
  const lensGrad = ctx.createLinearGradient(-32, -8, -8, 10);
  lensGrad.addColorStop(0, 'rgba(200,220,255,0.18)');
  lensGrad.addColorStop(1, 'rgba(200,220,255,0)');
  ctx.fillStyle = lensGrad;
  ctx.beginPath();
  ctx.roundRect(-32, -8, 24, 18, 4);
  ctx.roundRect(8, -8, 24, 18, 4);
  ctx.fill();

  // eyes
  ctx.fillStyle = '#241a12';
  ctx.beginPath();
  ctx.ellipse(-20, 1, 3, 2.2, 0, 0, Math.PI * 2);
  ctx.ellipse(20, 1, 3, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // nose (soft shading, no hard outline)
  ctx.strokeStyle = 'rgba(70,45,30,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-2, -4);
  ctx.quadraticCurveTo(6, 14, 2, 22);
  ctx.stroke();

  // mouth, calm expression
  ctx.strokeStyle = '#5c3624';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-12, 32);
  ctx.quadraticCurveTo(0, 36, 12, 32);
  ctx.stroke();

  ctx.restore();

  // torch under-glow vignette to sell "lit from a handheld torch"
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.85, 4, w * 0.5, h * 0.85, w * 0.7);
  glow.addColorStop(0, 'rgba(255,210,140,0.10)');
  glow.addColorStop(1, 'rgba(255,210,140,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}
