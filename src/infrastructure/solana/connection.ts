import { Connection } from "@solana/web3.js";

let connection: Connection | null = null;

export function getSolanaConnection() {
  if (!connection) {
    connection = new Connection(process.env.SOLANA_RPC_URL ?? process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com", "confirmed");
  }

  return connection;
}
