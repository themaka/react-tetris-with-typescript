import { STAGE_WIDTH } from "../setup";
import { randomTetromino } from "../gameHelpers";
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

    const updatePlayerPos = 
    ({x, y, collided}: {x: number, y: number, collided: boolean}): void => (
        setPlayer(prev => (
            {
               ...prev,
               pos: {x: prev.pos.x += x, y: prev.pos.y += y}, collided 
            }
        ))
    )

    const resetPlayer = useCallback(
        (): void => 
        setPlayer({
            pos: {x: STAGE_WIDTH / 2 - 2, y: 0},
            tetromino: randomTetromino().shape,
            collided: false,
        }),[]
    )
    return {player, updatePlayerPos, resetPlayer}
}