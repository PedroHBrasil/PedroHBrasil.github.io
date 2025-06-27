function initBuffers(gl, gridParameters) {
  const positionBuffer = initPositionBuffer(gl, gridParameters);

  return {
    position: positionBuffer,
  };
}

function initPositionBuffer(gl, gridParameters) {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cells.
  // const positions = [
  //   0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2,
  //   0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.2, 0.2, 0.2,
  // ];
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

  console.log(positions);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

export { initBuffers };
