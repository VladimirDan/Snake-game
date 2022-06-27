

const items = {
	none: "none",
	snake:"snake",
	berry:"berry",
}


const gameMode = {
	score: 0,
	snakeSpeed: 300,
	berrySpawnFrequency: 1000,
};


const backgrounds = {
  snake: "snake",
  berry:  "berry",
  none:  "none",
};


const gameField = {
  fieldHeight:  10,
  fieldWidth:  10,
  cellsCount:  0,
  cells: [],
  infoPanel: document.getElementById("infoPanel"),
	oppositeDirections: [["up","down"],["right","left"]],

  createField(){
		gameField.cellsCount = gameField.fieldHeight * gameField.fieldWidth;
		for(let i = 0; i < gameField.cellsCount; i++){
			gameField.cells.push({item: items.none, coords: i,});
		}
  },

  randomCellCoords(){
		return (Math.floor(Math.random() * gameField.fieldHeight) * 10 +
		 Math.floor(Math.random() * gameField.fieldWidth));
	},

  randomEmptyCellCoords(){
  	if(!gameField.isThereEmptyCell()) gameField.gameLost();

		const coords = gameField.randomCellCoords();
		return gameField.cells[coords].item === items.none ? coords : gameField.randomEmptyCellCoords();
  },

  showMessage(text){
    infoPanel.innerHTML = text;
  },

  changeCellBackground(index, background){
    document.getElementById(index).setAttribute("class", background);
  },

  changeCell(index, item)
  {
    gameField.cells[index].item = item;
  },

  gameStop(){
  	clearInterval(snake.moving);
  },

  windowReload(){
  	window.location.reload(true);
  },

  gameLost(){
  	gameField.gameStop();
  	gameField.showMessage("You lost");
  	window.addEventListener("keydown",gameField.windowReload);
  },

  isThereEmptyCell(){
		for(let i = 0; i < gameField.cellsCount; i++){
			if(gameField.cells[i].item === items.none){
				return true;
			}
		}
	},
};

const directions = {
		up: -gameField.fieldWidth,
		down: gameField.fieldWidth,
		right: 1,
		left: -1,
};


const controller = {
	oppositeDirections: [["up","down","left","right"], ["down","up", "right","left"]],
	buttons: ["KeyW","KeyS","KeyD","KeyA"],
	buttonsDirection : {
		KeyW : ["up", directions.up],
		KeyS : ["down", directions.down],
		KeyD : ["right", directions.right],
		KeyA : ["left", directions.left],
	},

	isProperCode(code){
		const isProperButton = controller.buttons.includes(code);

		if(!isProperButton){
			return false;
		}

		for(const button in controller.buttonsDirection){
			const directionName = controller.buttonsDirection[button][0];
			const directionNameIndex = controller.oppositeDirections[0].indexOf(directionName);
			const oppositeDirectionName = controller.oppositeDirections[1][directionNameIndex];

			if(button === code && snake.directionName !== oppositeDirectionName){
				return true;
			}
		}
		return false;
	},
};


const snake = {
	snakeHead: 0,
	direction: 1,
	directionName: "",
	moving: 0,
	snakeBody: [],

	lose(){
		let goOutTheField = false;
  	const purpose = snake.snakeHead + snake.direction;
  	const purposeIsOutX = Math.floor(purpose / gameField.fieldWidth) !==  Math.floor(snake.snakeHead / gameField.fieldWidth);
  	const purposeIsOutY = purpose >= gameField.cellsCount || purpose < 0;
  	const snakeIsGoingLR = snake.directionName === "left" || snake.directionName === "right";

		if(purposeIsOutY || (purposeIsOutX && snakeIsGoingLR)){
  		goOutTheField = true;
  		gameField.gameLost(gameField)
  		return goOutTheField;
  	}

  	
  	const snakeIsBitingItSelf = gameField.cells[purpose].item === items.snake && purpose !== snake.snakeBody[0];

  	if(snakeIsBitingItSelf){
  		gameField.gameLost(gameField);
  		return bitYourself;
  	}
  },

	step(){

		if(snake.lose(snake)){
			return;
		}
		
		snake.snakeHead += snake.direction;

		if(!berry.berryEat(berry, snake)){
		  snake.deleteTail(snake);
	  }

	  snake.addHead(snake);
	},

	turn(eventObject){
		if(controller.isProperCode(eventObject.code)){
			clearInterval(snake.moving);
		  snake.changeDirection(eventObject.code, snake);
		  snake.moving = setInterval(snake.step, gameMode.snakeSpeed);
	  }
	},

	changeDirection(code){
		for(const temp in controller.buttonsDirection)
		{
			if(temp === code)
			{
				snake.direction = controller.buttonsDirection[temp][1];
				snake.directionName = controller.buttonsDirection[temp][0];
			}
		}
	},
	
	snakeSpawn() {
	  snake.snakeHead = gameField.randomEmptyCellCoords(gameField);
	  snake.snakeBody.push(snake.snakeHead);
		gameField.changeCellBackground(snake.snakeHead, backgrounds.snake);
		gameField.changeCell(snake.snakeHead, items.snake);
  },

  deleteTail(){
  	gameField.changeCellBackground(snake.snakeBody[0], backgrounds.none);
		gameField.changeCell(snake.snakeBody[0], items.none)
		snake.snakeBody.shift();
	},

	addHead(){
		gameField.changeCellBackground(snake.snakeHead, backgrounds.snake);
	  gameField.changeCell(snake.snakeHead, items.snake)
		snake.snakeBody.push(snake.snakeHead);
	},
  
};


const berry = {
	item:  "berry",
	berryCoords: 0,

	berrySpawn(){
		berry.berryCoords = gameField.randomEmptyCellCoords();
		gameField.changeCellBackground(berry.berryCoords, backgrounds.berry);
		gameField.changeCell(berry.berryCoords, items.berry)
	},
	berryEat(){
		if(snake.snakeHead === berry.berryCoords){
			berry.berrySpawn();
			gameMode.score += 100;
			gameField.showMessage(gameMode.score);
			return true;
		}
	},
};

function gameStart(){
	gameField.createField();
	snake.snakeSpawn();
	berry.berrySpawn();
	window.addEventListener("keydown",snake.turn);
}

gameStart();
