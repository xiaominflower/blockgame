/**
 * Created by hanym on 2017/4/10.
 */

// Game
var Game = function(param){
	var _this = this;
	this.canvas = document.getElementById(param.canvasid);
	this.ctx = this.canvas.getContext("2d");
	this.state = 0; // 0��ʾδ��ʼ��1��ʾ��ʼ
	//������Դ
	var imgs = new StaticSource();
	imgs.loadImages(function(){
		_this.run();
		_this.imgs = imgs.imageObj;
	})
	this.score = 0;
}
Game.prototype ={
	run:function(){
		var _self = this;
		//��ɫ
		this.ball = new Ball();
		this.tray = new Tray();
		this.blockManager = new BlockManager();
		this.blockManager.createBlock();

		this.timer = setInterval(function(){
			_self.mainloop();
		},20)


	},
	mainloop:function(){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.blockManager.updateAll();
		this.blockManager.renderAll();
		this.tray.render();
		this.ball.render();
		this.ball.update();

	},
	gameover:function(){
		clearInterval(this.timer);
		alert('gameover');
	},
	resurrection:function(){ //����
		this.state =0;
		game.ball.angle = -30;

	}
}

//��Դ����
function StaticSource(){
	var _this = this;
	this.images =[
		{"role" : 'ball',"src" : "images/ball.png"},
		{"role" : 'block',"src" : "images/block.png"},
		{"role" : 'tray',"src" : "images/tray.png"},
		{"role" : 'star',"src" : "images/star.png"}
	];
	this.total = this.images.length;
	this.progress = 0;
	this.imageObj = {};
};
StaticSource.prototype ={
	loadImages : function(callback){
		var _this = this;
		_this.images.forEach(function(o){
			var image = new Image();
			image.src = o.src;
			image.role = o.role;
			image.onload = function(){
				_this.progress += 1;
				if(_this.progress >= _this.total) {
					//console.log('ok');
					callback();
				}
				_this.imageObj[o.role] = image;
			};
		})
	}
}

//Ball С��
var Ball = function(r,c){
	this.dia =25;
	this.speed = 10;
	this.angle = -30;
}

Ball.prototype ={
	update:function(){
		if(game.state){
			this.x+= this.speed * Math.cos(this.angle * Math.PI/180);
			this.y+= this.speed * Math.sin(this.angle * Math.PI/180);
			//ײǽ
			if(this.y<0){
				this.y =0;
				this.angle = 360- this.angle;
			}
			if(this.x>game.canvas.width- this.dia || this.x<0){
				this.angle = 180- this.angle;
			}
			//ײ����
			if(this.x > game.tray.x-14 && this.x<game.tray.x+100-14){
				if(this.y>game.tray.y){
					this.angle = 360- this.angle;
				}
			}
			//��Ϸʧ��
			if(this.y >game.tray.y+30-this.dia){ //��ʱʧ����
				this.speed = 15;
				if(this.y>game.tray.y+30){
					game.gameover();
				}
				//game.resurrection() //����
			}
		}else{
			this.x = game.tray.x+50-this.dia/2;
			this.y = game.tray.y-this.dia;
		}

	},
	render:function(){
		game.ctx.drawImage(game.imgs.ball,this.x,this.y);
	}
}

//Block ש��
function Block(row,col,color){
	this.row=row;
	this.col=col;
	this.color=color;
	this.width = 80;
	this.height = 30;
	this.x = 50+this.col*(this.width+10); //50�ֱ��Ǿ��뻭����λ��
	this.y = 200+this.row*(this.height+10);
}

Block.prototype ={
	update:function(){
		//��ײ��⣬���ײ��,blocks���Ӧ��ש��null��

		/*if(game.ball.y > this.y-game.ball.dia && game.ball.y<this.y){

			if(game.ball.x>this.x-game.ball.dia && game.ball.x<this.x+this.width-game.ball.dia ||game.ball.x>this.x && game.ball.x<this.x+this.width+this.width){//������߻����ұ�
				game.blockManager.blocks[this.row][this.col] = null;
				game.ball.angle = 180 - game.ball.angle;
				console.log('����')
				if(game.blockManager.stars[this.row][this.col]){
					game.blockManager.stars[this.row][this.col].fall = true;
				}
			}
		}else if(game.ball.x > this.x-game.ball.dia && game.ball.x<this.x+this.width+game.ball.dia){
			if(game.ball.y > this.y-game.ball.dia && game.ball.y<this.y+this.height-game.ball.dia || game.ball.y>this.y && game.ball.y<this.y+this.height+game.ball.dia){
				console.log('����')
				//�����ױ߻��߶���
				game.blockManager.blocks[this.row][this.col] = null;
				game.ball.angle = 360 - game.ball.angle;
				if(game.blockManager.stars[this.row][this.col]){
					game.blockManager.stars[this.row][this.col].fall = true;
				}
			}
		}
*/		//�����ױ߻��߶���
		var k = game.ball.dia/2;
		if((game.ball.x > this.x -k) && (game.ball.x < this.x + this.width + k)){
			if(game.ball.y > this.y + this.height && game.ball.y < this.y + this.height + k || game.ball.y > this.y - k && game.ball.y < this.y){
				game.blockManager.blocks[this.row][this.col] = null;
				game.ball.angle = 360 - game.ball.angle;
				if(game.blockManager.stars[this.row][this.col]){
					game.blockManager.stars[this.row][this.col].fall = true;
				}
			}
		}

		//��ߡ��ұ�
		if(game.ball.y > this.y && game.ball.y < this.y + this.height){
			if(game.ball.x > this.x - k && game.ball.x < this.x || game.ball.x > this.x + this.width && game.ball.x < this.x + this.width + 2){

				game.blockManager.blocks[this.row][this.col] = null;
				game.ball.angle = 180 - game.ball.angle;
				if(game.blockManager.stars[this.row][this.col]){
					game.blockManager.stars[this.row][this.col].fall = true;
				}
			}
		}
	},
	render:function(){
		game.ctx.drawImage(game.imgs.block,(this.color-1)*(this.width+10),0,this.width,this.height,this.x,this.y,this.width,this.height)
	}

}
//ש�����
function BlockManager(){
	this.map =[
		[3,0,2,0,0,1],
		[0,2,2,3,0,4],
		[0,4,1,0,4,0],
		[5,1,1,0,0,3],
		[0,1,0,3,0,2],
		[5,1,0,3,1,2],
		[2,1,0,3,0,2],
		[0,1,4,3,2,2]
	];

	this.blocks = [];
	this.stars = [];
	for(var i=0; i<this.map.length; i ++){
		this.blocks.push([null,null,null,null,null,null]);
		this.stars.push([null,null,null,null,null,null]);
	}


}

BlockManager.prototype ={
	createBlock : function(){
		//����map����ש��
		for(var r=0; r<this.map.length; r ++){
			for(var c=0; c<6; c++){
				//this.map[r][c] && (this.blocks[r][c] = new Block(r,c,this.map[r][c]) );
				if(this.map[r][c]){
					this.blocks[r][c] = new Block(r,c,this.map[r][c]);
					if(Math.floor(Math.random()*10)%9 == 0){

						this.stars[r][c]=new Star(r,c,this.blocks[r][c].x+30,this.blocks[r][c].y+3);
					}
				}
			}
		}


	},
	updateAll:function(){
		for(var r=0; r<this.map.length; r ++){
			for(var c=0; c<6; c++){
				this.blocks[r][c] && this.blocks[r][c].update();
				this.stars[r][c] && this.stars[r][c].update(r,c);
			}
		}
	},
	renderAll:function(){
		for(var r=0; r<this.map.length; r ++){
			for(var c=0; c<6; c++){
				this.blocks[r][c] && this.blocks[r][c].render();
				this.stars[r][c] && this.stars[r][c].render();
			}
		}

	}
}

//����
function Tray(){
	this.x= game.canvas.width/2 - 50;
	this.y = 700;
	this.bindEvent();
}

Tray.prototype ={
	render:function(){
		game.ctx.drawImage(game.imgs.tray,this.x,this.y);
	},
	bindEvent : function(){
		var _this = this;
		game.canvas.addEventListener("touchmove",function(e){
			var position = e.changedTouches[0];
			_this.x = position.pageX-50;//�����ȥ���һ����Ϊ�������̷�����ָ��������

			if(_this.x>game.canvas.width-100){
				_this.x = game.canvas.width-100;
			}
			if(_this.x<0){
				_this.x = 0;
			}

		});

		game.canvas.addEventListener("click",function(e){
			game.state = 1;
		});
	}
}


//�������Ƿ�ֵ
function Star(r,c,x,y){
	this.r = r;
	this.c = c;
	this.x = x;
	this.y = y;
	this.fall = false;
}
Star.prototype = {
	update:function(){
		if(this.fall){
			this.y+=10;
		}

		//ײ����
		if(this.x > game.tray.x-10 && this.x<game.tray.x+100+10){
			if(this.y>game.tray.y-10){
				//console.log("��ס�ӷ�");
				game.score+=10;
				score.innerHTML = game.score;
				game.blockManager.stars[this.r][this.c] = null;
			}
		}

	},
	render:function(){
		game.ctx.drawImage(game.imgs.star,this.x,this.y);
	}
}
window.addEventListener('touchmove',function(e){e.preventDefault()})
