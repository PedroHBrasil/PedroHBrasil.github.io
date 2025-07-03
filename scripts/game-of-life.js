export class GameOfLife {
  numCellsX;
  numCellsY;
  cellWidth;
  cellHeight;
  lineThickness;
  cellsMatrix;
  vertices;
  vertexCount;
  aliveColor;
  deadColor;
  aliveToDeadColor;
  deadToAliveColor;

  constructor(
    width,
    height,
    numCellsMainAxis,
    gridLineThickness,
    aliveColor,
    deadColor,
  ) {
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
    this.calcGridParameters(width, height, numCellsMainAxis, gridLineThickness);
    this.vertexCount = this.numCellsX * this.numCellsY * 6;
    this.initCellsMatrix();
    this.initVertices();
  }

  calcGridParameters(width, height, numCellsMainAxis, gridLineThickness) {
    this.lineThickness = gridLineThickness;

    this.numCellsX = 0;
    this.numCellsY = 0;
    if (width > height) {
      const aspectRatio = width / height;
      this.numCellsX = Math.round(numCellsMainAxis * aspectRatio);
      this.numCellsY = numCellsMainAxis;
    } else {
      const aspectRatio = height / width;
      this.numCellsX = numCellsMainAxis;
      this.numCellsY = Math.round(numCellsMainAxis * aspectRatio);
    }

    this.cellHeight =
      (height - gridLineThickness) / this.numCellsY - gridLineThickness;
    this.cellWidth =
      (width - gridLineThickness) / this.numCellsX - gridLineThickness;
  }

  initCellsMatrix() {
    this.cellsMatrix = [];
    for (let i = 0; i < this.numCellsX; i++) {
      const cellsRow = [];
      for (let j = 0; j < this.numCellsY; j++) {
        const isAlive = Math.round(Math.random());
        const cell = new Cell(i, j, isAlive, 0);
        cellsRow.push(cell);
      }
      this.cellsMatrix.push(cellsRow);
    }
  }

  initVertices() {
    this.vertices = [];
    for (let i = 0; i < this.numCellsX; i++) {
      const x0 = this.lineThickness + i * (this.cellWidth + this.lineThickness);
      const x1 = (i + 1) * (this.cellWidth + this.lineThickness);
      for (let j = 0; j < this.numCellsY; j++) {
        const y0 =
          this.lineThickness + j * (this.cellHeight + this.lineThickness);
        const y1 = (j + 1) * (this.cellHeight + this.lineThickness);
        this.vertices.push(x0, y0, x0, y1, x1, y1, x1, y1, x1, y0, x0, y0);
      }
    }
  }

  updateCellsMatrix() {
    for (let i = 0; i < this.numCellsX; i++) {
      for (let j = 0; j < this.numCellsY; j++) {
        this.cellsMatrix[i][j].updateWasAlive();
      }
    }
    for (let i = 0; i < this.numCellsX; i++) {
      for (let j = 0; j < this.numCellsY; j++) {
        const count = this.countAliveNeighbors(i, j);
        this.cellsMatrix[i][j].updateIsAlive(count);
      }
    }
  }

  countAliveNeighbors(i, j) {
    const neighbors = this.cellsMatrix[i][j].getNeighbors(
      i,
      j,
      this.numCellsX,
      this.numCellsY,
    );

    let count = 0;
    for (const neighbor of neighbors) {
      const i = neighbor[0];
      const j = neighbor[1];
      count += this.cellsMatrix[i][j].wasAlive;
    }

    return count;
  }
}

class Cell {
  isAlive;
  wasAlive;

  constructor(i, j, isAlive, wasAlive) {
    this.isAlive = isAlive;
    this.wasAlive = wasAlive;
  }

  updateWasAlive() {
    this.wasAlive = this.isAlive;
  }

  updateIsAlive(numAliveNeighbors) {
    if (numAliveNeighbors == 3) {
      this.isAlive = 1;
    } else if (numAliveNeighbors == 2) {
      this.isAlive = this.wasAlive;
    } else {
      this.isAlive = 0;
    }
  }

  getNeighbors(i, j, numCellsX, numCellsY) {
    if (i > 0 && j > 0 && i < numCellsX - 1 && j < numCellsY - 1) {
      return [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
    } else if (i == 0 && j == 0) {
      return [
        [numCellsX - 1, numCellsY - 1],
        [numCellsX - 1, j],
        [numCellsX - 1, j + 1],
        [i, numCellsY - 1],
        [i, j + 1],
        [i + 1, numCellsY - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
    } else if (i == numCellsX - 1 && j == 0) {
      return [
        [i - 1, numCellsY - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, numCellsY - 1],
        [i, j + 1],
        [0, numCellsY - 1],
        [0, j],
        [0, j + 1],
      ];
    } else if (i == 0 && j == numCellsY - 1) {
      return [
        [numCellsX - 1, j - 1],
        [numCellsX - 1, j],
        [numCellsX - 1, 0],
        [i, j - 1],
        [i, 0],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, 0],
      ];
    } else if (i == numCellsX - 1 && j == numCellsY - 1) {
      return [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, 0],
        [i, j - 1],
        [i, 0],
        [0, j - 1],
        [0, j],
        [0, 0],
      ];
    } else if (i == 0) {
      return [
        [numCellsX - 1, j - 1],
        [numCellsX - 1, j],
        [numCellsX - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
    } else if (i == numCellsX - 1) {
      return [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
        [0, j - 1],
        [0, j],
        [0, j + 1],
      ];
    } else if (j == 0) {
      return [
        [i - 1, numCellsY - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, numCellsY - 1],
        [i, j + 1],
        [i + 1, numCellsY - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
    } else if (j == numCellsY - 1) {
      return [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, 0],
        [i, j - 1],
        [i, 0],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, 0],
      ];
    }
  }
}
