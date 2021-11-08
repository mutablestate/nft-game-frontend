export function transformCharacterData(characterData) {
  return {
    name: characterData.name,
    taunt: characterData.taunt,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
}
