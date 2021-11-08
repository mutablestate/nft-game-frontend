import { get } from "svelte/store";
import { contract, characterNFT, boss } from "../stores";
import { transformCharacterData } from "../utils";

async function handleCharacterNFTMinted(sender, tokenId, characterIndex) {
  let $contract = get(contract);
  console.log(
    `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
  );

  if ($contract) {
    const mintedCharacterNFT = await $contract.checkIfUserHasNFT();
    console.log("CharacterNFT: ", mintedCharacterNFT);
    characterNFT.set(transformCharacterData(mintedCharacterNFT));
  }
}

function handleAttackComplete(newBossHp, newPlayerHp) {
  let $boss = get(boss);
  let $characterNFT = get(characterNFT);

  const bossHp = newBossHp.toNumber();
  const playerHp = newPlayerHp.toNumber();

  console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

  boss.set({ ...$boss, hp: bossHp });
  characterNFT.set({ ...$characterNFT, hp: playerHp });
}

export function contractEvent(node) {
  let $contract = get(contract);
  $contract.on("CharacterNFTMinted", handleCharacterNFTMinted);
  $contract.on("AttackComplete", handleAttackComplete);

  return {
    destroy() {
      $contract.off("CharacterNFTMinted", handleCharacterNFTMinted);
      $contract.off("AttackComplete", handleAttackComplete);
    },
  };
}
