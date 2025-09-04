const socketUrl = "http://localhost:8082";
// const socketUrl = "https://tomipay-staging.tomi.com";

let connectButton;
let disconnectButton;
let socket;
let statusInput;
let tokenInput;

const connect = () => {
  let error = null;

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
    // path: "/chats/sockets",
  });

  socket.on("connect", () => {
    console.log("Connected");
    statusInput.value = "Connected";
    console.log(socket.id);
    connectButton.disabled = true;
    disconnectButton.disabled = false;

    socket.emit("join_room", {
      get: { limit: 6, offset: 1 },
    });
  });

  socket.on("packet", (reason) => {
    console.log("Unauthorized:", reason);

    error = reason.message;

    socket.disconnect();
  });

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${error || reason}`);
    statusInput.value = `Disconnected: ${error || reason}`;
    connectButton.disabled = false;
    disconnectButton.disabled = true;
    error = null;
  });

  socket.on("error", (payload) => {
    console.log("error recieved");
    console.log("payload", payload);
  });

  socket.on("Veteran_kicked_out", ({ message, accessToken }) => {
    console.log(message);
    console.log(accessToken);
  });

  socket.on("WORK_PROOF_REJECTED", ({ message }) => {
    console.log(message);
  });
  socket.on("prices_tomi", (data) => {
    console.log("data", data);
  });

  socket.on("ping", () => {
    console.log("ping called");
  });
  // socket.open();
};

const disconnect = () => {
  socket.disconnect();
};

document.addEventListener("DOMContentLoaded", () => {
  connectButton = document.getElementById("connect");
  disconnectButton = document.getElementById("disconnect");
  statusInput = document.getElementById("status");
  tokenInput = document.getElementById("token");
});
