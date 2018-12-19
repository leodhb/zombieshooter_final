
window.onkeydown = function(e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault(); //bug fixado: o espaço estava dando page down durante o game!
  } 
};


var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'phaser_div');

//o allowMultiple não funcionou por algum motivo, por isso fiz uma verificação manual
var startUmaVez = false;

var fundoJogo;
var player;
//var sprite;

var delimitador;
var direcionais;

var startSong;
var abates;
var tempo;
var timer;
var wave;
var bgmenu;
var textmenu;
var count_descidas = 0;
var tropa;
var municao;
var tempoDisparo = 0;
var botaoDisparo;
var botaoStart;
var audioTiro;
var explosao;
var audiodamorte;
var musica;
var zumbi;
var count_zumbis = 0;
var morte0;
var morte1;
var morte2;
var morte3;
var morte4;
var audio_inicio;
var audio_gameover;
var morte_sfx;
var municao_zumbi;
var bala_zumbi;
var zumbis_vivos = [];
var tempo_bala = 1000;


var explosions;

var intervalo_balas = 400;

var tempo_stage = 40000;
var texto_LCD;
var instrucoes = {


		preload: function(){
				game.load.audio('inicio', 'audio/inicio.ogg');
		},
		create: function(){

				startUmaVez = false;

				var style = { font: "20px prstart", fill: "#ffffff", align: "center" };
				var text = game.add.text(game.world.centerX, game.world.centerY, "INSTRUÇÕES\n\nSE FODE AÍ...\n\nBOA SORTE!", style);
				text.anchor.set(0.5);

				audio_inicio = game.add.audio('inicio');
				audio_inicio.play();

				game.time.events.add(Phaser.Timer.SECOND * 7, jogar, this);


		},
		update: function(){

		}

};

var menu = {

		preload: function(){
				game.load.image('mainmenu', 'img/menu.png');
				game.load.image('textmenu', 'img/menu2.png');
				game.load.audio('start', 'audio/desgraça.ogg');
		},
		create: function(){
			delimitador = game.time.now + 2500;

			botaoStart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			bgmenu = game.add.tileSprite(0, -480, 640, 480, 'mainmenu');
			textmenu = game.add.tileSprite(0, 0, 640, 480, 'textmenu');
			
			startSong = game.add.audio('start');
			startSong.allowMultiple = false;

			startSong.volume = 0.6;


			textmenu.alpha = 0;

			game.add.tween(bgmenu).to( { y: '+480' }, 2000, Phaser.Easing.Linear.None, true);
			game.time.events.add(Phaser.Timer.SECOND * 2, textMenu, this);
		},
		update: function(){
			if(botaoStart.isDown)
			{
				if(game.time.now > delimitador)
				{
					if(!startUmaVez)
					{
						startUmaVez = true;
						startSong.play();
					}
					game.time.events.add(Phaser.Timer.SECOND * 1, mostrarInstrucoes, this);
				}
				
			}
		}

};

var gameover = {

		preload: function(){
				
				game.load.audio('audiogameover', 'audio/gameover.ogg');
		},
		create: function(){

				

				var style = { font: "20px prstart", fill: "#ffffff", align: "center" };
				var text = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER\n\nABATES: " + abates, style);
				

				text.anchor.set(0.5);
				audio_gameover = game.add.audio('audiogameover');
				audio_gameover.play();
				game.time.events.add(Phaser.Timer.SECOND * 7, voltarAoMenu, this);


		},
		update: function(){

		}

};


var jogo = {


	preload: function(){

		game.load.audio('musica', 'audio/tema.ogg');
		game.load.image('fundo', 'img/fundo.png');
		game.load.image('nave', 'img/soldado.png');
		game.load.image('bala', 'img/bala.png');
		game.load.image('bala_zumbi', 'img/bala_zumbi.png');
		game.load.image('powerup', 'img/powerup.png');
		
		game.load.spritesheet('explosao', 'img/explosaun.png', 128, 128);
		game.load.spritesheet('zumbi', 'img/zumbi.png', 64,64);
		game.load.audio('tiro', 'audio/tei.ogg');
		
		// audios de morte - randômicos
		game.load.audio('morte0', 'audio/morte/away.ogg');
		game.load.audio('morte1', 'audio/morte/dlc.ogg');
		game.load.audio('morte2', 'audio/morte/ai.ogg');
		game.load.audio('morte3', 'audio/morte/meuc.ogg');
		game.load.audio('morte4', 'audio/morte/bct.ogg');

		game.load.audio('morte', 'audio/morte_player.ogg');

		
		


	},
	create: function(){
		//adicionando imagens

		abates = 0;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		musica = game.add.audio('musica');
		musica.loop = true;
		musica.volume = 0.6;
		musica.play();

		fundoJogo = game.add.tileSprite(0, 0, 640, 480, 'fundo');
		player    = game.add.sprite(game.width/2, 400, 'nave');
		player.enableBody = true;
		player.physicsBodyType = Phaser.Physics.ARCADE;
		

		audioTiro = game.add.audio('tiro');
		audioTiro.allowMultiple = false;
		audioTiro.volume = 0.2;

		morte0 = game.add.audio('morte0');
		morte0.allowMultiple = false;
		morte0.volume = 0.5;

		morte1 = game.add.audio('morte1');
		morte1.allowMultiple = false;
		morte1.volume = 0.3;
		
		morte2 = game.add.audio('morte2');
		morte2.allowMultiple = false;
		morte2.volume = 0.4;

		morte3 = game.add.audio('morte3');
		morte3.allowMultiple = false;
		morte3.volume = 0.4;

		morte4 = game.add.audio('morte4');
		morte4.allowMultiple = false;
		morte4.volume = 0.4;

		morte_sfx = game.add.audio('morte');
		morte_sfx.allowMultiple = false;
		morte_sfx.volume = 0.7;

		timer = game.time.create(false);
		timer.loop(tempo_stage, fimDeJogo, this);
		timer.start();
		wave = 1;

		player.scale.setTo(0.1, 0.1);
		player.anchor.setTo(0.5, 0.5);
		
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		//direções
		direcionais  = game.input.keyboard.createCursorKeys();
		botaoDisparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		

		municao_zumbi = game.add.group();
	    municao_zumbi.enableBody = true;
	    municao_zumbi.physicsBodyType = Phaser.Physics.ARCADE;
	    municao_zumbi.createMultiple(30, 'bala_zumbi');
	    municao_zumbi.setAll('anchor.x', 0.5);
	    municao_zumbi.setAll('anchor.y', 1);
	    municao_zumbi.setAll('outOfBoundsKill', true);
	    municao_zumbi.setAll('checkWorldBounds', true);

		carregarArma();

		tropa = game.add.group();
		tropa.enableBody = true;
		tropa.physicsBodyType = Phaser.Physics.ARCADE;


		//é tudo invertido nesse krl mds
		for(var y = 0 ; y < 5 ; y++)
		{
			for (var x = 0 ; x < 9 ; x++) 
			{
				zumbi = tropa.create(x*60, y*40, 'zumbi');
				zumbi.scale.setTo(0.7);
				zumbi.anchor.setTo(0.5);
				zumbi.animations.add('andar', [0,1,2,3], 4, true);
				zumbi.animations.play('andar', true);
				count_zumbis++;

			}
		}
		tropa.x = 50;
		tropa.y = 30;
		

		var animacao = game.add.tween(tropa).to({x:100}, 3000, Phaser.Easing.Linear.None, true, 0, 3000, true);
		animacao.onLoop.add(descer, this);

		explosions = game.add.group();
	    explosions.createMultiple(30, 'explosao');
	    explosions.forEach(setupExplosoes, this);
	},
	update: function(){



		if(direcionais.left.isDown)
		{
			player.x -= 10;
		}
		else if(direcionais.right.isDown)
		{
			player.x +=10;
		}
		
		if (game.time.now > tempo_bala)
        {
        	disparoZumbi();
        }

		var bala;
		if(botaoDisparo.isDown)
		{
			if(game.time.now > tempoDisparo)
			{
				bala = municao.getFirstExists(false);
			}
			if(bala && player.alive == true)
			{
				bala.reset(player.x, player.y);
				audioTiro.play();
				bala.body.velocity.y = -300; //-300
				tempoDisparo = game.time.now + 400;//intervalo_balas; //400
			}
		}
		

		/* QUANDO UMA WAVE MORRE */
		if(count_zumbis == 0)
		{

			for(var y = 0 ; y < 5 ; y++)
			{
			for (var x = 0 ; x < 9 ; x++) 
				{
					zumbi = tropa.create(x*60, y*40, 'zumbi');
					zumbi.scale.setTo(0.7);
					zumbi.anchor.setTo(0.5);
					zumbi.animations.add('andar', [0,1,2,3], 4, true);
					zumbi.animations.play('andar', true);
					count_zumbis++;

				}
			}
			


				municao.destroy();
				carregarArma();

				timer.stop(false);
				timer = game.time.create(false);
				tempo_stage = tempo_stage - 1000;
				timer.loop(tempo_stage, fimDeJogo, this);
				timer.start();
				wave ++;
				tropa.x = 50;
				tropa.y = 30;
		}

		game.physics.arcade.overlap(municao, tropa, colisao, null, this);
		game.physics.arcade.overlap(municao_zumbi, player, morte_player, null, this);
		
		
	},
	render: function()
	{
		tempo = parseInt(timer.duration.toFixed(0) / 1000);
		texto_LCD =  game.debug.text('Horda: ' + wave + ' | Tempo: ' + (tempo + 1) , 35, 462);
	
	}
};


function morte_player(player,bullet) {
    bullet.kill();
    player.kill();

    explosao = game.add.sprite(player.body.x, player.body.y, 'explosao');
    explosao.scale.setTo(1.2);
	explosao.anchor.setTo(0.3, 0.3);

	explosao.animations.add('explodir', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],80, false);
	explosao.animations.play('explodir', true);
	morte_sfx.play();
	game.time.events.add(Phaser.Timer.SECOND * 6, fimDeJogo, this);

}






function colisao(bala, alien)
{

	bala.kill();
	alien.kill();
	count_zumbis--;
	abates++;
	audiodamorte =  Math.floor((Math.random() * 5)); 

	switch(audiodamorte)
	{
		case 0:
			morte0.play();
			break;
		case 1:
			morte1.play();
			break;
		case 2:
			morte2.play();
			break;
		case 3:
			morte3.play();
			break;
		case 4:
			morte4.play();
			break;
			
	}

	var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('explodir', 80, false, true);
}
	

function descer()
{
	tropa.y += 10;
	count_descidas ++;

}



function textMenu()
{
		game.add.tween(textmenu).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);	
}

function jogar() {
    game.state.start('jogo');


}

function mostrarInstrucoes() {
    game.state.start('instrucoes');


}


function fimDeJogo()
{
	musica.stop();
	tropa.remove(zumbi);
	tempo_stage = 40000;
	count_zumbis = 0;
	game.state.start('gameover');
}


function carregarArma()
{
		municao = game.add.group();
		municao.enableBody = true;
		municao.physicsBodyType = Phaser.Physics.ARCADE;
		municao.createMultiple(200, 'bala');

		municao.setAll('anchor.x', 0);
		municao.setAll('anchor.y', 4.1);
		municao.setAll('outOfBoundsKill', true);
		municao.setAll('checkWorldBounds', true);
}


function disparoZumbi () {

    //  Grab the first bullet we can from the pool
    bala_zumbi = municao_zumbi.getFirstExists(false);

    zumbis_vivos.length=0;

    tropa.forEachAlive(function(zumbi){

        // put every living enemy in an array
        zumbis_vivos.push(zumbi);
    });


    if (bala_zumbi && zumbis_vivos.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,zumbis_vivos.length-1);

        // randomly select one of them
        var zumbi_atirador = zumbis_vivos[random];
        // And fire the bullet from this enemy
        bala_zumbi.reset(zumbi_atirador.body.x+10, zumbi_atirador.body.y+15);

        game.physics.arcade.moveToObject(bala_zumbi,player,120);
        tempo_bala = game.time.now + 2000;
    }

}



function voltarAoMenu()
{
	game.state.start('menu');
}

function setupExplosoes(alvo) {

    alvo.anchor.x = 0.3;
    alvo.anchor.y = 0.3;
    alvo.animations.add('explodir', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],80, false);
}
game.state.add('menu', menu);
game.state.add('gameover', gameover);
game.state.add('jogo', jogo);
game.state.add('instrucoes', instrucoes);

game.state.start('menu');
