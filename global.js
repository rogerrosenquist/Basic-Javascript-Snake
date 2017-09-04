//constants
var Cols = 26;
var Rows = 26;

//Ids for the grid
var Empty = 0;
var Snake = 1;
var Food = 2;

//need some direction to go
var Left = 0;
var Up = 1;
var Right = 2;
var DOWN = 3;

//need some keycodes to move
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var grid = {

	width: null,
	height: null,
	_grid: null,

	init: function(d, c, r){
		this.width = c;
		this.height = r;

		this._grid = [];
		for (var x = 0; x < c; x++){
			this._grid.push([]);
			for (var y = 0; y < r; y++){
				this._grid[x].push(d);

			}
		}

	},

	set: function(val, x, y){

		this._grid[x][y] = val;

	},

	get: function(x, y){

		return this._grid[x][y];

	}
}

var snake = {

	direction: null,
	last: null,
	_queue: null,

	init: function (d, x, y){

		this.direction = d;
		this._queue = [];
		this.insert(x,y);

	},

	insert: function(x, y){

		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];


	},

	remove: function(){

		return this._queue.pop();

	}

}

function setFood(){

	var empty = [];
	for (var x = 0; x < grid.width; x++){
		for (var y = 0; y < grid.height; y++)
			if (grid.get(x,y) === Empty)
				empty.push({x:x, y:y});
	}

	var randpos = empty[Math.floor(Math.random()*empty.length)];
	grid.set(Food, randpos.x, randpos.y);

}

//Need to make game objects
var canvas, ctx, keystate, frames, score;

function main(){

	canvas = document.createElement("canvas");
	canvas.width = Cols * 20;
	canvas.height = Rows * 20;
	ctx = canvas.getContext("2d");
	var canvas_container = document.getElementById("canvas_container");
	console.log(canvas_container);
	canvas_container.appendChild(canvas);

	ctx.font = "12px Helvetica";

	frames = 0;
	keystate = {};
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});

	init();
	loop();
}

function init(){

	score = 0;
	grid.init(Empty, Cols, Rows);

	var sp = {x:Math.floor(Cols/2), y:Rows - 1};
	snake.init(Up, sp.x, sp.y);
	grid.set(Snake, sp.x, sp.y);

	setFood();

}

function loop(){

	update();
	draw();

	window.requestAnimationFrame(loop, canvas);

}

function update(){

	frames++;

	if (keystate[KEY_LEFT] && snake.direction !== Right)
		snake.direction = Left;

	if (keystate[KEY_UP] && snake.direction !== DOWN)
		snake.direction = Up;

	if (keystate[KEY_RIGHT] && snake.direction !== Left)
		snake.direction = Right;

	if (keystate[KEY_DOWN] && snake.direction !== Up)
		snake.direction = DOWN;

	if (frames%5 === 0)
	{
		var nx = snake.last.x;
		var ny = snake.last.y;

		switch (snake.direction){
			case Left:
				nx--;
				break;
			case Up:
				ny--;
				break;
			case Right:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}


		//if snake hits a wall, new game starts
		if (0 > nx || nx > grid.width - 1 || 0 > ny || ny > grid.height - 1){

			return init();

		}

		//if snake hits hitself, new game starts
		if (grid.get(nx, ny) === Snake){

			return init();

		}

		//snake grows with food, and a new food appears
		if (grid.get(nx, ny) === Food){

			var tail = {x:nx, y:ny};
			score++;
			setFood();

		} else{
			
			var tail = snake.remove();
			grid.set(Empty, tail.x, tail.y);
			tail.x = nx;
			tail.y = ny;

		}

		grid.set(Snake, tail.x, tail.y);
		snake.insert(tail.x, tail.y);
	}

}

function draw(){

	var tw = canvas.width / grid.width;
	var th = canvas.height / grid.height;

	for (var x = 0; x < grid.width; x++){
		for (var y = 0; y < grid.height; y++){
			switch (grid.get(x,y)){
				case Empty:
					ctx.fillStyle = "#fff";
					break;
				case Snake:
					ctx.fillStyle = "#0ff";
					break;
				case Food:
					ctx.fillStyle = "#f00";
					break;
			}

			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}

	ctx.fillStyle = "#000";
	ctx.fillText("SCORE:" + score, 10, canvas.height - 10);

}

window.onload = function(){
	main();
};

