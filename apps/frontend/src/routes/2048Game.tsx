import {useEffect, useRef, useState} from "react";
import MGBButton from "@/elements/MGBButton.tsx";

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
    constructor(position: Vector2, value: number) {
        this.position = position;
        this.value = value;
    }

}


function moveTiles(gameBoard: (Tile | undefined)[][], direction: ('left' | 'right' | 'up' | 'down')) {
    // Need to move tiles based on how close to respective edge they are
    switch (direction) {
        case 'left':
            for(let y = 0; y < gameBoard.length; y++) {
                for (let x = 0; x < gameBoard[y].length; x++) {
                    const tile = gameBoard[y][x];
                    if(tile){
                        let movePos = new Vector2(tile.position.posX - 1, tile.position.posY);
                        let tileAtPos = gameBoard[movePos.posY][movePos.posX];
                        while(!tileAtPos && tile.position.posX > 0){
                            tile.position.add(-1, 0);
                            movePos = new Vector2(tile.position.posX - 1, tile.position.posY);
                            tileAtPos = gameBoard[movePos.posY][movePos.posX];
                        }
                        gameBoard[y][x] = undefined;
                        gameBoard[tile.position.posY][tile.position.posX] = tile;
                    }
                }
            }
            break;
            case 'right':
                for(let y = 0; y < gameBoard.length; y++) {
                    for (let x = gameBoard[y].length; x >= 0; x--) {
                        const tile = gameBoard[y][x];
                        if(tile){
                            let movePos = new Vector2(tile.position.posX + 1, tile.position.posY);
                            let tileAtPos = gameBoard[movePos.posY][movePos.posX];
                            while(!tileAtPos && tile.position.posX < gameBoard[y].length - 1){
                                tile.position.add(1, 0);
                                movePos = new Vector2(tile.position.posX + 1, tile.position.posY);
                                tileAtPos = gameBoard[movePos.posY][movePos.posX];
                            }
                            gameBoard[y][x] = undefined;
                            gameBoard[tile.position.posY][tile.position.posX] = tile;
                        }
                    }
                }
                break;
                case 'down':
                    console.log("called")
                    for(let y = gameBoard.length - 1; y >= 0; y--) {
                        for (let x= 0; x < gameBoard[y].length; x++) {
                            const tile = gameBoard[y][x];
                            if(tile){
                                let movePos = new Vector2(tile.position.posX, tile.position.posY + 1);
                                let tileAtPos = gameBoard[movePos.posY][movePos.posX];
                                while(!tileAtPos && tile.position.posY < gameBoard[y].length - 1){
                                    tile.position.add(0, 1);
                                    movePos = new Vector2(tile.position.posX, tile.position.posY + 1);
                                    tileAtPos = gameBoard[movePos.posY][movePos.posX];
                                }
                                gameBoard[y][x] = undefined;
                                gameBoard[tile.position.posY][tile.position.posX] = tile;
                            }
                        }
                    }
                    break;
                    case 'up':
                        break;
    }
}

export default function Game2048() {
    const animationFrameId = useRef<number>(0);
    const deltaTime = useRef<number>(0);
    const bestScore = useRef<number>(0);
    const [gameStarted, setGameStarted] = useState(true); //TODO: change back to false
    const gameStartX = 50;
    const gameStartY = 150;
    const tileStartX = gameStartX + 10;
    const tileStartY = gameStartY + 10;
    const gameWidth = 500;
    const gameHeight = 500;
    const tileSize = gameWidth / 4;
    //                                  REMEMBER: [y][x]
    const gameBoard: (Tile | undefined)[][] = Array.from({ length: 4 }, () =>
        Array(4).fill(undefined)
    );

    gameBoard[0][0] = new Tile(new Vector2(0, 0), 2);
    gameBoard[1][3] = new Tile(new Vector2(3, 1), 4);

    useEffect(() => {
        if(!gameStarted) return;
        const canvas = document.getElementById("game-window") as HTMLCanvasElement | null;
        if(!canvas){
            return;
        }
        canvas.addEventListener("keydown", (e) => {
            if (e.key === 'ArrowUp') {
                moveTiles(gameBoard, 'up');
            }
            if (e.key === 'ArrowDown') {
                moveTiles(gameBoard, 'down');
            }
            if (e.key === 'ArrowLeft') {
                moveTiles(gameBoard, 'left');
            }
            if (e.key === 'ArrowRight') {
                moveTiles(gameBoard, 'right');
            }
        })

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

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Background
            ctx.fillStyle = "tan";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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



            animationFrameId.current = requestAnimationFrame(gameLoop);
        };

        animationFrameId.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gameStarted]);

    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="bg-gray-200 p-2 rounded shadow">
                    <canvas
                        id={'game-window'}
                        width={600}
                        height={700}
                    ></canvas>
                </div>
            </div>
            <div
                hidden={gameStarted}
                className={"absolute top-90 left-170"}
            >
                <MGBButton
                    onClick={() => setGameStarted(true)}
                    children={'Start Game'}
                    variant={'primary'}
                >
                </MGBButton>
            </div>
        </>
    );
}