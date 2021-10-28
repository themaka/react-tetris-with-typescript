import { STAGE_WIDTH } from "../setup";
import { isColliding, randomTetromino } from "../gameHelpers";
import {STAGE} from '../components/Stage/Stage'
import { useCallback, useState } from "react";

export type player = {
    pos: {
        x: number
        y: number
    }
    tetromino: (string | number)[][]
    collided: boolean

}

export const usePlayer = () => {
    const [player, setPlayer] = useState({} as player)

    const rotate = (matrix: player['tetromino']) => {
        //Convert rows to columns (transpose)
        const mtrx = matrix.map((_,i) => matrix.map(column => column[i]))
        //Reverse each row to get a rotated matrix
        return mtrx.map(row => row.reverse())
    }

    const playerRotate = (stage: STAGE): void => {
        const clonedPlayer = JSON.parse(JSON.stringify(player))
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino)

        // prevent player from rotating into the walls or other tetriminos
        const posX = clonedPlayer.pos.x
        let offset = 1

        while(isColliding(clonedPlayer, stage, {x: 0, y:0})) {
            clonedPlayer.pos.x += offset
            offset = -(offset +(offset > 0 ? 1 : -1))

            if(offset > clonedPlayer.tetromino[0].legth) {
                clonedPlayer.pos.x = posX
            }
        }

        setPlayer(clonedPlayer)
    }


    const updatePlayerPos = 
    ({ x, y, collided }: { x: number; y: number; collided: boolean }): void => {
        setPlayer(prev => ({
          ...prev,
          pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
          collided
        }));
      };
        

    const resetPlayer = useCallback(
        (): void => 
        setPlayer({
            pos: {x: STAGE_WIDTH / 2 - 2, y: 0},
            tetromino: randomTetromino().shape,
            collided: false,
        }),[]
    )
    return {player, updatePlayerPos, resetPlayer, playerRotate}
}