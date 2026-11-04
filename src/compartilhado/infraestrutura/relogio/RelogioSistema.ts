import { Relogio } from "./Relogio";
import { TimestampMs } from "../../dominio/TimestampMs";

export class RelogioSistema implements Relogio {
  public agora(): TimestampMs {
    return TimestampMs.deNumero(Date.now());
  }
}
