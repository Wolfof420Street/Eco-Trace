import { Keypair, PublicKey } from "@solana/web3.js";
import { mplBubblegum, mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import type { BadgeDefinition } from "@/src/domain/entities/Badge";

export type MintResult = {
  mintAddress: string;
  txSignature: string;
  explorerUrl: string;
};

export class SolanaBadgeMintService {
  private getUmi() {
    const encoded = process.env.SOLANA_MINT_AUTHORITY_KEYPAIR;
    if (!encoded) {
      throw new Error("SOLANA_MINT_AUTHORITY_KEYPAIR is not configured");
    }

    const decoded = JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) as number[];
    const mintAuthority = Keypair.fromSecretKey(Uint8Array.from(decoded));
    const umi = createUmi(process.env.SOLANA_RPC_URL ?? process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com").use(mplBubblegum());
    const authority = umi.eddsa.createKeypairFromSecretKey(mintAuthority.secretKey);
    umi.use(keypairIdentity(authority));
    return umi;
  }

  async mint(recipientWallet: string, badge: BadgeDefinition): Promise<MintResult> {
    const merkleTree = process.env.SOLANA_MERKLE_TREE_ADDRESS;
    if (!merkleTree) {
      throw new Error("SOLANA_MERKLE_TREE_ADDRESS is not configured");
    }

    const umi = this.getUmi();
    const tree = publicKey(merkleTree);
    const recipient = new PublicKey(recipientWallet);
    const leafOwner = publicKey(recipient.toBase58());
    const leafDelegate = generateSigner(umi);

    const result = await mintToCollectionV1(umi, {
      leafOwner,
      leafDelegate,
      merkleTree: tree,
      collectionMint: tree as any,
      collectionAuthority: umi.identity,
      collectionAuthorityRecordPda: undefined,
      treeDelegate: umi.identity,
      payer: umi.identity,
      metadata: {
        name: badge.name,
        uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/badges/metadata/${badge.id}`,
        sellerFeeBasisPoints: { basisPoints: 0, identifier: "%" } as any,
        collection: { key: tree, verified: false },
        creators: []
      }
    } as any).sendAndConfirm(umi);

    const txSignature = Buffer.from(result.signature).toString("base64");
    return {
      mintAddress: recipient.toBase58(),
      txSignature,
      explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
    };
  }
}
