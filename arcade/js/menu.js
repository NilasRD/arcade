var menuState = {
    create: function(){
        game.add.image(0,0,"background");
        
        var nameLabel01 = game.add.text(game.world.centerX, 60, "ARCADE",{font: "40px Share Tech Mono", fill: "#ffffff"});
        var nameLabel02 = game.add.text(game.world.centerX, 90, "MUSIC",{font: "40px Share Tech Mono", fill: "#ffffff"});
        var nameLabel03 = game.add.text(game.world.centerX, 120, "-BOX-",{font: "40px Share Tech Mono", fill: "#ffffff"});
nameLabel01.anchor.setTo(0.5,0.5);
nameLabel02.anchor.setTo(0.5,0.5);
nameLabel03.anchor.setTo(0.5,0.5);

      //  var scoreLabel = game.add.text(game.world.centerX, game.world.centerY+30, "score: " + game.global.score,{font: "25px Arial", fill: "#ffffff"});
//scoreLabel.anchor.setTo(0.5,0.5);
        
        var startLabel = game.add.text(game.world.centerX, game.world.height-80, "press the spacebar to start",{font: "25px Share Tech Mono", fill: "#ffffff"});
startLabel.anchor.setTo(0.5,0.5);
        var startTestLabel = game.add.text(game.world.centerX, game.world.height-40, "(press the T key for a test game)",{font: "15px Share Tech Mono", fill: "#ffffff"});
startTestLabel.anchor.setTo(0.5,0.5);

        game.global.testGame = false;
        
        if (!localStorage.getItem('bestScore')) {
// Then set the best score to 0
localStorage.setItem('bestScore', 0);
}
// If the score is higher than the best score
if (game.global.score > localStorage.getItem('bestScore')) {
// Then update the best score
localStorage.setItem('bestScore', game.global.score);
}
        var text = 'score: ' + game.global.score + '\nbest score: ' +
localStorage.getItem('bestScore');
var scoreLabel = game.add.text(game.world.centerX, game.world.centerY+30, text,
{ font: '25px Share Tech Mono', fill: '#ffffff', align: 'center' });
scoreLabel.anchor.setTo(0.5, 0.5);
        
      //  var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var tKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
       // upKey.onDown.addOnce(this.start,this);
         wKey.onDown.addOnce(this.start,this);
        tKey.onDown.addOnce(this.startTest,this);
      
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
// If the mouse is over the button, it becomes a hand cursor
this.muteButton.input.useHandCursor = true;
        if (game.sound.mute) {
// Change the frame to display the speaker with no sound
this.muteButton.frame = 1;
            
           
}
        
        //tween title
        game.add.tween(nameLabel01).from({y: -80},1000).easing(Phaser.Easing.Bounce.Out).start();
         game.add.tween(nameLabel02).from({y: -80},1100).easing(Phaser.Easing.Bounce.Out).start();
         game.add.tween(nameLabel03).from({y: -80},1200).easing(Phaser.Easing.Bounce.Out).start();
        //tween start
        game.add.tween(startLabel).to({angle: -2},500).to({angle: 0},500).to({angle: -2},500).to({angle: 0},500).loop().start();
        
    },
    start: function (){
        game.global.testGame = false;
        game.state.start("play");
    },
    startTest: function (){
        game.global.testGame = true;
        game.state.start("play");
    },
    toggleSound: function(){
        game.sound.mute = ! game.sound.mute;
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    }
}