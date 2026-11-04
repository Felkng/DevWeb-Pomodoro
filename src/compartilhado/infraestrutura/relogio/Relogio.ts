import { TimestampMs } from "../../dominio/TimestampMs";

export interface Relogio {
  agora(): TimestampMs;
}
