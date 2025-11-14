"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function getRandomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit))
  );
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(false);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        // shift rows down
        newGrid[2] = newGrid[1];
        newGrid[1] = newGrid[0];
        newGrid[0] = Array.from({ length: 3 }, getRandomFruit);
        return newGrid;
      });
      if (Date.now() - start >= 2000) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setSpinning(false);
        checkWin();
      }
    }, 100);
  };

  const checkWin = () => {
    const centerRow = grid[1];
    if (centerRow[0] === centerRow[1] && centerRow[1] === centerRow[2]) {
      setWin(true);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flatMap((row, rowIndex) =>
          row.map((fruit, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-16 h-16 flex items-center justify-center border rounded"
            >
              <img
                src={`/${fruit}.png`}
                alt={fruit}
                className="w-12 h-12"
              />
            </div>
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning} variant="primary">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-green-600 font-semibold">You win!</span>
          <Share text={`I just hit a jackpot on the slot machine mini app! ${url}`} />
        </div>
      )}
    </div>
  );
}
