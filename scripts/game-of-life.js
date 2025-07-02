export class GameOfLife {
  numCellsX;
  numCellsY;
  cellWidth;
  cellHeight;
  lineThickness;
  isAliveMatrix;
  wasAliveMatrix;
  vertexCount;

  constructor(width, height, numCellsMainAxis, gridLineThickness) {
    this.calcGridParameters(width, height, numCellsMainAxis, gridLineThickness);
    this.vertexCount = this.numCellsX * this.numCellsY * 6;
    this.initIsAliveMatrix();
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

  initIsAliveMatrix() {
    this.isAliveMatrix = [];
    this.wasAliveMatrix = [];
    for (let i = 0; i < this.numCellsX; i++) {
      const isAliveRow = [];
      for (let j = 0; j < this.numCellsY; j++) {
        const isAlive = Math.round(Math.random());
        isAliveRow.push(isAlive);
      }
      this.isAliveMatrix.push(isAliveRow);
      this.wasAliveMatrix.push(Array.from(isAliveRow));
    }
  }

  updateIsAliveMatrix() {
    for (let i = 0; i < this.numCellsX; i++) {
      for (let j = 0; j < this.numCellsY; j++) {
        const isAlive = this.shouldLive(i, j);
        this.isAliveMatrix[i][j] = isAlive;
      }
    }
    for (let i = 0; i < this.numCellsX; i++) {
      for (let j = 0; j < this.numCellsY; j++) {
        this.wasAliveMatrix[i][j] = this.isAliveMatrix[i][j];
      }
    }
  }

  shouldLive(i, j) {
    const neighbors = this.getCellNeighbors(i, j);
    const numAliveNeighbors = this.countAliveNeighbors(neighbors);
    if (numAliveNeighbors == 3) {
      return 1;
    } else if (numAliveNeighbors == 2) {
      return this.wasAliveMatrix[i][j];
    } else {
      return 0;
    }
  }

  getCellNeighbors(i, j) {
    if (i > 0 && j > 0 && i < this.numCellsX - 1 && j < this.numCellsY - 1) {
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
        [this.numCellsX - 1, this.numCellsY - 1],
        [this.numCellsX - 1, j],
        [this.numCellsX - 1, j + 1],
        [i, this.numCellsY - 1],
        [i, j + 1],
        [i + 1, this.numCellsY - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
    } else if (i == this.numCellsX - 1 && j == 0) {
      return [
        [i - 1, this.numCellsY - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, this.numCellsY - 1],
        [i, j + 1],
        [0, this.numCellsY - 1],
        [0, j],
        [0, j + 1],
      ];
    } else if (i == 0 && j == this.numCellsY - 1) {
      return [
        [this.numCellsX - 1, j - 1],
        [this.numCellsX - 1, j],
        [this.numCellsX - 1, 0],
        [i, j - 1],
        [i, 0],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, 0],
      ];
    } else if (i == this.numCellsX - 1 && j == this.numCellsY - 1) {
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
        [this.numCellsX - 1, j - 1],
        [this.numCellsX - 1, j],
        [this.numCellsX - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
    } else if (i == this.numCellsX - 1) {
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
        [i - 1, this.numCellsY - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, this.numCellsY - 1],
        [i, j + 1],
        [i + 1, this.numCellsY - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
    } else if (j == this.numCellsY - 1) {
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

  countAliveNeighbors(neighbors) {
    let count = 0;
    for (const neighbor of neighbors) {
      const i = neighbor[0];
      const j = neighbor[1];
      count += this.wasAliveMatrix[i][j];
    }

    return count;
  }
}
