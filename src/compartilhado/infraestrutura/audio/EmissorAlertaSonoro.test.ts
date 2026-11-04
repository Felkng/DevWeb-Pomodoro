import { describe, it, expect, vi, beforeEach } from "vitest";
import { EmissorAlertaSonoro } from "./EmissorAlertaSonoro";

describe("EmissorAlertaSonoro", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deve criar o emissor sem erro mesmo se AudioContext nao existir", () => {
    const emissor = new EmissorAlertaSonoro();
    expect(emissor).toBeDefined();
  });

  it("deve tocar alerta sonoro com contexto de audio simulado", () => {
    const mockOscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
    };
    const mockGain = {
      connect: vi.fn(),
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    };
    const mockContext = {
      state: "suspended",
      currentTime: 0,
      destination: {},
      resume: vi.fn().mockResolvedValue(undefined),
      createOscillator: vi.fn().mockReturnValue(mockOscillator),
      createGain: vi.fn().mockReturnValue(mockGain),
    };

    const emissor = new EmissorAlertaSonoro(mockContext as unknown as AudioContext);
    emissor.tocarAlertaFimDeFase();

    expect(mockContext.createOscillator).toHaveBeenCalled();
    expect(mockOscillator.start).toHaveBeenCalled();
  });
});
