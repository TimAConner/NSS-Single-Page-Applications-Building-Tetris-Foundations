"use strict";/* Keys.js */

let Keys = {Left:false, Right:false, MouseDown:false};

/* Game.js */

let Game = { };

Game.createShape = function(){

};

let shapes = [];
let shapesId = 0;
let selectedShape = {};

let globalMousePosition;

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

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

const getNewId = () => {
    shapesId ++;
    return shapesId;
};

/* Shape.js */
let Shape = function(shapes = [{}], options = {}){

    this.constituent = [];

    shapes.forEach((shape, index) => {
        this.constituent.push({});
        this.constituent[index].h = shape.h || 25;
        this.constituent[index].w = shape.w || 25;
        this.constituent[index].x = shape.x  || ((Game.canvas.width/2)-this.constituent[index].w);
        
        this.constituent[index].y = shape.y || 0;
        this.constituent[index].stroke = shape.stroke || false;
        this.constituent[index].color = shape.color || "#FF0000";
        this.constituent[index].middle = this.constituent[index].x + (this.constituent[index].w/2);
        this.constituent[index].rightEdge = this.constituent[index].x + this.constituent[index].w;   
        this.constituent[index].borderWidth = shape.borderWidth || 1;
    });

    this.x = options.x || 1;
    this.y = options.y || 1;

    this.direction = "r";

    this.horizontalSpeed = 5;

    this.ignore = options.ignore || false;

    this.prefab = options.prefab || false;

    this.followMouse = options.followMouse || false;

    this.id = options.id || getNewId();
    

    this.draw =  function() {
        // console.log("shapes", shapes);

        if(this.followMouse){
            this.ignore = true;
            this.x = globalMousePosition.x;
            this.y = globalMousePosition.y;
            console.log("following", this);
        } else {
            this.ignore = false;
            console.log("not", this);
        }

        this.constituent.forEach((shape) => {    
            if(shape.stroke === false){
                Game.ctx.lineWidth = 3;
                shape.lineWidth = Game.ctx.lineWidth ; 
                Game.ctx.fillStyle = shape.color;
                Game.ctx.fillRect(this.x + shape.x, this.y + shape.y, shape.w, shape.h);
            } else {
                Game.ctx.lineWidth = 3;
                shape.lineWidth = Game.ctx.lineWidth ; 
                Game.ctx.strokeStyle = shape.color;
                Game.ctx.strokeRect(this.x + shape.x, this.y + shape.y, shape.w, shape.h);
            }
        });  
    };

};

const isInsideXAxis = (shape1x,  shape1, shape2x, shape2) => {

    let x1 = shape1x + shape1.x;
    let x2 =  shape2x + shape2.x;

    if( ((x1 > ((x2)-shape2.lineWidth)) && ((x1) < (x2+shape2.w+shape2.lineWidth))) || ( (shape1.rightEdge > (x2) && (shape1.rightEdge < shape2.rightEdge)))){
        return true;
    } else {
        return false;
    }
};

Shape.prototype.isEmptySpaceBelow = function(){
    let bottomOfShape = (this.y+this.h+this.lineWidth);
    let shapeBelow = false;
    // If it is not above an object
    for(let i = 0; i < shapes.length; i++){
        if(shapes[i].id !== this.id && shapes[i].ignore === false){
            
            // Compare range function?
            if(isInsideXAxis(this, shapes[i])) {
                if((bottomOfShape > (shapes[i].y-this.borderWidth)) && (bottomOfShape < (shapes[i].y + shapes[i].h))){
                    // console.log("bottom of shape", bottomOfShape);
                    // console.log('shapes[i].y', shapes[i].y);
                    // console.log('(shapes[i].y + shapes[i].h)', (shapes[i].y + shapes[i].h));
                    // console.log(shapes[i]);
                    return false;
                }
            }
        }
    }

    if(bottomOfShape >= Game.canvas.height){
        return false;
    } 

    return true;
    // if(shapeBelow === false){
    //     if(bottomOfShape < Game.canvas.height){
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
};

Shape.prototype.update = function(player = false) {
    // Update code goes here.
    this.rightEdge = this.x + this.w;
    
    if(player === true){
        // let leftMax = 0;

        // let objectInWayLeft = false;
        let leftMax = this.lineWidth;
        let rightMax = Game.canvas.width-this.lineWidth;

        for(let i = 0; i < shapes.length; i++){
            if(shapes[i].id !== this.id){
                if((this.y >= shapes[i].y) && (this.y  <= (shapes[i].y+shapes[i].h)) || (((this.y+this.h) >= shapes[i].y) && (this.y+this.h) <= (shapes[i].y+shapes[i].h) )){

                    let maxLeftTest = ((shapes[i].x+shapes[i].w+shapes[i].lineWidth));

                    if(maxLeftTest >  leftMax){
                        leftMax = maxLeftTest;
                    }

                    let rightMaxTest = ((shapes[i].x-shapes[i].lineWidth));
                    if(rightMaxTest > this.rightEdge){
                        if(rightMaxTest <  rightMax){
                            rightMax = rightMaxTest;
                        }
                    }
                }
            }
        }

        if ((this.isEmptySpaceBelow()) && ((Keys.Left == true) && ((this.x-this.horizontalSpeed) >= leftMax))){
            this.x = this.x - this.horizontalSpeed;
        }

        if ((this.isEmptySpaceBelow()) && ((Keys.Right == true) && ((this.x+this.w+this.horizontalSpeed) <= rightMax))) {
            this.x = this.x + this.horizontalSpeed;
            console.log("hey");
        }
        

        // Account for horizontalSpeed of movement offset

    //     let rightMax = 0;
    //     let objectInWayRight = false;
    //     for(let i = 0; i < shapes.length; i++){
    //         if(shapes[i].id !== this.id){
    //             if((this.y >= shapes[i].y) && (this.y  <= (shapes[i].y+shapes[i].h)) || (((this.y+this.h) >= shapes[i].y) && (this.y+this.h) <= (shapes[i].y+shapes[i].h) )){
    //                 // let rightMax = (this.y >  (shapes[i].h+shapes[i].y)) ? Game.canvas.width : (((Game.canvas.width)-shapes[i].w-this.w-this.horizontalSpeed));
    //                 rightMax = (shapes[i].x+shapes[x].lineWidth);
    //                 if(curRightMax <  rightMax){
    //                     rightMax = curRightMax;
    //                 }

    //                 console.log("x", this.x, "curRightMax", curRightMax);
                    
    //                 // console.log("x", this.x, "canvas", Game.canvas.width, shapes[i].x, this.w);
    //                 objectInWayRight = true;
    //                 if ((this.isEmptySpaceBelow()) && ((Keys.Right == true) && ((this.x+this.w) <= rightMax))) {
    //                     this.x = this.x + this.horizontalSpeed;
    //                 }
    //             }
    //         }
    //     }

    //     if(objectInWayRight === false){
    //         let rightMaxQ = Game.canvas.width;
            
    //         if ((this.isEmptySpaceBelow()) && ((Keys.Right == true) && ((this.x+this.w) <= rightMaxQ))) {
    //             this.x = this.x + this.horizontalSpeed;
    //         }
    //     }

    }
};

Shape.prototype.drop = function(change = 0.5, interval = 10){
    // console.log("dropping");
    let dropInterval = setInterval(() => {

        // Right now is empty space below is reteurning true for some reason.
        // console.log('this.rightEdge', this.rightEdge);
        this.rightEdge = this.x + this.w;
        
        if(this.isEmptySpaceBelow()){
            
            this.y += change;
            // console.log(this);
            // console.log(shapes);
        } else {
            // console.log(this);
            // console.log("can't drop", shapes);
            // Create new block when this one hits the bottom
            // shapes.unshift(new Shape({
            //     w: 100,
            //     h: 100,
            //     x: 200,
            //     color: "blue",
            //     stroke: true
            // }));
            // shapes[0].drop(1, 10);

            clearInterval(dropInterval);
        }
    }, interval);
};





// Player1.drop(0.5, 10);

// shapes.push(new Shape({
//     w: 100,
//     h: 100,
//     x: 250,
//     stroke: true
// }));
// shapes[0].drop(1, 10);


shapes.push(new Shape({
    w: 150,
    h: 100,
    x: Game.canvas.width-150,
    y: 1,
    stroke: true,
    color: "gray"
}));

shapes.push(new Shape({
    w: 25,
    h: 25,
    x: Game.canvas.width-50,
    y: 1,
    color: "red",
    prefab: true,
    stroke: true
}));

shapes.push(new Shape({
    w: 5,
    h: 5,
    x: Game.canvas.width-52,
    y: 1,
    color: "red",
    prefab: true
}));

// shapes.push(new Shape({
//     x: 1,
//     y: 1,
//     w: 70,
//     h: 500,
//     stroke: true
// }));

// // shapes.push(new Shape({
// //     h: 150,
// //     w: 150,
// //     x: (Game.canvas.width-150),
// //     y: 0,
// //     stroke: true,
// //     color: "#FFF"
// // }));

// shapes.push(new Shape({
//     h: 150,
//     w: 150,
//     x: (Game.canvas.width-160),
//     y: 0,
//     stroke: true,
//     color: "#FFF"
// }));

// shapes.push(new Shape({
//     h: 150,
//     w: 10,
//     x: 25,
//     y: 0,
//     stroke: true,
//     color: "#FFF"
// }));

// shapes.push(new Shape({
//     h: 10,
//     w: 100,
//     x: 25,
//     y: 150,
//     stroke: true,
//     color: "#FFF"
// }));


// shapes.push(new Shape({
//     h: 10,
//     w: 50,
//     x: 100,
//     y: 250,
//     stroke: true,
//     color: "#FFF"
// }));



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


const getShape = (id) => {
    return shapes.find((shape) => shape.id === id);
};

Game.canvas.addEventListener("click", function(event){
    if(selectedShape!== undefined && selectedShape.prefab === true){
        // find shape in array
        selectedShape.followMouse = false;
        selectedShape.prefab = false;
        // console.log(getShape(selectedShape.id));
        let x = getShape(selectedShape.id);
        // console.log(x);
        x.drop();
        // selectedShape.drop();
        // console.log("selected", selectedShape);
        // console.log("shapes", shapes);
        // Make shape drop
        // unselect shape
    }

    if(selectedShape !== undefined){
        let mouse = getMousePos(Game.canvas, event);
        let mx = mouse.x;
        let my = mouse.y;

        let smallestShape;

        for(let i = 0; i < shapes.length; i++){
            let isOnXAxis = ((mx >= shapes[i].x) && (mx <= (shapes[i].x + shapes[i].w)));
            let isOnYAxis = ((my >= shapes[i].y) && (my <= (shapes[i].y + shapes[i].h)));
            if(isOnXAxis && isOnYAxis){
                if(smallestShape === undefined){
                    smallestShape = shapes[i];
                } else {
                    isOnXAxis = ((shapes[i].x >= smallestShape.x) && (shapes[i].x  <= (smallestShape.x + smallestShape.w)));
                    isOnYAxis = ((shapes[i].y >= smallestShape.y) && (shapes[i].y <= (smallestShape.y + smallestShape.h)));
                    if(isOnXAxis && isOnYAxis){
                        // console.log(`${smallestShape.id} surrounds ${shapes[i].id}`);
                        smallestShape = shapes[i];    
                    }
                }
            }
        }

        if(smallestShape !== undefined && smallestShape.prefab === true){
            selectedShape = smallestShape;

            let newShape = Object.create(selectedShape);
            selectedShape = newShape;
            newShape.followMouse = true;
            newShape.id = getNewId();
            shapes.push(newShape);
        }
    }
});


Game.canvas.addEventListener("mousemove", function(event){
    globalMousePosition = getMousePos(Game.canvas, event);
});

Game.canvas.addEventListener("mousedown", function(event){

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



