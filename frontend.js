let balance = 0;

document.getElementById("spin-button").addEventListener("click", spin);

function spin() {
  const deposit = parseInt(document.getElementById("deposit").value);
  const lines = parseInt(document.getElementById("lines").value);
  const bet = parseInt(document.getElementById("bet").value);

  if (isNaN(deposit) || isNaN(lines) || isNaN(bet)) {
    showMessage("Please enter valid numbers for all fields.");
    return;
  }

  if (balance === 0) {
    balance = deposit;
  }

  if (bet * lines > balance) {
    showMessage("Insufficient balance for this bet.");
    return;
  }

  const result = simulateBackendResponse(lines, bet);

  updateSlotMachine(result.rows);
  balance += result.winnings - bet * lines;
  showMessage(`You won $${result.winnings}!`);
  updateBalance();
}

function simulateBackendResponse(lines, bet) {
  const symbols = ["A", "B", "C", "D"];
  const rows = [];
  for (let i = 0; i < 3; i++) {
    rows.push([]);
    for (let j = 0; j < 3; j++) {
      rows[i].push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
  }

  let winnings = 0;
  for (let i = 0; i < lines; i++) {
    if (rows[i][0] === rows[i][1] && rows[i][1] === rows[i][2]) {
      winnings += bet * (["A", "B", "C", "D"].indexOf(rows[i][0]) + 2);
    }
  }

  return { rows, winnings };
}

function updateSlotMachine(rows) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      document.getElementById(`slot${i * 3 + j + 1}`).textContent = rows[i][j];
    }
  }
}

function showMessage(msg) {
  document.getElementById("message").textContent = msg;
}

function updateBalance() {
  document.getElementById("balance").textContent = `Balance: $${balance}`;
}

updateBalance();
