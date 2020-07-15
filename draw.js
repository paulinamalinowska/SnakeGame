//Rules and game start
const gameStartButton = document.querySelector('.gameStartButton');
const rulesDiv = document.querySelector('.rules');
const rulesButton = document.querySelector('.gamePlay');
const gameWindow = document.querySelector('.gameWindow');
const closeWindowButton1 = document.querySelector('.closeWindowButton1');
const closeWindowButton2 = document.querySelector('.closeWindowButton2');

gameStartButton.addEventListener('click', () => {
    rulesDiv.classList.add('hidden');
    setTimeout(() => {
        if (gameWindow.classList.contains('hiddenOnStart')) {
            gameWindow.classList.remove('hiddenOnStart');
        } else {
            gameWindow.classList.remove('hidden');
        }
    }, 450)
    gameStart();
})

rulesButton.addEventListener('click', () => {
    gameWindow.classList.add('hidden');
    setTimeout(() => {
        rulesDiv.classList.remove('hidden');
    }, 450);

    clearInterval(game)
})

//creating the game
const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext("2d");

let score = document.querySelector('.score')
const bestScoreDiv = document.querySelector('.high-score')
const scale = 32;

const rows = canvas.height / scale;
const columns = canvas.width / scale;

//mobile arrows
const arrowUp = document.querySelector('.arrowUp');
const arrowDown = document.querySelector('.arrowDown');
const arrowLeft = document.querySelector('.arrowLeft');
const arrowRight = document.querySelector('.arrowRight');

//loading images
const foodImg = new Image();
foodImg.src = 'img/broccoli.png';
const poisonImg = new Image();
poisonImg.src = 'img/poison.png';
const poisonImg2 = new Image();
poisonImg2.src = 'img/poison2.png';

//loading music 
const winSound = new Audio('audio/win.mp3');

const pickLocation = foodList => {
    foodList.forEach((food, index) => {
        const previousFood = foodList[index - 1];
        food.pickLocation();
        
        if (previousFood && previousFood.x === food.x && previousFood.y === food.y) {
            food.pickLocation();
        }
    });
}

//gameplay
const gameStart = function () {
    snake = new Snake(ctx);
    broccoli = new Broccoli(ctx, foodImg);
    burger = new Burger(ctx, poisonImg);
    pizza = new Pizza(ctx, poisonImg2);

    const foodList = [broccoli, burger, pizza];

    pickLocation(foodList);

    let time = snake.checkScoreAndReturnNewSpeed();
    let game;

    const gameLogic = () => {
        if (time !== snake.checkScoreAndReturnNewSpeed()) {
            clearInterval(game);
            time = snake.checkScoreAndReturnNewSpeed();

            game = window.setInterval(gameLogic, time);

            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        foodList.forEach(food => food.draw());

        snake.update();
        snake.draw();

        const eatenFood = foodList
            .find(food => snake.eat(food));

        if (eatenFood) {
            pickLocation(foodList);
        }

        bestScoreDiv.innerText = `REKORD: ${snake.getBestScore()}`
        score.innerText = `TWÓJ WYNIK: ${snake.total}`;
        snake.checkCollision(game);
        snake.lose(game);
        // snake.win();
    }

    game = window.setInterval(gameLogic, time)
};



window.addEventListener('keydown', ((event) => {
    const direction = event.key.replace('Arrow', '') //wyświetla w konsoli sam klawisz klikniety
    snake.changeDirection(direction);
}))

//dodanie eventListenerów na strzałki mobilne
arrowUp.addEventListener('click', (() => {
    const direction = "Up";
    snake.changeDirection(direction)
}))

arrowDown.addEventListener('click', (() => {
    const direction = "Down";
    snake.changeDirection(direction)
}))

arrowLeft.addEventListener('click', (() => {
    const direction = "Left";
    snake.changeDirection(direction)
}))

arrowRight.addEventListener('click', (() => {
    const direction = "Right";
    snake.changeDirection(direction)
}))

