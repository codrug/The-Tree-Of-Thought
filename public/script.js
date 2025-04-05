let tree = { root: [] };
let selectedWord = null;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas-holder');
  background(26, 26, 26);
}

function grow() {
  const input = document.getElementById('thought').value;
  fetch('/grow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  })
  .then(response => response.json())
  .then(data => {
    tree = data;
    redrawTree();
  });
}

function redrawTree() {
  background(26, 26, 26);
  stroke(212, 175, 55);
  strokeWeight(2);
  textFont('Times New Roman');
  textSize(16);

  const rootX = width / 2;
  const rootY = height - 50;
  tree.root.forEach((word, i) => {
    let x = rootX + (i - (tree.root.length - 1) / 2) * 100;
    fill(212, 175, 55, 200);
    ellipse(x, rootY, 20, 20);
    text(word, x, rootY + 30);
    drawBranches(word, x, rootY - 50, -PI / 4, 0);
  });
}

function drawBranches(word, x, y, angle, depth) {
  if (!tree[word] || depth > 1) return;
  tree[word].related.forEach((rel, i) => {
    let newX = x + cos(angle + i * PI / 6) * 100;
    let newY = y + sin(angle + i * PI / 6) * 100;
    line(x, y, newX, newY);
    ellipse(newX, newY, 15, 15);
    text(rel, newX, newY + 20);
    if (mouseX > newX - 10 && mouseX < newX + 10 && mouseY > newY - 10 && mouseY < newY + 10) {
      selectedWord = { word: rel, x: newX, y: newY, parent: word };
    }
  });
}

function mouseClicked() {
  if (selectedWord) {
    const info = document.getElementById('info');
    info.style.left = `${selectedWord.x + 20}px`;
    info.style.top = `${selectedWord.y}px`;
    info.style.display = 'block';
    info.innerHTML = `
      <strong>${selectedWord.word}</strong><br>
      ${tree[selectedWord.parent].meanings[0]}<br>
      <button onclick="expand('${selectedWord.word}')">Expand</button>
    `;
  }
}

function expand(word) {
  // Placeholder for expansion (synonyms, history)
  alert(`Expanding ${word}: Synonyms, history coming soon!`);
}

function draw() {
  selectedWord = null;
  redrawTree();
}