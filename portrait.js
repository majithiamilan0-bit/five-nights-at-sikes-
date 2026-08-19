// Painterly (not flat-cartoon) portrait of Mr. Lau, built from layered
// gradients + soft shading rather than solid vector fills.
export function drawLauPortrait(ctx, w, h) {
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

  // torch under-glow vignette to sell "lit from below in the dark"
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.85, 4, w * 0.5, h * 0.85, w * 0.7);
  glow.addColorStop(0, 'rgba(255,210,140,0.10)');
  glow.addColorStop(1, 'rgba(255,210,140,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

// Painterly portrait of the player: a school student caught after hours,
// lit from below by their own flashlight (cool white, not Mr. Lau's warm torch).
export function drawStudentPortrait(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(w * 0.4, h * 0.35, 10, w * 0.5, h * 0.5, w * 0.75);
  bg.addColorStop(0, '#1c2530');
  bg.addColorStop(0.6, '#11161c');
  bg.addColorStop(1, '#05070a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5, neckY = h * 0.64;

  ctx.save();
  ctx.translate(cx, neckY);

  // blazer (maroon, school uniform) with soft fabric shading
  const blazerGrad = ctx.createLinearGradient(-70, 0, 70, 88);
  blazerGrad.addColorStop(0, '#7a2b34');
  blazerGrad.addColorStop(0.45, '#511c24');
  blazerGrad.addColorStop(1, '#2c0f14');
  ctx.fillStyle = blazerGrad;
  ctx.beginPath();
  ctx.moveTo(-60, 88);
  ctx.quadraticCurveTo(-56, 20, -25, 6);
  ctx.quadraticCurveTo(0, -4, 25, 6);
  ctx.quadraticCurveTo(56, 20, 60, 88);
  ctx.closePath();
  ctx.fill();
  // lapels
  ctx.fillStyle = 'rgba(15,5,8,0.4)';
  ctx.beginPath();
  ctx.moveTo(-6, -2); ctx.lineTo(-22, 34); ctx.lineTo(-8, 30); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, -2); ctx.lineTo(22, 34); ctx.lineTo(8, 30); ctx.closePath(); ctx.fill();

  // backpack strap crossing the chest
  ctx.strokeStyle = '#2a2f26';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-46, -6);
  ctx.quadraticCurveTo(-10, 40, 8, 90);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-46, -6);
  ctx.quadraticCurveTo(-10, 40, 8, 90);
  ctx.stroke();

  // striped school tie
  const tieGrad = ctx.createLinearGradient(-9, -3, 9, 68);
  tieGrad.addColorStop(0, '#d9b23f');
  tieGrad.addColorStop(1, '#8f6f24');
  ctx.fillStyle = tieGrad;
  ctx.beginPath();
  ctx.moveTo(-8, -2);
  ctx.lineTo(8, -2);
  ctx.lineTo(5, 22);
  ctx.lineTo(0, 32);
  ctx.lineTo(-5, 22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(20,15,5,0.5)';
  ctx.lineWidth = 3;
  for (let y = 2; y < 26; y += 7) {
    ctx.beginPath();
    ctx.moveTo(-8 + y * 0.12, y - 2);
    ctx.lineTo(8 - y * 0.12, y - 2);
    ctx.stroke();
  }

  // collar
  ctx.fillStyle = '#eef0ec';
  ctx.beginPath();
  ctx.moveTo(-14, -2); ctx.lineTo(0, 8); ctx.lineTo(-4, -12); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(14, -2); ctx.lineTo(0, 8); ctx.lineTo(4, -12); ctx.closePath(); ctx.fill();

  // neck
  ctx.fillStyle = '#caa07a';
  ctx.beginPath();
  ctx.moveTo(-11, -2);
  ctx.lineTo(11, -2);
  ctx.lineTo(9, -18);
  ctx.lineTo(-9, -18);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // ---------- head (younger, rounder proportions) ----------
  const headY = h * 0.35;
  ctx.save();
  ctx.translate(cx, headY);

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, 42, 50, 0, 0, Math.PI * 2);
  ctx.clip();

  const faceGrad = ctx.createLinearGradient(-42, -18, 42, 18);
  faceGrad.addColorStop(0, '#e7bd94');
  faceGrad.addColorStop(0.45, '#d1a077');
  faceGrad.addColorStop(1, '#9a7255');
  ctx.fillStyle = faceGrad;
  ctx.fillRect(-55, -65, 110, 130);

  const hi = ctx.createRadialGradient(-16, 6, 2, -16, 6, 28);
  hi.addColorStop(0, 'rgba(210,235,255,0.25)');
  hi.addColorStop(1, 'rgba(210,235,255,0)');
  ctx.fillStyle = hi;
  ctx.beginPath();
  ctx.arc(-16, 6, 28, 0, Math.PI * 2);
  ctx.fill();

  const sh = ctx.createRadialGradient(26, 4, 4, 26, 4, 36);
  sh.addColorStop(0, 'rgba(20,20,30,0.3)');
  sh.addColorStop(1, 'rgba(20,20,30,0)');
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.arc(26, 4, 36, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // ears
  ctx.fillStyle = '#cf9d72';
  ctx.beginPath();
  ctx.ellipse(-40, 4, 5, 9, 0, 0, Math.PI * 2);
  ctx.ellipse(40, 4, 5, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // tousled short hair
  ctx.fillStyle = '#241a10';
  ctx.beginPath();
  ctx.moveTo(-42, -8);
  ctx.quadraticCurveTo(-48, -46, 0, -50);
  ctx.quadraticCurveTo(48, -46, 42, -8);
  ctx.quadraticCurveTo(30, -32, 14, -30);
  ctx.quadraticCurveTo(4, -40, -10, -30);
  ctx.quadraticCurveTo(-26, -34, -42, -8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(70,55,35,0.45)';
  ctx.lineWidth = 1;
  for (let i = -34; i < 34; i += 5) {
    ctx.beginPath();
    ctx.moveTo(i, -44 + Math.abs(i) * 0.2);
    ctx.lineTo(i * 0.85, -28);
    ctx.stroke();
  }

  // worried eyebrows (raised, anxious)
  ctx.strokeStyle = '#1f150c';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-27, -16);
  ctx.quadraticCurveTo(-16, -22, -7, -14);
  ctx.moveTo(7, -14);
  ctx.quadraticCurveTo(16, -22, 27, -16);
  ctx.stroke();

  // wide, alert eyes (no glasses)
  ctx.fillStyle = '#fff6ea';
  ctx.beginPath();
  ctx.ellipse(-17, 0, 7, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(17, 0, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a1c10';
  ctx.beginPath();
  ctx.ellipse(-16, 1, 3, 3.4, 0, 0, Math.PI * 2);
  ctx.ellipse(18, 1, 3, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // nose
  ctx.strokeStyle = 'rgba(80,50,30,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-1, -2);
  ctx.quadraticCurveTo(5, 12, 1, 18);
  ctx.stroke();

  // tense, slightly open mouth
  ctx.strokeStyle = '#7a4632';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 28, 6, 3, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // cool flashlight under-glow, distinct from Mr. Lau's warm torch light
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.85, 4, w * 0.5, h * 0.85, w * 0.7);
  glow.addColorStop(0, 'rgba(180,215,255,0.12)');
  glow.addColorStop(1, 'rgba(180,215,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

// Tight, harshly-lit close-up of Mr. Lau's face for the jump-scare moment —
// filling the frame instead of the bust-shot composition the other
// portraits use, with wide eyes and an open mouth for the shock beat.
export function drawLauJumpscare(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5, cy = h * 0.52;
  ctx.save();
  ctx.translate(cx, cy);

  // harsh flashlight-from-below lighting: bright chin/nose, dark forehead
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.34, h * 0.4, 0, 0, Math.PI * 2);
  ctx.clip();

  const faceGrad = ctx.createLinearGradient(0, h * 0.3, 0, -h * 0.35);
  faceGrad.addColorStop(0, '#f0c79a');
  faceGrad.addColorStop(0.5, '#c89468');
  faceGrad.addColorStop(1, '#3a2418');
  ctx.fillStyle = faceGrad;
  ctx.fillRect(-w * 0.4, -h * 0.45, w * 0.8, h * 0.9);

  const underGlow = ctx.createRadialGradient(0, h * 0.3, 4, 0, h * 0.3, w * 0.5);
  underGlow.addColorStop(0, 'rgba(255,235,200,0.55)');
  underGlow.addColorStop(1, 'rgba(255,235,200,0)');
  ctx.fillStyle = underGlow;
  ctx.fillRect(-w * 0.4, -h * 0.45, w * 0.8, h * 0.9);
  ctx.restore();

  // hair, low and close over a furrowed brow
  ctx.fillStyle = '#0c0a07';
  ctx.beginPath();
  ctx.moveTo(-w * 0.32, -h * 0.05);
  ctx.quadraticCurveTo(-w * 0.34, -h * 0.38, 0, -h * 0.42);
  ctx.quadraticCurveTo(w * 0.34, -h * 0.38, w * 0.32, -h * 0.05);
  ctx.quadraticCurveTo(w * 0.2, -h * 0.22, 0, -h * 0.24);
  ctx.quadraticCurveTo(-w * 0.2, -h * 0.22, -w * 0.32, -h * 0.05);
  ctx.closePath();
  ctx.fill();

  // steep, angry eyebrows
  ctx.strokeStyle = '#150f0a';
  ctx.lineWidth = w * 0.018;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-w * 0.2, -h * 0.1);
  ctx.lineTo(-w * 0.06, -h * 0.05);
  ctx.moveTo(w * 0.06, -h * 0.05);
  ctx.lineTo(w * 0.2, -h * 0.1);
  ctx.stroke();

  // glasses, glinting hard as if catching the flashlight beam full-on
  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = w * 0.014;
  ctx.beginPath();
  ctx.roundRect(-w * 0.22, -h * 0.055, w * 0.16, h * 0.11, w * 0.02);
  ctx.roundRect(w * 0.06, -h * 0.055, w * 0.16, h * 0.11, w * 0.02);
  ctx.moveTo(-w * 0.06, 0);
  ctx.lineTo(w * 0.06, 0);
  ctx.stroke();
  const lensGlint = ctx.createLinearGradient(-w * 0.22, -h * 0.055, w * 0.22, h * 0.055);
  lensGlint.addColorStop(0, 'rgba(255,255,255,0.05)');
  lensGlint.addColorStop(0.5, 'rgba(255,255,255,0.65)');
  lensGlint.addColorStop(1, 'rgba(255,255,255,0.05)');
  ctx.fillStyle = lensGlint;
  ctx.beginPath();
  ctx.roundRect(-w * 0.22, -h * 0.055, w * 0.16, h * 0.11, w * 0.02);
  ctx.roundRect(w * 0.06, -h * 0.055, w * 0.16, h * 0.11, w * 0.02);
  ctx.fill();

  // wide, bloodshot-white eyes behind the lenses
  ctx.fillStyle = '#fff2e6';
  ctx.beginPath();
  ctx.ellipse(-w * 0.14, 0, w * 0.055, h * 0.045, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.14, 0, w * 0.055, h * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a0f08';
  ctx.beginPath();
  ctx.ellipse(-w * 0.14, 0, w * 0.022, w * 0.022, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.14, 0, w * 0.022, w * 0.022, 0, 0, Math.PI * 2);
  ctx.fill();

  // nose
  ctx.strokeStyle = 'rgba(60,35,20,0.5)';
  ctx.lineWidth = w * 0.012;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.02);
  ctx.quadraticCurveTo(w * 0.03, h * 0.08, 0, h * 0.11);
  ctx.stroke();

  // mouth wide open mid-shout
  ctx.fillStyle = '#3a0d0d';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.22, w * 0.09, h * 0.075, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f0ece0';
  ctx.fillRect(-w * 0.075, h * 0.16, w * 0.15, h * 0.025);

  ctx.restore();

  // hard red-tinted vignette to sell the shock of the moment
  const vignette = ctx.createRadialGradient(cx, cy, h * 0.15, cx, cy, w * 0.65);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(60,0,0,0.75)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}
