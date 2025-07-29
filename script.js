const board = document.getElementById("board");
const blockOptions = document.getElementById("block-options");

// Tạo lưới 8x8
for (let i = 0; i < 64; i++) {
  const cell = document.createElement("div");
  cell.dataset.index = i;
  board.appendChild(cell);
}

// Một vài khối mẫu (dạng ma trận 3x3)
const blocks = [
  // Khối vuông 2x2
  [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ],
  // Khối ngang 1x3
  [
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  // Khối dọc 3x1
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
];

// Vẽ các khối để người chơi chọn
function drawBlockOptions() {
  blockOptions.innerHTML = "";
  blocks.forEach((blockMatrix, i) => {
    const block = document.createElement("div");
    block.classList.add("block");
    block.dataset.blockId = i;

    blockMatrix.flat().forEach(value => {
      const cell = document.createElement("div");
      if (value) cell.classList.add("filled");
      block.appendChild(cell);
    });

    blockOptions.appendChild(block);
  });
}

drawBlockOptions();
