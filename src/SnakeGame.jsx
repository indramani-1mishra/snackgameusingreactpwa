import React, { useEffect, useRef, useState } from "react";
import "./snack.css";

const SnakeGame = () => {
  const boardRef = useRef(null);
  const scoreRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    let inputdir = { x: 0, y: 0 };
    let speed = 4;
    let lastPantTime = 0;
    let snackarr = [{ x: 6, y: 7 }];
    let score = 0;
    let food = { x: 13, y: 15 };
    const scoreElement = scoreRef.current;

    function main(ctime) {
      window.requestAnimationFrame(main);
      if ((ctime - lastPantTime) / 1000 < 1 / speed) return;
      lastPantTime = ctime;
      gameengine();
    }

    function iscolide(array) {
      for (let i = 1; i < array.length; i++) {
        if (array[i].x === array[0].x && array[i].y === array[0].y) {
          return true;
        }
      }
      if (
        array[0].x >= 18 ||
        array[0].y >= 18 ||
        array[0].x <= 0 ||
        array[0].y <= 0
      ) {
        return true;
      }
    }

    function gameengine() {
      const board = boardRef.current;

      if (iscolide(snackarr)) {
        inputdir = { x: 0, y: 0 };
        alert("Game Over! Press any key to play again. Your score is: " + score);
        snackarr = [{ x: 6, y: 7 }];
        removescore();
      }

      for (let i = snackarr.length - 2; i >= 0; i--) {
        snackarr[i + 1] = { ...snackarr[i] };
      }

      snackarr[0].x += inputdir.x;
      snackarr[0].y += inputdir.y;

      // Snake eats food
      if (snackarr[0].y === food.y && snackarr[0].x === food.x) {
        addscore();
        snackarr.unshift({
          x: snackarr[0].x + inputdir.x,
          y: snackarr[0].y + inputdir.y,
        });
        let a = 2;
        let b = 16;
        food = {
          x: Math.round(a + (b - a) * Math.random()),
          y: Math.round(a + (b - a) * Math.random()),
        };
      }

      board.innerHTML = "";

      // Draw snake
      snackarr.forEach((object, index) => {
        const newSnackElement = document.createElement("div");
        newSnackElement.style.gridRowStart = object.x;
        newSnackElement.style.gridColumnStart = object.y;
        if (index === 0) newSnackElement.classList.add("snackhead");
        else newSnackElement.classList.add("snackbody");
        board.appendChild(newSnackElement);
      });

      // Draw food
      const newfoodElement = document.createElement("div");
      newfoodElement.style.gridRowStart = food.x;
      newfoodElement.style.gridColumnStart = food.y;
      newfoodElement.classList.add("food");
      board.appendChild(newfoodElement);
    }

    window.requestAnimationFrame(main);

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          inputdir = { x: -1, y: 0 };
          break;
        case "ArrowDown":
          inputdir = { x: 1, y: 0 };
          break;
        case "ArrowLeft":
          inputdir = { x: 0, y: -1 };
          break;
        case "ArrowRight":
          inputdir = { x: 0, y: 1 };
          break;
        default:
          break;
      }
    });

    function addscore() {
      score++;
      scoreElement.textContent = "Score: " + score;
    }

    function removescore() {
      score = 0;
      scoreElement.textContent = "";
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile button control
  const handleDirection = (dir) => {
    switch (dir) {
      case "up":
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
        break;
      case "down":
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        break;
      case "left":
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
        break;
      case "right":
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="body">
      <div className="border" ref={boardRef}></div>
      <div className="score" ref={scoreRef}></div>

      {/* Show buttons only on mobile */}
      {isMobile && (
        <div className="mobile-controls">
          <div className="control-row">
            <button className="btn up" onClick={() => handleDirection("up")}>⬆️</button>
          </div>
          <div className="control-row">
            <button className="btn left" onClick={() => handleDirection("left")}>⬅️</button>
            <button className="btn down" onClick={() => handleDirection("down")}>⬇️</button>
            <button className="btn right" onClick={() => handleDirection("right")}>➡️</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
