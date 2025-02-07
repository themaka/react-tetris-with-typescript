import { createStage } from "../gameHelpers";
import type { player } from './usePlayer'
import type {STAGECELL, STAGE} from '../components/Stage/Stage'
import { useEffect, useState } from "react";
// export type STAGECELL = [string | number, string];
// export type STAGE = STAGECELL[][];

export const useStage = (player: player, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage())
  const [rowsCleared, setRowsCleared] = useState(0);


  useEffect(() => {
    if(!player.pos) return

    setRowsCleared(0);

    const sweepRows = (newStage: STAGE): STAGE => {
      return newStage.reduce((ack, row) => {
        // If we don't find a 0 it means that the row is full and should be cleared
        if (row.findIndex(cell => cell[0] === 0) === -1) {
          setRowsCleared(prev => prev + 1);
          // Create an empty row at the beginning of the array to push the Tetrominos down
          // instead of returning the cleared row
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear']) as STAGECELL[]);
          return ack;
        }

        ack.push(row);
        return ack;
      }, [] as STAGE);
    };


    const updateStage = (prevStage: STAGE): STAGE => {
      // First flush the stage
      // If it says "clear" but doesn't have a 0 - it means that it's the players move and should be cleared.   
      const newStage = prevStage.map(
        row => row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)) as STAGECELL[]

      )

      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? 'merged' : 'clear'}`]
          }
        })
      })

      if(player.collided) {
        resetPlayer()
        return sweepRows(newStage)
      }
      return newStage
      }

      setStage(prev => updateStage(prev))

  },[player.collided, player.pos?.x, player.pos?.y, player.tetromino])

  return {stage, setStage, rowsCleared}
}