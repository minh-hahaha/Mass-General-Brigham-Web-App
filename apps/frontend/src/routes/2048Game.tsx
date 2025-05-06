import {useEffect, useRef, useState} from "react";
import MGBButton from "@/elements/MGBButton.tsx";

let clearCheck = 2;

class Vector2 {
    posX: number;
    posY: number;
    constructor(posX: number, posY: number) {
        this.posX = posX;
        this.posY = posY;
    }
    set(posX: number, posY: number): void {
        this.posX = posX;
        this.posY = posY;
    }

    setX(posX: number): void {
        this.posX = posX;
    }

    setY(posY: number): void {
        this.posY = posY;
    }

    add(posX: number, posY: number): void {
        this.posX += posX;
        this.posY += posY;
    }
}

class Tile {
    position: Vector2;
    value: number;
    merged: boolean;
    constructor(position: Vector2, value: number) {
        this.position = position;
        this.value = value;
        this.merged = false;
    }

}


function moveTiles(gameBoard: (Tile | undefined)[][], direction: 'left' | 'right' | 'up' | 'down') {
    const isHorizontal = direction === 'left' || direction === 'right';
    const dir = direction === 'left' || direction === 'up' ? -1 : 1;

    const outerLimit = isHorizontal ? gameBoard.length : gameBoard[0].length;
    const innerLimit = isHorizontal ? gameBoard[0].length : gameBoard.length;

    const getTile = (x: number, y: number) => gameBoard[y]?.[x];
    const setTile = (x: number, y: number, tile: Tile | undefined) => {
        if (gameBoard[y]) gameBoard[y][x] = tile;
    };

    // Reset merge flags
    for (let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[y].length; x++) {
            const tile = gameBoard[y][x];
            if (tile) tile.merged = false;
        }
    }

    for (let outer = 0; outer < outerLimit; outer++) {
        const range = [...Array(innerLimit).keys()];
        if (dir === 1) range.reverse();

        for (const inner of range) {
            const x = isHorizontal ? inner : outer;
            const y = isHorizontal ? outer : inner;
            const tile = getTile(x, y);

            if (tile) {
                let posX = tile.position.posX;
                let posY = tile.position.posY;

                let nextX = posX + (isHorizontal ? dir : 0);
                let nextY = posY + (isHorizontal ? 0 : dir);

                let merged = false;

                while (
                    nextX >= 0 && nextX < gameBoard[0].length &&
                    nextY >= 0 && nextY < gameBoard.length
                    ) {
                    const nextTile = getTile(nextX, nextY);

                    if (!nextTile) {
                        tile.position.add(isHorizontal ? dir : 0, isHorizontal ? 0 : dir);
                        posX = tile.position.posX;
                        posY = tile.position.posY;
                        nextX = posX + (isHorizontal ? dir : 0);
                        nextY = posY + (isHorizontal ? 0 : dir);
                    } else if (
                        nextTile.value === tile.value &&
                        !nextTile.merged &&
                        !tile.merged
                    ) {
                        // Merge
                        nextTile.value *= 2;
                        nextTile.merged = true;
                        setTile(x, y, undefined); // Remove original tile from original position
                        setTile(tile.position.posX, tile.position.posY, undefined); // Remove it from wherever it was moved to
                        merged = true;
                        clearCheck = 2;
                        break;
                    } else {
                        break;
                    }
                }

                // If it moved and wasn't merged, update the grid position
                if (!merged && (tile.position.posX !== x || tile.position.posY !== y)) {
                    setTile(x, y, undefined);
                    setTile(tile.position.posX, tile.position.posY, tile);
                    clearCheck = 2;
                }
            }
        }
    }
    if(!isBoardFull(gameBoard)) {
        console.log("Hello")
        let posX = Math.floor(Math.random() * 4);
        let posY = Math.floor(Math.random() * 4);
        while (getTile(posX, posY)) {
            posX = Math.floor(Math.random() * 4);
            posY = Math.floor(Math.random() * 4);
        }
        const random = Math.floor(Math.random() * 10);
        let value = 2;
        if(random < 2){
            value = 4;
        }
        setTile(posX, posY, new Tile(new Vector2(posX, posY), value));
    }
}

function isBoardFull(gameBoard: (Tile | undefined)[][]){
    for(let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[y].length; x++) {
            if(!gameBoard[y][x]) {
                return false;
            }
        }
    }
    return true;
}

//                                  REMEMBER: [y][x]
const gameBoard: (Tile | undefined)[][] = Array.from({ length: 4 }, () =>
    Array(4).fill(undefined)
);

export default function Game2048() {
    const animationFrameId = useRef<number>(0);
    const deltaTime = useRef<number>(0);
    const bestScore = useRef<number>(0);
    const gameStartX = 50;
    const gameStartY = 150;
    const tileStartX = gameStartX + 10;
    const tileStartY = gameStartY + 10;
    const gameWidth = 500;
    const gameHeight = 500;
    const tileSize = gameWidth / 4;
    const [lose, setLose] = useState(false);

    function clearGameBoard() {
        for (let row = 0; row < gameBoard.length; row++) {
            for (let col = 0; col < gameBoard[row].length; col++) {
                gameBoard[row][col] = undefined;
            }
        }
    }

    if(!lose) {
        clearGameBoard();
        const posX = Math.floor(Math.random() * 4);
        const posY = Math.floor(Math.random() * 4);
        gameBoard[posX][posY] = new Tile(new Vector2(posX, posY), 2);
        let posX1 = Math.floor(Math.random() * 4);
        let posY1 = Math.floor(Math.random() * 4);
        while(posX === posX1 || posY === posY1) {
            posX1 = Math.floor(Math.random() * 4);
            posY1 = Math.floor(Math.random() * 4);
        }
        gameBoard[posX1][posY1] = new Tile(new Vector2(posX1, posY1), 2);
    }

    useEffect(() => {
        const canvas = document.getElementById("game-window") as HTMLCanvasElement | null;
        if(!canvas){
            return;
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();

            switch (e.key) {
                case 'ArrowUp':
                    moveTiles(gameBoard, 'up');
                    break;
                case 'ArrowDown':
                    moveTiles(gameBoard, 'down');
                    break;
                case 'ArrowLeft':
                    moveTiles(gameBoard, 'left');
                    break;
                case 'ArrowRight':
                    moveTiles(gameBoard, 'right');
                    break;
            }
        };
        if(!lose) {
            window.addEventListener('keydown', handleKeyDown);
        }

        // Get the 2D drawing context
        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        canvas.tabIndex = 0; // Make it focusable
        canvas.focus(); // Give it focus so it receives keyboard events

        let lastTime = performance.now();

        const gameLoop = (time: number) => {
            const delta = (time - lastTime) / 1000;
            lastTime = time;
            deltaTime.current = delta;
            clearCheck -= delta;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Background
            ctx.fillStyle = "tan";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.fillText(lose ? "Game Over" : "2048", (canvas.width / 2) - (lose ? 160 : 75), 100);

            // Game board
            ctx.fillStyle = "gray";
            ctx.fillRect(gameStartX, gameStartY, gameWidth, gameHeight);

            // Board Lines
            ctx.fillStyle = "black";
            for(let i = 0; i < 5; i++)
            {
                ctx.fillRect(gameStartX, gameStartY + (tileSize * i), gameWidth + 10, 10);
                ctx.fillRect(gameStartX + (tileSize * i), gameStartY, 10, gameHeight + 10);
            }

            // Tiles
            for(let y = 0; y < gameBoard.length; y++) {
                for(let x = 0; x < gameBoard[y].length; x++) {
                    const tile: Tile | undefined = gameBoard[y][x];
                    if(!tile) continue;
                    const trueTileSize = tileSize - 10;
                    const worldTileX = tileStartX + (tileSize * tile.position.posX);
                    const worldTileY = tileStartY + (tileSize * tile.position.posY);
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(worldTileX, worldTileY, trueTileSize, trueTileSize);
                    ctx.fillStyle = "black";
                    let fontSize = 64;
                    ctx.font = `${fontSize}px Arial`;
                    // Measure text width
                    const textMetrics = ctx.measureText(tile.value.toString());
                    let textWidth = textMetrics.width;

                    // Reduce font size if needed
                    while (textWidth > trueTileSize - 10 && fontSize > 10) {
                        fontSize -= 2;
                        ctx.font = `${fontSize}px Arial`;
                        textWidth = ctx.measureText(tile.value.toString()).width;
                    }

                    // Calculate position to center the text
                    const textX = worldTileX + (trueTileSize / 2) - (textWidth / 2);
                    const textY = worldTileY + (trueTileSize / 2) + fontSize / 2.5;

                    ctx.fillText(tile.value.toString(), textX, textY);
                }
            }

            // Update and render game state here

            if(clearCheck <= 0) {
                clearCheck = 2;
                if (isBoardFull(gameBoard)) {
                    setLose(true);
                    window.removeEventListener('keydown', handleKeyDown);
                }
            }


            animationFrameId.current = requestAnimationFrame(gameLoop);
        };

        animationFrameId.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="bg-gray-200 p-2 rounded shadow">
                    <canvas id={'game-window'} width={600} height={700}></canvas>
                </div>
                {lose &&
                    (<div hidden={!lose} className={'absolute'}>
                        <MGBButton
                            onClick={() => {
                                setLose(false);
                                clearGameBoard();
                            }}
                            children={'Play Again?'}
                            variant={'primary'}
                        ></MGBButton>
                    </div>)
                }
            </div>
        </>
    );
}