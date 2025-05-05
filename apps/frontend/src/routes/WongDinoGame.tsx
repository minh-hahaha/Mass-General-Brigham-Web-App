import {useEffect, useRef, useState} from "react";
import MGBButton from "@/elements/MGBButton.tsx";

const groundLevel = 300;

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

class Character {
    image: HTMLImageElement;
    position: Vector2;
    velocity: Vector2;
    width: number;
    height: number;
    grounded: boolean;
    constructor(image: HTMLImageElement, posX: number, posY: number, width: number, height: number) {
        this.image = image;
        this.position = new Vector2(posX, posY);
        this.width = width;
        this.height = height;
        this.velocity = new Vector2(0, 0);
        this.grounded = this.position.posY === groundLevel;
    }

}

class Obstacle extends Character {
    canHurt: boolean;
    offset: number;
    speedMultiplier: number;
    maxSpeedMultiplier: number;

    constructor(image: HTMLImageElement, width: number, height: number, offset: number = 0) {
        super(image, 800, groundLevel, width, height);
        this.velocity.setX(-200);
        this.canHurt = true;
        this.offset = offset;
        this.speedMultiplier = 1;
        this.maxSpeedMultiplier = 3;
    }

    resetPosition() {
        // Adjust offset based on speed multiplier
        const speedBasedOffset = 100 * this.speedMultiplier;  // The offset increases with speed
        const offsetX = Math.random() * (800 - 500) + 500 + speedBasedOffset; // Add the speed-based offset
        this.position.set(800 + offsetX + this.offset, groundLevel); // Update the position with the offset
        this.canHurt = true;
    }

    updateSpeed(score: number) {
        // Calculate the new speed multiplier based on score, but cap at maxSpeedMultiplier
        const scaleFactor = 1 + Math.floor(score / 300);  // Speed increases every 300 points
        this.speedMultiplier = Math.min(scaleFactor, this.maxSpeedMultiplier);  // Apply the cap
        this.velocity.setX(-200 * this.speedMultiplier);  // Update obstacle speed
    }
}


export default function WongDinoGame() {
    const animationFrameId = useRef<number>(0);
    const deltaTime = useRef<number>(0);
    const bestScore = useRef<number>(0);
    const [gameStarted, setGameStarted] = useState(false);
    const img = new Image();
    img.src = "/dino/wong.png";
    const wongCharacter = new Character(img, 50, groundLevel, 100, 100);

    const obstacleImageSrcs = ['adMinh.png', 'pakorn.png', 'pakorn2.png', 'andrew.png', 'andrew2.png', 'jake.png', 'krish.png', 'max.png']
    const obstacleImages = obstacleImageSrcs.map(imageSrc => {
        const img = new Image();
        img.src = "/dino/"+imageSrc;
        return img;
    });

    const obs1Img = new Image();
    obs1Img.src = "/dino/"+"/adMinh.png";
    const obstacle1 = new Obstacle(obs1Img, 50, 50);
    const obs2Img = new Image();
    obs2Img.src = "/dino/"+"/andrew2.png";
    const obstacle2 = new Obstacle(obs2Img, 50, 50, 500);



    useEffect(() => {
        if(!gameStarted) return;
        const canvas = document.getElementById("game-window") as HTMLCanvasElement | null;
        if(!canvas){
            return;
        }
        canvas.addEventListener("keydown", (e) => {
            if (e.key === 'ArrowUp' && wongCharacter.grounded) {
                wongCharacter.velocity.setY(-600); // higher initial jump velocity
                wongCharacter.grounded = false;
            }
        })

        const obstacles = [obstacle1, obstacle2];
        obstacles.forEach(obstacle => {
            obstacle.resetPosition();
        })
        let lives = 3;
        let score = 0;
        const lifeImg = new Image();
        lifeImg.src = "/dino/max.png";

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

                ctx.drawImage(wongCharacter.image, wongCharacter.position.posX, wongCharacter.position.posY - wongCharacter.height, wongCharacter.width, wongCharacter.height);
                for(const obstacle of obstacles) {
                    ctx.drawImage(obstacle.image, obstacle.position.posX, obstacle.position.posY - obstacle.height, obstacle.width, obstacle.height);
                }


                // Physics

                // Gravity
                const gravity = 1200;
                wongCharacter.velocity.add(0, gravity * delta);

                wongCharacter.position.add(wongCharacter.velocity.posX * delta, wongCharacter.velocity.posY * delta);

                obstacles.forEach((obstacle) => {

                    obstacle.position.add(obstacle.velocity.posX * delta, obstacle.velocity.posY * delta);

                    const padding = 20;
                    const collides =
                        wongCharacter.position.posX + padding < obstacle.position.posX + obstacle.width - padding &&
                        wongCharacter.position.posX + wongCharacter.width - padding > obstacle.position.posX + padding &&
                        wongCharacter.position.posY + padding < obstacle.position.posY + obstacle.height - padding &&
                        wongCharacter.position.posY + wongCharacter.height - padding > obstacle.position.posY + padding;


                    if (collides && obstacle.canHurt) {
                        obstacle.canHurt = false;
                        lives--;
                    }

                    if(obstacle.position.posX <= -50){
                        if(obstacle.canHurt){
                            score += 25;
                        }
                        const index = Math.floor(Math.random() * obstacleImages.length);
                        obstacle.image = obstacleImages[index];
                        obstacle.updateSpeed(score);
                        obstacle.resetPosition();
                    }
                })

                // Check for ground collision
                if (wongCharacter.position.posY >= groundLevel) {
                    wongCharacter.position.setY(groundLevel);
                    wongCharacter.velocity.setY(0);
                    wongCharacter.grounded = true;
                } else {
                    wongCharacter.grounded = false;
                }

                wongCharacter.position.setY(
                    Math.min(wongCharacter.position.posY, groundLevel)
                );

                if(score > bestScore.current){
                    bestScore.current = score;
                }
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
            <canvas
                id={'game-window'}
                width={800}
                height={400}
                style={{ border: '1px solid white', display: 'block', margin: '0 auto' }}
                className={"absolute top-50 left-85"}
            ></canvas>
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