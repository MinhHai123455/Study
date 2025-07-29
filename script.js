const grid = document.querySelector('.grid');
for (let i = 0; i < 200; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  grid.appendChild(cell);
}
function startGame(){
    alert("Game Started!");
}