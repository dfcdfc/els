//每个格子的公共父类型
function Cell(r,c,src){
  this.r=r; this.c=c; this.src=src;
 }
function State(){//描述一个状态对象
	for(var i=0;i<4;i++){
	    this["r"+i]=arguments[i*2];
		this["c"+i]=arguments[i*2+1];
	}
 }
//所有图形的公共父类型
function  Shape(cells,src,states,orgi){
	this.cells=cells;
	for(var i=0;i<this.cells.length;i++){
	   this.cells[i].src=src; }
	this.orgCell=this.cells[orgi];//获得参照格对象
	this.states=states;
	this.statei=0;//所有图形的初始状态都为0
 }
//公共图片的原型对象
Shape.prototype={
	IMGS:{//集中保存公共图片对象
		T:"img/T.png", O:"img/O.png",
		I:"img/I.png",   J:"img/J.png",
		L:"img/L.png",  S:"img/S.png",
		Z:"img/Z.png"
     },
	moveDown:function(){//下移
		 for(var i=0;i<this.cells.length;i++){
		    this.cells[i].r++;}
	},
	moveLeft:function(){//左移
		for(var i=0;i<this.cells.length;i++){
		    this.cells[i].c--;}
	},
	moveRight:function(){//右移
		for(var i=0;i<this.cells.length;i++){
		    this.cells[i].c++;}
	},
	rotate:function(){//旋转方法
		var state=this.states[this.statei];
		for(var i=0;i<this.cells.length;i++){
		    this.cells[i].r=this.orgCell.r+state["r"+i];
			this.cells[i].c=this.orgCell.c+state["c"+i];
		}
	},
    rotateR:function(){//右旋
		this.statei++;
		this.statei==this.states.length&&(this.statei=0);
        this.rotate();
	},
	rotateL:function(){//左旋
		this.statei--;
		this.statei<0&&(this.statei=this.states.length-1);
        this.rotate();
	}
 }
//实例化图形
function  T(){
	Shape.call(this,//继承父类型
		 [ new Cell(0,3),//参数1:创建图形需要的格子
		   new Cell(0,4),
		   new Cell(0,5),
		   new Cell(1,4),
		 ],
		 this.IMGS.T,//参数2:图像地址src
		 [new State(0,-1,0,0,0,1,1,0),//参数3:图形的状态
          new State(-1,0,0,0,1,0,0,-1),
          new State(0,1,0,0,0,-1,-1,0),
          new State(1,0,0,0,-1,0,0,1) ],
		  1//参数4:参照格下标
	);
 }
 Object.setPrototypeOf(//继承原型对象
   T.prototype,Shape.prototype);
function  I(){
	Shape.call(this,
		 [ new Cell(0,3),
		   new Cell(0,4),
		   new Cell(0,5),
		   new Cell(0,6),
		 ],
		 this.IMGS.I,
		 [new State(0,-1, 0,0, 0,1, 0,2),
          new State(-1,0, 0,0, 1,0, 2,0) ],
		 1
	);
 }
 Object.setPrototypeOf(
    I.prototype,Shape.prototype);
function  O(){
	Shape.call(this,
		 [ new Cell(0,4),
		   new Cell(0,5),
		   new Cell(1,4),
		   new Cell(1,5),
		 ],
		 this.IMGS.O,
         [new State(0,-1,0,0,1,-1,1,0) ],
		 1
	);
 }
 Object.setPrototypeOf(
   O.prototype,Shape.prototype);
function  J(){
	Shape.call(this,
		 [ new Cell(0,3),
		   new Cell(1,3),
		   new Cell(1,4),
		   new Cell(1,5),
		 ],
		 this.IMGS.J,
		 [new State(-1,0, 0,0, 0,1, 0,2),
          new State(0,1, 0,0, 1,0, 2,0),
          new State(1,0, 0,0, 0,-1, 0,-2),
          new State(0,-1, 0,0, -1,0, -2,0) ],
		  1
	);
 }
 Object.setPrototypeOf(
   J.prototype,Shape.prototype); 
function  L(){
	Shape.call(this,
		 [ new Cell(1,3),
		   new Cell(1,4),
		   new Cell(1,5),
		   new Cell(0,5),
		 ],
		 this.IMGS.L,
		 [new State(0,-2, 0,-1, 0,0, -1,0),
		  new State(-2,0, -1,0, 0,0, 0,1),
          new State(0,2, 0,1, 0,0, 1,0),
          new State(2,0, 1,0, 0,0, 0,-1)
           ],
		  2
	);
 }
 Object.setPrototypeOf(
   L.prototype,Shape.prototype);
function  S(){
	Shape.call(this,
		 [ new Cell(1,3),
		   new Cell(1,4),
		   new Cell(0,4),
		   new Cell(0,5),
		 ],
		 this.IMGS.S,
		 [new State(0,-1, 0,0, -1,0, -1,1),
          new State(-1,0, 0,0, 0,1, 1,1),
          new State(0,1, 0,0, 1,0, 1,-1),
          new State(1,0, 0,0, 0,-1, -1,-1) ],
		  1
	);
 }
 Object.setPrototypeOf(
   S.prototype,Shape.prototype);    
function  Z(){
	Shape.call(this,
		 [ new Cell(0,3),
		   new Cell(0,4),
		   new Cell(1,4),
		   new Cell(1,5),
		 ],
		 this.IMGS.Z,
		 [new State(0,-1, 0,0, 1,0, 1,1),
          new State(-1,0, 0,0, 0,-1, 1,-1),
          new State(0,1, 0,0, -1,0, -1,-1),
          new State(1,0, 0,0, 0,1, -1,1) ],
		  1
	);
 }
 Object.setPrototypeOf(
    Z.prototype,Shape.prototype); 

