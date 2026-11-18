export class EmissorAlertaSonoro {
  private readonly contextoAudio: AudioContext | null;

  public constructor(contextoExistente?: AudioContext) {
    if (contextoExistente) {
      this.contextoAudio = contextoExistente;
      return;
    }
    const ConstrutorContexto =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (typeof ConstrutorContexto === "undefined") {
      this.contextoAudio = null;
      return;
    }
    this.contextoAudio = new ConstrutorContexto();
  }

  public desbloquearNoGestoDoUsuario(): void {
    this.desbloquearContextoSeSuspenso();
  }

  public tocarAlertaFimDeFase(): void {
    if (!this.contextoAudio) {
      return;
    }
    this.desbloquearContextoSeSuspenso();
    this.tocarBipeHarmonico();
  }

  private desbloquearContextoSeSuspenso(): void {
    if (this.contextoAudio?.state === "suspended") {
      this.contextoAudio.resume();
    }
  }

  private tocarBipeHarmonico(): void {
    if (!this.contextoAudio) {
      return;
    }
    const oscilador = this.contextoAudio.createOscillator();
    const ganho = this.contextoAudio.createGain();
    const tempoAgora = this.contextoAudio.currentTime;

    oscilador.type = "sine";
    oscilador.frequency.setValueAtTime(880, tempoAgora);
    ganho.gain.setValueAtTime(0.15, tempoAgora);
    ganho.gain.exponentialRampToValueAtTime(0.001, tempoAgora + 0.6);

    oscilador.connect(ganho);
    ganho.connect(this.contextoAudio.destination);
    oscilador.start(tempoAgora);
    oscilador.stop(tempoAgora + 0.6);
  }
}
