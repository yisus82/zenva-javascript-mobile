let level = 1;
let restart = false;

const showMessage = messageText => {
  // Get the modal
  const modal = document.getElementById('messageBox');

  // Get the <span> element that closes the modal
  const close = document.getElementById('close');

  // Get the <span> element to set the message text
  const message = document.getElementById('message');
  message.innerHTML = messageText;

  // Open the modal
  modal.style.display = 'block';

  // When the user clicks on <span> (x), close the modal
  close.onclick = () => {
    modal.style.display = 'none';
    if (restart) {
      // Reload page
      window.location = '';
    }
  };
};

const load = () => {
  // constants
  const GAME_WIDTH = window.innerWidth;
  const GAME_HEIGHT = window.innerHeight;

  // grab the canvas and context
  const canvas = document.getElementById('mycanvas');
  const ctx = canvas.getContext('2d');

  ctx.canvas.width = GAME_WIDTH;
  ctx.canvas.height = GAME_HEIGHT;

  // keep the game going
  let gameLive = true;

  // enemies
  const enemies = [
    {
      x: GAME_WIDTH / 6, // x coordinate
      y: GAME_HEIGHT / 2, // y coordinate
      speedY: Math.random() + level, // speed in Y
      w: 40, // width
      h: 40, // height
    },
    {
      x: (2 * GAME_WIDTH) / 6,
      y: GAME_HEIGHT / 2,
      speedY: Math.random() + level,
      w: 40,
      h: 40,
    },
    {
      x: (3 * GAME_WIDTH) / 6,
      y: GAME_HEIGHT / 2,
      speedY: Math.random() + level,
      w: 40,
      h: 40,
    },
    {
      x: (4 * GAME_WIDTH) / 6,
      y: GAME_HEIGHT / 2,
      speedY: Math.random() + level,
      w: 40,
      h: 40,
    },
  ];

  // the player object
  const player = {
    x: 10,
    y: GAME_HEIGHT / 2,
    speedX: 2.5,
    isMoving: 0,
    w: 40,
    h: 40,
  };

  // the goal object
  const goal = {
    x: GAME_WIDTH - 75,
    y: GAME_HEIGHT / 2,
    w: 50,
    h: 36,
  };

  const sprites = {};

  const movePlayer = () => (player.isMoving = true);

  const stopPlayer = () => (player.isMoving = false);

  // event listeners to move player
  canvas.addEventListener('mousedown', movePlayer);
  canvas.addEventListener('mouseup', stopPlayer);
  canvas.addEventListener('touchstart', movePlayer);
  canvas.addEventListener('touchend', stopPlayer);

  const loadImages = () => {
    sprites.player = new Image();
    sprites.player.src = 'img/hero.png';

    sprites.background = new Image();
    sprites.background.src = 'img/floor.png';

    sprites.enemy = new Image();
    sprites.enemy.src = 'img/enemy.png';

    sprites.goal = new Image();
    sprites.goal.src = 'img/chest.png';
  };

  // check the collision between two rectangles
  const checkCollision = (rect1, rect2) => {
    const closeOnWidth =
      Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
    const closeOnHeight =
      Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);
    return closeOnWidth && closeOnHeight;
  };

  // update the logic
  const update = () => {
    // check if you've won the game
    if (checkCollision(player, goal)) {
      // stop the game
      gameLive = false;
      showMessage(`You've completed level ${level}`);
      level++;
      load();
    }

    // update player
    if (player.isMoving) {
      player.x += player.speedX;
    }

    // update enemies
    enemies.forEach(element => {
      // check for collision with player
      if (checkCollision(player, element)) {
        // stop the game
        gameLive = false;
        restart = true;
        showMessage('Game Over!');
      }

      // move enemy
      element.y += element.speedY;

      // check borders
      if (element.y <= 10) {
        element.y = 10;
        element.speedY *= -1;
      } else if (element.y >= GAME_HEIGHT - 50) {
        element.y = GAME_HEIGHT - 50;
        element.speedY *= -1;
      }
    });
  };

  // show the game on the screen
  const draw = () => {
    // clear the canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // draw background
    ctx.drawImage(
      sprites.background,
      0,
      0,
      sprites.background.width,
      sprites.background.height,
      0,
      0,
      GAME_WIDTH,
      GAME_HEIGHT
    );

    // draw player
    ctx.drawImage(sprites.player, player.x, player.y);

    // draw enemies
    enemies.forEach(element =>
      ctx.drawImage(sprites.enemy, element.x, element.y)
    );

    // draw goal
    ctx.drawImage(sprites.goal, goal.x, goal.y);
  };

  // gets executed multiple times per second
  const step = () => {
    update();
    draw();

    if (gameLive) {
      window.requestAnimationFrame(step);
    }
  };

  // initial kick
  loadImages();
  step();
};

window.addEventListener('load', load);

window.addEventListener('resize', load);
