const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d');

const toggleBtnFirst = document.querySelector('.toggle-btn.first-player');
const toggleBtnSecond = document.querySelector('.toggle-btn.second-player');

const grid = 50;

canvas.width = grid * 20;
canvas.height = grid * 15;

const mind = [
  {
    thinking: false,
    directionX: 1,
    directionY: 5,
    count: 0,
  },
  {
    thinking: false,
    directionX: 1,
    directionY: 5,
    count: 0,
  }
];

const players = [
  {
    x: canvas.width / 2 + (grid * 4),
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    color: 'red',
    cooldown: 0,
    pos: canvas.width / 2 + (canvas.width / 4),
  },
  {
    x: canvas.width / 2 - (grid * 4),
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    color: 'blue',
    cooldown: 0,
    pos: canvas.width / 4,
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

toggleBtnFirst.addEventListener('click', (e) => {
  if(!mind.thinking) {
    mind.thinking = true;
    toggleBtnFirst.textContent = 'Turn off';
    toggleBtnFirst.style.backgroundColor = 'green'
  } else {
    mind.thinking = false;
    toggleBtnFirst.textContent = 'Turn on';
    toggleBtnFirst.style.backgroundColor = 'red'
  }
});

document.addEventListener('keydown', (e) => {
  if(e.code in keys) {
    keys[e.code] = true;
  }
  
  if(e.code == 'Space' && players[0].cooldown <= 0) {
    players[0].cooldown = 20;
    game.bullets.push({
      x: players[0].x - players[0].size - 15,
      y: players[0].y - 5,
      speed: -game.bulletSpeed,
      size: 10,
      color: '#3836C6',
    })
  }
  
  if(e.code == 'KeyF' && players[1].cooldown <= 0) {
    players[1].cooldown = 20;
    game.bullets.push({
      x: players[1].x + players[1].size + 15,
      y: players[1].y - 5,
      speed: game.bulletSpeed,
      size: 10,
      color: '#DA2FD3',
    })
  }
});

document.addEventListener('keyup', (e) => {
  if(e.code in keys) {
    keys[e.code] = false;
  }
});

const checkPressedKey = () => {
  if(mind.thinking) {
    let shootTime = Math.floor(Math.random() * 5 + 1);

    if(shootTime == 1 && players[1].cooldown <=0) {
      players[1].cooldown = Math.floor(Math.random() * 20) + 7;
      game.bullets.push({
        x: players[1].x + players[1].size + 15,
        y: players[1].y - 5,
        speed: game.bulletSpeed,
        size: 10,
        color: '#DA2FD3',
      })
    }
    
    if(mind.count > 0) {
      mind.count--;
    } else {
      let buffer = Math.floor(Math.random() * 20);
      let bufferX = Math.floor(Math.random() * 7);
      let bufferY = Math.floor(Math.random() * 2) + 3;
        
      if(bufferX == 1) {
        mind.directionX = -1;
      } else if (bufferX == 2) {
        mind.directionX = 1;
      } else {
        mind.directionX = 0;
      }
      
      mind.count = 30;
      
      if(players[1].y + buffer < players[0].y) {
        mind.directionY = bufferY;
      } else if (players[1].y + buffer > players[0].y) {
        mind.directionY = -bufferY;
      }
    }
    
    // incoming bullet check
    game.bullets.forEach((bull, index) => {
      if (bull.spped < 0) {
        mind.count = 30;
        
        if (bull.y <= players[1].y) {
          mind.directionY = -bufferY;
        } else {
          mind.directionY = bufferY;
        }
      }
    });
    
    if (!(players[1].y > (players[1].size / 2) && players[1].y - players[1].size < canvas.height)) {
      mind.directionY *= -1;
      mind.count = 0;
    }
    
     if (!(players[1].x > (players[1].size / 2) && players[1].x - players[1].size < canvas.width - players[1].size)) {
       mind.directionX *= -1;
     }
    
    players[1].y += mind.directionY;
    players[1].x += mind.directionX;
  }
  
  if(keys['ArrowLeft'] && players[0].x > (canvas.width/2 + players[0].size)) {
    players[0].x -= players[0].speed;
  };
  if(keys['ArrowRight'] && players[0].x < (canvas.width - players[0].size)) {
    players[0].x += players[0].speed;
  };
  if(keys['ArrowUp'] && players[0].y > players[0].size) {
    players[0].y -= players[0].speed;
  };
  if(keys['ArrowDown'] && players[0].y < canvas.height - players[0].size) {
    players[0].y += players[0].speed;
  };
  
  if(keys['KeyA'] && players[1].x > players[1].size) {
    players[1].x -= players[1].speed;
  };
  if(keys['KeyD'] && players[1].x < canvas.width/2 - players[1].size) {
    players[1].x += players[1].speed;
  };
  if(keys['KeyW'] && players[1].y > players[1].size) {
    players[1].y -= players[1].speed;
  };
  if(keys['KeyS'] && players[1].y < canvas.height - players[1].size) {
    players[1].y += players[1].speed;
  };
}

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
    if(player.cooldown > 0) {
      player.cooldown--;
    }
    
    ctx.fillStyle = player.color;
    ctx.font = `${grid}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${player.score}`, player.pos, grid);
    
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
    player.cooldown = 100;
    player.speed = Math.ceil(grid / 8);
    player.size = grid/2 + 5;
    player.y = canvas.height / 2;
  })
  game.request = requestAnimationFrame(draw);
};

canvas.addEventListener('click', startGame);