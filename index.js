const socketUrl = "http://localhost:8082"; // adjust if deployed

let connectButton, disconnectButton, socket, statusInput;

const connect = () => {
  let error = null;

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Connected with ID:", socket.id);
    statusInput.value = "Connected";
    document.getElementById("status").style.background = "#c8e6c9";
    connectButton.disabled = true;
    disconnectButton.disabled = false;

    // Ask backend for coin prices
    socket.emit("join_room", {
      get: { limit: 6, offset: 0 },
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${error || reason}`);
    statusInput.value = `Disconnected: ${error || reason}`;
    document.getElementById("status").style.background = "#ffcdd2";
    connectButton.disabled = false;
    disconnectButton.disabled = true;
    error = null;
  });

  socket.on("error", (payload) => {
    console.error("Socket error:", payload);
  });

  socket.on("prices_tomi", (data) => {
    console.log("Received prices_tomi:", data);
    renderCoins(data.coins || []);
  });
};

const disconnect = () => {
  if (socket) socket.disconnect();
};

document.addEventListener("DOMContentLoaded", () => {
  connectButton = document.getElementById("connect");
  disconnectButton = document.getElementById("disconnect");
  statusInput = document.getElementById("status");
});

function renderCoins(coins) {
  const tbody = document.getElementById("coins-table");
  tbody.innerHTML = "";

  coins.forEach((coin) => {
    const tr = document.createElement("tr");

    const percent = parseFloat(coin.percent_change_1h || 0);
    const percentClass = percent >= 0 ? "positive" : "negative";

    tr.innerHTML = `
      <td><img src="${coin.logo}" alt="${coin.symbol}" /></td>
      <td>${coin.name}</td>
      <td>${coin.symbol}</td>
      <td>$${Number(coin.price).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}</td>
      <td>$${Number(coin.market_cap).toLocaleString()}</td>
      <td class="${percentClass}">${percent.toFixed(2)}%</td>
      <td>$${Number(coin.volume_24h).toLocaleString()}</td>
      <td><img src="${coin.sparkline_7d}" alt="sparkline"/></td>
      <td>${new Date(coin.updatedAt).toLocaleString()}</td>
    `;

    tbody.appendChild(tr);
  });
}
