function initBuffers(gl, gameOfLife, deltaTimeRatio) {
  const positionBuffer = initPositionBuffer(gl, gameOfLife);
  const colorBuffer = initColorBuffer(gl, gameOfLife, deltaTimeRatio);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

function initPositionBuffer(gl, gameOfLife) {
  // Create a buffer for the cells's positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(gameOfLife.vertices),
    gl.STATIC_DRAW,
  );

  return positionBuffer;
}

function initColorBuffer(gl, gameOfLife, deltaTimeRatio) {
  // Create a buffer for the square's positions.
  const colorBuffer = gl.createBuffer();

  // Select the colorBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // Determine colors
  // console.log(`deltaTimeRatio: ${deltaTimeRatio}`);
  const aliveColor = [0.2, 0.2, 0.2, 1.0];
  const deadColor = [0.1, 0.1, 0.1, 1.0];
  const aliveToDeadColor = [
    aliveColor[0] + (deadColor[0] - aliveColor[0]) * deltaTimeRatio,
    aliveColor[1] + (deadColor[1] - aliveColor[1]) * deltaTimeRatio,
    aliveColor[2] + (deadColor[2] - aliveColor[2]) * deltaTimeRatio,
    aliveColor[3] + (deadColor[3] - aliveColor[3]) * deltaTimeRatio,
  ];
  const deadToAliveColor = [
    deadColor[0] + (aliveColor[0] - deadColor[0]) * deltaTimeRatio,
    deadColor[1] + (aliveColor[1] - deadColor[1]) * deltaTimeRatio,
    deadColor[2] + (aliveColor[2] - deadColor[2]) * deltaTimeRatio,
    deadColor[3] + (aliveColor[3] - deadColor[3]) * deltaTimeRatio,
  ];

  // Now create an array of colors for the cells.
  const colors = [];
  for (let i = 0; i < gameOfLife.numCellsX; i++) {
    for (let j = 0; j < gameOfLife.numCellsY; j++) {
      const wasAlive = gameOfLife.cellsMatrix[i][j].wasAlive;
      const isAlive = gameOfLife.cellsMatrix[i][j].isAlive;
      let color = [];
      if (isAlive == 1 && wasAlive == 1) {
        color = aliveColor;
      } else if (isAlive == 1 && wasAlive == 0) {
        color = deadToAliveColor;
      } else if (isAlive == 0 && wasAlive == 1) {
        color = aliveToDeadColor;
      } else if (isAlive == 0 && wasAlive == 0) {
        color = deadColor;
      }
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
