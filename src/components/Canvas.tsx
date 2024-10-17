import Color from "color";
import { batch, createSignal, createUniqueId, onMount } from "solid-js";
import { throttle } from "throttle-debounce";

const CANVAS_SIZE = 898;
const GAP_SIZE = 2;
const NUM_CELLS = 15;
const CELL_SIZE = Math.floor(
  (CANVAS_SIZE - (NUM_CELLS - 1) * GAP_SIZE) / NUM_CELLS
);

const SQUARE_COLORS = {
  DEFAULT: "#fef1ba",
  TW: "#bc504d",
  DW: "#b8cce4",
  TL: "#548dd1",
  DL: "#b7cbe3",
} as const;

const SQUARE_COLORS_HOVER = {
  DEFAULT: Color(SQUARE_COLORS.DEFAULT).darken(0.5).hex(),
  TW: Color(SQUARE_COLORS.TW).darken(0.5).hex(),
  DW: Color(SQUARE_COLORS.DW).darken(0.5).hex(),
  TL: Color(SQUARE_COLORS.TL).darken(0.5).hex(),
  DL: Color(SQUARE_COLORS.DL).darken(0.5).hex(),
};

type SquareType = keyof typeof SQUARE_COLORS;

const SPECIAL_SQUARES: Record<
  Exclude<SquareType, "DEFAULT">,
  [number, number][]
> = {
  TW: [
    [0, 0],
    [0, 7],
    [0, 14],
    [7, 0],
    [7, 14],
    [14, 0],
    [14, 7],
    [14, 14],
  ],
  DW: [
    [1, 1],
    [1, 13],
    [2, 2],
    [2, 12],
    [3, 3],
    [3, 11],
    [4, 4],
    [4, 10],
    [7, 7],
    [10, 4],
    [10, 10],
    [11, 3],
    [11, 11],
    [12, 2],
    [12, 12],
    [13, 1],
    [13, 13],
  ],
  TL: [
    [1, 5],
    [1, 9],
    [5, 1],
    [5, 5],
    [5, 9],
    [5, 13],
    [9, 1],
    [9, 5],
    [9, 9],
    [9, 13],
    [13, 5],
    [13, 9],
  ],
  DL: [
    [0, 3],
    [0, 11],
    [2, 6],
    [2, 8],
    [3, 0],
    [3, 7],
    [3, 14],
    [6, 2],
    [6, 6],
    [6, 8],
    [6, 12],
    [7, 3],
    [7, 11],
    [8, 2],
    [8, 6],
    [8, 8],
    [8, 12],
    [11, 0],
    [11, 7],
    [11, 14],
    [12, 6],
    [12, 8],
    [14, 3],
    [14, 11],
  ],
};

function generateBoard() {
  // Pre-compute the board layout
  const BOARD_LAYOUT = Array(NUM_CELLS)
    .fill(null)
    .map(() => Array(NUM_CELLS).fill("DEFAULT"));

  Object.entries(SPECIAL_SQUARES).forEach(([type, coords]) => {
    coords.forEach(([x, y]) => {
      BOARD_LAYOUT[y][x] = type;
    });
  });

  return BOARD_LAYOUT;
}

function drawBoard(
  ctx: CanvasRenderingContext2D,
  mouseX: undefined | number,
  mouseY: undefined | number
) {
  console.log(mouseX, mouseY);
  const board = generateBoard();
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (let y = 0; y < NUM_CELLS; y++) {
    for (let x = 0; x < NUM_CELLS; x++) {
      const squareType = board[y][x] as SquareType;
      const xPos = (CELL_SIZE + GAP_SIZE) * x;
      const yPos = (CELL_SIZE + GAP_SIZE) * y;

      const cellBackgroundColor =
        mouseX &&
        mouseY &&
        mouseX >= xPos &&
        mouseY >= yPos &&
        mouseX <= xPos + CELL_SIZE &&
        mouseY <= yPos + CELL_SIZE
          ? SQUARE_COLORS_HOVER[squareType]
          : SQUARE_COLORS[squareType];
      ctx.fillStyle = cellBackgroundColor;

      ctx.beginPath();
      ctx.roundRect(xPos, yPos, CELL_SIZE, CELL_SIZE, [5]);
      ctx.fill();

      if (squareType !== "DEFAULT") {
        ctx.font = "12px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = Color(cellBackgroundColor).isDark()
          ? Color("white").hex()
          : Color("black").hex();
        ctx.fillText(squareType, xPos + CELL_SIZE / 2, yPos + CELL_SIZE / 2);
      }
    }
  }
}

export default function Canvas() {
  const id = createUniqueId();

  onMount(() => {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (canvas) {
      // canvas. = (e) => throttledMouseCoordinates(canvas, e);
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        requestAnimationFrame(() => {
          drawBoard(ctx, undefined, undefined);
        });
        document.onmousemove = (e) => {
          const rect = ctx.canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          requestAnimationFrame(() => {
            drawBoard(ctx, x, y);
          });
        };
      }
    }
  });

  return <canvas id={id} style={{ cursor: 'pointer' }}></canvas>;
}
