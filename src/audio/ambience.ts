/**
 * Optional ambient ocean bed, synthesised with Web Audio (no asset to download).
 * Never starts on its own: start() must be called from a user gesture.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let lowpass: BiquadFilterNode | null = null;
let swell: GainNode | null = null;
let lfos: OscillatorNode[] = [];
let sources: AudioBufferSourceNode[] = [];

function noiseBuffer(c: AudioContext, brown: boolean) {
  const len = c.sampleRate * 4;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w * 0.5;
  }
  return buf;
}

export function startAmbience() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 700;
    lowpass.connect(master);

    // deep rumble / water body
    const body = ctx.createBufferSource();
    body.buffer = noiseBuffer(ctx, true);
    body.loop = true;
    const bodyGain = ctx.createGain();
    bodyGain.gain.value = 0.9;
    body.connect(bodyGain).connect(lowpass);

    // slow wave swell
    swell = ctx.createGain();
    swell.gain.value = 0.35;
    const hiss = ctx.createBufferSource();
    hiss.buffer = noiseBuffer(ctx, false);
    hiss.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.value = 1400;
    hp.Q.value = 0.4;
    hiss.connect(hp).connect(swell).connect(lowpass);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.28;
    lfo.connect(lfoGain).connect(swell.gain);

    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.05;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 180;
    lfo2.connect(lfo2Gain).connect(lowpass.frequency);

    [body, hiss, lfo, lfo2].forEach((n) => n.start());
    sources = [body, hiss];
    lfos = [lfo, lfo2];
  }
  void ctx.resume();
  master!.gain.cancelScheduledValues(ctx.currentTime);
  master!.gain.setTargetAtTime(0.16, ctx.currentTime, 0.8);
}

export function stopAmbience() {
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
  const c = ctx;
  window.setTimeout(() => { if (master && master.gain.value < 0.01) void c.suspend(); }, 1500);
}

/** depth 0 (surface) .. 1 (deepest): the deeper, the more muffled. */
export function setAmbienceDepth(depth: number) {
  if (!ctx || !lowpass) return;
  lowpass.frequency.setTargetAtTime(900 - depth * 650, ctx.currentTime, 0.5);
}

export function disposeAmbience() {
  [...sources, ...lfos].forEach((n) => { try { n.stop(); } catch { /* already stopped */ } });
  void ctx?.close();
  ctx = master = lowpass = swell = null;
  sources = []; lfos = [];
}
