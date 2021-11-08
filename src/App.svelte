<script>
  import { onMount } from "svelte";
  import { ethers } from "ethers";

  import { notifications } from "./notifications";
  import Toast from "./lib/Toast.svelte";

  import SelectCharacter from "./lib/SelectCharacter.svelte";

  import { transformCharacterData } from "./utils";
  import { contractEvent } from "./actions/contractEvent";
  import { contract, currentAccount, characterNFT, characters } from "./stores";

  export let contractAbi;
  export let contractAddress;

  let ethereum = null;

  async function fetchNFTMetaData() {
    console.log("FetchNFTMetaData");
    const txn = await $contract.checkIfUserHasNFT();
    if (txn.name) {
      console.log("User has character NFT");
      characterNFT.set(transformCharacterData(txn));
    } else {
      console.log("No character NFT found");
    }
  }

  async function getDefaultCharacters() {
    try {
      console.log("Getting contract characters to mint");

      const charactersTxn = await $contract.getAllDefaultCharacters();
      console.log("charactersTxn:", charactersTxn);

      const transformedCharacters = charactersTxn.map((characterData) =>
        transformCharacterData(characterData)
      );

      characters.set(transformedCharacters);
    } catch (error) {
      console.error("Something went wrong fetching characters:", error);
    }
  }

  async function fetchContract() {
    console.log("FetchContract");
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      contract.set(gameContract);

      if (gameContract) {
        getDefaultCharacters();
      } else {
        console.log("characters exist", $characters);
      }
    } catch (error) {
      notifications.danger("Ooof! Please try again.", 3000);
    }
  }

  // NOTE: connect first ethereum account in MetaMask
  async function handleConnectWallet() {
    console.log("ConnectWallet");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length) {
      console.log("Connected ", accounts[0]);
      notifications.success("Wallet connected!", 3000);
      currentAccount.set(accounts[0]);

      if ($contract) {
        fetchNFTMetaData();
      }
    }
  }

  onMount(async () => {
    ethereum = window?.ethereum;
    if (ethereum) {
      fetchContract();
    } else {
      console.log("Login To Metamask!");
      notifications.info("Please login to MetaMask!", 3000);
    }
  });
</script>

<svelte:head>
  <title>The Beast Slayer!</title>
</svelte:head>

<main class="App">
  <Toast />
  <div class="container">
    <div class="header-container">
      <p class="header gradient-text">
        ⚔️ The <span style="color:orangered">Beast</span> Slayer! ⚔️
      </p>
      <p class="sub-text">Free Arrakis from Harkonnen rule!</p>

      {#if $currentAccount}
        <div class="arrakis-bg">
          <div class="connected-container">
            {#if $characterNFT}
              Show character
            {:else}
              <!-- Connected:
              <a
                target="_blank"
                style="text-decoration: underline; color: white; width: 350px;"
                href={`https://rinkeby.etherscan.io/address/${$currentAccount}`}
              >
                {$currentAccount}
              </a> -->
              <SelectCharacter />
            {/if}
          </div>
        </div>
      {:else}
        <div class="connect-container">
          <img
            src="https://media.giphy.com/media/17QQ2DIidrb5nXEexj/giphy.gif"
            alt="Beast Grabban"
          />

          <button
            class="cta-button connect-wallet-button"
            on:click={handleConnectWallet}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      {/if}

      {#if $contract}
        <div use:contractEvent>
          <div class="hall-title" />
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  .App {
    height: 100vh;
    background-color: #0d1116;
    overflow: scroll;
    text-align: center;
  }

  .container {
    height: 100%;
    background-color: #0d1116;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .header-container {
    padding-top: 30px;
  }

  .header {
    margin: 0;
    font-size: 50px;
    font-weight: bold;
    color: white;
  }

  .sub-text {
    font-size: 25px;
    color: white;
  }

  .cta-button {
    margin-top: 20px;
    height: 45px;
    border: 0;
    width: auto;
    padding-left: 40px;
    padding-right: 40px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    color: white;
  }

  .arrakis-bg {
    max-width: 1500px;
    object-fit: contain;
    background-image: url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/777ed9be-a2bc-43cf-a764-4d0c3375b32f/d4kgzxa-a91a9011-a304-48c1-a13b-237a52a17892.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzc3N2VkOWJlLWEyYmMtNDNjZi1hNzY0LTRkMGMzMzc1YjMyZlwvZDRrZ3p4YS1hOTFhOTAxMS1hMzA0LTQ4YzEtYTEzYi0yMzdhNTJhMTc4OTIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.GhmnjApLU7jnit0atixyBXw1nFJJbwAtvaYF3srvCpQ");
    margin: auto;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .connect-container {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 550px;
  }

  .connected-container {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: 760px;
    color: white;
  }

  .connect-wallet-button {
    background-image: linear-gradient(
      to right,
      #ff8177 0%,
      #ff867a 0%,
      #ff8c7f 21%,
      #f99185 52%,
      #cf556c 78%,
      #b12a5b 100%
    );
    background-size: 200% 200%;
    animation: gradient-animation 4s ease infinite;
  }

  /* .mint-button {
    background: -webkit-linear-gradient(left, #a200d6, #ff6fdf);
    background-size: 200% 200%;
    animation: gradient-animation 4s ease infinite;
    margin-right: 15px;
  }

  .opensea-button {
    background-color: rgb(32, 129, 226);
  }

  .mint-count {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }

  /* KeyFrames */
  @-webkit-keyframes gradient-animation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-moz-keyframes gradient-animation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes gradient-animation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
