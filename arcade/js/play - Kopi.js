var playState = {
    create: function(){
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,
Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACE]);
        
        this.wasd = {up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
                    down: game.input.keyboard.addKey(Phaser.Keyboard.S)
                    };
        
        this.key ={space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)};
        
        this.checkKeyUp = false;
        
        
        
      this.points = 10;
        
        game.rnd.sow([1]);
        
        // game.stage.backgroundColor = "#3498db";
         game.stage.backgroundColor = "#f3be7e";
        background = game.add.sprite(0,0,"background");
        background.fixedToCamera = true;
        this.camDefY = 0;
        this.camDefX = 0;
        
        //add sounds
        this.jumpSound = game.add.audio("jump");
        this.coinSound = game.add.audio("coin");
        this.deadSound = game.add.audio("dead");
        this.landFloorSound = game.add.audio("landFloor");
        this.landWallSound = game.add.audio("landWall");
        this.smashSideSound = game.add.audio("smashSide");
        this.smashDownSound = game.add.audio("smashDown");
        this.hardLandSound = game.add.audio("hardLand");
        this.kickSound = game.add.audio("kick");
        this.hihatSound = game.add.audio("hihat");
        this.hihat2Sound = game.add.audio("hihat2");
        this.clapSound = game.add.audio("clap");
        this.crashSound = game.add.audio("crash");
        
        //volume
        this.hihatSound.volume = 0.2;
        this.hihat2Sound.volume = 0.1;
        this.clapSound.volume = 0.5;
        
        //sound variables
        this.noteSound = [game.add.audio("jump"),game.add.audio("coin"),game.add.audio("landFloor"),game.add.audio("landWall"),game.add.audio("smashSide"),game.add.audio("hardLand"),game.add.audio("doubleJump"),game.add.audio("hardLand")];
       
       this.clapOn = false;
        this.oneCrash = true;
        
        //time
        this.bpm = 120;
        this.time = 1000/(this.bpm/15);
        this.swing = this.time/4;
       this.beatArray = [];
       for (z = 1; z <= 4 ; z++) {
                        this.beatArray[z] = [];
        }  
           for (y = 1; y <= 4 ; y++) {
                    for (z = 1; z <= 4 ; z++) {
                         this.beatArray[y][z] = [];
                    }   
                }
        
             for (x = 1; x <= 4 ; x++) {
                for (y = 1; y <= 4 ; y++) {
                    for (z = 1; z <= 4 ; z++) {
                        this.beatArray[x][y][z] = 0;
                    }   
                }   
            }    
        
        this.combo = 0;
        
        this.note = [0,0,0,0,0,0,0,0];
        
         game.time.events.add(125,this.playNote, this);
        //game.time.events.loop(250,this.kickSound.play(), this);
        
        if (!game.global.testGame)
        game.time.events.loop(1000,this.deathTimer, this);
        
        //obvious. Create the world
        this.createWorld();
        this.width = 500;
        this.height = 340;
        
        this.gamePosY = 160;
        this.gamePosX = 25;
        
        //var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')

        //add player
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
        this.player.anchor.setTo(0.5,0.5);
    
        this.wallArray = new Array;
        
        this.smash = 0;
        this.smashDown = false;
        
        
        this.maxTimer = 30;
        this.timer = this.maxTimer;
        
        this.blobber = {x: 0};
        this.jumpAnim = {y: 0};
        this.inAir = true;
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 800;
        this.player.enableBody = true;
        this.doubleJump = true;
        this.grip = false;
        
        this.notDead = true;
        
        this.kickNumber = 1;
        this.beat = 1;
        this.bar = 1;
        
        //draw rectangle
      this.graphics = game.add.graphics(this.player.x,this.player.y);
        this.player.alpha = 0;
        
        //particle emitter
        this.emitter = game.add.emitter(0,0,15);
        this.emitter.makeParticles("pixel");
        this.emitter.setYSpeed(-150,150);
        this.emitter.setXSpeed(-150,150);
        this.emitter.gravity = 0;
        //player controls
        //this.cursor = game.input.keyboard.createCursorKeys();
        
        this.playerSpeed = 0;
        this.playerMaxSpeed = 400;
        this.jumpPower = -400;
        this.dblJumpPower = -350;
        this.playerAcc = 80;
        this.playerJump = 0;
        this.playerLR = true;
        
        if (!game.global.testGame)
        this.createUI();
        
        //create enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemySpeed = 100;
        this.enemies.createMultiple(10,"enemy");
        //game.time.events.loop(2200,this.addEnemy, this);
        
        this.enemyTimer = 4000;
        this.nextEnemy = 0;
        
          //add coin aswell
        this.coin = game.add.sprite(60,140,"coin");
        this.coin.anchor.set(0.5,0.5);
        game.physics.arcade.enable(this.coin);
        
        this.coinTween =  game.add.tween(this.coin.scale).to({x: 1.2,y:1.2},1000).to({x: 1,y:1},1000).to({x: 0.9,y:0.9},1000).to({x: 1,y:1},1000);
        this.coinTween.loop();
        this.coinTween.start();
       
       
        
        this.rayLine = new Phaser.Line(this.player.body.position.x-11,this.player.body.position.y,this.player.body.position.x+11,this.player.body.position.y);
        
        //this.rayLine.x1 = this.player.body.position.x-11;
       // this.rayLine.y1 = this.player.body.position.y;
        //this.rayLine.x2 = this.player.body.position.x+11;
        //this.rayLine.y2 = this.player.body.position.y;
        
    },
   update: function(){
       
      game.physics.arcade.collide(this.player,this.layer);
  game.physics.arcade.collide(this.enemies,this.layer);     

       if (!game.global.testGame)
       this.timerLabel.text = "time: " + this.timer;
       
       if (this.notDead){   
          this.rayLine = new Phaser.Line(this.player.body.position.x-1,this.player.body.position.y+10,this.player.body.position.x+21,this.player.body.position.y+10);
        
        if (!game.global.testGame){
           if (this.nextEnemy < game.time.now){
               this.addEnemy();
               
               this.nextEnemy = game.time.now + this.enemyTimer;
           }
        }
       //if (this.player.body.onWall()){
      //    this.playerSpeed = 0;
    //  }
       
    if (this.player.body.onFloor()){
        this.playerJump = 0;
    }
       
      
       
      // game.physics.arcade.collide(this.player, this.walls);
        this.movePlayer();
       if (!this.player.inWorld){
           this.playerDie();
       }
       game.physics.arcade.overlap(this.player,this.coin, this.takeCoin, null, this);
       //game.physics.arcade.collide(this.enemies, this.walls);
       game.physics.arcade.overlap (this.player, this.enemies, this.playerDie, null, this);
       
       if (this.playerLR){
        if (!this.wasd.left.isDown && !this.wasd.right.isDown)
       if (this.playerSpeed >= this.playerAcc || this.playerSpeed <= -this.playerAcc){
           if (this.playerSpeed > 0)
           this.playerSpeed -= this.playerAcc;
               else
                   this.playerSpeed += this.playerAcc;
           }
           else
            this.playerSpeed = 0;
        }
       }
      // game.debug.text(this.layer.width, 10, 20);
      // game.debug.geom(this.rayLine);
      // game.debug.text(this.smash, 10, 40);
      // game.debug.cameraInfo(game.camera, 10, 20);
       
    },
    movePlayer: function(){
        
        if (this.player.body.onWall()){
            this.playerSpeed = 0;
        }
        
        this.player.body.velocity.x = this.playerSpeed;
        
        
        if(this.playerLR){
         if (this.wasd.left.isDown){
             this.player.body.velocity.x
             if (this.playerSpeed > -this.playerMaxSpeed){
           this.playerSpeed -= this.playerAcc;
             }
           // else
            //this.playerSpeed = -this.playerMaxSpeed;
       } else if (this.wasd.right.isDown){
           
           if (this.playerSpeed < this.playerMaxSpeed){
           this.playerSpeed += this.playerAcc;
           }
           //else
           // this.playerSpeed = this.playerMaxSpeed;
       }  
        }
       
        
       
            // wall jump & grap
             this.wallArray = this.layer.getRayCastTiles(this.rayLine,0.5,true,false);
        
        if (this.wallArray != 0 && (this.wasd.left.isDown || this.wasd.right.isDown)){
            if (this.inAir && this.smash == 0)
               { 
                   //this.landWallSound.play();
                   this.grip = true;
                   this.note[3] = 1;
               }
            this.inAir = false;
            this.player.body.velocity.y = 0;
            {
                if (this.wasd.up.downDuration()){ //this.cursor.up.downDuration() works as a sort of onKeyDown()
                    
                    //this.jumpSound.play();
                    this.note[0] = 1;
                    
                    if (this.wasd.left.isDown){
                        this.player.body.velocity.y = this.dblJumpPower;
                        this.playerSpeed += 300;
                        this.player.x += 5;
                        this.playerLR = false;
                        game.time.events.add(150,this.gainControl, this);
                    }
                    else if (this.wasd.right.isDown){
                        this.player.body.velocity.y = this.dblJumpPower;
                        this.playerSpeed -= 300;
                         this.player.x -= 5;
                        this.playerLR = false;
                         game.time.events.add(150,this.gainControl, this);
                    }
                }
            }
        } 
        
        
        
    
    if (this.player.body.velocity.y > 500){
        this.smashDown = true;
    }
        
        if (!this.player.body.onGround && this.wasd.down.downDuration()){
            if (this.wallArray != 0){
                if (!this.wasd.left.isDown & !this.wasd.right.isDown){
                    
                   // this.smashDownSound.play();
                    this.note[5] = 1;
                    this.player.body.velocity.y = 700;
                }
            } else if (this.wallArray == 0){
                if (this.inAir)
                
                //this.smashDownSound.play();
                    this.note[5] = 1;
            this.player.body.velocity.y = 700;
            }
            
        } else if (!this.player.body.onFloor() && this.wasd.down.isDown && this.wallArray != 0 && (this.wasd.left.isDown || this.wasd.right.isDown) ){
           this.player.body.velocity.y = 200;
        
        }
              
        if (this.wasd.up.downDuration() && this.player.body.onFloor())
        {
           //this.jumpSound.play(); 
           this.note[0] = 1;
           this.player.body.velocity.y = this.jumpPower;
            this.playerJump += 1;
        }  else if (this.wasd.up.isDown && this.playerJump != 0) {
            if (this.playerJump < 15){
           // this.player.body.velocity.y -= 15
            this.playerJump += 1;
            }  
        }
        else if(this.wasd.up.downDuration() && this.doubleJump && !this.player.body.onFloor() && this.inAir){
            
            this.player.body.velocity.y = this.dblJumpPower;
            this.note[6] = 1;
            this.jumpAnim.y = 0;
            game.add.tween(this.jumpAnim).from( { y: 15 }, 500, Phaser.Easing.Bounce.Out, true);
            this.doubleJump = false;
            
        }
        else if (!this.wasd.up.isDown){
            this.playerJump = 0;
            
        }
        
      
        
        //smash side
        
        if (!this.player.body.onFloor() && this.key.space.downDuration() && this.wallArray == 0 ){
           
            if (this.wasd.left.isDown){
                if (this.smash == 0)
               { 
                  // this.smashSideSound.play();
                   this.note[4] = 1;
                   this.smash = 1;
                this.game.time.events.add(200, this.stopSmash, this);
                   
               }
            } else if (this.wasd.right.isDown){
                if (this.smash == 0)
               { 
                 //  this.smashSideSound.play();
                   this.note[4] = 1;
                   this.smash = 2;
                 this.game.time.events.add(200, this.stopSmash, this);
                   
               }
            } 
            
        } 
        
        
        if (this.player.body.onFloor() || this.player.body.onWall()){
            if (this.smash != 0 ){
                if (this.smash != 3){
                      
                    var max = this.playerSpeed/5;
                    if (max < -20){
                        max = -20;
                    }
                     if (max > 20){
                        max = 20;
                    } 
                    this.camera.x = this.camDefX;
                   // this.hardLandSound.play();
                    game.add.tween(this.camera).from( { x: -max }, 500, Phaser.Easing.Bounce.Out, true);
                }
                 
            this.smash = 0;
                
          }
            this.doubleJump = true;
       }
        
        if(!this.player.body.onFloor() && this.wallArray == 0){
            this.inAir = true;
        }
        
       
        
        if (this.player.body.onFloor()){
            if (this.inAir && !this.smashDown){
                //this.landFloorSound.play();
                this.note[2] = 1;
             this.blobber.x = 0;
                 game.add.tween(this.blobber).from( { x: 8 }, 500, Phaser.Easing.Bounce.Out, true);
            }
            this.inAir = false;
        }
        
        if (this.player.body.onFloor()){
            if (this.smashDown){
                //this.hardLandSound.play();
                this.camera.y = this.camDefY;
                game.add.tween(this.camera).from( { y: this.camDefY-15 }, 500, Phaser.Easing.Bounce.Out, true);
               game.add.tween(this.blobber).from( { x: 15 }, 500, Phaser.Easing.Bounce.Out, true);
                this.smashDown = false;
                                       }
            
        }
        
        if (this.smash == 1){
            this.playerSpeed = -1000;
               this.player.body.velocity.y = 0;
        } else if (this.smash == 2){
            this.playerSpeed = 1000;
               this.player.body.velocity.y = 0;
        } else {
            if (this.playerSpeed > this.playerMaxSpeed){
                this.playerSpeed = this.playerMaxSpeed
            } else if (this.playerSpeed < -this.playerMaxSpeed){
                this.playerSpeed = -this.playerMaxSpeed
            }
           // this.player.body.gravity.y = 500;
           // this.playerSpeed = 0;
        }
   
      
        
        
        
        
    },
    createWorld: function(){
       /*
        //create walls
        this.walls = game.add.group();
       this.walls.enableBody = true;
        //vertical
        game.add.sprite(0,0,"wallV",0,this.walls);
        game.add.sprite(480,0,"wallV",0,this.walls);
        //horizontal
        game.add.sprite(0,0,"wallH",0,this.walls);
        game.add.sprite(300,0,"wallH",0,this.walls);
        game.add.sprite(0,320,"wallH",0,this.walls);
        game.add.sprite(300,320,"wallH",0,this.walls);
        game.add.sprite(-100,160,"wallH",0,this.walls);
        game.add.sprite(400,160,"wallH",0,this.walls);
        
        var middleTop = game.add.sprite(100,80,"wallH",0,this.walls), middleBottom = game.add.sprite(100,240,"wallH",0,this.walls);
        middleTop.scale.setTo(1.5,1);
        middleBottom.scale.setTo(1.5,1);
            
        this.walls.setAll('body.immovable', true);
        */
      this.map = game.add.tilemap("map");
        this.map.addTilesetImage("tileset");
        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        
        this.map.setCollision(1);
       
        this.camera.bounds = null;
        
    },
    playerDie: function(){
        if (this.notDead){
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.deadSound.play();
        this.emitter.start(true,600,null,15);
        this.kickSound.stop();
        this.player.kill();
        game.time.events.add(1000,this.startMenu,this);
                  
        }
        this.notDead = false;
    },
    createUI: function(){
    this.scoreScale = 18;
    this.scoreLabel = game.add.text(30,30,"score: 0", {font: "18px Share Tech Mono", fill: "#ffffff"});
    this.scoreLabelRed = game.add.text(30,30,"score: 0", {font: "18px Share Tech Mono", fill: "#dd0000"});
    this.scoreLabelRed.alpha = 0;
    this.timerLabel = game.add.text(30,50,"time: " + this.timer, {font: "18px Share Tech Mono", fill: "#ffffff"});
    game.global.score = 0;
    this.comboText = game.add.text(game.world.centerX, game.world.centerY, "-COMBO START!-",{font: "40px Share Tech Mono", fill: "#ffffff"});
    this.comboText.alpha = 0;
    this.comboText.anchor.setTo(0.5,0.5);
},
    takeCoin: function(){
        this.coinTween.pause();
         this.coin.scale.setTo(0,0);
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 1000,Phaser.Easing.Bounce.Out).start();
        
       // this.coinTween.loop();
        this.game.time.events.add(50, this.coinPulse, this);
        
       // this.coinSound.play();
        this.note[1] = 1;
        //game.add.tween(this.player.scale).to({x: 1.3, y: 1.3},50).to({x:1,y:1},150).start();
        if ( (this.maxTimer - this.timer) <= 4 ){
            this.combo += 1;
            }
        
        if (this.combo >= 4){
            this.beatArray[this.kickNumber][ this.beat][this.bar] = 1;
          //  this.comboText.text = this.combo + " in a row!";
            if (this.combo == 4) {
            game.add.tween(this.comboText).from( { alpha: 1 }, 1000, "Linear", true);
            }
        }
        
        
        
        
        var coinPosition = [{x:140,y: 60},{x:360,y: 60},
                            {x:60,y: 140},{x:440,y: 140},
                            {x: 130, y: 300}, {x: 370, y: 300}
        ];
        
        for (var i = 0; i < coinPosition.length; i++){
            if (coinPosition[i].x === this.coin.x){
                coinPosition.splice(i,1);
            }
        }
   
        if (this.maxTimer > 10){
            this.maxTimer -=1;
        }
        
        if (this.enemyTimer > 1000){
            this.enemyTimer -= 50;
        }
        
   if (this.enemySpeed < 250){
       this.enemySpeed += 5;
   }
    
        
        this.timer = this.maxTimer;
        
        var newPosition = coinPosition[game.rnd.integerInRange(0,coinPosition.length-1)]
       
        
       
        if (!game.global.testGame){
        game.global.score += this.points;
        this.scoreLabel.text = "score: " + game.global.score;
        this.scoreLabel.x = 30;
        game.add.tween(this.scoreLabel).from({x: 50},200).easing(Phaser.Easing.Bounce.Out).start();
            this.scoreLabelRed.text = "score: " + game.global.score;
        this.scoreLabelRed.x = 30;
        game.add.tween(this.scoreLabelRed).from({x: 50},200).easing(Phaser.Easing.Bounce.Out).start();
        game.add.tween(this.scoreLabelRed).from( { alpha: 1 }, 200, "Linear", true);
        this.points = 10;
        }
        
        this.coin.reset(newPosition.x,newPosition.y);
    },
    addEnemy: function() {
        //get first dead enemy of the group
        var enemy = this.enemies.getFirstDead();
       // this.camera.x = 0;
       // this.camera.y = 0;
        //check to see if dead enemies are left
        if (!enemy){
            return;
        }
        
        enemy.anchor.setTo(0.5,1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 800;
        enemy.body.velocity.x = this.enemySpeed * game.rnd.sign();
         enemy.body.velocity.y = enemy.body.gravity.y;
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },
    stopSmash: function(){
        this.smash = 3;
    },
    render: function(){
      var maxShift = this.playerSpeed/20;
        if (maxShift > 20)
            maxShift = 20;
        if (maxShift < -20)
            maxShift = -20;
           
          if(this.wallArray != 0){
            maxShift = 0;
        }
        
        var yShift = this.player.body.velocity.y/20;
        
        if (yShift < -5){
            yShift = -5;
        }
        
         if (yShift > 10){
            yShift = 10;
        }
        
        if (this.player.body.onFloor()){
            yShift = 0;
        }
        
            this.graphics.destroy();
        if (this.player.exists){
        this.graphics = game.add.graphics(this.player.x,this.player.y);
        this.graphics.beginFill(0xF7F7F7);
        this.graphics.x = this.player.x;
        this.graphics.x = this.player.x;
        this.graphics.y = this.player.y;
   // this.graphics.lineStyle(1, 0xff00ff, 1); 
     this.graphics.moveTo(-10-maxShift+yShift/2, -10-yShift/2+this.blobber.x);  
     this.graphics.lineTo(10-maxShift-yShift/2, -10-yShift/2+this.blobber.x);
     this.graphics.lineTo(10, 10+yShift/2+this.jumpAnim.y);
     this.graphics.lineTo(-10, 10+yShift/2+this.jumpAnim.y); 
      this.graphics.moveTo(-10-maxShift+yShift/2, -10-yShift+this.blobber.x); 
       this.graphics.endFill();
        }
    },
    startMenu: function(){
        //reset size and position
             this.gamePosY = 160;
        this.width = 500;
        this.height = 340;
        game.scale.setGameSize(this.width,this.height);
        var gameStyle = document.getElementById("gameDiv");
        gameStyle.style.top = this.gamePosY.toString()+"px"; 
        //go to start menu
        game.state.start("menu");
    },
    coinPulse: function(){
        this.coinTween.resume();
    },
    playNote: function(){
        
        
        
        if ( (this.maxTimer - this.timer) > 4 ){
            this.combo = 0; 
        }
        
        if (this.combo == 0){
            for (x = 1; x <= 4 ; x++) {
                for (y = 1; y <= 4 ; y++) {
                    for (z = 1; z <= 4 ; z++) {
                        this.beatArray[x][y][z] = 0;
                    }   
                }   
            }
        }
        
        if (this.notDead){
           
            if (this.beatArray[this.kickNumber][this.beat][this.bar] == 1){
                 if (this.combo >= 4){
                    this.clapSound.play();
                    this.clapPoint();
                }
            }
            
            
        //1's   
        if (this.kickNumber == 1){
        ///*
               if (game.global.score > 5) {
                    
                  /* 
                   if (this.gamePosY > 0){this.gamePosY -= 10;
                                          this.height += 20;
                                        game.scale.setGameSize(this.width,this.height);
                                          this.camDefY -= 20;
                                          this.camera.y = this.camDefY;
                                         }
                   */
                   
                   var gameStyle = document.getElementById("gameDiv");
                   gameStyle.style.top = this.gamePosY.toString()+"px";
            }
         //   */
           
            
            if (this.timer >= 8){
            this.kickSound.play();
            }
            
            if (this.beat == 2  || this.beat == 4){
                 if (this.combo >= 4){
                    this.clapSound.play();
                    this.clapPoint();
                }
                
             
                
            }
            
             if (game.global.score >= 100 && game.global.score <= 190) {
            this.hihatSound.play();
             }
            else if (game.global.score >= 200) {
            this.hihatSound.play();
             }
            else if (game.global.score > 190 && game.global.score <= 200 && this.oneCrash){
                this.crashSound.play();
                this.oneCrash = false;
            }
        }
        
       
         
        //2's
        if (this.kickNumber == 2 ){
         if (game.global.score >= 200) {
        this.hihatSound.play();
            }
            
             
        } 
        
        //3's
        if (this.kickNumber == 3){
             if (game.global.score >= 200) {
        this.hihat2Sound.play();
            }
            
          if (game.global.score >= 100 && game.global.score <= 190) {
            this.hihatSound.play();
             }
            else if (game.global.score >= 200) {
            this.hihatSound.play();
             }
        } 
          
        
        if (this.kickNumber == 4) {
             if (game.global.score >= 200) {
        this.hihatSound.play();
             }
           
        } 
            
        this.kickNumber += 1;
            
    if (this.kickNumber > 4){
        this.kickNumber = 1;
        this.beat += 1;
        
        if (this.beat > 4){
            this.beat = 1;
            this.bar += 1;
            
            if (this.bar > 2){
                this.bar = 1;
            }
        }
    }
            
        }
            
        for (var i = 0; i < this.note.length-1; i++){
            if (this.note[i] == 1){
                this.noteSound[i].play();
                this.note[i] = 0;
            }
            
        }
        
        switch (this.kickNumber){
            case 2:
                game.time.events.add(this.time+this.swing,this.playNote, this);
                break;
            case 3:
                game.time.events.add(this.time-this.swing,this.playNote, this);
                break;
            case 4:
                game.time.events.add(this.time+this.swing,this.playNote, this);
                break;
            case 1:
                game.time.events.add(this.time-this.swing,this.playNote, this);
                break;
                               }
        
    },
    findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },
    gainControl: function(){
   this.playerLR = true;
    
},
deathTimer: function(){
    if (this.points > 1){
        this.points -= 1;
    }
    
    this.timer -= 1;
    if (this.timer == 0){
        this.playerDie();
    }
    
},
clapPoint: function(){
                     game.global.score += 1;
                     this.scoreLabel.text = "score: " + game.global.score;
                     this.scoreLabel.x = 30;
                     game.add.tween(this.scoreLabel).from({x: 35},200).easing(Phaser.Easing.Bounce.Out).start();
                     this.scoreLabelRed.text = "score: " + game.global.score;
                     this.scoreLabelRed.x = 30;
                     game.add.tween(this.scoreLabelRed).from({x: 35},50).easing(Phaser.Easing.Bounce.Out).start();
                     this.scoreLabelRed.alpha = 0;
                     game.add.tween(this.scoreLabelRed).from( { alpha: 1 }, 50, "Linear", true);
}
    

};

