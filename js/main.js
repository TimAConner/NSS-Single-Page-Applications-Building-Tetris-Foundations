"use strict";/* Keys.js */

let Keys = {Left:false,Right:false,MouseDown:false};

/* Game.js */

let Game = { };

Game.createShape = function(){

};

let shapes = [];
let shapesId = 0;

// Game Variables
Game.canvas = document.getElementById('myCanvas');
Game.ctx = Game.canvas.getContext('2d');
Game.fps = 30;


// let StagingArea = function () {
//     this.h = 150;
//     this.w = 150;
//     this.y = 0;
//     this.x = Game.canvas.width-this.w;

//     this.draw = function() {
//         // Draw code goes here.
//         Game.ctx.strokeStyle = "#FFFFFF";
//         Game.ctx.strokeRect(this.x,this.y,this.w,this.h);

//         Game.ctx.fillStyle = "red";
//         Game.ctx.fillRect(this.x + 5,this.y +5, 25, 25);


//         // Game.ctx.strokeStyle = "#FFFFFF";
//         // Game.ctx.strokeRect(25, 25, this.w, this.h);

//         // Game.ctx.font = '25px serif';
//         // let text = "Tetris Test";
//         // Game.ctx.fillText(text, (Game.canvas.width/2)-(Game.ctx.measureText(text).width/2       ), 25);
//     };

// };


// let inventory = new StagingArea();


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
let Shape = function(options = {}){

    // Options id, x, y, width, height, stroke = false

    shapesId ++;

    this.id = options.id || shapesId;
    this.h = options.h || 25;
    this.w = options.w || 25;
    this.x = options.x  || (Game.canvas.width/2)-this.w ;
    this.y = options.y || 0;
    this.stroke = options.stroke || false;
    this.color = options.color || "#FF0000";

    this.direction="r";
    this.speed = 2;

    this.draw = function() {
        // Draw code goes here.
        if(this.stroke === false){
            Game.ctx.fillStyle= this.color;
            Game.ctx.fillRect(this.x,this.y,this.w,this.h);
        } else {
            Game.ctx.strokeStyle= this.color;
            Game.ctx.strokeRect(this.x,this.y,this.w,this.h);
        }
        
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

Shape.prototype.update = function(player = false) {
    // Update code goes here.
    if(player === true){
        let leftMax = 0;
    
        if ((this.isAboveBottom()) && ((Keys.Left == true) && (this.x >= leftMax))){
            this.x = this.x - this.speed;
        }
    

        // Account for speed of movement offset
        
        let objectInWay = false;
        for(let i = 0; i < shapes.length; i++){
            if(shapes[i].id !== this.id){
                if((this.y >= shapes[i].y) && (this.y  <= (shapes[i].y+shapes[i].h))){
                    let rightMax = (this.y >  shapes[i].h) ? Game.canvas.width : (Game.canvas.width-shapes[i].w);
                    objectInWay = true;
                    if ((this.isAboveBottom()) && ((Keys.Right == true) && ((this.x+this.w) <= rightMax))) {
                        this.x = this.x + this.speed;
                    }
                }
            }
        }

        if(objectInWay === false){
            let rightMax = Game.canvas.width;
            
            if ((this.isAboveBottom()) && ((Keys.Right == true) && ((this.x+this.w) <= rightMax))) {
                this.x = this.x + this.speed;
            }
        }

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





// Player1.drop(0.5, 10);

shapes.push(new Shape());
shapes[0].drop(0.5, 10);

shapes.push(new Shape({
    h: 150,
    w: 150,
    x: (Game.canvas.width-150),
    y: 0,
    stroke: true,
    color: "#FFF"
}));


// Core Methods
Game.run = function() {
    // Run code goes here.
    Game.draw();
	Game.update();
};

Game.update = function() {
    // Update code goes here.
    // inventory.draw();
    shapes.forEach((shape, i) => {
        if(i === 0){
            shape.update(true);
        }
        
    });
};

Game.draw = function() {
    // Draw code goes here.
	Game.clear();
	shapes.forEach((shape) => {
        shape.draw();
    });
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

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

Game.canvas.addEventListener("click", function(event){
    let mouse = getMousePos(Game.canvas, event);
    let mx = mouse.x;
    let my = mouse.y;

    for(let i = 0; i < shapes.length; i++){
        let isOnXAxis = ((mx > shapes[i].x) && (mx < (shapes[i].x + shapes[i].w)));
        let isOnYAxis = ((my > shapes[i].y) && (my < (shapes[i].y + shapes[i].h)));
        if(isOnXAxis && isOnYAxis){
            console.log(`Clicked on ${shapes.id}`);
        }
    }
});




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

Game._intervalId = setInterval(Game.run, 1000 / Game.fps);



