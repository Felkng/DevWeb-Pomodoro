import { describe, it, expect, beforeEach } from "vitest";
import { RepositorioSessaoAtiva } from "./RepositorioSessaoAtiva";
import { ArmazenamentoLocal } from "../../compartilhado/infraestrutura/persistencia/ArmazenamentoLocal";
import { SessaoAtiva, SnapshotPreset } from "../dominio/SessaoAtiva";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";

describe("RepositorioSessaoAtiva (RF-12, UC10, RN-06)", () => {
  let armazenamento: ArmazenamentoLocal;
  let repositorio: RepositorioSessaoAtiva;

  beforeEach(() => {
    localStorage.clear();
    armazenamento = new ArmazenamentoLocal();
    repositorio = new RepositorioSessaoAtiva(armazenamento);
  });

  it("deve retornar null quando nao houver sessao gravada", () => {
    expect(repositorio.carregar(TimestampMs.deNumero(1000))).toBeNull();
  });

  it("deve salvar, limpar e carregar sessao", () => {
    const sessao = SessaoAtiva.iniciar({
      id: IdentificadorId.deString("s-1").obterValor(),
      presetId: "p-1",
      snapshot: new SnapshotPreset({
        tempoFocoMin: 25,
        tempoPausaCurtaMin: 5,
        ciclosAntesPausaLonga: 4,
        tempoPausaLongaMin: 15,
      }),
      momentoInicio: TimestampMs.deNumero(1000),
    });

    repositorio.salvar(sessao);
    const carregada = repositorio.carregar(TimestampMs.deNumero(2000));
    expect(carregada).not.toBeNull();
    expect(carregada?.paraDto().id).toBe("s-1");

    repositorio.limpar();
    expect(repositorio.carregar(TimestampMs.deNumero(3000))).toBeNull();
  });
});
