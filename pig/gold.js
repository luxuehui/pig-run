(function () {

    window.sprites = window.sprites || {};

    var Runner = function (spritesheet) {
        this.initialize(spritesheet);
    }
    var p = Runner.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.speed = 0;
    p.speedY = 0;
    p.pigSpeedX = 10;  //猪猪初始化水平速度
    p.pigSpeedY = 5;    //猪猪初始化垂直速度
    p.pigDefaultY = 100;  //猪猪初始化垂直位移
    p.pigMaxTop = 20;   //猪猪初始化垂直可到最高点

    p.PIG_COMPLETE = '完成';
    

    p.initialize = function (spritesheet) {
        this.Sprite_initialize(spritesheet, 'idle');
        this.on('tick', function (e) {
            this.x += this.speed;
            this.y -= this.speedY;
            if(this.y <= this.pigMaxTop){
                this.y = this.pigDefaultY;
            }
            //猪猪可以循环运动 
            if (this.x > stage.canvas.width) {
                this.x = -this.getBounds().width;
            }
        })
    }
    p.run = function () {
        if (this.currentAnimation === 'idle') {
            this.gotoAndPlay('jump');
            this.speed = 0;
        }
    }
    p.jump = function () {
        if (this.currentAnimation === 'idle') {
            this.gotoAndPlay('jump');
            //给猪猪添加水平和垂直的速度
            this.speed = this.pigSpeedX;
            this.speedY = this.pigSpeedY;
            this.on('animationend', function (e) {
                //一个跳动完成,猪猪的y恢复默认,速度清0
                this.y = this.pigDefaultY;
                this.speed = 0;
                this.speedY = 0;
            });
        }

    }

    window.sprites.Runner = Runner;
}());