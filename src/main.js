import myEpicGame from "./contract/MyEpicGame.json";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
  props: {
    contractAddress: "0x3835bE8E6D76E98311e3d5124f7F4e6FcE0f77E6",
    contractAbi: myEpicGame.abi,
  },
});

export default app;
