import { createStage } from "../gameHelpers";
import type { player } from './usePlayer'
import type {STAGECELL, STAGE} from '../components/Stage/Stage'
import { useEffect, useState } from "react";

export const useStage = (player: player, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage())

  useEffect(() => {
    if(player.pos) return

    const updateStage = (prevStage: STAGE): STAGE => {
      // First flush the stage
      // If it says "clear" but doesn't have a 0 - it means that it's the players move and should be cleared.      
      const newStage = prevStage.map(
        row => row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)) as STAGECELL[]
      )
      player.tetromino.forEach((row,y) => {
        row.forEach((value, x) => {
          if(value !== 0 ) {
            newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? "merged" : "clear"}`]
          }
        })
      })
      return newStage
      }

      setStage(prev => updateStage(prev))

  },[player.collided, player.pos?.x, player.pos?.y, player.tetromino])
}