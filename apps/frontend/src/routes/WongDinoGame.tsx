import {useEffect, useRef, useState} from "react";
import MGBButton from "@/elements/MGBButton.tsx";

const groundLevel = 300;
let obstacleIds = 1;
const baseSpeed = -200;

const obstacleImageSrcs = ['adMinh.png', 'pakorn.png', 'pakorn2.png', 'andrew.png', 'andrew2.png', 'jake.png', 'krish.png', 'max.png']
const obstacleImages = obstacleImageSrcs.map(imageSrc => {
    const img = new Image();
    img.src = "/dino/"+imageSrc;
    return img;
});

class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    setX(x: number): void {
        this.x = x;
    }

    setY(y: number): void {
        this.y = y;
    }

    add(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }
}

class Character {
    image: HTMLImageElement;
    position: Vector2;
    velocity: Vector2;
    width: number;
    height: number;
    grounded: boolean;
    objectId: number;
    constructor(image: HTMLImageElement, posX: number, posY: number, width: number, height: number, objectId: number) {
        this.image = image;
        this.position = new Vector2(posX, posY);
        this.width = width;
        this.height = height;
        this.velocity = new Vector2(0, 0);
        this.grounded = this.position.y === groundLevel;
        this.objectId = objectId;
    }

}

class Obstacle extends Character {
    canHurt: boolean;

    constructor() {
        const index = Math.floor(Math.random() * obstacleImages.length);
        super(obstacleImages[index], 800, groundLevel, 50, 50, obstacleIds++);
        this.velocity.setX(baseSpeed);
        this.canHurt = true;
    }
}


export default function WongDinoGame() {
    const animationFrameId = useRef<number>(0);
    const deltaTime = useRef<number>(0);
    const bestScore = useRef<number>(0);
    const [gameStarted, setGameStarted] = useState(false);
    const img = new Image();
    img.src = "/dino/wong.png";
    const wongCharacter = new Character(img, 50, groundLevel, 100, 100, 0);

    useEffect(() => {
        if(!gameStarted) return;
        const canvas = document.getElementById("game-window") as HTMLCanvasElement | null;
        if(!canvas){
            return;
        }
        canvas.addEventListener("keydown", (e) => {
            e.preventDefault();
            if (e.key === 'ArrowUp' && wongCharacter.grounded) {
                wongCharacter.velocity.setY(-600);
                wongCharacter.grounded = false;
            }
        })

        let obstacles = [new Obstacle()];
        let lives = 3;
        let score = 0;
        const lifeImg = new Image();
        lifeImg.src = "/dino/max.png";

        function getRandomNum(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        function canSpawnObstacle(){
            if(obstacles.length === 0) return true;
            const closestObstacle = obstacles.reduce((closest, obstacle) => {
                return Math.abs(obstacle.position.x - 800) < Math.abs(closest.position.x - 800)
                    ? obstacle
                    : closest;
            });
            return (800 - closestObstacle.position.x >= (closestObstacle.width * Math.abs(Math.max(closestObstacle.velocity.x / 150))) + 180 + getRandomNum(120, 150));
        }

        function speedByScore(){
            return baseSpeed - ((score / 10) * 2);
        }


        // Get the 2D drawing context
        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        canvas.tabIndex = 0; // Make it focusable
        canvas.focus(); // Give it focus so it receives keyboard events

        let lastTime = performance.now();
        let secondCount = 1;

        const gameLoop = (time: number) => {
            const delta = (time - lastTime) / 1000;
            lastTime = time;
            secondCount -= delta;
            if(secondCount <= 0){
                score++;
                secondCount = 1;
            }
            deltaTime.current = delta;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "lightblue";
            ctx.fillRect(0, 0, canvas.width, canvas.height);



            if(lives <= 0){
                ctx.fillStyle = "black";
                ctx.font = "48px Arial";
                ctx.fillText("Game Over!", (canvas.width / 2) - 125, 50);
                setGameStarted(false);
                return;
            }

            // Update and render game state here

            // Create the ground
            ctx.fillStyle = "white";
            ctx.fillRect(0, 300, canvas.width, 5);
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText("Lives: ", 25, 25);
            ctx.fillText("Score: " + score, canvas.width - 150, 25);
            ctx.fillText("Best: " + bestScore.current, canvas.width - 300, 25);
            for(let i = 0; i < lives; i++) {
                ctx.drawImage(lifeImg, 100 + (i*50), 5, 25, 25);
            }

            ctx.drawImage(wongCharacter.image, wongCharacter.position.x, wongCharacter.position.y - wongCharacter.height, wongCharacter.width, wongCharacter.height);
            for(const obstacle of obstacles) {
                ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y - obstacle.height, obstacle.width, obstacle.height);
            }


            // Physics

            // Gravity
            const gravity = 1200;
            wongCharacter.velocity.add(0, gravity * delta);

            wongCharacter.position.add(wongCharacter.velocity.x * delta, wongCharacter.velocity.y * delta);

            obstacles.forEach((obstacle) => {

                obstacle.position.add(obstacle.velocity.x * delta, obstacle.velocity.y * delta);

                const padding = 20;
                const collides =
                    wongCharacter.position.x + padding < obstacle.position.x + obstacle.width - padding &&
                    wongCharacter.position.x + wongCharacter.width - padding > obstacle.position.x + padding &&
                    wongCharacter.position.y + padding < obstacle.position.y + obstacle.height - padding &&
                    wongCharacter.position.y + wongCharacter.height - padding > obstacle.position.y + padding;


                if (collides && obstacle.canHurt) {
                    obstacle.canHurt = false;
                    lives--;
                }

                if(obstacle.position.x <= -50){
                    if(obstacle.canHurt){
                        score += 25;
                    }
                    // Remove the obstacle
                    obstacles = obstacles.filter(o => o.objectId !== obstacle.objectId);
                }
            })

            // Check for ground collision
            if (wongCharacter.position.y >= groundLevel) {
                wongCharacter.position.setY(groundLevel);
                wongCharacter.velocity.setY(0);
                wongCharacter.grounded = true;
            } else {
                wongCharacter.grounded = false;
            }

            wongCharacter.position.setY(
                Math.min(wongCharacter.position.y, groundLevel)
            );

            if(score > bestScore.current){
                bestScore.current = score;
            }

            if(obstacles.length < 2 && canSpawnObstacle()){
                obstacles.push(new Obstacle());
            }

            obstacles.forEach((obstacle) => {obstacle.velocity.set(speedByScore(), 0)});

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
                        width={800}
                        height={400}
                        style={{ border: '1px solid white', display: 'block', margin: '0 auto' }}
                    ></canvas>
                    <div
                        hidden={gameStarted}
                        className={'absolute py-10'}
                    >
                        <MGBButton
                            onClick={() => setGameStarted(true)}
                            children={'Start Game'}
                            variant={'primary'}
                        >
                        </MGBButton>
                    </div>
                </div>
            </div>
        </>
    );
}