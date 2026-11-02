/**
 * Copy text and give the agreed micro-feedback: a gentle 1px buzz with a short
 * dim flash on the page, plus a soft 0.1s bleep. Returns false if copying failed.
 */
export async function copyWithFeedback(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    return false;
  }
  document.body.classList.remove("copy-feedback");
  void document.body.offsetWidth; // restart the animation on repeated copies
  document.body.classList.add("copy-feedback");
  window.setTimeout(() => document.body.classList.remove("copy-feedback"), 320);
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
    osc.onended = () => ctx.close();
  } catch {
    // sound is optional
  }
  return true;
}
