const socketUrl = "http://localhost:8082"; // change to your backend URL

let connectButton;
let disconnectButton;
let socket;
let statusInput;

const connect = () => {
  let error = null;

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
    statusInput.value = "Connected";
    connectButton.disabled = true;
    disconnectButton.disabled = false;
  });

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${error || reason}`);
    statusInput.value = `Disconnected: ${error || reason}`;
    connectButton.disabled = false;
    disconnectButton.disabled = true;
    error = null;
  });

  socket.on("error", (payload) => {
    console.error("Error received:", payload);
  });

  // Listen for paginated coin list
  socket.on("prices_tomi", (data) => {
    console.log("Paginated Data:", data);
    document.getElementById("roomData").innerText = JSON.stringify(
      data,
      null,
      2
    );
  });

  // Listen for single coin by ID
  socket.on("coin_byId", (data) => {
    console.log("Coin byId:", data);
    document.getElementById("coinData").innerText = JSON.stringify(
      data,
      null,
      2
    );
  });
};

const disconnect = () => {
  if (socket) socket.disconnect();
};

// join room with pagination
const joinRoom = () => {
  const limit = document.getElementById("limit").value;
  const offset = document.getElementById("offset").value;

  socket.emit("join_room", {
    get: { limit: Number(limit), offset: Number(offset) },
  });
};

// join room with coinId
const joinRoomById = () => {
  const coinId = document.getElementById("coinId").value;

  socket.emit("join_room_byId", {
    get: { coinId: Number(coinId) },
  });
};

document.addEventListener("DOMContentLoaded", () => {
  connectButton = document.getElementById("connect");
  disconnectButton = document.getElementById("disconnect");
  statusInput = document.getElementById("status");
});
