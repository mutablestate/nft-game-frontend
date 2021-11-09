<script>
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import { contract, boss, characterNFT } from "../stores";
  import { notifications } from "../notifications";

  let attackState = "";
  notifications.info(`${$boss.name}: ${$boss.taunt}`, 6000);

  async function handleAttack() {
    try {
      attackState = "attacking";
      notifications.info(`${$characterNFT.name}: ${$characterNFT.taunt}`, 3000);
      console.log("Attacking boss...");
      const attackTxn = await $contract.attackBoss();
      await attackTxn.wait();
      console.log("attackTxn:", attackTxn);
      attackState = "hit";

      notifications.success(
        `${$characterNFT.name} hits for ${$characterNFT.attackDamage} HP!`,
        3000
      );
    } catch (error) {
      notifications.danger("Ooof! Attack fails.", 3000);
      console.error("Error attacking boss:", error);
      attackState = "";
    }
  }
</script>

<div class="arena-container">
  <div class="boss-container">
    <div class="boss-content {attackState}">
      <div class="image-content">
        <img src={$boss.imageURI} alt="The Beast" />
        <div class="health-bar">
          <progress value={$boss.hp} max={$boss.maxHp} />
          <p>{`${$boss.hp} / ${$boss.maxHp} HP`}</p>
        </div>
      </div>
    </div>
    <div class="attack-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style="width: 0;height: 0;"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <button class="cta-button" on:click={handleAttack}>
        <span class="title">
          <span class="drop" />
          <span class="drop" />
          <span class="drop" />
          Attack The Beast!
          <span class="drop" />
          <span class="drop" />
        </span>
      </button>
      {#if attackState === "attacking"}
        <div class="loading-indicator">
          <LoadingIndicator />
          <p>Attacking ⚔️</p>
        </div>
      {/if}
    </div>
  </div>

  <div class="players-container">
    <div class="player-container">
      <div class="player">
        <div class="image-content">
          <img
            src={$characterNFT.imageURI}
            alt={`Character ${$characterNFT.name}`}
          />
          <div class="health-bar">
            <progress value={$characterNFT.hp} max={$characterNFT.maxHp} />
            <p>{`${$characterNFT.hp} / ${$characterNFT.maxHp} HP`}</p>
          </div>
        </div>
        <div class="stats">
          <h4>{`⚔️ Attack Damage: ${$characterNFT.attackDamage}`}</h4>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
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
    box-shadow: 0 1px 2px rgba(255, 255, 255, 0.07),
      0 2px 4px rgba(255, 255, 255, 0.07), 0 4px 8px rgba(255, 255, 255, 0.07),
      0 8px 16px rgba(255, 255, 255, 0.07),
      0 16px 32px rgba(255, 255, 255, 0.07),
      0 32px 64px rgba(255, 255, 255, 0.07);
  }

  .arena-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    color: white;
  }

  .arena-container .boss-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-bottom: 32px;
  }

  .boss-container .boss-content {
    display: flex;
    flex-direction: column;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 1px 2px rgba(255, 255, 255, 0.07),
      0 2px 4px rgba(255, 255, 255, 0.07), 0 4px 8px rgba(255, 255, 255, 0.07),
      0 8px 16px rgba(255, 255, 255, 0.07),
      0 16px 32px rgba(255, 255, 255, 0.07),
      0 32px 64px rgba(255, 255, 255, 0.07);
    background-size: 600% 600%;
    animation: gradient-animation 8s ease infinite;
    margin-bottom: 25px;
  }

  .boss-container .loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 25px;
  }

  .boss-container .loading-indicator p {
    font-weight: bold;
    font-size: 28px;
  }

  .title {
    font-weight: 600;
    font-size: 52px;
    margin: 0;
    filter: url(#goo);
    position: relative;
    /* letter-spacing: -0.12px; */
    color: IndianRed;
    text-transform: uppercase;
  }

  .drop {
    width: 8px;
    height: 8px;
    border-radius: 0 100% 100% 100%;
    background-color: currentColor;
    position: absolute;
    top: 72%;
    animation: drop 3s infinite both;
  }
  .drop:nth-child(1) {
    left: 14%;
  }
  .drop:nth-child(2) {
    left: 39%;
    animation-delay: -0.4s;
  }
  .drop:nth-child(3) {
    left: 55%;
    animation-delay: -1.5s;
  }
  .drop:nth-child(4) {
    left: 82%;
    animation-delay: -0.8s;
  }
  .drop:nth-child(5) {
    left: 95.5%;
    animation-delay: -1.3s;
  }

  @keyframes drop {
    0% {
      transform: translateY(0) scaleX(0.85) rotate(45deg);
      animation-timing-function: ease-out;
    }
    60% {
      transform: translateY(120%) scaleX(0.85) rotate(45deg);
      animation-timing-function: ease-in;
    }
    80%,
    100% {
      transform: translateY(60vh) scaleX(0.85) rotate(45deg);
    }
  }

  .boss-content .image-content,
  .player .image-content {
    position: relative;
  }

  .boss-content .image-content img {
    width: 350px;
    height: 300px;
    border-radius: 10px;
    object-fit: cover;
  }

  .image-content .health-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
  }

  .health-bar progress[value] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 100%;
  }

  .health-bar progress[value]::-webkit-progress-bar {
    background-color: #e5652e;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    overflow: hidden;
  }

  .health-bar progress[value]::-webkit-progress-value {
    background-color: #70cb1b;
  }

  .health-bar p {
    position: absolute;
    width: 100%;
    font-weight: bold;
    color: black;
    bottom: -10px;
  }

  .arena-container .players-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
  }

  .players-container .player {
    display: flex;
    flex-direction: column;
    max-height: 80%;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 2px rgba(255, 255, 255, 0.07),
      0 2px 4px rgba(255, 255, 255, 0.07), 0 4px 8px rgba(255, 255, 255, 0.07),
      0 8px 16px rgba(255, 255, 255, 0.07),
      0 16px 32px rgba(255, 255, 255, 0.07),
      0 32px 64px rgba(255, 255, 255, 0.07);
  }

  .player .image-content img {
    width: 250px;
    height: 300px;
    border-radius: 10px;
    object-fit: cover;
  }

  /* .players-container .active-players {
    display: flex;
    flex-direction: column;
  }

  .active-players .players-list {
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow: scroll;
  }

  .players-list .active-player-item {
    display: flex;
    align-items: center;
    background-color: #b12a5b;
    border-radius: 8px;
    margin: 5px;
    padding: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .active-player-item .player-image {
    width: 64px;
    height: 64px;
    background-color: gray;
    margin-right: 15px;
    border-radius: 8px;
  }

  .active-player-item .player-content {
    flex-direction: column;
    text-align: left;
  }

  .players-container .attack-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
  } */
  .attack-container button {
    height: 60px;
    background-image: linear-gradient(135deg, #667eea 0%, #562983 100%);
    background-size: 160% 160%;
    animation: gradient-animation 4s ease infinite;
  }

  /* Effects */
  .boss-container .attacking {
    animation: shake 1.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .boss-container .hit {
    animation: hit-bounce 1s ease;
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  @keyframes hit-bounce {
    0% {
      transform: scale(1) translateY(0);
    }
    10% {
      transform: scale(1.2, 0.6);
    }
    30% {
      transform: scale(0.8, 1.1) translateY(-10px);
    }
    50% {
      transform: scale(1) translateY(0);
    }
    100% {
      transform: translateY(0);
    }
  }

  /* Toast */
  /* #toast {
    visibility: hidden;
    max-width: 500px;
    height: 90px;
    margin: auto;
    background-color: gray;
    color: #fff;
    text-align: center;
    border-radius: 10px;
    position: fixed;
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 30px;
    font-size: 17px;
    white-space: nowrap;
  }

  #toast #desc {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 28px;
    font-weight: bold;
    height: 90px;
    overflow: hidden;
    white-space: nowrap;
  } */
</style>
