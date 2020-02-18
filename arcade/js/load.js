var loadState ={
    preload: function(){
        var loadingLabel = game.add.text(game.world.centerX,150,"loading...", {font:"30px Arial", fill: "#ffffff"});
        loadingLabel.anchor.setTo(0.5,0.5);
        
        var progressBar = game.add.sprite(game.world.centerX,200,"progressBar");
        progressBar.anchor.setTo(0.5,0.5);
        game.load.setPreloadSprite(progressBar);
         game.load.image("background","assets/background.png");
        game.load.image("player","assets/player.png");
        game.load.image("enemy","assets/enemy.png");
        game.load.image("coin","assets/coin.png");
        game.load.image("pixel","assets/pixel.png");
        game.load.image("wall","assets/tileWall.png");
       //game.load.image("wallV","assets/wallVertical.png");
        //game.load.image("wallH","assets/wallHorizontal.png");
        game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
        
        game.load.image("tileset","assets/tileset.png");
        game.load.tilemap("map","assets/tileset.json",null,Phaser.Tilemap.TILED_JSON);
        
        //load sounds
        game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
        game.load.audio('doubleJump', ['assets/doubleJump.ogg', 'assets/doubleJump.mp3']);
        game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
        game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
        game.load.audio('landFloor', ['assets/landFloor.ogg', 'assets/landFloor.mp3']);
        game.load.audio('landWall', ['assets/landWall.ogg', 'assets/landWall.mp3']);
        game.load.audio('smashSide', ['assets/smashSide.ogg', 'assets/smashSide.mp3']);
        game.load.audio('smash', ['assets/Smash.ogg', 'assets/smash.mp3']);
        game.load.audio('hardLand', ['assets/hardLand.ogg', 'assets/hardLand.mp3']);
        game.load.audio('kick', ['assets/kick.ogg', 'kick/rythm.mp3']);
        game.load.audio('hihat', ['assets/hihat.wav']);
        game.load.audio('hihat2', ['assets/hihat2.wav']);
        game.load.audio('clap', ['assets/clap.wav']);
        game.load.audio('crash', ['assets/crash.wav']);
        
    },
    create: function(){
        game.state.start("menu");
    }
};