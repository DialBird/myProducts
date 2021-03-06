
//------------------------------------------------------
//音声を管理するクラス
//------------------------------------------------------

/*
このクラスでは、ランダムに選んだ鳥の鳴き声を流しつづける機能（BGM機能）と、特定の鳥の音声を流す機能とがある。
前者は鳥の画像の出現とともに流れ出し、画面右上のサウンドアイコンをオフにしない限り流れ続ける。
後者は鳥の説明画面の音声アイコンを押すと流れ出し、約７秒後に自動で止まる。右上のサウンドアイコンのオンオフに依存しない。
*/

/*
bgmのオンオフはメンバ変数のBGM_stateと4つのメソッドのstartBGM~stopBGMで行う
BGM_stateは外部から操作し、これが「stop」になっている間は、４つの関数は機能しなくなる
このBGM_stateを変更するのは画面右上にあるsoundのオンオフボタンと、一番最初の開始の時だけである
*/

//soundJSとpreloadJS両方を使う
const createjs = require('createjs');

class SoundJukeBox{
    constructor(){
        this.birdNameList = '';
        this.specificBirdSoundChannel = '';
        this.BGMchannel = '';

		//bgmが流れているかどうかを格納
        this.BGM_state = 'playing';
    }


	//------------------------------------------------------
	//メソッド
	//------------------------------------------------------

    //鳥の説明画面に付いている音声ボタンを押した時に発動し、特定の鳥の音声だけ流す
    playSpecificBirdSound(_birdName){
        const self = this;

        //Soundインスタンス作成
        this.specificBirdSoundChannel = createjs.Sound.createInstance(_birdName);
        this.specificBirdSoundChannel.play();

        //もしインスタンスがなければreturn
        if (this.specificBirdSoundChannel.playState !== 'playSucceeded') return false;

        //もしBGMが流れていれば、一時的に停止する
        if (this.BGM_state === 'playing') this.BGMchannel._pause();

        //流し終えたらBGMの音量を元に戻す
        //toDo: もし特定の鳥の音声を流している間にBGMをオフにした場合、一回だけpauseした時の音楽が流れてしまうことに注意
        setTimeout(()=>{
            if (self.BGM_state === 'playing'){
                self.BGMchannel._resume();
            }
        },7500);

        return true;
    }

    stopSpecificBirdSound(){
        if (this.BGM_state === 'playing'){
            this.BGMchannel._resume();
        }
        this.specificBirdSoundChannel.stop();
    }

    //app側からsoundリストを受け取って、ランダムに音楽を流す
    setBirdNames(_birdNameList){
        this.birdNameList = _birdNameList;
    }

	//BGMを流す関数。一度発動したら、BGM_stateがstopになるまで連続して発動する。
    startBGM(){
        //もしbgmをoffにしていればreturn
        if (this.BGM_state === 'stop') return;
        
        const self = this;
        this.BGMchannel = this.createRandomInstance();
        this.BGMchannel.play();
        
        //もし音楽の再生に失敗したらやり直し（鳥によっては音源が登録されていなかったり、うまくいかなかった場合にこの関数をやり直すため）
        if (this.BGMchannel.playState !== 'playSucceeded'){
            this.startBGM();
            return;
        }
        
        //一つのインスタンスを流し終えたら次のbgmを流し始める
        this.BGMchannel.on('complete', ()=>{
            self.startBGM();
        });
    }

	//BGMを止める関数
    stopBGM(){
        if (this.BGM_state === 'stop') return;
        this.BGMchannel.stop();
    }

	//メンバ変数のbirdNameList内からランダムに鳥を選び、鳥の鳴き声を流す
    createRandomInstance(){
        const len = this.birdNameList.length;
        const ranNum = Math.floor(Math.random()*len);
        const birdName = this.birdNameList[ranNum];
        const instance = createjs.Sound.createInstance(birdName);
        return instance;
    }
}

module.exports = SoundJukeBox;



