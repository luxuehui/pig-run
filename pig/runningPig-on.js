(function () {
    window.create = window.create || {};
    var Pig = function (canvas) {
        this.initialize(canvas);
    };

    var pig = Pig.prototype = new createjs.Container();


    pig.pigWidth = 124;
    pig.pigHeight = 144;
    pig.groundWidth = 1246;
    pig.groundHeight = 133;
    pig.baseMoney = 11;
    pig.hitX =  this.pigWidth/2;
    pig.hitY =  12;
    pig.stage;
    pig.queue;
    pig.preloader;
    pig.spritesheet;
    pig.runner;
    pig.target=[];
    pig.ground;

    Pig.prototype = {
        initialize:function(canvas){
            this.queue = new createjs.LoadQueue();
            this.queue.loadManifest([
                {id:"runner", src:"img/2/p.png"},
                {id:"money",src:"img/m.png"},
                {id:"ground",src:"img/road.png"}
            ],false);
            this.load(canvas);
        },
        load:function (canvas) {
            var _this = this;
            createjs.Ticker.setFPS(24);//舞台帧率控制
            var cc = document.getElementById(canvas);
            _this.stage = new createjs.Stage(cc);

            createjs.Ticker.on('tick', _this.stage);
            _this.stage.enableMouseOver();
            _this.preloader = new ui.Preloader('#FFF','#000');
            _this.preloader.x = (_this.stage.canvas.width / 2) - (_this.preloader.width / 2);
            _this.preloader.y = (_this.stage.canvas.height / 2) - (_this.preloader.height / 2);
            _this.stage.addChild(_this.preloader);
            //创建
            var onFileProgress = new createjs.proxy(this.onFileProgress, this);
            var initGame = new createjs.proxy(this.initGame, this);
            _this.queue.addEventListener("complete", initGame);
            _this.queue.addEventListener('progress', onFileProgress);

            _this.queue.load();
        },
        initGame:function () {
            debugger;
            var _this = this;
            _this.stage.removeChild(_this.preloader);
            _this.preloader = null;
            var onTick = new createjs.proxy(this.onTick, this);
            createjs.Ticker.on('tick', onTick);

            _this.spritesheet = new createjs.SpriteSheet({
                "images":[_this.queue.getResult('runner')],
                "frames":{"regX":0, "height":_this.pigHeight, "count":10, "regY":0, "width":_this.pigWidth},
                "animations":{"idle":[8], "run":{
                    frames:[9,8],
                    next:'idle'
                }, "jump":[0, 9,'run']}
            });

            this.buildRunner();
            this.buildButtons();
        },
        onFileProgress:function (e) {
            this.preloader.update(e.progress);
        },
        onTick:function () {
            var _this = this;
            // for (var i =0;i<11;i++){
            //     var pt = _this.runner.localToLocal(_this.hitX,_this.hitY, _this.target[i]);
            //     if ( _this.target[i].hitTest(pt.x, pt.y)){
            //         _this.target[i].alpha = 0;
            //     }
            // }
        },
        buildRunner:function () {
            this.runner = new sprites.Runner(this.spritesheet);
            this.runner.x = 30;
            this.runner.y = 100;



            //循环金币
            for (var i =0;i<this.baseMoney;i++){
                this.target[i] = this.stage.addChild(new createjs.Shape());
                this.target[i].graphics.beginBitmapFill(this.queue.getResult("money")).drawRect(0, 0,62,62);
                this.target[i].x = 130+i*89;
                this.target[i].y = 40+Math.random()*30;
            }
            //ground
            this.ground =  this.stage.addChild(new createjs.Shape());
            this.ground.graphics.beginBitmapFill(this.queue.getResult("ground")).drawRect(0, 0,this.groundWidth,this.groundHeight);
            this.ground.x = 0;
            this.ground.y = 120;



            this.stage.addChild(this.runner);
        },
        buildButtons:function () {
            var _this = this;
            var jumpBtn = new ui.SimpleButton("JUMP");
            var runBtn = new ui.SimpleButton("RUN");
            jumpBtn.on('click', function (e) {
                _this.runner.jump();
            });
            runBtn.on('click', function (e) {
                _this.runner.run();
            });
            runBtn.x = jumpBtn.width + 10;
            this.stage.addChild(jumpBtn, runBtn);
        }
    };




    window.create.Pig = Pig;
}());
//
// var stage,
//     queue,
//     preloader,
//     spritesheet,
//     runner,
//     target=[],
//     ground;
//
//
//
// const pigWidth     =  98,
//       pigHeight    =  120,
//       groundWidth  =  1246,
//       groundHeight =  133,
//       baseMoney    =  11,
//       hitX         =  pigWidth/2,
//       hitY         =  12;
//
// function preload() {
//     queue = new createjs.LoadQueue();
//     queue.loadManifest([
//         {id:"runner", src:"img/2/p.png"},
//         {id:"money",src:"img/m.png"},
//         {id:"ground",src:"img/road.png"}
//     ],false);
//     init();
// }
// function init(){
//     createjs.Ticker.setFPS(24);//舞台帧率控制
//     stage = new createjs.Stage(document.getElementById('canvas1'));
//
//     createjs.Ticker.on('tick', stage);
//     stage.enableMouseOver();
//     preloader = new ui.Preloader('#FFF','#000');
//     preloader.x = (stage.canvas.width / 2) - (preloader.width / 2);
//     preloader.y = (stage.canvas.height / 2) - (preloader.height / 2);
//     stage.addChild(preloader);
//     queue.addEventListener("complete", initGame);
//     queue.addEventListener('progress', onFileProgress);
//     createjs.Ticker.on('tick', onTick);
//     queue.load();
// }
// function onFileProgress(e) {
//     preloader.update(e.progress);
// }
// function onTick() {
//     for (var i =0;i<baseMoney;i++){
//         var pt = runner.localToLocal(hitX,hitY, target[i]);
//         if ( target[i].hitTest(pt.x, pt.y)){
//             target[i].alpha = 0;
//         }
//     }
// }
// function initGame() {
//     stage.removeChild(preloader);
//     preloader = null;
//     spritesheet = new createjs.SpriteSheet({
//         "images":[queue.getResult("runner")],
//         "frames":{"regX":0, "height":pigHeight, "count":10, "regY":0, "width":pigWidth},
//         "animations":{"idle":[8], "run":{
//             frames:[9,8],
//             next:'idle'
//         }, "jump":[0, 9,'run']}
//     });
//
//     buildRunner();
//     buildButtons();
// }
// function buildRunner() {
//     runner = new sprites.Runner(spritesheet);
//     runner.x = 30;
//     runner.y = 100;
//
//
//
//     //循环金币
//     for (var i =0;i<baseMoney;i++){
//         target[i] = stage.addChild(new createjs.Shape());
//         target[i].graphics.beginBitmapFill(queue.getResult("money")).drawRect(0, 0,62,62);
//         target[i].x = 130+i*89;
//         target[i].y = 40+Math.random()*30;
//     }
//     //ground
//     ground =  stage.addChild(new createjs.Shape());
//     ground.graphics.beginBitmapFill(queue.getResult("ground")).drawRect(0, 0,groundWidth,groundHeight);
//     ground.x = 0;
//     ground.y = 120;
//
//
//
//     stage.addChild(runner);
// }
// function buildButtons() {
//     var jumpBtn = new ui.SimpleButton("JUMP");
//     var runBtn = new ui.SimpleButton("RUN");
//     jumpBtn.on('click', function (e) {
//         runner.jump();
//     });
//     runBtn.on('click', function (e) {
//         runner.run();
//     });
//     runBtn.x = jumpBtn.width + 10;
//     stage.addChild(jumpBtn, runBtn);
// }
