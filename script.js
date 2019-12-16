const video = document.getElementById('video')
let check = false;
let gameScore = [];
let emotions = [];
let data = [0, 0, 0, 0, 0, 0, 0];
let labels = ["HAPPY", "SAD", "ANGRY", "FEARFUL", "DISGUSTED", "SURPRISED", 'NEUTRAL'];
let gameLabel = [];
let gameEmotion = [];

function startVideo() {
    navigator.mediaDevices.getUserMedia(
        {
            video: {}
        }).then((stream) => {
            video.srcObject = stream;
        }, (err) => console.error(err));
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    canvas.id = "mainCanvas";
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    let time = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        // console.log("test");
        if (check == true) {
            console.log(detections[0].expressions);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            clearInterval(time);
            video.style.display = 'None';
            let x = document.getElementById('mainCanvas');
            x.parentNode.removeChild(x);
        }
        if (typeof detections != "undefined") {
            data[0] = parseFloat(data[0]) + parseFloat((detections[0].expressions.happy));
            data[1] = parseFloat(data[1]) + parseFloat((detections[0].expressions.sad));
            data[2] = parseFloat(data[2]) + parseFloat((detections[0].expressions.angry));
            data[3] = parseFloat(data[3]) + parseFloat((detections[0].expressions.fearful));
            data[4] = parseFloat(data[4]) + parseFloat((detections[0].expressions.disgusted));
            data[5] = parseFloat(data[5]) + parseFloat((detections[0].expressions.surprised));
            data[6] = parseFloat(data[6]) + parseFloat((detections[0].expressions.neutral));
            // console.log( "happy" +parseFloat((detections[0].expressions.happy)).toFixed(4));
            // console.log("sad" + parseFloat((detections[0].expressions.sad)).toFixed(4));
            // console.log("angry" +parseFloat((detections[0].expressions.angry)).toFixed(4));
            // console.log("fearful"+parseFloat((detections[0].expressions.fearful)).toFixed(4));
            // console.log("digs"+parseFloat((detections[0].expressions.disgusted)).toFixed(4));
            // console.log("surprised"+parseFloat((detections[0].expressions.surprised)).toFixed(4));
            // console.log("neutral"+parseFloat((detections[0].expressions.neutral)).toFixed(4));
            // emotions.push(data);
            //console.log(data);
        }
    }, 100)
})

async function stopStreamedVideo(video) {
    let stream = video.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function (track) {
        track.stop();
    });
    console.log('a');
    video.srcObject = null;
    return 1;
}

// document.onkeydown = function (evt) {
//   evt = evt || window.event;
//   if (evt.keyCode == 27) {

//     stopStreamedVideo(video).then(() => {
//       check = true;
//       console.log("video ended!!");

//       //  renderChart(data, labels);
//     });
//   }
//   stopStreamedVideo(video);
// };

function showAnalysis() {
    stopStreamedVideo(video);
    //   window.open ('report.html','_self',false)
    document.getElementById('reportHeading').style.display= 'block';
    document.getElementById('mainCanvas').remove();
    renderChart(data, labels);
    circleGraph(data, labels);
    gameChart(gameScore,gameLabel);
}
function gameChart(data,label)
{
    var ctx = document.getElementById("gameChart");
    ctx.style.display = 'block';
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: '# of Tomatoes',
                data: data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                        maxRotation: 90,
                        minRotation: 80
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
function renderChart(data, label) {
    var ctx = document.getElementById("myChart");
    ctx.style.display = 'block';
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: '# of Tomatoes',
                data: data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                        maxRotation: 90,
                        minRotation: 80
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function circleGraph(data, label) {
    var ctx = document.getElementById("circleChart");
    ctx.style.display = 'block';
    var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: label,
            datasets: [{
                label: '# of Tomatoes',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                        maxRotation: 90,
                        minRotation: 80
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function removeInteger(x) {
    int_part = Math.trunc(x); // returns 3
    float_part = Number((x - int_part).toFixed(2)); // return 0.2

    return float_part;
}


////////////// GAME /////////////////////
(function () {
    /////////////////////////////////////////////////////////////
    // Canvas & Context
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(startVideo)
    var canvas;
    var ctx;

    // Snake
    var snake;
    var snake_dir;
    var snake_next_dir;
    var snake_speed = 40;
    var speedChange = 10;

    // Food
    var food = {
        x: 0,
        y: 0
    };

    // Score
    var score;

    // Wall
    var wall;

    // HTML Elements
    var screen_snake;
    var screen_menu;
    var screen_setting;
    var screen_gameover;
    var button_newgame_menu;
    var button_newgame_setting;
    var button_newgame_gameover;
    var button_setting_menu;
    var button_setting_gameover;
    var ele_score;
    var speed_setting;
    var wall_setting;

    /////////////////////////////////////////////////////////////

    var activeDot = function (x, y) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x * 10, y * 10, 10, 10);
    }


    /////////////////////////////////////////////////////////////

    var changeDir = function (key) {

        if (key == 38 && snake_dir != 2) {
            snake_next_dir = 0;
        } else {

            if (key == 39 && snake_dir != 3) {
                snake_next_dir = 1;
            } else {

                if (key == 40 && snake_dir != 0) {
                    snake_next_dir = 2;
                } else {

                    if (key == 37 && snake_dir != 1) {
                        snake_next_dir = 3;
                    }
                }
            }
        }

    }

    /////////////////////////////////////////////////////////////

    var addFood = function () {
        food.x = Math.floor(Math.random() * ((canvas.width / 10) - 1));
        food.y = Math.floor(Math.random() * ((canvas.height / 10) - 1));
        for (var i = 0; i < snake.length; i++) {
            if (checkBlock(food.x, food.y, snake[i].x, snake[i].y)) {
                addFood();
            }
        }
    }

    /////////////////////////////////////////////////////////////

    var checkBlock = function (x, y, _x, _y) {
        return (x == _x && y == _y) ? true : false;
    }

    /////////////////////////////////////////////////////////////

    var altScore = function (score_val) {
        ele_score.innerHTML = String(score_val);
    }

    /////////////////////////////////////////////////////////////

    var mainLoop = function () {

        var _x = snake[0].x;
        var _y = snake[0].y;
        snake_dir = snake_next_dir;

        // 0 - Up, 1 - Right, 2 - Down, 3 - Left
        switch (snake_dir) {
            case 0:
                _y--;
                break;
            case 1:
                _x++;
                break;
            case 2:
                _y++;
                break;
            case 3:
                _x--;
                break;
        }

        snake.pop();
        snake.unshift({
            x: _x,
            y: _y
        });


        // --------------------

        // Wall

        if (wall == 1) {
            // On
            if (snake[0].x < 0 || snake[0].x == canvas.width / 10 || snake[0].y < 0 || snake[0].y ==
                canvas.height / 10) {
                showScreen(3);
                return;
            }
        } else {
            // Off
            for (var i = 0, x = snake.length; i < x; i++) {
                if (snake[i].x < 0) {
                    snake[i].x = snake[i].x + (canvas.width / 10);
                }
                if (snake[i].x == canvas.width / 10) {
                    snake[i].x = snake[i].x - (canvas.width / 10);
                }
                if (snake[i].y < 0) {
                    snake[i].y = snake[i].y + (canvas.height / 10);
                }
                if (snake[i].y == canvas.height / 10) {
                    snake[i].y = snake[i].y - (canvas.height / 10);
                }
            }
        }

        // --------------------
        let x1 = document.getElementById('timer').innerHTML;
            x1--;
        document.getElementById('timer').innerHTML = x1;
        // Autophagy death and game score updated
        for (var i = 1; i < snake.length; i++) {
            if ((snake[0].x == snake[i].x && snake[0].y == snake[i].y) || x1 < 1) {
                showScreen(3);
                gameScore.push(score);
                gameLabel.push("game "+ gameScore.length +" ");
                let temp = data.indexOf(Math.max(...data));
                gameEmotion.push(labels[temp]);
                snake_speed = 40;
                return;
            }
        }

        // --------------------

        // Eat Food
        if (checkBlock(snake[0].x, snake[0].y, food.x, food.y)) {
            snake[snake.length] = {
                x: snake[0].x,
                y: snake[0].y
            };
            score += 1;
            altScore(score);
            addFood();
            activeDot(food.x, food.y);
        }
        // --------------------

        snake_speed -= 0.5;

        // --------------------

        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --------------------

        for (var i = 0; i < snake.length; i++) {
            activeDot(snake[i].x, snake[i].y);
        }

        // --------------------

        activeDot(food.x, food.y);

        // Debug
        //document.getElementById("debug").innerHTML = snake_dir + " " + snake_next_dir + " " + snake[0].x + " " + snake[0].y;    
       
        //   console.log(document.getElementById('timer').innerHTML);
        setTimeout(mainLoop, snake_speed);
    }

    /////////////////////////////////////////////////////////////

    var newGame = function () {
        document.getElementById('timer').innerHTML = 300;
        showScreen(0);
        screen_snake.focus();
       
        snake = [];
        for (var i = 4; i >= 0; i--) {
            snake.push({
                x: i,
                y: 15
            });
        }

        snake_next_dir = 1;

        score = 0;
        altScore(score);

        addFood();

        // checkTime();

        canvas.onkeydown = function (evt) {
            evt = evt || window.event;
            changeDir(evt.keyCode);
        }
        mainLoop();

        // let t = 45;
        // function count() {
        //     document.getElementById("timer").innerHTML = t--;
        // }
        // setTimeout(count, 1000);

    }

    /////////////////////////////////////////////////////////////

    // Change the snake speed...
    // 150 = slow
    // 100 = normal
    // 50 = fast


    // var setSnakeSpeed = function(speed_value){
    //     snake_speed = speed_value;
    // }

    /////////////////////////////////////////////////////////////
    var setWall = function (wall_value) {
        wall = 0;
        // wall = wall_value;
        // if(wall == 0){screen_snake.style.borderColor = "#606060";}
        // if(wall == 1){screen_snake.style.borderColor = "#FFFFFF";}
    }

    /////////////////////////////////////////////////////////////

    // 0 for the game
    // 1 for the main menu
    // 2 for the settings screen
    // 3 for the game over screen
    var showScreen = function (screen_opt) {
        switch (screen_opt) {

            case 0:
                screen_snake.style.display = "block";
                screen_menu.style.display = "none";
                screen_setting.style.display = "none";
                screen_gameover.style.display = "none";
                break;

            case 1:
                screen_snake.style.display = "none";
                screen_menu.style.display = "block";
                screen_setting.style.display = "none";
                screen_gameover.style.display = "none";
                break;

            case 2:
                screen_snake.style.display = "none";
                screen_menu.style.display = "none";
                screen_setting.style.display = "block";
                screen_gameover.style.display = "none";
                break;

            case 3:
                screen_snake.style.display = "none";
                screen_menu.style.display = "none";
                screen_setting.style.display = "none";
                screen_gameover.style.display = "block";
                break;
        }
    }

    /////////////////////////////////////////////////////////////

    // function checkTime() {
    //     let i = 0;
    //     var Time =  setTimeout(function () {
    //         myVar = setTimeout(function(){ alert("Hello"); }, 3000);
    //     }, 600);
    // }

    /////////////////////////////////////////////////////////////
    window.onload = function () {

        canvas = document.getElementById("snake");
        ctx = canvas.getContext("2d");

        // Screens
        screen_snake = document.getElementById("snake");
        screen_menu = document.getElementById("menu");
        screen_gameover = document.getElementById("gameover");
        screen_setting = document.getElementById("setting");

        // Buttons
        button_newgame_menu = document.getElementById("newgame_menu");
        button_newgame_setting = document.getElementById("newgame_setting");
        button_newgame_gameover = document.getElementById("newgame_gameover");
        button_setting_menu = document.getElementById("setting_menu");
        button_setting_gameover = document.getElementById("setting_gameover");

        // etc
        ele_score = document.getElementById("score_value");
        speed_setting = document.getElementsByName("speed");
        wall_setting = document.getElementsByName("wall");

        // --------------------

        button_newgame_menu.onclick = function () {
            newGame();
        };
        button_newgame_gameover.onclick = function () {
            newGame();
        };
        button_newgame_setting.onclick = function () {
            newGame();
        };
        button_setting_menu.onclick = function () {
            showScreen(2);
        };
        button_setting_gameover.onclick = function () {
            showScreen(2)
        };

        // setSnakeSpeed(200);
        setWall(1);

        showScreen("menu");

        // --------------------
        // Settings

        // speed
        for (var i = 0; i < speed_setting.length; i++) {
            speed_setting[i].addEventListener("click", function () {
                for (var i = 0; i < speed_setting.length; i++) {
                    if (speed_setting[i].checked) {
                        setSnakeSpeed(speed_setting[i].value);
                    }
                }
            });
        }

        // wall
        for (var i = 0; i < wall_setting.length; i++) {
            wall_setting[i].addEventListener("click", function () {
                for (var i = 0; i < wall_setting.length; i++) {
                    if (wall_setting[i].checked) {
                        setWall(wall_setting[i].value);
                    }
                }
            });
        }

        document.onkeydown = function (evt) {
            if (screen_gameover.style.display == "block") {
                evt = evt || window.event;
                if (evt.keyCode == 32) {
                    newGame();
                }
            }
        }
    }

})();