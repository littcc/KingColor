window.onload = function() {
    var head = document.querySelector('header'),
        score = document.getElementById('score'),
        over_score = document.getElementById('over-score'),
        over_best = document.getElementById('over-best'),
        king = document.getElementById('king'),
        key = document.querySelector('.key'),
        error = key.querySelector('.error'),
        msg = document.querySelector('.msg'),
        replay = msg.querySelector('.replay'),
        correct = key.querySelector('.correct'),
        timeLine = document.querySelector('#time-line'),
        timeLine_ = document.querySelectorAll('#time-line li'),
        data_cn = {
            'red': '红色',
            'yellow': '黄色',
            'blue': '蓝色',
            'green': '绿色',
            'orange': '橙色',
            'purple': '紫色',
            'white': '白色',
            'gray': '灰色',
            'pink': '粉色',
            'magenta': '洋红色',
            'black': '黑色',
            'cyan': '青色',
            'tomato': '番茄色',
            'color': ['red', 'yellow', 'blue', 'green', 'orange', 'purple', 'white', 'gray', 'pink', 'magenta', 'black', 'cyan', 'tomato'],
            'text': ['红色', '黄色', '蓝色', '绿色', '橙色', '紫色', '白色', '灰色', '粉色', '洋红色', '黑色', '青色', '番茄色']
        },
        data_en = {
            'red': 'red',
            'yellow': 'yellow',
            'blue': 'blue',
            'green': 'green',
            'orange': 'orange',
            'purple': 'purple',
            'white': 'white',
            'gray': 'gray',
            'color': ['red', 'yellow', 'blue', 'green', 'orange', 'purple', 'white', 'gray'],
            'text': ['red', 'yellow', 'blue', 'green', 'orange', 'purple', 'white', 'gray']
        },
        //default
        data = data_cn,
        dataNum = 8;
    if (data == data_cn) {
        king.style.fontWeight = 600;
    }
    document.onselectstart = document.oncontextmenu = function() {
        return false;
    };
    //定义函数方法
    function addClass(obj, value) {
        var cur = obj.className.trim() || "",
            j, clazz, classes, temp;
        classes = (value || "").split(' ') || [];
        if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
                if (cur.indexOf("" + clazz + "") < 0) {
                    cur += " " + clazz;
                }
            }
            temp = cur.replace('\/s\g', ' ');
            obj.className = temp;
        } else {
            obj.className = value;
        }
    };

    function removeClass(obj, value) {
        var cur = obj.className || "",
            classes;
        if (cur) {
            classes = cur.replace(value, "");
        }
        obj.className = classes;
    };

    function animateRemove() {
        removeClass(error, 'animation-keydown');
        removeClass(correct, 'animation-keydown');
    };

    function randomNum(n, m) {
        return parseInt(Math.random() * (m - n) + n);
    };
    //时间线设定
    var LineWidth = document.body.clientWidth;

    function timeLineRemoveAnimation() {
        for (var i = 0; i < timeLine_.length; i++) {
            removeClass(timeLine_[i], 'animation-a' + (i + 1))
        }
    };

    function timeLineAnimation() {
        for (var i = 0; i < timeLine_.length; i++) {
            addClass(timeLine_[i], 'animation-a' + (i + 1))
        }
    };
    //Sound set
    var GameSound = {
        '1': new buzz.sound("./sounds/combo1.mp3"),
        '2': new buzz.sound("./sounds/combo2.mp3"),
        '3': new buzz.sound("./sounds/combo3.mp3"),
        '4': new buzz.sound("./sounds/combo4.mp3"),
        '5': new buzz.sound("./sounds/combo5.mp3"),
        '6': new buzz.sound("./sounds/combo6.mp3"),
        '7': new buzz.sound("./sounds/combo7.mp3"),
        '8': new buzz.sound("./sounds/combo8.mp3"),
        '9': new buzz.sound("./sounds/combo9.mp3"),
        '11': new buzz.sound("./sounds/combo11.mp3"),
        '12': new buzz.sound("./sounds/combo12.mp3"),
        '13': new buzz.sound("./sounds/combo13.mp3"),
        '14': new buzz.sound("./sounds/combo14.mp3"),
        '15': new buzz.sound("./sounds/combo15.mp3"),
        '16': new buzz.sound("./sounds/combo16.mp3"),
        '17': new buzz.sound("./sounds/combo17.mp3"),
        '18': new buzz.sound("./sounds/combo18.mp3"),
        '19': new buzz.sound("./sounds/combo19.mp3"),
        'error': new buzz.sound("./sounds/end.mp3"),
        'play': new buzz.sound("./sounds/fx_correct_answer.mp3"),
        'over': new buzz.sound("./sounds/fx_gameover.mp3"),
        'up': new buzz.sound("./sounds/fx_timeup.mp3"),
        'hit': new buzz.sound("./sounds/hit.mp3"),
        '40hit': new buzz.sound("./sounds/40hit.mp3")
    };
    //定义逻辑
    var gamePlay, Timer, keyResponse, temp, sys, timeOver,
        // Over = false,
        Play = false,
        score_ = 38,
        base_ = localStorage.base || 0,
        calc = 0;
    score.innerHTML = base_ == 0 ? 0 : 'BASE&nbsp:&nbsp' + base_;

    function randomKing() {
        calc++;
        var temp = randomNum(0, dataNum);
        if (calc % temp == 0 && calc != 0) {
            king.className = data.color[temp];
            king.innerHTML = data.text[temp];
            return [data.color[temp], data.text[temp]];
        } else {
            var c = randomNum(0, dataNum);
            var t = randomNum(0, dataNum);
            king.className = data.color[c];
            king.innerHTML = data.text[t];
            return [data.color[c], data.text[t]];
        }
    };

    function Result(ev) {
        var e = ev || event,
            key = e.keyCode;
        if (key == 37) {
            addClass(error, 'animation-keydown');
            return false;
        } else if (key == 39) {
            addClass(correct, 'animation-keydown');
            return true;
        }
    };

    function init() {
        animateRemove();
        timeLineAnimation();
        keyResponse = true;
    };
    init();
    GameSound['play'].play();

    function GamePlaySound(s) {
        if (s < 40 && s % 10 == 0) {
            GameSound['hit'].stop().play();

        } else if (s >= 40 && s % 10 == 0) {
            GameSound['40hit'].stop().play();
            dataNum++;
        } else if (s > 20) {
            // GameSound['19'].stop().play();
            GameSound[s % 20 + ''].stop().play();
            // console.log(s % 20);
        } else if (s < 20) {
            GameSound[s + ''].stop().play();
        }
    }

    function gameInit() {
        GameSound['play'].play();
        init();
        Play = false;
        // Over = false;
        score_ = 38;
        tlNum = 0;
        sys = undefined;
        gamePlay = false;
        score.innerHTML = 'BASE&nbsp:&nbsp' + base_;
        over_score.innerHTML = 0;
        king.innerHTML = '用&nbsp<b>▲</b>&nbsp键来开始游戏';
        king.className = 'play';
        msg.style.top = '-5000px';
    }

    function gameOver() {
        clearInterval(Timer);
        msg.style.top = 0;
        over_best.innerHTML = base_;
        // Over = true;
        // Play = false;
        GameSound['over'].stop().play();

    }
    replay.onclick = function() {
        gameInit();
    }
    document.onkeydown = function(ev) {
        timeOver = false;
        var e = ev || event,
            key = e.keyCode;
        if (Play == false) {
            if (key == 38) {
                // if (Over == true) {
                //     gameInit();
                //     console.log('message');
                //     Over = false;
                // } else {
                Play = true;
                timeLineRemoveAnimation();
                GameSound['up'].stop().play();
                score.innerHTML = 0;
                Timer = setInterval(function() {
                    if (timeOver) {
                        gameOver();
                    } else {
                        init();
                        temp = randomKing();
                        sys = data[temp[0]] === temp[1] ? true : false;
                        // calcTemp()
                        timeOver = true;
                    }
                }, 1000);
            }
        } else {
            if (keyResponse) {
                if (key != 38) {
                    r = Result(ev);
                    keyResponse = false;
                    if (sys === r && sys != undefined) {
                        timeLineRemoveAnimation();
                        score_++;
                        if (score_ > base_) {
                            base_ = score_;
                            localStorage.base = base_;
                        }
                        GamePlaySound(score_);
                        over_score.innerHTML = score.innerHTML = score_;
                    } else {
                        GameSound['error'].stop().play();
                        gameOver();
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    };
}
