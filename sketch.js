var bg, doorRight, doorLeft, michael, bonnie, bonniePt, chica, chicaPt, freddy, freddyPt, foxy, foxyPt, goldenFreddy, goldenPt, goldenLockR, goldenLockL, shock, heart3, heart2, heart1, clock, clockEnd, restart, gameoverTitle, gameTitle;
var bgImg, doorRightImg, doorLeftImg, michaelR, michaelL, michaelShootingR, michaelShootingL, bonnieImg, chicaImg, freddyImg, foxyImg, goldenRImg, goldenLImg, heart3Img, heart2Img, heart1Img, clock12, clock1, clock2, clock3, clock4, clock5, clock6, restartImg, gameoverImg, gameTitleImg;
var themeSound, clockSound, shockSound;
var bonnieGroup, chicaGroup, freddyGroup, foxyGroup, shockGroup;
var gamePhase, life, gambiarra;
var PLAY = 2;
var END = 1;
var GAMEOVER = 0;
var gameState = PLAY;

function preload() {
  bgImg = loadImage("assets/ground.jpeg");
  michaelR = loadImage("assets/michaelRight.png");
  michaelL = loadImage("assets/michaelLeft.png");
  michaelShootingR = loadImage("assets/michaelShootingRight.png");
  michaelShootingL = loadImage("assets/michaelShootingLeft.png");
  doorRightImg = loadImage("assets/doorRight.png");
  doorLeftImg = loadImage("assets/doorLeft.png");
  bonnieImg = loadImage("assets/bonnie.png");
  chicaImg = loadImage("assets/chica.png");
  freddyImg = loadImage("assets/freddy.png");
  foxyImg = loadImage("assets/foxy.png");
  goldenRImg = loadImage("assets/goldenFreddyR.png");
  goldenLImg = loadImage("assets/goldenFreddyL.png");
  heart3Img = loadImage("assets/life3.png");
  heart2Img = loadImage("assets/life2.png");
  heart1Img = loadImage("assets/life1.png");
  clock12 = loadImage("assets/12am.png");
  clock1 = loadImage("assets/1am.png");
  clock2 = loadImage("assets/2am.png");
  clock3 = loadImage("assets/3am.png");
  clock4 = loadImage("assets/4am.png");
  clock5 = loadImage("assets/5am.png");
  clock6 = loadImage("assets/clock6.jpg");
  restartImg = loadImage("assets/restartImg.png");
  gameoverImg = loadImage("assets/gameOver.png");
  gameTitleImg = loadImage("assets/gameTitle.png");
  themeSound = loadSound("assets/themeSound.mp3");
  clockSound = loadSound("assets/6am.mp3");
  shockSound = loadSound("assets/shockSound.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  bg = bgImg;
  gamePhase = "phase1";
  life = 3;

  //verifica quantos animatronicos de cada tipo já foram eliminados(exceto no goldenFreddy)
  bonniePt = 0;
  chicaPt = 0;
  foxyPt = 0;
  freddyPt = 0;
  goldenPt = 0;

  //cria os grupos
  bonnieGroup = new Group();
  chicaGroup = new Group();
  foxyGroup = new Group();
  freddyGroup = new Group();
  shockGroup = new Group();

  //cria o michael
  michael = createSprite(width/2, height/2, 20, 20);
  michael.addImage("michael", michaelR);
  michael.scale = 0.7;
  michael.setCollider("rectangle", 0, 0, 200, 270, 0);
  michael.debug = false;

  //cria as duas portas de segurança
  doorRight = createSprite(width, height/2, 30, 30);
  doorRight.addImage("doorRight", doorRightImg);
  doorRight.scale = 0.7;
  doorLeft = createSprite(0, height/2, 30, 30);
  doorLeft.addImage("doorLeft", doorLeftImg);
  doorLeft.scale = 0.7;

  //cria os corações de vida no HUD
  heart3 = createSprite(width/8-20, height/8-50, 20, 20);
  heart3.addImage("heart3", heart3Img);
  heart2 = createSprite(width/8-60, height/8-50, 20, 20);
  heart2.addImage("heart2", heart2Img);
  heart1 = createSprite(width/8-92, height/8-50, 20, 20);
  heart1.addImage("heart1", heart1Img);

  //cria o relógio no HUD
  clock = createSprite(width-120, height/8-50, 20, 20);
  clock.addImage("clock", clock12);
  clock.scale = 0.8;

  //cria o golden freddy
  goldenFreddy = createSprite(-200, height/2, 30, 30);
  goldenFreddy.setCollider("rectangle", 0, 0, 380, 550, 0);
  goldenFreddy.debug = false;
  goldenFreddy.addImage("goldenL", goldenLImg);
  goldenFreddy.addImage("goldenR", goldenRImg);
  goldenFreddy.scale = 0.5;

  //gambiarra pra travar o golden freddy na tela
  goldenLockR = createSprite(width-200, height/2, 10, height);
  goldenLockL = createSprite(width/4-200, height/2, 10, height);
  goldenLockR.visible = false;
  goldenLockL.visible = false;

  //relógio de 6am do final bom
  clockEnd = createSprite(width/2, height/2, 50, 50);
  clockEnd.visible = false;

  //música tema
  themeSound.play();
  themeSound.loop();
  themeSound.setVolume(0.2);

  //gambiarra da música
  gambiarra = createSprite(width/2, height/2, width, height);
  gambiarra.visible = false;

  //tela de game over
  restart = createSprite(width/2, height-200, 20, 20);
  restart.visible = false;
  gameoverTitle = createSprite(width/2, height/2-70, 20, 20);
  gameoverTitle.visible = false;

  //título do jogo
  gameTitle = createSprite(width/2, height/4-20, 20, 20);
  gameTitle.addImage("gameTitle", gameTitleImg);
  gameTitle.scale = 1.5;
}

function draw() {
  background(bg);  
  //colisões
  michael.bounceOff(doorLeft);
  michael.bounceOff(doorRight);
  //pontos
  shockCounter();
  //dano no michael
  if(michael.isTouching(bonnieGroup)||michael.isTouching(chicaGroup)||michael.isTouching(foxyGroup)||michael.isTouching(freddyGroup)){
    life -= 1;
    manageHearts();
    bonnieGroup.destroyEach();
    chicaGroup.destroyEach();
    foxyGroup.destroyEach();
    freddyGroup.destroyEach();
    michael.setVelocity(0,0);
  }
  if(michael.isTouching(goldenFreddy)){
    life -= 1;
    manageHearts();
  }
  //michael andando
  if(keyIsDown(RIGHT_ARROW) && michael.x < width){
    michael.x += 7;
    michael.addImage("michael", michaelR);
  }
  if(keyIsDown(LEFT_ARROW) && michael.x > 0){
    michael.x -= 7;
    michael.addImage("michael", michaelL);
  }
  if(keyIsDown(UP_ARROW) || keyIsDown(87) && michael.y > 0){
    michael.y -= 7;
  }
  if(keyIsDown(DOWN_ARROW) && michael.y < height){
    michael.y += 7;
  }
  //faz a barra de espaço atirar e fazer som
  if(keyIsDown(32)){
    shootShock();
    shockSound.play();
    shockSound.setLoop(false);
  }
  //game over se o michael perder todas as vidas
  if(life <= 0){
    gameState = GAMEOVER;
  }
  //tira o título da tela
  if(bonniePt >= 2 && chicaPt >= 2){
    gameTitle.visible = false;
  }

  if(gameState == PLAY){
    if(gamePhase == "phase1"){
      //gera bonnie e chica num intervalo de tempo
      if(frameCount % 80 === 0){
        spawnBonnie();
        spawnChica();
      }
      //1am
      if(bonniePt >= 5 && chicaPt >= 5){
        clock.addImage("clock", clock1);
      }
      //2am
      if(bonniePt >= 10 && chicaPt >= 10){
        clock.addImage("clock", clock2);
        gamePhase = "phase2";
      }
    }

    if(gamePhase == "phase2"){
      //gera bonnie, chica e foxy, acelerando bonnie e chica
      if(frameCount % 80 === 0){
        bonnieGroup.setVelocityEach(4.5,0);
        chicaGroup.setVelocityEach(-4.5,0);
        spawnBonnie();
        spawnChica();
      }else if(frameCount % 150 === 0){
        spawnFoxy();
      }
      //3am
      if(bonniePt >= 15 && chicaPt >= 15 && foxyPt >= 5){
        clock.addImage("clock", clock3);
      }
      //4am
      if(bonniePt >= 20 && chicaPt >= 20 && foxyPt >= 10){
        clock.addImage("clock", clock4);
        gamePhase = "phase3";
      }
    }

    if(gamePhase == "phase3"){
      //joga o freddy e acelera o resto
      if(frameCount % 80 === 0){
        bonnieGroup.setVelocityEach(5.5,0);
        chicaGroup.setVelocityEach(-5.5,0);
        spawnBonnie();
        spawnChica();
      }else if(frameCount % 130 === 0){
        foxyGroup.setVelocityEach(15,0);
        spawnFoxy();
      }else if(frameCount % 100 === 0){
        spawnFreddy();
      }
      //5am
      if(bonniePt >= 25 && chicaPt >= 25 && foxyPt >= 15 && freddyPt >= 5){
        clock.addImage("clock", clock5);
        gamePhase = "final";
      }
    }

    if(gamePhase == "final"){
      //dá partida no golden
      if(goldenFreddy.x <width/4-200){
      goldenFreddy.setVelocity(6,0);
      }
      //faz os teleportes de glitch do golden freddy
      if(shockGroup.isTouching(goldenFreddy) || michael.isTouching(goldenFreddy)){
        goldenFreddy.x = random(width/4-200,width-200);
        goldenFreddy.y = random(height/8-50, height);
      }
      //trava o golden freddy na tela e faz ele olhar pro lado certo
      if(goldenFreddy.bounceOff(goldenLockR)){
        goldenFreddy.changeImage("goldenR", goldenRImg);
        goldenFreddy.setVelocity(-6,0);
      }
      if(goldenFreddy.x > width/4-200){
        if(goldenFreddy.bounceOff(goldenLockL)){
          goldenFreddy.changeImage("goldenL", goldenLImg);
          goldenFreddy.setVelocity(6,0);
        }
      }
      //final bom :D
      if(goldenPt >= 6){
        gameState = END;
      }
    }
}

  if(gameState == END){
    //6am
    clockEnd.visible = true;
    clockEnd.addImage("clock", clock6);
    clockEnd.scale = 3.4;
    michael.overlap(gambiarra, play6am);

    //para tudo
    shockGroup.destroyEach();
    michael.visible = false;
    if(keyIsDown(32)){
      shock.visible = false;
      shockSound.setVolume(0);
    }
    //reinicia o jogo apertando enter
    if(keyIsDown(13)){
      reset();
    }
  }

  if(gameState == GAMEOVER){
    //para a música e limpa a tela
    michael.visible = false;
    michael.setVelocity(0,0);
    themeSound.stop();
    shockGroup.destroyEach();
    clock.visible = false;
    if(keyIsDown(32)){
      shock.visible = false;
      shockSound.setVolume(0);
    }
    //mostra o HUD na tela
    restart.visible = true;
    restart.addImage("restart", restartImg);
    restart.scale = 0.6;
    gameoverTitle.visible = true;
    gameoverTitle.addImage("gameover", gameoverImg);
    gameoverTitle.scale = 3;
    //esconde o golden freddy
    goldenFreddy.x = -200;
    goldenFreddy.y = height/2;
    goldenFreddy.setVelocity(0,0);
    //aperta o botão de reiniciar
    if(mousePressedOver(restart)){
      reset();
    }
  }
  drawSprites();

  if(gameState == END){
    textSize(30);
    fill("white");
    text("Parabéns, você conseguiu o final bom! Aperte ENTER para jogar novamente.", width/4-200, height-100, 1000, 1000);
  }
}

function spawnBonnie() {
  bonnie = createSprite(width/4-200, Math.round(random(height/8-50, height)), 20, 20);
  bonnie.addImage("bonnie", bonnieImg);
  bonnie.scale = 0.2;
  bonnie.velocityX = 3.5;
  bonnie.setCollider("rectangle", 0, 0, 450, 1000, 0);
  bonnie.debug = false;
  bonnie.lifetime = 500;
  bonnieGroup.add(bonnie);
}

function spawnChica() {
  chica = createSprite(width-200, Math.round(random(height/8-50, height)), 20, 20);
  chica.addImage("chica", chicaImg);
  chica.scale = 0.2;
  chica.velocityX = -3.5;
  chica.setCollider("rectangle", 0, 0, 450, 1000, 0);
  chica.debug = false;
  chica.lifetime = 500;
  chicaGroup.add(chica);
}

function spawnFoxy() {
  foxy = createSprite(0, Math.round(random(height/8-50, height)), 20, 20);
  foxy.addImage("foxy", foxyImg);
  foxy.scale = 0.2;
  foxy.velocityX = 10;
  foxy.setCollider("rectangle", 0, 0, 600, 1000, 0);
  foxy.debug = false;
  foxy.lifetime = 500;
  foxyGroup.add(foxy);
}

function spawnFreddy(){
  freddy = createSprite(width-150, michael.y, 20, 20);
  freddy.addImage("freddy", freddyImg);
  freddy.scale = 0.2;
  freddy.velocityX = -13;
  freddy.y === michael.y;
  freddy.setCollider("rectangle", 0, 0, 470, 1000, 0);
  freddy.debug = false;
  freddy.lifetime = 300;
  freddyGroup.add(freddy);
}

function shootShock() {
  shock = createSprite(michael.x, michael.y, 50, 20);
  shock.lifetime = 150;
  shock.shapeColor = "cyan";
  
  if(keyIsDown(RIGHT_ARROW)){
    shock.velocityX = 30;
    shock.velocityY = 0;
    shock.x = michael.x+20;
    michael.addImage("michael", michaelShootingR);
  }else if(keyIsDown(LEFT_ARROW)){
    shock.velocityX = -30;
    shock.velocityY = 0;
    shock.x = michael.x-20;
    michael.addImage("michael", michaelShootingL);
  }else if(keyIsDown(UP_ARROW) || keyIsDown(87)){
    shock.velocityX = 0;
    shock.velocityY = -30;
  }else if(keyIsDown(DOWN_ARROW)){
    shock.velocityX = 0;
    shock.velocityY = 30;
  }else{
    shock.velocityX = 30;
    shock.velocityY = 0;
    shock.x = michael.x+20;
    michael.addImage("michael", michaelShootingR);
  }
  shockGroup.add(shock);
}

function manageHearts() {
  if(life === 2){
    heart3.visible = false;
  }else if(life === 1){
    heart2.visible = false;
  }else if(life === 0){
    heart1.visible = false;
  }
}

function shockCounter(){
  if(bonnieGroup.isTouching(shockGroup)){
    for(var i=0;i<bonnieGroup.length;i++){     
      if(bonnieGroup[i].isTouching(shockGroup)){
        bonnieGroup[i].destroy();
        shockGroup.destroyEach();
        bonniePt += 1;
      } 
    }
  }
  if(chicaGroup.isTouching(shockGroup)){
    for(var i=0;i<chicaGroup.length;i++){     
      if(chicaGroup[i].isTouching(shockGroup)){
        chicaGroup[i].destroy();
        shockGroup.destroyEach();
        chicaPt += 1;
      } 
    }
  }
  if(foxyGroup.isTouching(shockGroup)){
    for(var i=0;i<foxyGroup.length;i++){     
      if(foxyGroup[i].isTouching(shockGroup)){
        foxyGroup[i].destroy();
        shockGroup.destroyEach();
        foxyPt += 1;
      } 
    }
  }
  if(freddyGroup.isTouching(shockGroup)){
    for(var i=0;i<freddyGroup.length;i++){     
      if(freddyGroup[i].isTouching(shockGroup)){
        freddyGroup[i].destroy();
        shockGroup.destroyEach();
        freddyPt += 1;
      } 
    }
  }
  if(gamePhase == "final"){
    if(shockGroup.isTouching(goldenFreddy)){
      goldenPt += 1;
    }
  }
}

function play6am(){
  themeSound.stop();
  clockSound.play();
  clockSound.setLoop(false);
  gambiarra.destroy();
}

function reset(){
  gameState = PLAY;
  gamePhase = "phase1";
  freddyPt = 0;
  bonniePt = 0;
  chicaPt = 0;
  foxyPt = 0;
  goldenPt = 0;

  gameoverTitle.visible = false;
  restart.visible = false;

  michael.visible = true;
  michael.x = width/2;
  michael.y = height/2;

  life = 3;
  heart3.visible = true;
  heart2.visible = true;
  heart1.visible = true;

  clock.visible = true;
  clock.addImage("clock", clock12);

  gameTitle.visible = true;

  gambiarra = createSprite(width/2, height/2, width, height);
  gambiarra.visible = false;
  clockEnd.visible = false;

  themeSound.play();
  themeSound.loop();
  themeSound.setVolume(0.35);

  goldenFreddy.x = -200;
  goldenFreddy.y = height/2;
  goldenFreddy.setVelocity(0,0);
  goldenFreddy.changeImage("goldenL", goldenLImg);
}
