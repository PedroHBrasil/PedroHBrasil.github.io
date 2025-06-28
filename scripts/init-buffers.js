function initBuffers(gl, gridParameters, isAliveMatrix) {
  const positionBuffer = initPositionBuffer(gl, gridParameters);
  const colorBuffer = initColorBuffer(gl, gridParameters, isAliveMatrix);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

function initPositionBuffer(gl, gridParameters) {
  // Create a buffer for the cells's positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cells.
  const positions = [];
  for (let i = 0; i < gridParameters.numCellsX; i++) {
    const x0 =
      gridParameters.lineThickness +
      i * (gridParameters.cellWidth + gridParameters.lineThickness);
    const x1 =
      (i + 1) * (gridParameters.cellWidth + gridParameters.lineThickness);
    for (let j = 0; j < gridParameters.numCellsY; j++) {
      const y0 =
        gridParameters.lineThickness +
        j * (gridParameters.cellHeight + gridParameters.lineThickness);
      const y1 =
        (j + 1) * (gridParameters.cellHeight + gridParameters.lineThickness);
      positions.push(x0, y0, x0, y1, x1, y1, x1, y1, x1, y0, x0, y0);
    }
  }

  // console.log(positions);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initColorBuffer(gl, gridParameters, isAliveMatrix) {
  // Create a buffer for the square's positions.
  const colorBuffer = gl.createBuffer();

  // Select the colorBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // Now create an array of positions for the cells.
  const aliveColor = [0.15, 0.15, 0.15, 1.0];
  const deadColor = [0.1, 0.1, 0.1, 1.0];
  const colors = [];
  for (let i = 0; i < gridParameters.numCellsX; i++) {
    for (let j = 0; j < gridParameters.numCellsY; j++) {
      const isAlive = isAliveMatrix[i][j];
      const color = isAlive == 1 ? aliveColor : deadColor;
      for (let k = 0; k < 6; k++) {
        colors.push(color[0], color[1], color[2], color[3]);
      }
    }
  }

  // console.log(positions);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}

export { initBuffers };
