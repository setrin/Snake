/*jshint latedef: true */
/*global window */
/*global document */
/*global console */

function Cube(positionX, positionY, facing, head) {
    "use strict";
    this.positionX = positionX;
    this.positionY = positionY;
    this.head = head;
    this.facing = facing;
}

function Point(positionX, positionY) {
    "use strict";
    this.positionX = positionX;
    this.positionY = positionY;
    this.spawnDelay = null;
}

function Snake(startX, startY, facing, length, canvasa) {
    "use strict";
    var snakeSize = 10,
        canvas = canvasa,
        scope = this,
        stopTimer = false,
        canvasWidth = document.getElementById("myCanvas").width,
        canvasHeight = document.getElementById("myCanvas").height,
        pointEatDelay = null;
    this.length = length;
    this.facing = facing;
    this.body = [];
    this.head = 0;
    this.points = [];
    this.maxPointsNumber = 2;
    this.pointSpawnCounter = 0;
    
    /**
     * Initialize Snake
     * @return void
     */
    this.init = function () {
        var i, posX, posY, head, that;
        for (i = 0; i < scope.length; i++) {
            if (i === 0) {
                head = true;
            } else {
                head = false;
            }
            if (scope.facing === "right") {
                posX = startX - (this.body.length * snakeSize);
                posY = startY;
            } else if (scope.facing === "left") {
                posX = startX + (this.body.length * snakeSize);
                posY = startY;
            } else if (scope.facing === "up") {
                posX = startX;
                posY = startY + (this.body.length * snakeSize);
            } else if (scope.facing === "down") {
                posX = startX;
                posY = startY - (this.body.length * snakeSize);
            }
            
            scope.body.push(new Cube(posX, posY, scope.facing, head));
        }
        console.log(this.body);
        this.renderSnake();
        this.timer();
    };
    
    /**
     * Render Snake and Points on canvas
     * @return void
     */
    this.renderSnake = function () {
        var i, that, posX, posY;
        this.clearCanvas();
        for (i = 0; i < scope.body.length; i++) {
            posX = scope.body[i].positionX;
            posY = scope.body[i].positionY;
            canvas.fillRect(posX, posY, snakeSize, snakeSize);
        }
        
        for (i = 0; i < scope.points.length; i++) {
            posX = scope.points[i].positionX;
            posY = scope.points[i].positionY;
            canvas.fillRect(posX, posY, snakeSize, snakeSize);
        }
    };
    
    /**
     * Clear canvas
     * @return void
     */
    this.clearCanvas = function () {
        canvas.fillStyle = "#fff";
        canvas.fillRect(0, 0, 400, 400);
        canvas.fillStyle = "#000";
    };
    
    /**
     * Timer for moving Snake
     * @return void
     */
    this.timer = function () {
        var timer = setTimeout(function () {
                
                scope.moveSnake();
                scope.renderSnake();
                scope.collisionDetection();
                scope.DetectPoint();
                scope.pointSpawner();
                if (stopTimer) {
                    clearTimeout(timer);
                    console.log("Game Over!!!");
                } else {
                    scope.timer();
                }
            }, 150);
    };
    
    /**
     * Chagne Snake's body parts to new position
     * @return void
     */
    this.moveSnake = function () {
        var newX, newY, oldX, oldY, i;
        for (i = 0; i < scope.body.length; i++) {
            if (i === scope.head) {
                oldX = scope.body[i].positionX;
                oldY = scope.body[i].positionY;
                if (scope.body[i].facing === "right") {
                    scope.body[i].positionX += snakeSize;
                } else if (scope.body[i].facing === "left") {
                    scope.body[i].positionX -= snakeSize;
                } else if (scope.body[i].facing === "up") {
                    scope.body[i].positionY -= snakeSize;
                } else if (scope.body[i].facing === "down") {
                    scope.body[i].positionY += snakeSize;
                }
            } else {
                newX = oldX;
                newY = oldY;
                oldX = scope.body[i].positionX;
                oldY = scope.body[i].positionY;
                scope.body[i].positionX = newX;
                scope.body[i].positionY = newY;
            }
        }
    };
    
    /**
     * Detect Snake collision with walls and itself
     * @return void
     */
    this.collisionDetection = function () {
        if (scope.body[scope.head].positionX < 0 || scope.body[scope.head].positionX >= canvasWidth || scope.body[scope.head].positionY < 0 || scope.body[scope.head].positionY >= canvasHeight) {
            stopTimer = true;
        } else {
            var i;
            for (i = 1; i < scope.length; i++) {
                if (scope.body[scope.head].positionX === scope.body[i].positionX && scope.body[scope.head].positionY === scope.body[i].positionY) {
                    stopTimer = true;
                }
            }
        }
    };
    
    /**
     * Spawn point to snake.points
     * @return void
     */
    this.pointSpawner = function () {
        if (scope.pointSpawnCounter <= 0 && scope.points.length < scope.maxPointsNumber) {
            var x = (Math.floor(Math.random() * 390)),
                y = (Math.floor(Math.random() * 390));
            x = Math.round(x / 10) * 10;
            y = Math.round(y / 10) * 10;
            scope.points.push(new Point(x, y));
            scope.pointSpawnCounter = 25;
        } else {
            scope.pointSpawnCounter--;
        }
    };
    
    /**
     * Detect if Snake eats Point (destroy Point, extend Snake)
     * @return void
     */
    this.DetectPoint = function () {
        var i, score, posX, posY;
        for (i = 0; i < scope.points.length; i++) {
            if (scope.body[scope.head].positionX === scope.points[i].positionX && scope.body[scope.head].positionY === scope.points[i].positionY) {
                scope.points[i].spawnDelay = scope.length - 1;
                score = document.getElementById("score").innerHTML;
                document.getElementById("score").innerHTML = (parseInt(score) + (scope.length*2));
            } else if (scope.points[i].spawnDelay === 0) {
                scope.length++;
                posX = scope.points[i].positionX;
                posY = scope.points[i].positionY;
                scope.body.push(new Cube(posX, posY, scope.facing, false));
                scope.points.splice(i, 1);
            } else if (scope.points[i].spawnDelay > 0) {
                scope.points[i].spawnDelay--;
            }
        }
    };
    
    /**
     * Change snake direction
     * @return void
     */
    this.changeDirection = function (e) {
        e = e || window.event;

        if (e.keyCode === 38) {
            if (scope.body[scope.head].facing !== "down") {
                scope.body[scope.head].facing = "up";
            }
        } else if (e.keyCode === 40) {
            if (scope.body[scope.head].facing !== "up") {
                scope.body[scope.head].facing = "down";
            }
        } else if (e.keyCode === 37) {
            if (scope.body[scope.head].facing !== "right") {
                scope.body[scope.head].facing = "left";
            }
        } else if (e.keyCode === 39) {
            if (scope.body[scope.head].facing !== "left") {
                scope.body[scope.head].facing = "right";
            }
        } else if (e.keyCode === 35) {
            if (stopTimer) {
                stopTimer = false;
                scope.timer();
            } else {
                stopTimer = true;
            }
        }
    };
    
    document.onkeydown = this.changeDirection;
}

window.onload = function () {
    "use strict";
    var canvas = document.getElementById("myCanvas"),
        ctx = canvas.getContext("2d"),
        snake;
    ctx.fillStyle = "#000";
    snake = new Snake(200, 200, "left", 4, ctx);
    snake.init();
};