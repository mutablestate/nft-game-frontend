<script>
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import { contract, characters } from "../stores";

  let isMinting = false;

  async function handleMintCharacter(characterId) {
    try {
      if ($contract) {
        isMinting = true;
        console.log("Minting character in progress...");
        const mintTxn = await $contract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
        isMinting = false;
        alert(
          `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${$contract}/${tokenId.toNumber()}`
        );
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
      isMinting = false;
    }
  }
</script>

<div class="select-character-container">
  <h2 style="color: #444444;">I must not fear. Fear is the mind-killer.</h2>
  <div class="character-grid">
    {#each $characters as character, i}
      <div class="character-item">
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          class="character-mint-button"
          on:click={handleMintCharacter(i)}
        >
          {`Mint ${character.name}`}
        </button>
      </div>
    {/each}
  </div>
  {#if isMinting}
    <div class="loading">
      <div class="indicator">
        <LoadingIndicator />
        <p>Minting In Progress...</p>
      </div>
      <img
        src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
        alt="Minting loading indicator"
      />
    </div>
  {/if}
</div>

<style>
  .select-character-container {
    width: 100%;
    height: 100%;
  }

  .character-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 240px 240px 240px;
    justify-content: center;
  }

  .character-item {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-self: center;
    align-self: center;
    box-shadow: 0 1px 2px rgba(255, 255, 255, 0.07),
      0 2px 4px rgba(255, 255, 255, 0.07), 0 4px 8px rgba(255, 255, 255, 0.07),
      0 8px 16px rgba(255, 255, 255, 0.07),
      0 16px 32px rgba(255, 255, 255, 0.07),
      0 32px 64px rgba(255, 255, 255, 0.07);
  }

  .character-item img {
    height: 300px;
    width: 220px;
    border-radius: 8px;
    object-fit: cover;
  }

  .character-mint-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border: none;
    cursor: pointer;
    background-color: rgb(32, 129, 226);
    color: white;
    font-weight: bold;
    font-size: 16px;
  }

  .select-character-container .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 75px;
  }

  .select-character-container .loading .indicator {
    display: flex;
  }

  .select-character-container .loading .indicator p {
    font-weight: bold;
    font-size: 28px;
    padding-left: 5px;
  }

  .select-character-container .loading img {
    width: 450px;
    padding-top: 25px;
  }
</style>
