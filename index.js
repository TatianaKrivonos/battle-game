const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d');

const grid = 50;

canvas.width = grid * 20;
canvas.height = grid * 15;

const players = [
  {
    x: canvas.width / 2 + (grid * 4),
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    color: '#D1131F',
    timeout: 0,
    textPosition: canvas.width / 2 + (canvas.width / 4),
    bulletColor: 'rgba(209, 19, 31, 0.65)',
    bulletDirection: -1,
    controls: {
      bulletKey: 'Space',
      leftMoveKey: 'ArrowLeft',
      rightMoveKey: 'ArrowRight',
      topMoveKey: 'ArrowUp',
      bottomMoveKey: 'ArrowDown',
    },
    isTouchLeftBorder: function() {
      return this.x > (canvas.width/2 + this.size)
    },
    isTouchRightBorder: function() {
      return this.x < (canvas.width - this.size)
    },
    isTouchTopBorder: function() {
      return this.y > this.size
    },
    isTouchBottomBorder: function() {
      return this.y < canvas.height - this.size
    },
  },
  {
    x: canvas.width / 2 - (grid * 4),
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    color: '#1D0AF3',
    timeout: 0,
    textPosition: canvas.width / 4,
    bulletColor: 'rgba(29, 10, 243, 0.65)',
    bulletDirection: 1,
    controls: {
      bulletKey: 'KeyF',
      leftMoveKey: 'KeyA',
      rightMoveKey: 'KeyD',
      topMoveKey: 'KeyW',
      bottomMoveKey: 'KeyS',
    },
    isTouchLeftBorder: function() {
      return this.x > this.size
    },
    isTouchRightBorder: function() {
      return this.x < canvas.width/2 - this.size
    },
    isTouchTopBorder: function() {
      return this.y > this.size
    },
    isTouchBottomBorder: function() {
      return this.y < canvas.height - this.size
    },
  }
];

const game = {
  request: '',
  bullets: [],
  bulletSpeed: 5,
};

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  KeyA: false,
  KeyD: false,
  KeyW: false,
  KeyS: false,
};

const shootToAnotherPlayer = (shootingPlayer) => {
  shootingPlayer.timeout = 20;
  game.bullets.push({
    x: shootingPlayer.x + (shootingPlayer.size * shootingPlayer.bulletDirection) + (15 * shootingPlayer.bulletDirection),
    y: shootingPlayer.y - 5,
    speed: game.bulletSpeed * shootingPlayer.bulletDirection,
    size: 10,
    color: shootingPlayer.bulletColor,
  })
}

const checkPressedKey = () => {
  players.forEach(player => {
    if (keys[player.controls.leftMoveKey] && player.isTouchLeftBorder()) {
      player.x -= player.speed;
    }

    if (keys[player.controls.rightMoveKey] && player.isTouchRightBorder()) {
      player.x += player.speed;
    }

    if (keys[player.controls.topMoveKey] && player.isTouchTopBorder()) {
      player.y -= player.speed;
    }

    if (keys[player.controls.bottomMoveKey] && player.isTouchBottomBorder()) {
      player.y += player.speed;
    }    
  })
};

const collisionDetection = (object1, object2) => {
  let collisionX = object1.x < object2.x + object2.size && object1.x + object1.size*2 > object2.x;
  let collisionY = object1.y < object2.y - object2.size + object2.size * 2 && object1.y + object1.size > object2.y - object2.size;
  let collision = collisionX && collisionY;
  return collision;
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  checkPressedKey();
  
  game.bullets.forEach((bull, index) => {
    ctx.fillStyle = bull.color;
    ctx.fillRect(bull.x, bull.y, bull.size, bull.size);
    bull.x += bull.speed;
    if(bull.x < 0 || bull.x > canvas.width) {
      game.bullets.splice(index, 1); 
    }
    players.forEach((player, i) => {
      if(collisionDetection(bull, player)) {
      if(i==0) {
        players[1].score++;
      } else {
        players[0].score++;
      }            
        game.bullets.splice(index, 1); 
      }
    })
  });
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  
  players.forEach((player) => {
    if(player.timeout > 0) {
      player.timeout--;
    }
    
    ctx.fillStyle = player.color;
    ctx.font = `${grid}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${player.score}`, player.textPosition, grid);
    
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  game.request = requestAnimationFrame(draw);
}

const startGame = () => {
  cancelAnimationFrame(game.request)
  players.forEach((player) => {
    player.score = 0;
    player.timeout = 100;
    player.speed = Math.ceil(grid / 8);
    player.size = grid/2 + 5;
    player.y = canvas.height / 2;
  })
  game.request = requestAnimationFrame(draw);
};

canvas.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  if(e.code in keys) {
    keys[e.code] = true;
  }

  players.forEach(player => {
    if (e.code == player.controls.bulletKey && player.timeout <= 0) {
      shootToAnotherPlayer(player);
    }
  });
});

document.addEventListener('keyup', (e) => {
  if(e.code in keys) {
    keys[e.code] = false;
  }
});