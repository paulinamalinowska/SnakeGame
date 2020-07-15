function Snake(context) {
  this.x = 9 * scale;
  this.y = 9 * scale;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];

  this.getBestScore = () => {
    if (localStorage.getItem('best') === null) {
      return bestScore = 0
    } else {
      return bestScore = localStorage.getItem('best')
    }
  }
  this.draw = () => {
    context.fillStyle = "white";
    // ctx.strokeStyle = "brown";
    // ctx.strokeRect(this.x, this.y, scale, scale);

    for (let i = 0; i < this.tail.length; i++) {
      context.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
      // ctx.strokeRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    context.fillRect(this.x, this.y, scale, scale);
  }

  this.update = () => {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.total - 1] =
      { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

  }

  this.changeDirection = (direction) => {
    if (direction === 'Up' && this.dir != "DOWN") {
      this.xSpeed = 0;
      this.ySpeed = -scale * 1;
      this.dir = "UP";
    }

    else if (direction === 'Down' && this.dir != "UP") {
      this.xSpeed = 0;
      this.ySpeed = scale * 1;
      this.dir = "DOWN";
    }

    else if (direction === 'Left' && this.dir != "RIGHT") {
      this.xSpeed = -scale * 1;
      this.ySpeed = 0;
      this.dir = "LEFT";
    }

    else if (direction === 'Right' && this.dir != "LEFT") {
      this.xSpeed = scale * 1;
      this.ySpeed = 0;
      this.dir = "RIGHT";
    }
  }

  this.eat = food => {
    if (!(this.x === food.x && this.y === food.y)) {
      return;
    }

    if (food.isHealthy()) {
      this.total++;

    } else {
      this.removeLastTailElement();
    }

    return food;
  }

  this.removeLastTailElement = () => {
    this.total--;
    this.tail.shift();
  }

  this.checkCollision = (intervalId) => {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        if (this.total > bestScore) {
          localStorage.setItem('best', this.total)
        }
        this.notifyAndClearGameState(intervalId);
      }
    }
  }

  this.notifyAndClearGameState = (intervalId) => {
    this.tail = [];

    clearInterval(intervalId);
    let repeat;

    if(this.total > bestScore) {
      repeat = window.confirm(`Gratulacje!!! Mimo, że przegrałeś, to pobiłeś swój rekord zdobywając ${this.total} punktów. Czy chcesz zagrać jeszcze raz?`)
    } else {
      repeat = window.confirm(`Przegrałeś, zdobyłeś ${this.total} punktów. Czy chcesz zagrać jeszcze raz?`)
    }
    if (repeat) {
      gameStart();
    } else {
      window.close()
    }

    this.total = 0;
  }

  

  this.lose = (intervalId) => {
    if (this.x < 0 || this.x > 19 * scale || this.y < 0 ||
      this.y > 19 * scale || this.total < 0) {

      if (this.total > bestScore) {
        localStorage.setItem('best', this.total)
        winSound.play();
      }
      this.notifyAndClearGameState(intervalId);
    }
  }

  // this.win = () => {
  //   if (this.total === 10) {
//     winSound.play();


  //   let repeat = window.confirm(`WYGRAŁEŚ, GRATULACJE!!! Czy chcesz zagrać jeszcze raz?`)
  //     if(repeat) {
  //       gameStart();
  //     } else {
  //       window.close()
  //     }
  //   }
  // }

  
  this.checkScoreAndReturnNewSpeed = () => {
    if (this.total <= 2) {
      return 300;
    }
    
    if (this.total > 1 && this.total <= 5) { 
      return 200;
    }

    return 100;
  }


}

class Food {
  constructor(canvas, imgSource) {
    this.imageSource = imgSource;
    this.canvas = canvas;
  }

  pickLocation = () => {
    this.x = (Math.floor(Math.random() *
      columns - 1) + 1) * scale;
    this.y = (Math.floor(Math.random() *
      rows - 1) + 1) * scale;
  }

  draw = () => {
    this.canvas.drawImage(this.imageSource, this.x, this.y)
  }
}

class Pizza extends Food {
  isHealthy = () => false;

  constructor(canvas, foodIcon) {
    super(canvas, foodIcon);
  }
}

class Burger extends Food {
  isHealthy = () => false;

  constructor(canvas, foodIcon) {
    super(canvas, foodIcon)
  }
}

class Broccoli extends Food {
  isHealthy = () => true;

  constructor(canvas, foodIcon) {
    super(canvas, foodIcon);
  }
}