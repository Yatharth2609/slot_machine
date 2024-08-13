const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

app.post("/spin", (req, res) => {
  const { bet, lines } = req.body;

  if (
    typeof bet !== "number" ||
    typeof lines !== "number" ||
    bet <= 0 ||
    lines <= 0 ||
    lines > 3
  ) {
    return res.status(400).json({ error: "Invalid bet or number of lines" });
  }

  const reels = spin();
  const rows = transpose(reels);
  const winnings = getWinnings(rows, bet, lines);

  res.json({ rows, winnings });
});

app.listen(port, () => {
  console.log(`Slot machine backend running on http://localhost:${port}`);
});
