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
            // console.log("following", this);
        } else {
            this.ignore = false;
            // console.log("not", this);
        }

        this.constituent.forEach((shape) => {    
            if(shape.stroke === false){
                Game.ctx.lineWidth = 3;
                shape.lineWidth = Game.ctx.lineWidth ; 
                Game.ctx.fillStyle = shape.color;
                
                // console.log(this.x, shape.x);
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
    
    let context = this;
    let shapeBelow = false;

    this.constituent.forEach((shape) => {

        let bottomOfShape = (this.y + shape.y + shape.h + shape.lineWidth);
       
        // If it is not above an object
        for(let i = 0; i < shapes.length; i++){
            if(shapes[i].id !== context.id && shapes[i].ignore === false){
                // console.log("can look in here");
                for(let a = 0; a < shapes[i].constituent.length; a++){
                    // Compare range function?
                    if(isInsideXAxis(this.x, shape, shapes[i].x, shapes[i].constituent[a])) {
                        let testingShapeY = shapes[i].constituent[a].y + shapes[i].y;
                        if((bottomOfShape > (testingShapeY-shape.borderWidth)) && (bottomOfShape < (testingShapeY + shapes[i].constituent[a].h))){
                            // console.log("bottom of shape", bottomOfShape);
                            // console.log('shapes[i].y', shapes[i].y);
                            // console.log('(shapes[i].y + shapes[i].h)', (shapes[i].y + shapes[i].h));
                            // console.log(shapes[i]);
                            
                            shapeBelow = true;
                        }
                    }
                }
            }
        }
    
        if(bottomOfShape >= Game.canvas.height){
            shapeBelow = true;
        } 

    });

 
    
    // console.log("true");
    // return true;

    if(shapeBelow === true){
        return  false;
    } else {
        return true;
    }


};

Shape.prototype.update = function(player = false) {
    // Update code goes here.
    // console.log(shapes);
    this.constituent.forEach((shape) => {
        shape.rightEdge = this.x + shape.x + shape.w;
    });
    
    
    if(player === "true"){
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
    // console.log("drop");
            if(this.isEmptySpaceBelow()){
                // console.log("dropping"); 
                this.y += change;
            } else {
                // console.log("stop");
    
                clearInterval(dropInterval);
            }
        

    }, interval);
};



shapes.push(new Shape(
    [
        {
            w: 25,
            h: 25,
            x: 1,
            y: 1,
            color: "red"
        },
        {
            w: 25,
            h: 25,
            x: 25,
            y: 1,
            color: "blue"
        },
        {
            w: 25,
            h: 25,
            x: 50,
            y: 1,
            color: "red"
        },
        {
            w: 25,
            h: 25,
            x: 75,
            y: 1,
            color: "blue"
        }
    ], 
    {
        prefab: true,
        x: 10,
        y: 1
    }
));

shapes.push(new Shape(
    [
        {
            w: 25,
            h: 25,
            x: 1,
            y: 1,
            color: "red"
        },
        {
            w: 25,
            h: 25,
            x: 1,
            y: 26,
            color: "blue"
        }
    ], 
    {
        prefab: true,
        x: 175,
        y: 1
    }
));


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
            shape.update(false);
    });
};

Game.draw = function() {
    // Draw code goes here.
    Game.clear();
    // console.log("shapes", shapes);
	shapes.forEach((shape) => {
        // console.log(shape);
        // console.log("shape", shape);
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
            for(let a = 0; a < shapes[i].constituent.length; a++){
                let isOnXAxis = ((mx >=  (shapes[i].x + shapes[i].constituent[a].x)) && (mx <= ((shapes[i].x + shapes[i].constituent[a].x)) + shapes[i].constituent[a].w));
                let isOnYAxis = ((my >= (shapes[i].y+shapes[i].constituent[a].y)) && (my <= ((shapes[i].y+shapes[i].constituent[a].y) + shapes[i].constituent[a].h)));
                if(isOnXAxis && isOnYAxis){
                    // if(smallestShape === undefined){
                    //     smallestShape = shapes[i].constituent[a];
                    // } else {
                        // isOnXAxis = ((shapes[i].constituent[a].x >= smallestShape.x) && (shapes[i].constituent[a].x  <= (smallestShape.x + smallestShape.w)));
                        // isOnYAxis = ((shapes[i].constituent[a].y >= smallestShape.y) && (shapes[i].constituent[a].y <= (smallestShape.y + smallestShape.h)));
                        // if(isOnXAxis && isOnYAxis){
                        //     // console.log(`${smallestShape.id} surrounds ${shapes[i].constituent[a].id}`);
                        //     smallestShape = shapes[i].constituent[a];    
                        // }
                    // }
                    selectedShape = shapes[i];
                }
            }
        }

        if(selectedShape !== undefined && selectedShape.prefab === true){
            // selectedShape = smallestShape;
            // console.log("selected shape", selectedShape);
            // console.log("newShape", newShape);

            /* jshint ignore:start */
            // console.log("selected");
            let newShape = {}; 

            $.extend(true, newShape, selectedShape);  
            
            selectedShape = newShape;

            newShape.followMouse = true;
            newShape.id = getNewId();

            shapes.push(newShape);
            // console.log("new shape", newShape);
            // console.log("new shape", shapes);
            /* jshint ignore:end */
        }
    }
    // console.log(shapes);
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



