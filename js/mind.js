// TO DO Artificial Intelligence for players

const toggleBtnFirst = document.querySelector('.toggle-btn');

const mind = [
  {
    thinking: false,
    directionX: 1,
    directionY: 5,
    count: 0,
  }
];

toggleBtnFirst.addEventListener('click', (e) => {
if(!mind.thinking) {
  mind.thinking = true;
  toggleBtnFirst.style.backgroundColor = 'green'
} else {
    mind.thinking = false;
    toggleBtnFirst.style.backgroundColor = 'red'
  }
});  

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
