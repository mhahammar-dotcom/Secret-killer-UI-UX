// Node script to generate the iconic Resident Evil style title screen voice:
// Deep raspy guttural voice reverberating: "SECRET... KILLER..."
// With sub-bass boom, formant resonance, stereo ping-pong delay, and cavernous plate reverb.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const sampleRate = 44100;

// Biquad Resonator Filter (Formant Filter)
class Resonator {
  constructor(freq, bandwidth, sampleRate) {
    this.setParams(freq, bandwidth, sampleRate);
    this.y1 = 0;
    this.y2 = 0;
  }

  setParams(freq, bandwidth, sr) {
    const r = Math.exp(-Math.PI * bandwidth / sr);
    const theta = 2 * Math.PI * freq / sr;
    this.a1 = 2 * r * Math.cos(theta);
    this.a2 = -r * r;
    this.b0 = 1 - r;
  }

  process(x) {
    const y0 = this.b0 * x + this.a1 * this.y1 + this.a2 * this.y2;
    this.y2 = this.y1;
    this.y1 = y0;
    return y0;
  }
}

// Lowpass / Highpass Filter
class Biquad {
  constructor(type, freq, Q, sr) {
    const w0 = 2 * Math.PI * freq / sr;
    const alpha = Math.sin(w0) / (2 * Q);
    const cosw0 = Math.cos(w0);

    let b0, b1, b2, a0, a1, a2;
    if (type === 'lowpass') {
      b0 = (1 - cosw0) / 2;
      b1 = 1 - cosw0;
      b2 = (1 - cosw0) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cosw0;
      a2 = 1 - alpha;
    } else if (type === 'highpass') {
      b0 = (1 + cosw0) / 2;
      b1 = -(1 + cosw0);
      b2 = (1 + cosw0) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cosw0;
      a2 = 1 - alpha;
    } else { // bandpass
      b0 = alpha;
      b1 = 0;
      b2 = -alpha;
      a0 = 1 + alpha;
      a1 = -2 * cosw0;
      a2 = 1 - alpha;
    }

    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = a1 / a0;
    this.a2 = a2 / a0;

    this.x1 = 0; this.x2 = 0;
    this.y1 = 0; this.y2 = 0;
  }

  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

// Phoneme definition sequence for "S - EE - K - R - E - T ... K - IH - L - ER"
// Target durations in ms
const timeline = [
  // Intro breath
  { phoneme: 'BREATH', dur: 0.2, f0: 0, amp: 0.15, formants: [400, 1500, 2800, 4000], noise: 0.9 },
  // "S"
  { phoneme: 'S', dur: 0.28, f0: 0, amp: 0.65, formants: [300, 1800, 4500, 7200], noise: 0.98 },
  // "EE" (long, deep, ominous)
  { phoneme: 'EE', dur: 0.42, f0: 68, amp: 0.95, formants: [270, 2250, 3100, 3900], noise: 0.08, asp: 0.25 },
  // "K" (closure + click)
  { phoneme: 'K', dur: 0.10, f0: 0, amp: 0.8, formants: [350, 2000, 2900, 4500], noise: 0.95 },
  // "R" (gravelly liquid)
  { phoneme: 'R', dur: 0.22, f0: 64, amp: 0.85, formants: [450, 1150, 1600, 3200], noise: 0.12, asp: 0.3 },
  // "E" (short vowel in 'ret')
  { phoneme: 'EH', dur: 0.26, f0: 62, amp: 0.9, formants: [520, 1800, 2500, 3600], noise: 0.1, asp: 0.25 },
  // "T" (hard crisp release)
  { phoneme: 'T', dur: 0.18, f0: 0, amp: 0.7, formants: [400, 1900, 3800, 6500], noise: 0.98 },
  
  // OMINOUS DRAMATIC PAUSE between words (Resident Evil style delay)
  { phoneme: 'PAUSE', dur: 0.45, f0: 0, amp: 0.05, formants: [300, 1200, 2400, 3500], noise: 0.05 },
  
  // "K" (strong initial explosive burst for "Killer")
  { phoneme: 'K2', dur: 0.16, f0: 0, amp: 0.85, formants: [380, 2100, 3000, 4800], noise: 0.96 },
  // "IH" (deep guttural vowel)
  { phoneme: 'IH', dur: 0.45, f0: 65, amp: 1.0, formants: [390, 1950, 2600, 3800], noise: 0.09, asp: 0.28 },
  // "L" (dark resonant lateral)
  { phoneme: 'L', dur: 0.32, f0: 60, amp: 0.85, formants: [380, 1050, 2500, 3400], noise: 0.08, asp: 0.2 },
  // "ER" (extended fading trailing vocal growl)
  { phoneme: 'ER', dur: 0.85, f0: 55, amp: 0.95, formants: [490, 1280, 1680, 3100], noise: 0.15, asp: 0.35, decay: true },
  
  // Outro decay
  { phoneme: 'TAIL', dur: 0.4, f0: 0, amp: 0.0, formants: [300, 1000, 2000, 3000], noise: 0.0 }
];

// Calculate total duration
const totalDuration = timeline.reduce((acc, cur) => acc + cur.dur, 0);
const numSamples = Math.ceil(totalDuration * sampleRate);
const rawVoice = new Float32Array(numSamples);

// Glottal pulse generator with jitter and vocal cord shimmer
let phase = 0;
let timeSec = 0;

for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  
  // Find current phoneme
  let elapsed = 0;
  let curSegment = timeline[0];
  let segProgress = 0;
  
  for (const seg of timeline) {
    if (t >= elapsed && t < elapsed + seg.dur) {
      curSegment = seg;
      segProgress = (t - elapsed) / seg.dur;
      break;
    }
    elapsed += seg.dur;
  }

  // Pitch variation (Resident Evil signature downward pitch drop)
  let f0 = curSegment.f0;
  if (f0 > 0) {
    // Subtle vibrato + pitch drop on vowel endings
    const pitchDrop = (curSegment.decay ? (1.0 - segProgress * 0.25) : 1.0);
    const vibrato = 1 + 0.035 * Math.sin(2 * Math.PI * 4.5 * t);
    const jitter = (Math.random() - 0.5) * 0.04;
    f0 = f0 * pitchDrop * vibrato * (1 + jitter);
  }

  // Generate Glottal Source (Rosenberg pulse model with rasp / sub-harmonic growl)
  let glottal = 0;
  if (f0 > 0) {
    const period = sampleRate / f0;
    phase += 1;
    if (phase >= period) phase -= period;
    const tn = phase / period;
    
    // Rosenberg model
    if (tn < 0.4) {
      glottal = 0.5 * (1 - Math.cos(Math.PI * tn / 0.4));
    } else if (tn < 0.65) {
      glottal = Math.cos(Math.PI * (tn - 0.4) / (2 * 0.25));
    } else {
      glottal = 0;
    }
    
    // Add sub-octave growl (f0 / 2) for demonic low register
    glottal += 0.45 * Math.sin(Math.PI * (phase / (period * 2)));
    
    // Vocal cord grit / saturation
    glottal = Math.tanh(glottal * 2.2);
  }

  // White noise for unvoiced fricatives and breath aspiration
  const whiteNoise = (Math.random() * 2 - 1);
  
  // Mix voiced + noise
  const noiseAmp = curSegment.noise || 0;
  const aspAmp = curSegment.asp || 0;
  const rawSignal = glottal * (1 - noiseAmp) + whiteNoise * (noiseAmp * 0.8 + aspAmp * 0.4);
  
  // Amplitude envelope
  let amp = curSegment.amp;
  if (curSegment.decay) {
    amp *= (1 - segProgress * 0.7);
  }
  
  rawVoice[i] = rawSignal * amp;
}

// Pass through Formant Resonator Filterbank
const filteredVoice = new Float32Array(numSamples);
const res1 = new Resonator(350, 80, sampleRate);
const res2 = new Resonator(1500, 110, sampleRate);
const res3 = new Resonator(2600, 140, sampleRate);
const res4 = new Resonator(3800, 220, sampleRate);
const highAir = new Biquad('highpass', 4500, 0.7, sampleRate);
const lowGrowl = new Biquad('lowpass', 180, 1.2, sampleRate);

for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  
  // Find current formants
  let elapsed = 0;
  let curSegment = timeline[0];
  for (const seg of timeline) {
    if (t >= elapsed && t < elapsed + seg.dur) {
      curSegment = seg;
      break;
    }
    elapsed += seg.dur;
  }
  
  const f = curSegment.formants;
  res1.setParams(f[0], 90, sampleRate);
  res2.setParams(f[1], 120, sampleRate);
  res3.setParams(f[2], 160, sampleRate);
  res4.setParams(f[3], 240, sampleRate);
  
  const s = rawVoice[i];
  const outF1 = res1.process(s) * 1.2;
  const outF2 = res2.process(s) * 0.85;
  const outF3 = res3.process(s) * 0.55;
  const outF4 = res4.process(s) * 0.35;
  const air = highAir.process(s) * (curSegment.noise > 0.5 ? 1.5 : 0.25);
  const sub = lowGrowl.process(s) * (curSegment.f0 > 0 ? 0.9 : 0.0);
  
  filteredVoice[i] = (outF1 + outF2 + outF3 + outF4 + air + sub);
}

// Apply Cinema Stereo Reverb, Pitch Doubling, Sub-bass Impact Boom, Tape Saturation
const reverbTailSamples = Math.ceil(3.2 * sampleRate);
const totalOutSamples = numSamples + reverbTailSamples;
const leftChannel = new Float32Array(totalOutSamples);
const rightChannel = new Float32Array(totalOutSamples);

// Multi-tap Delay Line (Early Reflections & Plate Reverb)
const delayDelays = [
  Math.floor(0.045 * sampleRate),
  Math.floor(0.088 * sampleRate),
  Math.floor(0.142 * sampleRate),
  Math.floor(0.210 * sampleRate),
  Math.floor(0.285 * sampleRate),
  Math.floor(0.360 * sampleRate),
  Math.floor(0.490 * sampleRate),
  Math.floor(0.680 * sampleRate)
];

const delayGains = [0.45, 0.38, 0.32, 0.28, 0.22, 0.17, 0.12, 0.08];

// Mix vocal + sub impact
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  let voiceSamp = filteredVoice[i] * 1.3;
  
  // Analog Tape Soft Clipping
  voiceSamp = Math.tanh(voiceSamp * 1.5);
  
  // Dry Stereo Voice (with slight Haas effect stereo width)
  leftChannel[i] += voiceSamp * 0.85;
  if (i + 12 < totalOutSamples) {
    rightChannel[i + 12] += voiceSamp * 0.85;
  }
  
  // Sub-Bass Cinema Impact Boom (Triggered right as "SECRET" and "KILLER" hit)
  // Boom 1 at t = 0.22 ("Secret")
  if (t >= 0.20 && t < 1.4) {
    const bt = t - 0.20;
    const boomFreq = 52 * Math.exp(-bt * 1.8);
    const boomAmp = Math.exp(-bt * 3.2) * 0.55;
    const boomVal = Math.sin(2 * Math.PI * boomFreq * bt) * boomAmp;
    leftChannel[i] += boomVal;
    rightChannel[i] += boomVal;
  }
  // Boom 2 at t = 1.9 ("Killer") - Heavy Sub Drop
  if (t >= 1.85 && t < 3.8) {
    const bt = t - 1.85;
    const boomFreq = 46 * Math.exp(-bt * 1.5);
    const boomAmp = Math.exp(-bt * 2.2) * 0.75;
    const boomVal = Math.sin(2 * Math.PI * boomFreq * bt) * boomAmp;
    leftChannel[i] += boomVal;
    rightChannel[i] += boomVal;
  }
}

// Reverb processing
for (let d = 0; d < delayDelays.length; d++) {
  const delay = delayDelays[d];
  const g = delayGains[d];
  const pan = (d % 2 === 0) ? 0.7 : -0.7; // Stereo spread
  
  for (let i = 0; i < numSamples; i++) {
    const targetIdx = i + delay;
    if (targetIdx < totalOutSamples) {
      const v = filteredVoice[i] * g;
      leftChannel[targetIdx] += v * (1 + pan);
      rightChannel[targetIdx] += v * (1 - pan);
    }
  }
}

// Feedback Damping Loop (Cavernous Tail)
const fbDelayL = Math.floor(0.185 * sampleRate);
const fbDelayR = Math.floor(0.225 * sampleRate);
for (let i = 0; i < totalOutSamples; i++) {
  if (i >= fbDelayL) {
    leftChannel[i] += rightChannel[i - fbDelayL] * 0.38;
  }
  if (i >= fbDelayR) {
    rightChannel[i] += leftChannel[i - fbDelayR] * 0.35;
  }
}

// Master Peak Limiter & Normalization
let maxPeak = 0.0001;
for (let i = 0; i < totalOutSamples; i++) {
  maxPeak = Math.max(maxPeak, Math.abs(leftChannel[i]), Math.abs(rightChannel[i]));
}

const normGain = 0.92 / maxPeak;

// Write Stereo 16-bit PCM WAV File
function writeWav(filePath, left, right, sr) {
  const numSamples = left.length;
  const numChannels = 2;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sr * blockAlign;
  const dataSize = numSamples * blockAlign;
  
  const buffer = Buffer.alloc(44 + dataSize);
  
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sr, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Left
    let lVal = Math.max(-1, Math.min(1, left[i] * normGain));
    let lInt = lVal < 0 ? Math.floor(lVal * 32768) : Math.floor(lVal * 32767);
    buffer.writeInt16LE(lInt, offset);
    offset += 2;
    
    // Right
    let rVal = Math.max(-1, Math.min(1, right[i] * normGain));
    let rInt = rVal < 0 ? Math.floor(rVal * 32768) : Math.floor(rVal * 32767);
    buffer.writeInt16LE(rInt, offset);
    offset += 2;
  }
  
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated WAV file: ${filePath} (${(dataSize / 1024).toFixed(1)} KB)`);
}

// Ensure output directory exists
const outDir = path.join(process.cwd(), 'public', 'sounds');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const wavPath = path.join(outDir, 'secret_killer_title.wav');
const mp3Path = path.join(outDir, 'secret_killer_title.mp3');

writeWav(wavPath, leftChannel, rightChannel, sampleRate);

// Convert to MP3 with high-quality compression using ffmpeg
try {
  execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}"`);
  console.log(`Generated MP3 file: ${mp3Path}`);
} catch (e) {
  console.error('FFmpeg conversion note:', e.message);
}

console.log('Resident Evil style title voice successfully synthesized!');
