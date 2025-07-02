import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { GameOfLife } from "./game-of-life.js";

// Vertex shader program
const vsSource = `#version 300 es
    in vec2 a_position;
    in vec4 a_color;

    uniform vec2 u_resolution;

    out vec4 v_color;

    void main(void) {
      // convert the position from pixels to 0.0 to 1.0
      vec2 zeroToOne = a_position / u_resolution;

      // convert from 0->1 to 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;

      // convert from 0->2 to -1->+1 (clip space)
      vec2 clipSpace = zeroToTwo - 1.0;

      gl_Position = vec4(clipSpace, 0, 1);
      v_color = a_color;
    }
  `;

// Fragment shader program
const fsSource = `#version 300 es
    precision highp float;

    in vec4 v_color;
    out vec4 out_color;

    void main() {
      out_color = v_color;
    }
  `;

let animationId = null;

main();

window.addEventListener(
  "resize",
  function (_) {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    main();
  },
  true,
);

function main() {
  const canvas = document.querySelector("#gl-canvas");

  // Fits canvas size to window
  const window = document.defaultView;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  // Initialize the GL context
  const gl = canvas.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL2. Your browser or machine may not support it.",
    );
    return;
  }

  // Initialize a shader program; is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
      vertexColor: gl.getAttribLocation(shaderProgram, "a_color"),
    },
    uniformLocations: {
      resolution: gl.getUniformLocation(shaderProgram, "u_resolution"),
    },
  };

  // Calculates grid parameters
  const numCells = 50;
  const gridLineThickness = 1;
  let gameOfLife = new GameOfLife(width, height, numCells, gridLineThickness);

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  let buffers = initBuffers(gl, gameOfLife);

  let counter = 30;
  function render() {
    if (counter >= 45) {
      // Draw the scene
      drawScene(gl, programInfo, buffers, gameOfLife);

      gameOfLife.updateIsAliveMatrix();
      buffers = initBuffers(gl, gameOfLife);
      counter = 0;
    }

    counter += 1;
    animationId = requestAnimationFrame(render);
  }
  animationId = requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram,
      )}`,
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
