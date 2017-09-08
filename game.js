var WIDTH = 1260, HEIGHT = 900, 
	ZONE_HEIGHT = 800, 
	BLOCK_WIDTH = 90, BLOCK_HEIGHT = 40, 
	ROWS = 8, COLUMES = 14;

var LeftArrow = 37, RightArrow = 39;

var mouse_x = 0;
var mouse_y = 0;

var god_mode = false;

var canvas, ctx, keystate;
var player = new player(), 
	ball = new ball(), 
	wall = new wall(), 
	life = new life(), 
	menu = new menu(),
	score = new score();
	digit = new digit();
	level = new level();

var scale = 1;

function level() {
	this.level = null;
	this.image = new Image(60, 71);

	this.levelUp = function() {
		if (this.level == 2) {
			console.log('entered');
			menu.status = 'won';
		} else {
			this.level += 1;
			wall.init();
			player.x = 575;
			player.y = 790;
			ball.x = 635;
			ball.y = 650;
			ball.hit_count = 0;
		}
	}

	this.draw = function(x, y) {
		ctx.drawImage(this.image, x, y);
		this.image.src = 'Stats/level.png';
		digit.draw_grey(this.level.toString(), x+60+40, y);
	}


}

function life() {
	this.life = null;
	this.image = new Image(94, 71);

	this.draw = function(x, y) {
		ctx.drawImage(this.image, x, y);
		this.image.src = 'Stats/life.png';
		digit.draw_grey(this.life.toString(), x+94+40, y);
	}
}

function score() {
	this.score = null;
	this.each_score = {0:7, 1:7, 2:5, 3:5, 4:3, 5:3, 6:1, 7:1};
	this.score_grey = new Image(166, 72);
	this.score_msg = new Image(363, 87);

	this.addScore = function(i) {
		this.score += this.each_score[i];
	}

	this.draw_grey = function(x, y) {
		ctx.drawImage(this.score_grey, x, y);
		this.score_grey.src = 'Stats/score.png';
		digit.draw_grey(this.score.toString(), x+166+40, y);
	}

	this.draw_black = function(x, y) {
		ctx.drawImage(this.score_msg, x, y);
		this.score_msg.src = 'Messages/scored.png';
		digit.draw_black(this.score.toString(), x+363+40, y);
	}

}

function digit() {
	this.digits = {
		0: new Image(),
		1: new Image(),
		2: new Image(),
		3: new Image(),
		4: new Image(),
		5: new Image(),
		6: new Image(),
		7: new Image(),
		8: new Image(),
		9: new Image()
	};

	this.draw_grey = function(number, x, y) {
		var i = 0;
		var _x = x;
		var space = 10;
		while (number[i]) {
			ctx.drawImage(this.digits[number[i]], _x, y);
			this.digits[number[i]].src = 'Stats/' + number[i] + '.png';
			_x += (this.digits[number[i]].naturalWidth + space);
			i++;
		}
	}

	this.draw_black = function(number, x, y) {
		var i = 0;
		var _x = x;
		var space = 10;
		while (number[i]) {
			ctx.drawImage(this.digits[number[i]], _x, y);
			this.digits[number[i]].src = 'Stats/' + number[i] + '_Black.png';
			_x += (this.digits[number[i]].naturalWidth + space);
			i++;
		}
	}
}

function menu() {
	this.status = null;
	this.welcome_msg = new Image(1280,212);
	this.start_button = new Image(150, 60);
	this.win_msg = new Image(829,100);
	this.lose_msg = new Image(260,87);
	this.restart_button = new Image(150, 60);
	this.continue_button = new Image(150, 60);
	this.clear_msg = new Image(428, 87);
	this.paused_msg = new Image(246, 87);
	this.greyedOut = new Image(1280, 900);
	this.pause_button = new Image(150, 60);

	this.drawStart = function() {
		ctx.drawImage(this.start_button, 565, 400);
		this.start_button.src = 'Buttons/start.png';

		ctx.drawImage(this.welcome_msg, 0, 50);
		this.welcome_msg.src = 'Messages/welcome.png';
	}

	this.drawWin = function() {
		ctx.drawImage(this.restart_button, 0, 840);
		this.restart_button.src = 'Buttons/restart.png';

		ctx.drawImage(this.win_msg, 0, 550);
		this.win_msg.src = 'Messages/won.png';

		score.draw_black(0, 680);

	}

	this.drawLevelUp = function() {
		ctx.drawImage(this.continue_button, 0, 840);
		this.continue_button.src = 'Buttons/continue.png';

		ctx.drawImage(this.clear_msg, 0, 550);
		this.clear_msg.src = 'Messages/cleared.png';

		score.draw_black(0, 680);
	}

	this.drawLose = function() {
		ctx.drawImage(this.restart_button, 0, 840);
		this.restart_button.src = 'Buttons/restart.png';

		ctx.drawImage(this.lose_msg, 0, 550);
		this.lose_msg.src = 'Messages/lost.png';

		score.draw_black(0, 680);

	}

	this.drawPaused = function() {
		ctx.drawImage(this.greyedOut, 0, 0);
		this.greyedOut.src = 'Elements/grey.png';

		ctx.drawImage(this.continue_button, 0, 840);
		this.continue_button.src = 'Buttons/continue.png';

		ctx.drawImage(this.paused_msg, 0, 700);
		this.paused_msg.src = 'Messages/paused.png';
	}

	this.drawPause = function() {
		ctx.drawImage(this.pause_button, 0, 840);
		this.pause_button.src = 'Buttons/pause.png';
	}

	this.drawClear = function() {

	}

	this.clicked = function(x, y, nextStatus) {

		if (mouse_x < x || mouse_x > (x+150*scale) || mouse_y < y || mouse_y > (y+60*scale)) {
			mouse_x = 0;
			mouse_y = 0;
		} else {
			if (this.status == 'lost' || this.status == 'won') {
				init();
			}
			this.status = nextStatus;
			mouse_x = 0;
			mouse_y = 0;
		}
	}

}

function block(source,x,y) {
	this.x = x;
	this.y = y;
	this.exist = true;
	this.image = new Image(BLOCK_WIDTH,BLOCK_HEIGHT);

	this.draw = function() {
		if (this.exist) {
			ctx.drawImage(this.image, this.x, this.y);
		}
		this.image.src = source;
	}
}

function wall() {
	this.img = [];

	this.init = function() {
		for (var i = 0; i < ROWS; i++) {
			this.img[i] = [];
			var y = BLOCK_HEIGHT * i; 
			for (var j = 0; j < COLUMES; j++){
				var x = BLOCK_WIDTH * j;
				this.img[i][j] = new block('Blocks/'+(i+1)+'.png',x,y);
			}
		}
	}

	this.draw = function() {
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLUMES; j++){
				this.img[i][j].draw();
			}
		}
	}
}

function player() {
	this.x = null;
	this.y = null;
	this.width = null;
	this.height = null;
	this.speed = 20;
	this.source = null;


	this.image = new Image(this.width, this.height);

	this.init = function() {
		this.x = 575;
		this.y = 790;
		this.width = 256;
		this.height = 10;
		this.source = 'Blocks/board@2x.png';
	}

	this.update = function() {
		if (keystate[LeftArrow]) this.x -= this.speed;
		if (keystate[RightArrow]) this.x += this.speed;
		this.x = Math.max(Math.min(this.x, WIDTH - this.width), 0);
		if (ball.bounced_off) {
			this.width = 128;
			this.source = 'Blocks/board.png';
		} else {
			this.width = 256;
			this.source = 'Blocks/board@2x.png';
		}
	};

	this.draw = function() {
		ctx.drawImage(this.image, this.x, this.y);
		this.image.src = this.source;
	}
}

function ball() {
	this.x = null;
	this.y = null;
	this.vx = null;
	this.vy = null;
	this.speed = null;
	this.hit_count = null;
	this.successive_hits = null;
	this.hit_top = null;
	this.hit_subtop = null;
	this.bounced_off = null;

	this.side = 10;
	this.image = new Image(10,10);

	this.init = function() {
		this.x = 625;
		this.y = 650;
		this.vx = 1;
		this.vy = -1;
		this.speed = 5;
		this.successive_hits = 0;
		this.hit_top = false;
		this.hit_subtop = false;
		this.hit_count = 0;
		this.bounced_off = false;
	}

	this.restore = function() {
		this.x = 625;
		this.y = 650;
		this.vx = 1;
		this.vy = -1;
		this.speed = 5;
		this.successive_hits = 0;
		this.hit_top = false;
		this.hit_subtop = false;
		this.bounced_off = false;
	}

	this.update = function() {
		menu.clicked(0, 840*scale, 'paused');
		
		var step = 0;
		if (this.hit_count == ROWS*COLUMES) {
			if (level.level == 1) {
				level.levelUp();
				menu.status = 'levelUp';
			} else {
				menu.status = 'won';
			}
		}

		while (step < this.speed) {
			if (this.y + this.side >= ZONE_HEIGHT) {
				if (god_mode) {
					this.vy = -1;
				} else {
					this.restore();
					life.life -= 1;
					if (life.life < 0) {
						menu.status = 'lost';
					}
				}
			}
			if (this.y + this.side >= ZONE_HEIGHT - player.height && this.vy > 0) {
				if (this.x - player.x >= 0 && this.x + this.side - player.x  < player.width) {
					this.vy = -1;
				}
			}
			if (this.y <= 0) {
				this.vy = 1;
				this.bounced_off = true;
			}
			if (this.x <= 0 || this.x + this.side >= WIDTH) {
				this.vx *= -1;
			}

			var i = Math.floor(this.y / BLOCK_HEIGHT);
			var j = Math.floor(this.x / BLOCK_WIDTH);
			var hit_x = false;
			var hit_y = false;

			if (i <= ROWS ) {
				if (this.y % BLOCK_HEIGHT == 0) {
					if (this.vy < 0 && i > 0) {
						//Bottom
						i--;
						hit_x = true;
					} 
					else if (this.vy > 0 && i < ROWS) {
						//Top
						hit_x = true;
					}
				}
				if (this.x % BLOCK_WIDTH == 0 && i < ROWS) {
					if (this.vx > 0 && j < COLUMES) {
						//Left
						hit_y = true;
					} 
					else if (this.vx < 0 && j > 0) {
						//Right
						j--;
						hit_y = true;
					}
				}
			}

			if (hit_x) {
				if (wall.img[i][j].exist) {
					wall.img[i][j].exist = false;
					this.hit_count++;
					this.successive_hits++;
					this.vy *= -1;
					score.addScore(i);
					if (this.successive_hits == 4 || this.successive_hits == 12) {
						this.speed++;
					}if (!this.hit_subtop && i == 1) {
						this.speed++;
						this.hit_subtop = true;
					}if (!this.hit_top && i == 0) {
						if (this.hit_subtop) {
							this.speed++;
						} else {
							this.speed += 2;
							this.hit_subtop = true;
						}
						this.hit_top = true;
					}
				}
				hit_x = false;
			}
			if (hit_y) {
				if (wall.img[i][j].exist) {
					wall.img[i][j].exist = false;
					this.hit_count++;
					this.successive_hits++;
					this.vx *= -1;
					score.addScore(i);
					if (this.successive_hits == 4 || this.successive_hits == 12) {
						this.speed++;
					}if (!this.hit_subtop && i == 1) {
						this.speed++;
						this.hit_subtop = true;
					}if (!this.hit_top && i == 0) {
						if (this.hit_subtop) {
							this.speed++;
						} else {
							this.speed += 2;
							this.hit_subtop = true;
						}
						this.hit_top = true;
					}
				}
			}
	
			
			this.x += this.vx;
			this.y += this.vy;
			step++;
		}
	}

	this.draw = function() {
		ctx.drawImage(this.image, this.x, this.y);
		this.image.src = 'Blocks/ball.png';
	}
}

function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    var xPosition = e.clientX - parentPosition.x;
    var yPosition = e.clientY - parentPosition.y;
    mouse_x = xPosition;
    mouse_y = yPosition;
}

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
      
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

function main() {
	canvas = document.createElement('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');

	keystate = {};
	document.addEventListener('keydown', function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener('keyup', function(evt) {
		delete keystate[evt.keyCode];
	});

	canvas.addEventListener('click', getClickPosition);

	$('body').css({'margin': 0 });
	$('body html').css({'overflow': 'hidden' });
	$('canvas').css({'position': 'absolute' });

	init();

	scaleToFit();

	$(window).resize(function() {
		scaleToFit();
	});

	var loop = function() {
		update();
		draw();
		window.requestAnimationFrame(loop,canvas);
	};
	window.requestAnimationFrame(loop,canvas);

}

function scaleToFit() {
	var width = $(window).width();
	var height = $(window).height();
	var canvasHeight = $(canvas).height()*scale;
	var maxScale = height/HEIGHT;
		scale = width*1.0/WIDTH;
		console.log(height, canvasHeight)
		console.log(scale, maxScale);
	if (canvasHeight <= height && scale <= maxScale) {
		$(canvas).css({
			'-webkit-transform' : 'scale(' + scale + ')',
			'-moz-transform'    : 'scale(' + scale + ')',
			'-ms-transform'     : 'scale(' + scale + ')',
			'-o-transform'      : 'scale(' + scale + ')',
			'transform'         : 'scale(' + scale + ')'
			});
	} else {
		scale = maxScale;
		$(canvas).css({
			'-webkit-transform' : 'scale(' + maxScale + ')',
			'-moz-transform'    : 'scale(' + maxScale + ')',
			'-ms-transform'     : 'scale(' + maxScale + ')',
			'-o-transform'      : 'scale(' + maxScale + ')',
			'transform'         : 'scale(' + maxScale + ')'
			});
	}
}


function init() {
	wall.init();
	ball.init();
	player.init();
	level.level = 1;
	life.life = 3;
	score.score = 0;
	menu.status = 'start';
}

function update() {
	if (menu.status == 'start') {
		menu.clicked(565*scale, 400*scale, 'play');
	} else if (menu.status == 'play') {
		player.update();
		ball.update();
	} else if (menu.status == 'paused'){
		menu.clicked(0, 840*scale, 'play');
	} else if (menu.status == 'levelUp') {
		menu.clicked(0, 840*scale, 'play');
	} else {
		menu.clicked(0, 840*scale, 'play');
	}
}

function draw() {
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	if (menu.status == 'start') {
		menu.drawStart();
	} else if (menu.status == 'play') {
		level.draw(240, 500);
		life.draw(490, 500);
		score.draw_grey(770, 500);
		wall.draw();
		player.draw();
		ball.draw();
		menu.drawPause();
	} else if (menu.status == 'won') {
		menu.drawWin();
	} else if (menu.status == 'levelUp') {
		menu.drawLevelUp();
	} else if (menu.status == 'paused') {
		level.draw(240, 500);
		life.draw(490, 500);
		score.draw_grey(770, 500);
		wall.draw();
		player.draw();
		ball.draw();
		menu.drawPaused();
	} else {
		menu.drawLose();
	}
}

function transition(sytle) {

	if (style == 'start') {

	}
}

main();