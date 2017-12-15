"use strict";/* Keys.js */

var Keys = {Left:false,Right:false,MouseDown:false};

/* Game.js */

var Game = { };

Game.createShape = function(){

};

// Game Variables
Game.canvas = document.getElementById('myCanvas');
Game.ctx = Game.canvas.getContext('2d');
Game.fps = 30;


// Keyboard Controls
window.onkeydown = function() {
	switch(event.keyCode) {
		case 37:
			Keys.Left = true;
		break;
		case 39:
			Keys.Right = true;
		break;
	}
};

window.onkeyup = function() {
	switch(event.keyCode) {
		case 37:
			Keys.Left = false;
		break;
		case 39:
			Keys.Right = false;
		break;
	}
};

/* Shape.js */
let Shape = function(){

    this.h = 25;
    this.w = 25;
    this.x = (Game.canvas.width/2)-this.w;
    this.y = 0;
    
    this.direction="r";
    this.speed = 1;

    this.draw = function() {
        // Draw code goes here.
        Game.ctx.fillStyle="#FF0000";
        Game.ctx.fillRect(this.x,this.y,this.w,this.h);
    };


};

Shape.prototype.isAboveBottom = function(){
    let bottomOfShape = (this.y+this.h);
    if(bottomOfShape < Game.canvas.height){
        return true;
    } else {
        return false;
    }
};

Shape.prototype.update = function() {
    // Update code goes here.
    if ((this.isAboveBottom()) && (Keys.Left == true && this.x >=0 )){
        this.x = this.x - this.speed;
    }
    if ((this.isAboveBottom()) && (Keys.Right == true && (this.x+this.w) <= Game.canvas.width )) {
        this.x = this.x + this.speed;
    }
};

Shape.prototype.drop = function(change = 0.5, interval = 10){
    let dropInterval = setInterval(() => {
        if(this.isAboveBottom()){
            this.y += change;
        } else {
            clearInterval(dropInterval);
        }
    }, interval);
};






var Player1 = new Shape();
Player1.drop(0.5, 10);

// Core Methods
Game.run = function() {
	// Run code goes here.
	Game.draw();
	Game.update();
};

Game.update = function() {
	// Update code goes here.
	Player1.update();
};

Game.draw = function() {
	// Draw code goes here.
	Game.clear();
	Player1.draw();
};

Game.clear = function() {
	// Clear the canvas.
	Game.ctx.fillStyle="#000000";
	Game.ctx.fillRect(0,0,Game.canvas.width,Game.canvas.height);
};

// Game.canvas.onmousedown = function(e) {
// 	if ( e.offsetX >= Player1.x && e.offsetX <= (Player1.x + Player1.w) && e.offsetY >= Player1.y && e.offsetY <= (Player1.y + Player1.h) ) {
// 		Keys.MouseDown = true;
// 	}
// };

// Game.canvas.onmouseup = function(e) {
// 	Keys.MouseDown = false;
// };

// Game.canvas.onmousemove = function(e) {
// 	if ( Keys.MouseDown == true ) {
// 		Player1.x = e.offsetX;
// 		Player1.y = e.offsetY;
//         console.log("x", Player1.x, "y", Player1.y);
// 	}
// };

Game._intervalId = setInterval(Game.run, 1000 / Game.fsp);