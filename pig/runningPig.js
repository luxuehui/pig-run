var stage,
    queue,
    preloader,
    spritesheet,
    runner,
    target=[],
    goldSheet,
    ground;

const pigWidth     =  124,
      pigHeight    =  144,
      groundWidth  =  1246,
      groundHeight =  133,
      baseMoney    =  12,
      hitX         =  pigWidth/2,
      hitY         =  3;

function preload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.loadManifest([
        {id:"runner", src:"img/2/ppp.png"},
        {id:"money",src:"img/2/gold.png"},
        {id:"ground",src:"img/road.png"},
        {id:"sound",src:"img/cut.mp3"}
    ],false);
    init();
}
function init(){
    createjs.Ticker.setFPS(30);//舞台帧率控制
    stage = new createjs.Stage(document.getElementById('canvas1'));

    stage.enableMouseOver();
    preloader = new ui.Preloader('#FFF','#000');
    preloader.x = (stage.canvas.width / 2) - (preloader.width / 2);
    preloader.y = (stage.canvas.height / 2) - (preloader.height / 2);
    stage.addChild(preloader);
    createjs.Ticker.on('tick', stage);
    queue.addEventListener("complete", initGame);
    queue.addEventListener('progress', onFileProgress);
    queue.load();
}

function onFileProgress(e) {
    preloader.update(e.progress);
}
function onTick() {
    for (var i =0;i<baseMoney;i++){
        var pt = runner.localToLocal(hitX,hitY, target[i]);
        if (target[i].hitTest(pt.x, pt.y)){
            if(target[i].currentAnimation === 'idle'){
                target[i].gotoAndPlay('run');
                createjs.Sound.play("sound");
            }
            target[i].on('animationend', function (e) {
                this.stop();
                stage.removeChild(this);
            });
        }
    }

}
function initGame() {
    createjs.Ticker.on('tick', onTick);
    stage.removeChild(preloader);
    preloader = null;

    spritesheet = new createjs.SpriteSheet({
        "images":[queue.getResult("runner")],
        "frames":{"regX":0, "height":pigHeight, "count":10, "regY":0, "width":pigWidth},
        "animations":{"idle":[0], "run":{
            frames:[7,6,5,4,3,2,1,0],
            next:'idle'
        }, "jump":[0, 7,'run']}
    });

    //金币动画
    goldSheet = new createjs.SpriteSheet({
        "images":[queue.getResult("money")],
        "frames":{"regX":0, "height":73, "count":10, "regY":0, "width":63},
        "animations":{"idle":[0], "run":[0,7]}
    });

    buildRunner();
    buildButtons();
}
function buildRunner() {
    runner = new sprites.Runner(spritesheet);
    runner.x = 30;
    runner.y = 70;

    //循环金币
    for (var i =0;i<baseMoney;i++){
        target[i] =  stage.addChild(new createjs.Sprite(goldSheet,'idle'));
        target[i].x = 130+i*86;
        target[i].y = 10+Math.random()*25;
    }
    //ground
    ground =  stage.addChild(new createjs.Shape());
    ground.graphics.beginBitmapFill(queue.getResult("ground")).drawRect(0, 0,groundWidth,groundHeight);
    ground.x = 0;
    ground.y = 120;

    stage.addChild(runner);
}
function buildButtons() {
    var jumpBtn = new ui.SimpleButton("JUMP");
    var runBtn = new ui.SimpleButton("RUN");
    jumpBtn.on('click', function (e) {
        runner.jump();
    });
    runBtn.on('click', function (e) {
        runner.run();
    });
    runBtn.x = jumpBtn.width + 10;
    stage.addChild(jumpBtn, runBtn);
}
