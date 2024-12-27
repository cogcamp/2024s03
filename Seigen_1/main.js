var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
    // 初期設定を実行する
    this.config();
    
    // ボール作成
    this.createBall();
    
    // パドル作成
    this.createPaddle();
    
    // スペースキーのクリックでボール発射
    this.input.keyboard.on('keydown-SPACE',function(event){
        //ゲーム開始状態ならば
        if(this.paddle.isStart){
            //ボール発射！！！！！！！！！！
            this.ball.setVelocity(this.ballSpeedX,this.ballSpeedY);
            this.paddle.isStart=false;
        }
    },this);
    
    // ブロック作成
    this.createBlocks();
    
    // ライフのテキスト表示
    this.lifeText=this.add.text(30,20,'ライフ:'+this.life+'スコア:'+this.score,
    {
        font:'20px Open Sans',
        fill:'#ff0000'
    });
};

mainScene.update = function() {
    // ボールがシーンの最下部に到達した
    if(this.ball.y>=this.game.config.height-this.ball.width/2){
        this.failToHit();
    }
    
    // キーボードのカーソルオブジェクトを取得
    var cursors = this.input.keyboard.createCursorKeys();
    var x = 0;
    //右カーソルをクリックすると
    if(cursors.right.isDown){
        x=this.paddle.x+this.paddleSpeed;
        this.paddle.x=Phaser.Math.Clamp(x,52,954);
    }
    //左カーソルをクリックすると
    if(cursors.left.isDown){
        x=this.paddle.x-this.paddleSpeed;
        this.paddle.x=Phaser.Math.Clamp(x,52,954);
    }
    //パドルの上にボールが乗っているなら
    if(this.paddle.isStart){
        this.ball.setPosition(this.paddle.x,650);
    }
    
};

mainScene.config = function() {
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#000000');
    
    // パドルの移動速度
    this.paddleSpeed = 8;
    
    // ボール発射の加速度
    this.ballSpeedX = 0;
    this.ballSpeedY = -320;
    
    // ライフ
    this.life = 3;
    
    //加速度の保存
    this.diffSave=0;
    
    //スコアの保存
    this.score=0
};

mainScene.createBall = function() {
    // ボール作成
    this.ball=this.physics.add.image(400,500,'ball1');
    this.ball.setDisplaySize(16,16);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
};

mainScene.createPaddle = function() {
     // パドル作成
    this.paddle=this.physics.add.image(500,650,'paddle1');
    this.paddle.setDisplaySize(92,24);
    this.paddle.setImmovable();
    this.paddle.isStart=true;
    this.physics.add.collider(this.paddle,this.ball,this.hitPaddle,null,this);
};

mainScene.hitPaddle = function (paddle, ball) {
    // ボールにX方向の角度を設定
    var diff=0;
    var cursors = this.input.keyboard.createCursorKeys();
    if(cursors.right.isDown){
        //ボールがパドルの左側に衝突
        diff=paddle.x-ball.x;
        ball.setVelocityX(-10*diff);
        this.diffSave=10*diff;
    }else if(cursors.left.isDown){
        //ボールがパドルの右側に衝突
        diff=ball.x-paddle.x;
        ball.setVelocityX(10*diff);
        this.diffSave=10*diff;
    }else{
        //x方向の加速度はなし
        ball.setVelocityX(this.diffSave);
    }
    
};

mainScene.createBlocks = function() {
    // 横10列、縦6行並べる
    //ブロックの色配列
    var blockColors=['red1','green1','yellow1','silver1','blue1','purple1'];
    //物理エンジン対象固定オブジェクトグループ作成
    this.blocks=this.physics.add.staticGroup();
    //縦に6行
    for(var i=1;i<9 ;i++){
        //横に10列
        for(var j=1;j<13;j++){
            if(
                i==1&&j==6||i==1&&j==7||i==1&&j==8||i==1&&j==10||i==1&&j==11||i==1&&j==12
                ||i==2&&j==6||i==2&&j==12
                ||i==3&&j==1||i==3&&j==2||i==3&&j==3||i==3&&j==4||i==3&&j==5||i==3&&j==6||i==3&&j==7||i==3&&j==8||i==3&&j==10||i==3&&j==11||i==3&&j==12
                ||i==4&&j==1||i==4&&j==5||i==4&&j==6||i==4&&j==7||i==4&&j==11||i==4&&j==12
                ||i==5&&j==1||i==5&&j==5||i==5&&j==6||i==5&&j==8||i==5&&j==10||i==5&&j==12
                ||i==6&&j==1||i==6&&j==2||i==6&&j==3||i==6&&j==4||i==6&&j==5||i==6&&j==6||i==6&&j==8||i==6&&j==10||i==6&&j==12
                ||i==7&&j==6||i==7&&j==7||i==7&&j==8||i==7&&j==10||i==7&&j==11||i==7&&j==12
                ||i==8&&j==6||i==8&&j==7||i==8&&j==8||i==8&&j==10||i==8&&j==11||i==8&&j==12
            ){
                continue;
            }else{
                var color=blockColors[i-1];
                var block=this.blocks.create(68+(j-1)*72,68+(i-1)*36,color);
                block.setOrigin(0,0);
                block.setDisplaySize(72,36);
                block.refreshBody();
                block.hitPoint=0
            }
        }
    }
    this.physics.add.collider(this.ball,this.blocks,this.hitBlock,null,this);
};
mainScene.hitBlock = function (ball, block) {
    if(block.hitPoint==1&&block.texture.key=='red1'
    ||block.hitPoint==1&&block.texture.key=='blue1'
    ||block.hitPoint==2&&block.texture.key=='green1'
    ||block.hitPoint==1&&block.texture.key=='yellow1'
    ||block.hitPoint==3&&block.texture.key=='silver1'
    ||block.hitPoint==1&&block.texture.key=='purple1'
    ||block.hitPoint==4&&block.texture.key=='__MISSING'){
        // 衝突したブロックを削除
        block.destroy();
        this.score+=block.hitPoint
        this.lifeText.text = 'ライフ:' + this.life + 'スコア:' + this.score;
    }else{
        block.hitPoint++;
        console.log(block);
    }
    // ブロックの残りを判定
    if (this.blocks.countActive() == 0) {
        // ブロックがなくなると、0.5秒後にゲームクリア
        this.time.addEvent({
            duration: 500,
            callback: this.gameClear,
            loop: false,
            callbackScope: this,
        });
    }
};

mainScene.gameClear = function() {
    // ゲームクリア
    alert("おめでとうございます");
    // スタートシーンに移動
    this.scene.start("startScene");
};

mainScene.failToHit =  function () {
    // ボールを打ち返すことに失敗
    this.ball.setVelocity(0);
    this.paddle.isStart = true;
    this.diffSave=0;
    // ライフを減らす
    this.life--;
    this.lifeText.text = 'ライフ:' + this.life + 'スコア:' + this.score;
    // ライフが0になると
    if(this.life <= 0) {
        // 0.5秒後にゲームオーバー
        this.time.addEvent({
            duration: 500,
            callback: this.gameOver,
            loop: false,
            callbackScope: this,
        });
    }
};

mainScene.gameOver = function() {
    // ゲームオーバー
    alert("ゲームオーバー");
    // スタートシーンに移動
    this.scene.start("startScene");
};
