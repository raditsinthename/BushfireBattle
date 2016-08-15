////////////////////////////////////////////////////////////////
// Global Variables
///////////////////////////////////////////////////////////////
var c = document.getElementById("myCanvas");
if (c.innerHTML == 'egg'){
	var egg = true;
} else {
	var egg = false;
}
c.style.backgroundColor = 'brown';
var ctx = c.getContext("2d");
ctx.font = "15px Verdana, Geneva, sans-serif";
var loaded = 0;
var selectionMode = 0;
var warnText = '';
var warn = 0;
var GAMEMODE = 0;
var difficulty = 0.1;
var firesExtinguished = 0;
var updateSent = false;
var helisUsed = 0;
var abilitiesUsed = false;


////////////////////////////////////////////////////////////////
// Images
///////////////////////////////////////////////////////////////
var fire_sprite = new Image();
fire_sprite.onload = function() {
	loaded = 1;
}
var background_img = new Image();
background_img.onload = function() {
	loaded = 1;
}

var single_img = new Image();
single_img.onload = function(){
	loaded = 1;
}

var row_img = new Image();
row_img.onload = function(){
	loaded = 1;
}

var col_img = new Image();
col_img.onload = function(){
	loaded = 1;
}

var bomb_img = new Image();
bomb_img.onload = function(){
	loaded = 1;
}

if (egg) {
	background_img.src = 'background2.png';
	fire_sprite.src = 'error.png';
	single_img.src = 'notepad.png';
	row_img.src = 'file_row.png';
	col_img.src = 'file_col.png';
	bomb_img.src = 'reboot.png';
} else {
	background_img.src = 'background.png';
	fire_sprite.src = 'Fire1.png';
	single_img.src = 'single.png';
	row_img.src = 'row.png';
	col_img.src = 'col.png';
	bomb_img.src = 'bomb.png';
}

function fireAnim(x,y,frame){
	if (!egg) {
		ctx.drawImage(fire_sprite,frame*96,0,96,96,x,y,50,50);
	} else {
		ctx.drawImage(fire_sprite,x+5,y-1,41,48);
	}
}

////////////////////////////////////////////////////////////////
// Abilities
///////////////////////////////////////////////////////////////
function Ability(name,num,cooldown,key,image,maxCooldown){
	this.name = name;
	this.num = num;
	this.cooldown = cooldown;
	this.key = key;
	this.image = image;
	this.maxCooldown = maxCooldown || 4;
}

Ability.prototype.drawBox = function(ctx){
	ctx.drawImage(this.image,this.num*110+100,590);	
	ctx.textAlign = "left";
	ctx.fillStyle = "white";
	ctx.font = '15px Verdana, Geneva, sans-serif'
	ctx.fillText(this.key,this.num*110+103,602);
	
	//if on cooldown draw timer
	if (this.cooldown > 0){
		ctx.beginPath();
		ctx.fillStyle = "rgba( 0, 0, 0, 0.8)";
		ctx.fillRect(this.num*110+100,590,70,90);
		ctx.closePath();
		
		ctx.beginPath();
		ctx.fillStyle = "white";
		if (this.maxCooldown == 6) {
			ctx.arc(this.num*110+135,635,30,1.5*Math.PI,(((2*Math.PI)/6)*this.cooldown)+1.5*Math.PI);
		}
		else {
			ctx.arc(this.num*110+135,635,30,1.5*Math.PI,((0.5*Math.PI)*this.cooldown)+1.5*Math.PI);
		}
		ctx.stroke();
		ctx.closePath();
	}
}

var singleAbility = new Ability('single',0,0,'Q',single_img);
var rowAbility = new Ability('row',1,4,'W',row_img);
var colAbility = new Ability('column',2,4,'E',col_img);
var bombAbility = new Ability('bomb',3,6,'R',bomb_img,6);
	



////////////////////////////////////////////////////////////////
// Selection Boxes
///////////////////////////////////////////////////////////////

var selection = [0,0];
var playerPhase = true;
var hasMoved = false;
var bombSelectionArray = [[0,0,0,1,0,0,0],
						  [0,0,1,1,1,0,0],
						  [0,1,1,1,1,1,0],
						  [1,1,1,1,1,1,1],
						  [0,1,1,1,1,1,0],
						  [0,0,1,1,1,0,0],
						  [0,0,0,1,0,0,0]]


function SelectionBox(){
	this.x = selection[0];
	this.y = selection[1]; 
}

function colSelectionBox(){
	this.x = selection[0];
}

function rowSelectionBox(){
	this.y = selection[1];
}

function bombSelectionBox(){
	this.x = selection[0];
	this.y = selection[1];
}

bombSelectionBox.prototype.draw = function(ctx){
	ctx.strokStyle = '#00ffff';
	ctx.lineWidth=5;
	for (i=0;i < 7;i++){
		for (j=0;j < 7;j++){
			if ((bombSelectionArray[i][j] == 1) && (this.y-(j-3) > -1)  && (this.x-(i-3) > -1) && (this.y-(j-3) < 10) && (this.x-(i-3) < 10)){
				ctx.beginPath();
				ctx.rect((this.x-(i-3))*50+50,(this.y-(j-3))*50+50,50,50);
				ctx.stroke();
				ctx.closePath();
			}
		}	
	}
}
rowSelectionBox.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.strokeStyle = '#00ffff';
	ctx.lineWidth=5;
	ctx.rect(50,this.y*50+50,500,50);
	ctx.stroke();
	ctx.closePath();
}

colSelectionBox.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.strokeStyle = '#00ffff';
	ctx.lineWidth=5;
	ctx.rect(this.x*50+50,50,50,500);
	ctx.stroke();
	ctx.closePath();
}

SelectionBox.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.strokeStyle = '#00ffff';
	ctx.lineWidth=5;
	ctx.rect(this.x*50+50,this.y*50+50,50,50);
	ctx.stroke();
	ctx.closePath();
}

var sCol = new colSelectionBox();
var s = new SelectionBox();
var sRow = new rowSelectionBox();
var sBomb = new bombSelectionBox();


////////////////////////////////////////////////////////////////
// Beginning, Win and Fail screens
///////////////////////////////////////////////////////////////
function drawBeginScreen(ctx){
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.clearRect(0,0,600,700);
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.font = '40px Verdana, Geneva, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('Hit [space] to begin.',300,350);
	ctx.closePath();
}

function drawWinScreen(ctx){
	ctx.clearRect(0,0,600,700);
	ctx.beginPath();
	ctx.font = '40px Verdana, Geneva, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('You Win!', 300,350);
	ctx.fillText('Hit [space] to play again.',300,400);
	ctx.closePath;
}

function drawFailScreen(ctx){
	ctx.clearRect(0,0,600,700);
	ctx.beginPath();
	ctx.font = '40px Verdana, Geneva, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('You Lose!', 300,350);
	ctx.fillText('Hit [space] to play again.',300,400);
	ctx.closePath;
}

////////////////////////////////////////////////////////////////
// Game Elements
///////////////////////////////////////////////////////////////
 var map = [ [0,0,0,0,0,0,0,0,0,0],
			 [0,0,0,0,0,0,0,0,0,0], 
			 [0,0,0,0,0,0,0,0,0,0], 
			 [0,0,0,0,0,0,0,0,0,0], 
			 [0,0,0,0,0,0,0,0,0,0], 
			 [0,0,0,0,0,0,0,0,0,0], 
			 [0,0,0,0,0,0,0,0,0,0], 
			 [0,0,0,0,0,0,0,0,0,0], 
			 [0,0,0,0,0,0,0,0,0,0], 
			 [0,0,0,0,0,0,0,0,0,0], 
			 ];
			 
			 
function drawMap(){
	for (i=0; i < map.length; i++){
		for(j=0; j < map[i].length; j++){
			if (map[i][j] !== 0) {
				map[i][j].draw();
			}
		}
	}
}
	
	
//fire object
function Fire(row, column){
	this.row = row;
	this.col = column;
	this.x = this.col*50+50;
	this.y = this.row*50+50;
	map[row][column] = this;
	animArray = [0,1,2,3,2,1]
	this.curAnimFrame = 0;
	
	this.draw = function(){
		fireAnim(this.x,this.y,animArray[Math.floor(this.curAnimFrame/10)]);
		this.curAnimFrame = (this.curAnimFrame + 1) % 60;
	};
	
	this.destroy = function(){
		map[row][column] = 0;
		delete this;
	}
	
	this.spread = function(){
		if (Math.random() < 0.5+difficulty){
			switch (Math.floor(Math.random()*4+1)) {
				case 1:
					if(this.row !== 0){
						if(map[this.row-1][this.col] == 0){
							map[this.row-1][this.col] = new Fire(this.row-1,this.col);
							numOfFires += 1;
						}
					}
					break;
				case 2:
					if(this.col !== 9){
						if(map[this.row][this.col+1] == 0){
							map[this.row][this.col+1] = new Fire(this.row,this.col+1);
							numOfFires +=1;
						}
					}
					break;
				case 3:
					if(this.row !==9){
						if(map[this.row+1][this.col] == 0){
							map[this.row+1][this.col] = new Fire(this.row+1,this.col);
							numOfFires += 1;
						}
					}
					break;
				case 4:
					if(this.col !==0){
						if(map[this.row][this.col-1] == 0){
							map[this.row][this.col-1] = new Fire(this.row,this.col-1);
							numOfFires += 1;
						}
					}
					break;
			}
		}
	}
}
	
	
	
//draw fire
var initFire1 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
var initFire2 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
var initFire3 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
var initFire4 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
var initFire5 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
var numOfFires = 5;

//reallocate important variables for initialising a new game
function initNewGame(){
	map = [ [0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0,0], 
		 [0,0,0,0,0,0,0,0,0,0], 
		 [0,0,0,0,0,0,0,0,0,0], 
		 [0,0,0,0,0,0,0,0,0,0], 
		 [0,0,0,0,0,0,0,0,0,0], 
		 [0,0,0,0,0,0,0,0,0,0], 
		 [0,0,0,0,0,0,0,0,0,0], 
		 [0,0,0,0,0,0,0,0,0,0], 
		 [0,0,0,0,0,0,0,0,0,0], 
		 ];
		 
	numOfFires = 0;
	initFire1 = null;
	initFire1 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
	initFire2 = null;
	initFire2 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
	initFire3 = null;
	var initFire3 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
	initFire4 = null;
	var initFire4 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
	initFire5 = null;
	var initFire5 = new Fire(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
	for (i=0; i < map.length; i++) {
		for (j=0; j < map.length; j++) {
			if (map[i][j] != '0') {
				numOfFires += 1;
			}
		}
	}
	
	
	singleAbility = new Ability('single',0,0,'Q',single_img);
	rowAbility = new Ability('row',1,4,'W',row_img);
	colAbility = new Ability('column',2,4,'E',col_img);
	bombAbility = new Ability('bomb',3,6,'R',bomb_img,6);
	
	updateSent = false;
	firesExtinguished = 0;
	helisUsed = 0;
}
	
////////////////////////////////////////////////////////////////
// Keyboard input listener 
///////////////////////////////////////////////////////////////	
document.addEventListener('keydown', function(event) {
	if (GAMEMODE == 0 || GAMEMODE == 2 || GAMEMODE == 3){
		if(event.keyCode == 32){
			GAMEMODE = 1;
			initNewGame();
		}
	}
	else if (GAMEMODE == 1){
		if([38,40].indexOf(event.keyCode) > -1){
			event.preventDefault();
		}
		if (playerPhase == true){
			if(event.keyCode == 37) {
				if(selection[0] > 0){selection[0] -= 1;};
				s.x=selection[0];
				sCol.x=selection[0];
				sBomb.x=selection[0];
			}
			else if(event.keyCode == 39) {
				if(selection[0] < 9) {selection[0] += 1;};
				s.x=selection[0];
				sCol.x=selection[0];
				sBomb.x=selection[0];
			}
			else if(event.keyCode == 40) {
				if(selection[1] < 9){selection[1] += 1;};
				s.y=selection[1];
				sRow.y=selection[1];
				sBomb.y=selection[1];
			}
			else if(event.keyCode == 38) {
				if(selection[1] > 0) {selection[1] -= 1;};
				s.y=selection[1];
				sRow.y=selection[1];
				sBomb.y=selection[1];
			}
			else if(event.keyCode == 32) {
				if (selectionMode == 0){
					if(map[selection[1]][selection[0]] !== 0){
						map[selection[1]][selection[0]].destroy();
						numOfFires -= 1;
						firesExtinguished += 1;
						hasMoved = true;
					}
				}
				else if (selectionMode == 1){
					abilitiesUsed = true;
					for (i = 0;i < map[1].length; i++){
						if(map[selection[1]][i] !== 0){
							map[selection[1]][i].destroy();
							numOfFires -= 1;
							firesExtinguished += 1;
						}
					}
					rowAbility.cooldown = 5;
					hasMoved = true;
				}
				else if (selectionMode == 2){
					abilitiesUsed = true;
					for (i = 0; i < map[1].length; i++){
						if(map[i][selection[0]] !== 0){
							map[i][selection[0]].destroy();
							numOfFires -= 1;
							firesExtinguished += 1;
						}
					}
					colAbility.cooldown = 5;
					hasMoved = true;
				}
				else if (selectionMode == 3){
					abilitiesUsed = true;
					for (i = 0; i < 7; i++){
						for (j = 0; j < 7; j++){
							if ((bombSelectionArray[i][j] == 1) && (selection[1]-(j-3) > -1) && (selection[1]-(j-3) < 10) && (selection[0]-(i-3) > -1) && (selection[0]-(i-3) < 10) && (map[selection[1]-(j-3)][selection[0]-(i-3)] !== 0) ){
								map[selection[1]-(j-3)][selection[0]-(i-3)].destroy();
								numOfFires -= 1;
								firesExtinguished += 1;
							}
						}
					}
					bombAbility.cooldown = 7;
					helisUsed += 1;
					hasMoved = true;
					
				}
			}
			else if(event.keyCode == 81) {
				selectionMode = 0;
			}
			else if(event.keyCode == 87){
				if (rowAbility.cooldown == 0){
					selectionMode = 1;
				}
				else {
					warnText = 'Row is on cooldown for ' + parseInt(rowAbility.cooldown) + ' more turns!';
					warn = 240;
				}
			}
			else if(event.keyCode == 69){
				if (colAbility.cooldown == 0){
					selectionMode = 2;
				}
				else {
					warnText = 'Column is on cooldown for ' + parseInt(colAbility.cooldown) + ' more turns!';
					warn = 240;
				}
			}
			else if(event.keyCode == 82){
				if (bombAbility.cooldown == 0){
				selectionMode = 3;
				}
				else {
					warnText = 'Heli is on cooldown for ' + parseInt(bombAbility.cooldown) + ' more turns!';
					warn = 240;
				}
			}
	}
}
});

////////////////////////////////////////////////////////////////
// Game Loop
///////////////////////////////////////////////////////////////
	var turn = 0;
	function draw(){
		if (GAMEMODE == 0){
			playerPhase = false;
			drawBeginScreen(ctx);
		}
		else if (GAMEMODE == 1){
			ctx.clearRect(0,0,600,600);
			ctx.drawImage(background_img,0,0);
			if(selectionMode == 0){
				s.draw(ctx);
			}
			if(selectionMode == 1){
				sRow.draw(ctx);
			}
			else if(selectionMode == 2){
				sCol.draw(ctx);
			}
			else if(selectionMode == 3){
				sBomb.draw(ctx);
			}
			
			//draw fires
			drawMap();
			
			//draw cooldown warning text
			if (warn > 0){
				ctx.fillStyle = "black";
				ctx.textAlign = "center";
				ctx.font = '15px Verdana, Geneva, sans-serif';
				ctx.fillText(warnText,300,580);
				warn -= 1;
			}
			
			//draw selection boxes
			singleAbility.drawBox(ctx);
			rowAbility.drawBox(ctx);
			colAbility.drawBox(ctx);
			bombAbility.drawBox(ctx);
			
			//draw percentage of on fire
			ctx.font = '25px Verdana, Geneva, sans-serif';
			ctx.textAlign = 'center';
			ctx.fillStyle = "rgb("+Math.round((255/75)*numOfFires)+","+Math.round(255-(255/75)*numOfFires)+",0)";
			if (!egg) {
				ctx.fillText("Percentage on fire: "+numOfFires+"%",300,35);
			} else {
				ctx.fillText("Corrupt Files: " +numOfFires+"%",300,35);
			}
		}
		else if (GAMEMODE == 2){
			drawWinScreen(ctx);
			
		}
		else if (GAMEMODE == 3){
			drawFailScreen(ctx);
			
		}
	}
	
	function update(){
		if(turn == 0){			
			playerPhase = true;
			if (hasMoved == true){
			//change selection mode back to single
			selectionMode = 0;
			
			//lower cooldowns
			rowAbility.cooldown = (rowAbility.cooldown == 0) ? 0: rowAbility.cooldown - 1;
			colAbility.cooldown = (colAbility.cooldown == 0) ? 0: colAbility.cooldown - 1;
			bombAbility.cooldown = (bombAbility.cooldown == 0) ? 0: bombAbility.cooldown - 1;
			
			//swap turn to fire's turn
			turn = (turn+1)%2;
			}
			
			
		}
		else if (turn == 1){
			playerPhase = false;
			//spread fires
			for (i=0; i < map.length; i++){
				for(j=0; j < map[i].length; j++){
					if(map[i][j] !== 0){
						map[i][j].spread();
					}
				}
			}
			hasMoved = false;
			turn = (turn+1)%2;
		}
		//Set GAMEMODE
		if(numOfFires == 0){				
			GAMEMODE = 2;
			if (!updateSent){
				$.post(window.location.href.split('/')[1]+'/update?w=1&l=0&f='+firesExtinguished+'&h='+helisUsed+'&a='+abilitiesUsed);
				updateSent = true;
			}
		}
		if(numOfFires > 75){
			GAMEMODE = 3;
			if (!updateSent){
				$.post(window.location.href.split('/')[1]+'/update?w=0&l=1&f='+firesExtinguished+'&h='+helisUsed);
				updateSent = true;
			}
		}
		
	}
	
	setInterval(function() { update(); draw();}, 1000/60);