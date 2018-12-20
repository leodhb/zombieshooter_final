
window.onkeydown = function(e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault(); //bug fixado: o espaço estava dando page down durante o game!
  } 
};


var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'phaser_div');


var fundoJogo;
var player;
var player2;
//var sprite;

var direcionais;

// direcionais e disparo player2
var botaoDisparoP2;
var a;
var d;
//VERIFICADOR MULTIPLAYER
var isMultiPlayer;

var abates;
var tempo;
var timer;
var wave;
var bgmenu;
var textmenu;
var textmenu2;
var count_descidas = 0;
var tropa;
var municao;
var tempoDisparo = 0;
var tempoDisparo2 = 0;
var botaoDisparo;
var botaoStart;
var botao1p;
var botao2p;
var audioTiro;
var explosao;
var audiodamorte;
var musica;
var zumbi;
var count_zumbis = 0;
var morte0;
var audio_inicio;
var audio_gameover;
var morte_sfx;
var municao_zumbi;
var bala_zumbi;
var zumbis_vivos = [];
var tempo_bala = 1000;
var isStart = false;
var startSong;

var playerAtivo;

var delimitador;

var explosions;

var intervalo_balas = 400;

var tempo_stage = 40000;
var texto_LCD;
var instrucoes = {


		preload: function(){
				game.load.audio('inicio', 'audio/inicio.ogg');
		},
		create: function(){
				var style = { font: "20px prstart", fill: "#ffffff", align: "center" };

				if(isMultiPlayer)
				{
					var text = game.add.text(game.world.centerX, game.world.centerY, "INSTRUÇÕES \n\nPLAYER 1\nDIRECIONAIS - MOVE O SOLDADO\n[ESPAÇO] - DISPARA\n\nPLAYER 2\n[A & D] - MOVE O SOLDADO\n[W] - DISPARA\n\nBOA SORTE!", style);
		
				}
				else
				{
					var text = game.add.text(game.world.centerX, game.world.centerY, "INSTRUÇÕES \n\nDIRECIONAIS - MOVE O SOLDADO\n[ESPAÇO] - DISPARA\n\nBOA SORTE!", style);
				
				}
				
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
				game.load.audio('start', 'audio/start.ogg');
				game.load.image('textmenu', 'img/menu1.png');
				game.load.image('textmenu2', 'img/menu2.png');
		},
		create: function(){
			delimitador = game.time.now + 2000;
			botaoStart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			botao1p    = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
			botao2p    = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
			
			startSong = game.add.audio('start');
			startSong.allowMultiple = false;
			startSong.volume = 0.4;

			bgmenu = game.add.tileSprite(0, -480, 640, 480, 'mainmenu');
			textmenu = game.add.tileSprite(0, 0, 640, 480, 'textmenu');
			textmenu2 = game.add.tileSprite(0, 0, 640, 480, 'textmenu2');
			textmenu2.visible = false;
			textmenu.alpha = 0;
			textmenu2.alpha = 0;

			game.add.tween(bgmenu).to( { y: '+480' }, 2000, Phaser.Easing.Linear.None, true);
			game.time.events.add(Phaser.Timer.SECOND * 2, textMenu, this);
			game.time.events.add(Phaser.Timer.SECOND * 2, textMenu2, this);
			
		},
		update: function(){

			if(botaoStart.isDown)
			{
				if(game.time.now > delimitador)
				{
					if(isStart == false)
					{
						var getAlpha;
						isStart = true;
						startSong.play();
						getAlpha = textmenu.alpha;
						textmenu.visible = false;
						textmenu2.visible = true;
						textmenu2.alpha = getAlpha;
					}
				}
				
			}

			if(botao1p.isDown)
			{	
				if(isStart)
				{
					
					isMultiPlayer = false;
					isStart       = false;
					startSong.play();
					game.time.events.add(Phaser.Timer.SECOND * 0.5, mostrarInstrucoes, this);
			
				}
				
				
			}
			else if(botao2p.isDown)
			{	
				if(isStart)
				{

					isMultiPlayer = true;
					isStart       = false;
					startSong.play();
					game.time.events.add(Phaser.Timer.SECOND * 0.5, mostrarInstrucoes, this);
			
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
		game.load.image('nave2', 'img/soldado2.png');
		game.load.image('bala', 'img/bala.png');
		game.load.image('bala_zumbi', 'img/bala_zumbi.png');
		game.load.image('powerup', 'img/powerup.png');
		
		game.load.spritesheet('explosao', 'img/explosaun.png', 128, 128);
		game.load.spritesheet('zumbi', 'img/zumbi.png', 64,64);
		game.load.audio('tiro', 'audio/tiro.ogg');
		
		// audios de morte - randômicos
		game.load.audio('morte_zumbi', 'audio/morte_zumbi.ogg');

		game.load.audio('morte', 'audio/morte_player.ogg');

		
		


	},
	create: function(){
		//adicionando imagens

		abates = 0;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		musica = game.add.audio('musica');
		musica.loop = true;
		musica.play();

		fundoJogo = game.add.tileSprite(0, 0, 640, 480, 'fundo');

		player                 = game.add.sprite(312, 400, 'nave');
		player.enableBody      = true;
		player.physicsBodyType = Phaser.Physics.ARCADE;

		audioTiro = game.add.audio('tiro');
		audioTiro.allowMultiple = false;
		audioTiro.volume = 0.3;

		morte0 = game.add.audio('morte_zumbi');
		morte0.allowMultiple = false;
		morte0.volume = 0.5;


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

		//direções e disparo p1
		direcionais  = game.input.keyboard.createCursorKeys();
		botaoDisparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		if(isMultiPlayer)
		{
			player2                 = game.add.sprite(426, 400, 'nave2');
			player2.enableBody      = true;
			player2.physicsBodyType = Phaser.Physics.ARCADE;

			player2.scale.setTo(0.1, 0.1);
			player2.anchor.setTo(0.5, 0.5);

			game.physics.arcade.enable(player2);
			player2.body.collideWorldBounds = true;

			//direções e disparo p2
			a = game.input.keyboard.addKey(Phaser.Keyboard.A);
			d = game.input.keyboard.addKey(Phaser.Keyboard.D);
			botaoDisparoP2 = game.input.keyboard.addKey(Phaser.Keyboard.W);
		}
		

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


		//P1
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
				tempoDisparo = game.time.now + 200;//intervalo_balas; //400
			}
		}
		
		//P2

		if(isMultiPlayer)
		{
			if(a.isDown)
			{
				player2.x -= 10;
			}
			else if(d.isDown)
			{
				player2.x +=10;
			}
			

			if (game.time.now > tempo_bala)
	        {
	        	disparoZumbi();
	        }

			var balap2;
			if(botaoDisparoP2.isDown)
			{
				if(game.time.now > tempoDisparo2)
				{
					balap2 = municao.getFirstExists(false);
				}
				if(balap2 && player2.alive == true)
				{
					balap2.reset(player2.x, player2.y);
					audioTiro.play();
					balap2.body.velocity.y = -300; //-300
					tempoDisparo2 = game.time.now + 200;//intervalo_balas; //400
				}
			}
			game.physics.arcade.overlap(municao_zumbi, player2, morte_player2, null, this);
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
	morte0.stop();
	morte_sfx.play();
	
	if(isMultiPlayer)
	{
		if(player2.alive == false)
		{
			game.time.events.add(Phaser.Timer.SECOND * 5, fimDeJogo, this);
		}
	}
	else if(isMultiPlayer == false)
	{
		game.time.events.add(Phaser.Timer.SECOND * 5, fimDeJogo, this);
	}
	

}


function morte_player2(player2,bullet) {
    bullet.kill();
    player2.kill();

    explosao = game.add.sprite(player2.body.x, player2.body.y, 'explosao');
    explosao.scale.setTo(1.2);
	explosao.anchor.setTo(0.3, 0.3);

	explosao.animations.add('explodir', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],80, false);
	explosao.animations.play('explodir', true);
	morte0.stop();
	morte_sfx.play();

	if(player.alive == false)
	{
		game.time.events.add(Phaser.Timer.SECOND * 5, fimDeJogo, this);
	}

}




function colisao(bala, alien)
{

	bala.kill();
	alien.kill();
	count_zumbis--;
	abates++;
	morte0.play();

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

function textMenu2()
{
		game.add.tween(textmenu2).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);	
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

    bala_zumbi = municao_zumbi.getFirstExists(false);

    zumbis_vivos.length=0;

    tropa.forEachAlive(function(zumbi){

        
        zumbis_vivos.push(zumbi);
    });


    if (bala_zumbi && zumbis_vivos.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,zumbis_vivos.length-1);

        //zumbi selecionado aleatoriamente
        var zumbi_atirador = zumbis_vivos[random];
        bala_zumbi.reset(zumbi_atirador.body.x+10, zumbi_atirador.body.y+15);



        /*
			ALGORITMO DE MIRA DOS ZUMBIS
			FEITO DE MODO A NÃO DEIXAR NENHUM PLAYER EM DESVANTAGEM
        */
        if(!isMultiPlayer)
        {
        	game.physics.arcade.moveToObject(bala_zumbi,player,120);
      		tempo_bala = game.time.now + 2000;
        }
        else
        {
        	if(player.alive == true && player2.alive == true)
        	{
        		playerAlvo = Math.random(); //Alvo aleatorio, caso os dois estejam vivos ainda

        		if(playerAlvo == 0)
        		{
        			game.physics.arcade.moveToObject(bala_zumbi,player,120);
      				tempo_bala = game.time.now + 2000;
        		}
        		else
        		{
        			game.physics.arcade.moveToObject(bala_zumbi,player2,120);
      				tempo_bala = game.time.now + 2000;
        		}
        		
        	}
        	else if(player.alive == true && player2.alive == false)
        	{
        		game.physics.arcade.moveToObject(bala_zumbi,player,120);
      			tempo_bala = game.time.now + 2000;
        	}
        	else
        	{
        		game.physics.arcade.moveToObject(bala_zumbi,player2,120);
      			tempo_bala = game.time.now + 2000;
        	}
        }
        
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
