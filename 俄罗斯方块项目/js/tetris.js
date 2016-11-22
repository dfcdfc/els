//创建图形，下落方块：下落主角图形，落入方块：墙内图形
var tetris={
    OFFSET:15,//盛放格子距离边框的距离
	CSIZE:26,//每个格子大小
	shape:null,//保存正在下落的主角图形
	nextShape:null,//保存备胎图形
	pg:null,//保存游戏的容器元素
	interval:0,//保存方块下落的速度
	timer:null,//保存定时器序号
	RN:20,CN:10,//保存总行、列数
	wall:null,//保存停止下落的图形方块的墙
	ln:0,//保存删除的总函数
	score:0,//保存得分
	SCORES:[0,10,30,60,100],//保存删除行得分数
	level:0,//保存游戏关数
	state:1,//保存游戏状态
	GAMEOVER:0,//游戏结束
	RUNNING:1,//游戏开始
	RAUSE:2,//游戏暂停
	start:function(){//游戏开始
		this.score=0;//分数归零
		this.ln=0;//行数归零
        this.interval=400,//初始化方块下落的速度
		this.level='1';//初始化为第一关
		this.state=this.RUNNING;//初始化游戏状态
		this.wall=[];
		for(var r=0;r<this.RN;r++){//创建墙格
		   this.wall[r]=new Array(this.CN);
		};
		this.pg=document.querySelector(".playground");
	    this.shape=this.randomShape();//创建图形
		this.nextShape=this.randomShape();//创建备胎图形
		this.paint();//重绘一切
		this.timer=setInterval(//下落动画
			this.moveDown.bind(this),this.interval);
		//为当前页面绑定键盘按下事件
        document.onkeydown=function(e){
			switch(e.keyCode){
			    case 37: this.state==this.RUNNING&&
					this.moveLeft();break;//左移一格
				case 39: this.state==this.RUNNING&&
					this.moveRight();break;//右移一格
				case 40: this.state==this.RUNNING&&
					this.moveDown();break;//下移一格
				case 32: this.state==this.RUNNING&&
					this.hardDrop();break;//直降
				case 38: this.state==this.RUNNING&&
					this.rotateR();break;//右旋一下
				case 90: this.state==this.RUNNING&&
					this.rotateL();break;//左旋一下z
				case 83: this.state==this.GAMEOVER&&
					this.start();break;//重启新游戏s
				case 80: this.state==this.RUNNING&&
					this.pause();break;//暂停游戏p
				case 67: this.state==this.PAUSE&&
					this.myContinue();break;//从暂停恢复游戏c
				case 81:this.gameover();break;//直接退出游戏q
			}
		}.bind(this);
	},
	gameover:function(){
	    this.state=this.GAMEOVER;//游戏状态结束
		clearInterval(this.timer);//停止定时器
		this.timer=null;
		this.paint();//重绘一切
	},
	randomShape:function(){//随机生成图形
	    var r=parseInt(Math.random()*7);
        switch(r){
		    case 0:return new O();
			case 1:return new I();
			case 2:return new T();
			case 3:return new J();
			case 4:return new L();
			case 5:return new S();
			case 6:return new Z();
		}
	},
	landIntoWall:function(){//落入墙中
        for(var i=0;i<this.shape.cells.length;i++){
			  var cell=this.shape.cells[i];
			  this.wall[cell.r][cell.c]=cell;
		}
	},
    canRotate:function(){//能否旋转
		for(var i=0;i<this.shape.cells.length;i++){
		    var cell=this.shape.cells[i];
			if(cell.r<0||cell.r>=this.RN||cell.c<0||cell.c>=this.CN
			  ||this.wall[cell.r][cell.c]){return false};
		}
		return true;
	},
	rotateR:function(){//右旋
		this.shape.rotateR();
		if(!this.canRotate()){//如果不能右旋
		   this.shape.rotateL();}//左旋回来
		this.paint();
	},
	rotateL:function(){//左旋
		this.shape.rotateL();
		if(!this.canRotate()){//如果不能左旋
		   this.shape.rotateR();}//右旋回来
		this.paint();
	},
    canLeft:function(){//能否左移
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]){
			   return false;}
		}
		return true;
	},
	moveLeft:function(){//左移一格
		if(this.canLeft()){
		  this.shape.moveLeft();
		  }
		this.paint();//重绘一切
	},
    canRight:function(){//能否右移
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]){
			   return false;}
		}
		return true;
	},
	moveRight:function(){//右移一格
		if(this.canRight()){
		  this.shape.moveRight();
		  }
		this.paint();//重绘一切
	},
	canDown:function(){//能否下落
	    for(var i=0;i<this.shape.cells.length;i++){
		     var cell=this.shape.cells[i];
			 if(cell.r==this.RN-1
				 ||this.wall[cell.r+1][cell.c]!==undefined){
			     return false;}
		}
		return true;
	},
	moveDown:function(){//下落一次
		if(this.canDown()){
		    this.shape.moveDown();//调用shape的moveDown方法
		}else{
			this.landIntoWall();//落入墙中
            var ln=this.deleteRows();//删除行
			this.ln+=ln;//累加本次删除行
            this.score+=this.SCORES[ln];//累加得分
			switch(this.score){//跳关加速
				case 50:this.level=2,this.getInterval(300);break;
                case 80:this.level=3,this.getInterval(250);break;
			    case 120:this.level=4,this.getInterval(200);break;
				case 200:this.level=5,this.getInterval(120);break;
			    case 350:this.level=6,this.getInterval(100);break;
				case 500:this.state=this.GAMEOVER;
				              clearInterval(this.timer);
				              this.timer=null;break;
			}
			if(!this.isGameOver()){//如果游戏没有结束
				this.shape=this.nextShape;//备胎转正
				this.nextShape=this.randomShape();//创建新备胎
			}else{
			    this.state=this.GAMEOVER;
				clearInterval(this.timer);
				this.timer=null;
			}
		}
		this.paint();//重绘一切
	},
	getInterval:function(intime){
	    clearInterval(this.timer);
		this.timer=null;
		this.interval=intime;
		this.timer=setInterval(//下落动画
		this.moveDown.bind(this),this.interval);
	},
	hardDrop:function(){//直降
		while(this.canDown()){//只要可以下落
		  this.moveDown();//调用moveDown
        }
	},
	isGameOver:function(){//判断游戏是否结束
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!==undefined){
			  return true;}
		}
		return false;
	},
	pause:function(){//暂停
	      this.state=this.PAUSE;
		  clearInterval(this.timer);
		  this.timer=null;
		  this.paint();//重绘一切
	},
    myContinue:function(){//重启
	    this.state=this.RUNNING;
		this.timer=setInterval(//下落动画
			this.moveDown.bind(this),this.interval);
		this.paint();//重绘一切
	},
	paintState:function(){//绘制游戏状态
		if(this.state!=this.RUNNING){
		    var img=new Image();
			img.src=this.state==this.GAMEOVER?
				"img/game-over.png":"img/pause.png";
			this.pg.appendChild(img);
		}
	},
	deleteRows:function(){//删除行
		for(var r=this.RN-1,ln=0;
		   r>=0&&this.wall[r].join("")!=""&&ln<4;r--){
			if(this.isFullRow(r)){//如果当前行是满格行
			   this.deleteRow(r);//就删除当前行
			   ln++;
               r++;//r留在原地
			}
		}
		return ln;
	},
	isFullRow:function(r){//判断当前行是否满格行
    //如果将wall中r行拍照后，包含符合reg要求的内容
	  return String(this.wall[r]).search(/^,|,,|,$/)==-1;
	},
    deleteRow:function(r){//删除一行
		for(;r>0;r--){//从r开始，自下向上遍历每一行
		  //用wall中r-1行代替r行
		   this.wall[r]=this.wall[r-1];
		  //将r-1行置为CN个元素的空数组
		  this.wall[r-1]=new Array(this.CN);
		  //如果当前cell有格,将当前cell的r+1
		  for(var c=0;c<this.CN;c++){
		      this.wall[r][c]!==undefined
				  &&this.wall[r][c].r++;
		   }
		  if(this.wall[r-2].join("")==""){break;}
		}
	},
	paintScore:function(){//重绘行、分、关数
	    var spans=document.querySelectorAll(
                      ".playground>p>span");
        spans[0].innerHTML=this.score;
        spans[1].innerHTML=this.ln;
        spans[2].innerHTML=String(this.level);
	},
	paint:function(){//重绘一切
		//删除pg内容中所有img元素
		this.pg.innerHTML=
			this.pg.innerHTML.replace(/<img[^>]*>/g,"");
		this.paintShape();//重绘主角图形
		this.paintWall();//重绘墙内图形
		this.paintNext();//重绘备胎
		this.paintScore();//重绘行、分、关数
		this.paintState();//重绘游戏状态
	},
	paintCell:function(cell,frag){//绘制格
		var img=new Image();
		img.style.left=cell.c*this.CSIZE+this.OFFSET+"px";
		img.style.top=cell.r*this.CSIZE+this.OFFSET+"px";
		img.src=cell.src;
		frag.appendChild(img);
	},
	paintWall:function(){//绘制墙内图形
        var frag=document.createDocumentFragment();
		for(var r=this.RN-1;r>=0&&this.wall[r].join("")!="";r--){
			  for(var c=0;c<this.CN;c++){
			    (this.wall[r][c])&&
				    this.paintCell(this.wall[r][c],frag);
			   }
		}
		this.pg.appendChild(frag);
	},
	paintShape:function(){//绘制主角图形
        var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			this.paintCell(this.shape.cells[i],frag);
		}
		this.pg.appendChild(frag);
	},
    paintNext:function(){//绘制备胎图形
        var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			this.paintCell(this.nextShape.cells[i],frag);
			var img=frag.lastChild;
			img.style.left=parseFloat(img.style.left)+this.CSIZE*10+"px";
			img.style.top=parseFloat(img.style.top)+this.CSIZE*1+"px";
         }
		this.pg.appendChild(frag);
	},	
}
tetris.start();
