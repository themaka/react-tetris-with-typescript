import { player } from './hooks/usePlayer';
import type {STAGECELL, STAGE} from './components/Stage/Stage'
import { STAGE_WIDTH, STAGE_HEIGHT } from './setup';
import { TETROMINOS } from './setup';

export const createStage = () => Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, 'clear']));

export const randomTetromino = () => {
  const tetrominos = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as (keyof typeof TETROMINOS)[];
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

export const isColliding = ( 
  player: player,
  stage: STAGE,
  { x: moveX, y: moveY }: {x: number, y: number}
  ) => {

    const newY = player.pos.y + moveY
    const newX = player.pos.y + moveX
    // using for loops to be able to return (and break). Not possible with forEach.
    for(let y = 0; y < player.tetromino.length; y++) {
      for(let x = 0; x < player.tetromino[y].length; x++) {
        // 1. Check that we're on actual Tetromino cell
        if(player.tetromino[y][x] !== 0) {
          if(
            // 2. Check that move is inside game area's height 
            !stage[y + player.pos.y + moveY] || 
            // 3. Check it's within the left and right grid borders
            !stage[y+player.pos.y + moveY][x+player.pos.x + moveX] ||
            // Check that the cell we're moving into isn't clear
            stage[y+player.pos.y + moveY][x+player.pos.x + moveX][1] !== "clear"
            ) {
              return true
          }
        }
      }
    }
    // if everything in the loops is false, return false
    return false
  }