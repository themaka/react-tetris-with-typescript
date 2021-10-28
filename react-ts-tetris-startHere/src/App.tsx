import React, { useRef, useState } from "react";
import { createStage, isColliding } from "./gameHelpers";

// Hooks
import { useInterval } from "./hooks/useInterval";
import { usePlayer } from "./hooks/usePlayer";
import { useStage } from "./hooks/useStage";

// Components
import Stage from "./components/Stage/Stage";
import Display from "./components/Display/Display";
import StartButton from "./components/StartButton/StartButton";

// Styles
import { StyledTetrisWrapper, StyledTetris } from "./App.styles";

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<null | number>(null);
  const [gameOver, setGameOver] = useState(true);

  const gameArea = useRef<HTMLDivElement>(null);

  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { stage, setStage } = useStage(player, resetPlayer);

  const movePlayer = (dir: number) => {
    if (!isColliding(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }): void => {
    // Change the dropdown speed when user releases downarrow
    if (keyCode === 40) {
      setDropTime(1000);
    }
  };

  const move = ({
    keyCode,
    repeat,
  }: {
    keyCode: number;
    repeat: boolean;
  }): void => {
    console.log(keyCode);
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        //just call this once
        if (repeat) return;
        setDropTime(30);
      } else if (keyCode === 38) {
        playerRotate(stage)
      }
    }
  };

  const handleStartGame = (): void => {
    // Need to focus the window with the key events on start
    if (gameArea.current) gameArea.current.focus();
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
  };

  const drop = (): void => {
    if (!isColliding(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // game over!
      if (player.pos.y < 1) {
        console.log("Game over!");
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({x: 0, y: 0, collided: true})
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex={0}
      onKeyDown={(e) => move(e)}
      onKeyUp={keyUp}
      ref={gameArea}
    >
      <StyledTetris>
        <div className="display">
          {gameOver ? (
            <>
              <Display gameOver={gameOver} text="Game Over!" />
              <StartButton callback={handleStartGame} />
            </>
          ) : (
            <>
              <Display text={`Score: `} />
              <Display text={`Rows: `} />
              <Display text={`Level: `} />
            </>
          )}
        </div>
        <Stage stage={stage} />
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default App;
