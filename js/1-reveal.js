//Cactpot script

const grid = document.getElementById("grid");
const tiles = [];
const triesEl = document.getElementById("tries");
const scoreEl = document.getElementById("score");
const START_TRIES = 3;

let tries = START_TRIES;

// Payout table keyed by the sum of the three tiles.
const PAYOUTS = {
  6: 10000,
  7: 36,
  8: 720,
  9: 360,
  10: 80,
  11: 252,
  12: 108,
  13: 72,
  14: 54,
  15: 180,
  16: 72,
  17: 180,
  18: 119,
  19: 36,
  20: 306,
  21: 1080,
  22: 144,
  23: 1800,
  24: 3600,
};

//shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildTiles() {
  const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  values.forEach((value, i) => {
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.type = "button";
    tile.setAttribute("aria-pressed", "false");
    tile.setAttribute("aria-label", `Tile ${i + 1}`);
    tile.dataset.value = value;
    tile.innerHTML = `
                <span class="tile__inner">
                    <span class="tile__face tile__face--front">?</span>
                    <span class="tile__face tile__face--back">${value}</span>
                </span>`;

    tile.addEventListener("click", () => revealTile(tile));

    grid.appendChild(tile);
    tiles.push(tile);
  });
}

function revealTile(tile) {
  if (chooser.submitted || tries === 0) return;
  if (tile.getAttribute("aria-pressed") === "true") return;

  tile.setAttribute("aria-pressed", "true");
  tries--;
  triesEl.innerText = tries;
}

//pop two
function getTwo() {
  const picks = shuffle([...tiles]).slice(0, 2);

  picks.forEach((tile) => {
    tile.setAttribute("aria-pressed", "true");
  });

  console.log(picks.map((tile) => tile.getAttribute("aria-label")));
}

// directional chooser
// lines in the grid that are chosen
const LINES = {
  row0: [0, 1, 2],
  row1: [3, 4, 5],
  row2: [6, 7, 8],
  col0: [0, 3, 6],
  col1: [1, 4, 7],
  col2: [2, 5, 8],
  diag0: [0, 4, 8],
  diag1: [2, 4, 6],
};

const lineButtons = [...document.querySelectorAll(".line-btn")];
const submitBtn = document.getElementById("submit-line");
const replayBtn = document.getElementById("replay");

const chooser = {
  line: "row0",
  submitted: false,
};

function selectLine(line) {
  if (chooser.submitted) return;

  chooser.line = line;
  lineButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.line === line));
  });
}

function readLine(line) {
  const indices = LINES[line];

  return indices.map((index) => Number(tiles[index].dataset.value));
}

function scoreLine(values) {
  const sum = values.reduce((total, value) => total + value, 0);

  return PAYOUTS[sum] ?? 0;
}

lineButtons.forEach((btn) =>
  btn.addEventListener("click", () => selectLine(btn.dataset.line)),
);

submitBtn.addEventListener("click", () => {
  if (chooser.submitted) return;

  const values = readLine(chooser.line);
  const score = scoreLine(values);

  scoreEl.textContent = score.toLocaleString();
  chooser.submitted = true;

  tiles.forEach((tile) => tile.setAttribute("aria-pressed", "true"));
  lineButtons.forEach((btn) => (btn.disabled = true));
  submitBtn.disabled = true;

  console.log(`${chooser.line}`, values, "=>", score);
});

replayBtn.addEventListener("click", () => newGame());

function setControlsEnabled(enabled) {
  lineButtons.forEach((btn) => (btn.disabled = !enabled));
  submitBtn.disabled = !enabled;
}

function newGame() {
  tries = START_TRIES;
  triesEl.innerText = tries;
  scoreEl.textContent = "0";
  chooser.submitted = false;

  tiles.length = 0;
  grid.innerHTML = "";

  buildTiles();
  getTwo();

  setControlsEnabled(true);
  selectLine(chooser.line);
}

buildTiles();
getTwo();
selectLine(chooser.line);
