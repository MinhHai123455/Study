const board = document.getElementById("board");
const blockOptions = document.getElementById("block-options");

let selectedBlock = null;
const gridSize = 8;
let grid = new Array(gridSize * gridSize).fill(0);
let score = 0;
let isGameOver = false;

const blockTemplates = [
  [[1, 1, 0],[1, 1, 0],[0, 0, 0]],
  [[1, 1, 1],[0, 0, 0],[0, 0, 0]],
  [[1, 0, 0],[1, 0, 0],[1, 0, 0]],
  [[0, 1, 0],[1, 1, 1],[0, 0, 0]],
  [[1, 1, 1],[1, 0, 0],[0, 0, 0]],
  [[0, 1, 1],[1, 1, 0],[0, 0, 0]],
];

let blocks = [];

function renderBoard() {
  board.innerHTML = "";
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.dataset.index = i;
    cell.classList.add("cell");
    if (grid[i] === 1) cell.classList.add("filled");
    cell.addEventListener("click", () => handleBoardClick(i));
    board.appendChild(cell);
  }
}

function drawBlockOptions() {
  blockOptions.innerHTML = "";
  blocks.forEach((blockMatrix, i) => {
    const block = document.createElement("div");
    block.classList.add("block");
    block.dataset.blockId = i;
    if (selectedBlock === i) block.classList.add("selected");

    block.style.display = "grid";
    block.style.gridTemplateColumns = `repeat(3, 1fr)`;

    blockMatrix.flat().forEach(value => {
      const cell = document.createElement("div");
      cell.classList.add("block-cell");
      if (value === 1) cell.classList.add("filled");
      else cell.style.visibility = "hidden";
      block.appendChild(cell);
    });

    block.addEventListener("click", () => {
      selectedBlock = i;
      drawBlockOptions();
    });

    blockOptions.appendChild(block);
  });
}

function generateRandomBlocks() {
  blocks.length = 0;
  for (let i = 0; i < 3; i++) {
    const randIndex = Math.floor(Math.random() * blockTemplates.length);
    const clone = blockTemplates[randIndex].map(row => [...row]);
    blocks.push(clone);
  }
}

function handleBoardClick(index) {
  if (selectedBlock === null) return;

  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  const block = blocks[selectedBlock];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (block[i][j] === 0) continue;
      const r = row + i;
      const c = col + j;
      if (r >= gridSize || c >= gridSize) return;
      if (grid[r * gridSize + c] === 1) return;
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (block[i][j] === 0) continue;
      const r = row + i;
      const c = col + j;
      grid[r * gridSize + c] = 1;
    }
  }

  clearFullLines();
  updateScoreDisplay();
  blocks.splice(selectedBlock, 1);
  selectedBlock = null;

  if (blocks.length === 0) generateRandomBlocks();

  renderBoard();
  drawBlockOptions();

  if (!canPlaceAnyBlock()) {
    isGameOver = true;
    setTimeout(() => {
      document.getElementById("game-over").style.display = "block";
    }, 100);
  }
}

function canPlaceAnyBlock() {
  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    for (let r = 0; r <= gridSize - 3; r++) {
      for (let c = 0; c <= gridSize - 3; c++) {
        if (canPlaceBlockAt(block, r, c)) return true;
      }
    }
  }
  return false;
}

function canPlaceBlockAt(block, row, col) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (block[i][j] === 0) continue;
      const r = row + i;
      const c = col + j;
      if (r >= gridSize || c >= gridSize) return false;
      if (grid[r * gridSize + c] === 1) return false;
    }
  }
  return true;
}

function clearFullLines() {
  let rowsToClear = [];
  let colsToClear = [];

  for (let r = 0; r < gridSize; r++) {
    if (grid.slice(r * gridSize, (r + 1) * gridSize).every(cell => cell === 1)) rowsToClear.push(r);
  }

  for (let c = 0; c < gridSize; c++) {
    let full = true;
    for (let r = 0; r < gridSize; r++) {
      if (grid[r * gridSize + c] === 0) {
        full = false;
        break;
      }
    }
    if (full) colsToClear.push(c);
  }

  rowsToClear.forEach(r => {
    for (let c = 0; c < gridSize; c++) {
      board.children[r * gridSize + c].classList.add("highlight");
    }
  });

  colsToClear.forEach(c => {
    for (let r = 0; r < gridSize; r++) {
      board.children[r * gridSize + c].classList.add("highlight");
    }
  });

  if (rowsToClear.length || colsToClear.length) {
    setTimeout(() => {
      rowsToClear.forEach(r => {
        for (let c = 0; c < gridSize; c++) grid[r * gridSize + c] = 0;
      });
      colsToClear.forEach(c => {
        for (let r = 0; r < gridSize; r++) grid[r * gridSize + c] = 0;
      });
      score += (rowsToClear.length + colsToClear.length) * 10;
      renderBoard();
      updateScoreDisplay();
    }, 400);
  }
}

function restartGame() {
  grid = new Array(gridSize * gridSize).fill(0);
  score = 0;
  isGameOver = false;
  document.getElementById("game-over").style.display = "none";
  generateRandomBlocks();
  renderBoard();
  drawBlockOptions();
  updateScoreDisplay();
}

function updateScoreDisplay() {
  document.getElementById("score").textContent = score;
}

generateRandomBlocks();
renderBoard();
drawBlockOptions();
updateScoreDisplay();
