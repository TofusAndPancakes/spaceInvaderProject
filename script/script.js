$(document).ready(function () {

class Game {
    constructor(defaultRow, defaultColumn, enemyCooldown) {
        //Set the Actors of the Game
        this.player;
        this.score;
        this.life;
        this.alienArray;
        this.bulletArray;

        //Alien Array
        this.defaultRow = defaultRow;
        this.defaultColumn = defaultColumn;
        this.alienUniqueID;

        //Bullet
        this.bullet;
        this.bulletExist;
        this.bulletUniqueID;

        this.enemyCooldown = enemyCooldown;

        //Enemy Bullet
        this.enemyBulletExist;
        this.enemyBulletUniqueID;
        this.enemyBulletCooldown = this.enemyCooldown;
        this.enemyReachPlayer;

        this.playSpaceWidth;
        this.playSpaceHeight;

        //VFX
        this.explosionArray;
        this.explosionUniqueID;

        requestAnimationFrame(() => this.gameMenu());
    }

    gameMenu() {
        $("#menuSpace").css("z-index", "100");
        $("#gameEndSpace").css("z-index", "0");

        $("#formScore").val(0);

        $("#formStatus").text("");

        //Refresh the Highscores!
        //Clear the Highscore Area!
        $('.menuHighScoreContent').remove();

        //Read the LocalStorage
        let currentLocalStorage = JSON.parse(localStorage.getItem("SpaceInvaderScore"));
        currentLocalStorage.forEach(
            inst => {
                $('#menuHighScore').append(`<div class="menuHighScoreContent">
                            <p>${inst.playerName} - ${inst.playerScore}</p>
                        </div>
                        `);
            }
        )
    }

    gameEnd(causeDeath) {
        if (checkLocalStorage(this.score.scoreValue)) {
            $("#gameEndForm").css("visibility", "visible");
        } else {
            $("#gameEndForm").css("visibility", "hidden");
        };

        $("#gameEndStatus").text(causeDeath);
        $("#gameEndScore").text(this.score.scoreValue + " Final Score!");

        $("#formScore").val(this.score.scoreValue);

        $("#gameEndSpace").css("z-index", "100");
        $("#menuSpace").css("z-index", "0");

        $('#playSpaceID').remove();

    }

    gameStart() {
        //Setup the Game!
        $('#container').append(`<div class="playSpace" id="playSpaceID">
                    <div class="playerCannon" id="playerID">
                        <img id="playerSpriteID" src="images/playerCharacter.png" alt="Player">
                    </div>
                </div>
                `);

        $("#menuSpace").css("z-index", "0");
        $("#gameEndSpace").css("z-index", "0");

        this.playSpaceWidth = parseInt($("#playSpaceID").css("width"));
        this.playSpaceHeight = parseInt($("#playSpaceID").css("height"));

        //Player (direction, speed, posX, htmlElement, imagehtmlElement)
        this.player = new Player(0, 5, 450, $("#playerID"), $("#playerSpriteID"));

        //Alien Initialize
        this.alienArray = [];
        this.row = this.defaultRow;
        this.column = this.defaultColumn;

        this.alienWidth = 50;
        this.alienHeight = 50;

        this.alienUniqueID = 0;
        this.alienDeadCounter = 0;

        this.bulletExist = 0;
        this.bulletUniqueID = 0;
        this.bulletHeight = 32;

        this.enemyBulletExist = 0;
        this.enemyBulletUniqueID = 0;
        this.enemyBulletCooldown = this.enemyCooldown;

        this.enemyReachPlayer = 0;

        //VFX
        this.explosionArray = [];
        this.explosionUniqueID = 0;

        //Aliens
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.column; j++) {

                //Array to Connect
                let alienEntry = {
                    rowLocation: i,
                    columnLocation: j,
                    alive: 1,
                }

                this.alienArray.push(alienEntry);

                $('#playSpaceID').append(`<div class="alien" id="alien_${this.alienUniqueID}">
                          <img src="images/alienCharacter.png" alt="Alien">
                        </div>`);

                //Alien (direction, speed, posX, posY, htmlElement)
                this.alienArray[this.alienUniqueID] = new Alien(1, 2, (j * this.alienWidth + this.alienWidth), (this.playSpaceHeight - (i * this.alienHeight) - (2 * this.alienHeight)), $(`#alien_${this.alienUniqueID}`));

                //To set a Unique Counter
                this.alienUniqueID++;
            }
        }

        //Initialize the Scores and Lives
        $('#playSpaceID').append(`<div class="UI" id="UI">
                        <p id="score">Score 0</p>
                        <p id="life">0 Live(s)</p>
                        </div>`);

        this.score = new Score($('#score'));

        this.life = new Life($('#life'));


        requestAnimationFrame(() => this.gameOngoing());
    }

    gameNextLevel() {
        //Check if Bullet Exists
        if (this.bulletExist > 0) {
            //If Bullet Exist, Delete it First!
            this.bullet.bulletTerminate();
            this.bulletExist = 0;
        }

        if (this.enemyBulletExist > 0) {
            //If Bullet Exist, Delete it First!
            this.enemyBullet.bulletTerminate();
            this.enemyBulletExist = 0;
        }

        //Check if Explosion Exists
        if (this.explosionArray.length > 0) {
            this.explosionArray.forEach(
                inst => {
                    if (inst.ongoing > 0) {
                        inst.explosionTerminate();
                    }
                    //Else do nothing!
                }
            )
        }

        //Alien Initialize
        this.alienArray = [];
        this.row = this.defaultRow;
        this.column = this.defaultColumn;

        this.alienWidth = 50;
        this.alienHeight = 50;

        this.alienUniqueID = 0;
        this.alienDeadCounter = 0;

        this.bulletExist = 0;
        this.bulletUniqueID = 0;
        this.bulletHeight = 32;

        this.enemyBulletExist = 0;
        this.enemyBulletUniqueID = 0;
        this.enemyBulletCooldown = this.enemyCooldown;

        this.enemyReachPlayer = 0;

        //VFX
        this.explosionArray = [];
        this.explosionUniqueID = 0;

        //Aliens
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.column; j++) {

                //Array to Connect
                let alienEntry = {
                    rowLocation: i,
                    columnLocation: j,
                    alive: 1,
                }

                this.alienArray.push(alienEntry);

                $('#playSpaceID').append(`<div class="alien" id="alien_${this.alienUniqueID}">
                          <img src="images/alienCharacter.png" alt="Alien">
                        </div>`);

                //Alien (direction, speed, posX, posY, htmlElement)
                this.alienArray[this.alienUniqueID] = new Alien(1, 2, (j * this.alienWidth + this.alienWidth), (this.playSpaceHeight - (i * this.alienHeight) - (2 * this.alienHeight)), $(`#alien_${this.alienUniqueID}`));

                //To set a Unique Counter
                this.alienUniqueID++;
            }
        }

        requestAnimationFrame(() => this.gameOngoing());
    }

    gameOngoingBullet() {
        if (this.bulletExist < 1) {
            $('#playSpaceID').append(`<div class="bullet" id="bullet_${this.bulletUniqueID}">
                        <img src="images/bulletSprite.png" alt="Bullet">
                        </div>`);

            this.bullet = new Bullet(1, 10, (this.player.posX + (0.5 * this.player.playerWidth - 8)), 0, $(`#bullet_${this.bulletUniqueID}`));
            this.bulletExist = 1;
            this.bulletUniqueID++;
        } else {
            //Do Nothing
        }

    }

    gameOngoingEnemyBulletCooldownSet(amount) {
        this.enemyBulletCooldown = amount;
    }

    gameOngoingEnemyBulletCooldown() {
        if (this.enemyBulletCooldown > 0) {
            this.enemyBulletCooldown--;
        }
    }

    gameOngoing() {
        //Control All Processeses

        //Enemy Bullet Cooldown, if EnemyCooldown is Zero, prepare the Enemy Bullet Now!
        this.gameOngoingEnemyBulletCooldown();

        //Bullet
        //Check if Bullet Hits Anything
        if (this.bulletExist > 0) {
            if (this.bullet.posY + this.bullet.direction * this.bullet.speed > 0 && this.bullet.posY + this.bullet.direction * this.bullet.speed < this.playSpaceHeight - this.bulletHeight) {
                this.bullet.bulletMove();
            } else {
                //Hit Wall Bullet Not Longer Exist
                this.bullet.bulletTerminate();
                this.bulletExist = 0;
            }

            //Hit Alien
            this.alienArray.forEach(
                inst => {
                    if (inst.alive > 0) {
                        if (collision(inst, this.bullet)) {
                            //Prepare Explosion
                            
                            //Array to Connect (Ongoing is Animation is still going!)
                            let explosionEntry = {
                                ongoing : 1,
                            }

                            this.explosionArray.push(explosionEntry);

                            $('#playSpaceID').append(`<div class="explosion" id="explosion_${this.explosionUniqueID}">
                                <img id="explosionImage_${this.explosionUniqueID}" src="images/explosion1.png" alt="Explosion">
                            </div>`);

                            //Explosion (posX, posY, htmlElement, imagehtmlElement)
                            this.explosionArray[this.explosionUniqueID] = new Explosion(inst.posX, inst.posY, $(`#explosion_${this.explosionUniqueID}`), $(`#explosionImage_${this.explosionUniqueID}`));

                            this.explosionUniqueID++;

                            //Hit Alien Bullet Not Longer Exist
                            this.bullet.bulletTerminate();
                            this.bulletExist = 0;
                            //Alien Doesnt Exist Anymore
                            inst.alienTerminate();
                            this.alienDeadCounter++;

                            //Add Points
                            this.score.scoreUpdate(100);

                        } else {
                            //Do Nothing
                        }
                    }
                }
            );
        }

        //Enemy Bullet
        //Check if Enemy Bullet Hits Anything
        if (this.enemyBulletExist > 0) {
            if (this.enemyBullet.posY + this.enemyBullet.direction * this.enemyBullet.speed > 0 && this.enemyBullet.posY + this.enemyBullet.direction * this.enemyBullet.speed < this.playSpaceHeight - this.bulletHeight) {
                this.enemyBullet.bulletMove();
                //Check if Enemy Bullet Hits Player
                if (collision(this.player, this.enemyBullet)) {
                    this.life.lifeUpdate(-1);
                    //Hit Player Bullet Not Longer Exist
                    this.enemyBullet.bulletTerminate();
                    //Reset the Cooldown Before Allowing a New Bullet!
                    this.enemyBulletExist = 0;
                    this.gameOngoingEnemyBulletCooldownSet(this.enemyCooldown);
                }
            } else {
                //Hit Wall Bullet Not Longer Exist
                this.enemyBullet.bulletTerminate();
                //Reset the Cooldown Before Allowing a New Bullet!
                this.enemyBulletExist = 0;
                this.gameOngoingEnemyBulletCooldownSet(this.enemyCooldown);
            }
        }

        //0 if Alien Doesnt Collide, 1 if it Collides!
        let alienCollision = 0;
        let alienAliveArray = [];

        //Check How Many Aliens Eligible for Attack
        //Check if Any Aliens Collide
        this.alienArray.forEach(
            inst => {
                if (inst.alive > 0) {
                    //If Hit the walls!
                    if (inst.posX + inst.direction * inst.speed > 0 && inst.posX + inst.direction * inst.speed < this.playSpaceWidth - this.alienWidth) {
                        //Alien Doesnt Collide
                    } else {
                        //Alien Collide
                        alienCollision = 1;
                    }

                    //Any Aliens Reaches the Player?
                    if (inst.posY <= this.player.playerHeight) {
                        this.enemyReachPlayer = 1;
                    }

                    //Add to the Alien Alive Array
                    if (this.enemyBulletExist < 1 && this.enemyBulletCooldown < 1) {
                        let alienAliveEntry = {
                            alienVariableName: inst,
                        }

                        alienAliveArray.push(alienAliveEntry);
                    }

                }
            }
        );

        //If Alien Collides!
        if (alienCollision > 0) {
            this.alienArray.forEach(
                inst => {
                    inst.alienDirection();
                    inst.alienMove();
                }
            )
        } else {
            this.alienArray.forEach(
                inst => {
                    inst.alienMove();
                }
            )
        }

        //Alien Bullet
        //An Alien Shoots the Bullet
        if (this.enemyBulletExist < 1 && this.enemyBulletCooldown < 1) {
            let alienBulletRandomize = Math.floor(Math.random() * alienAliveArray.length);
            $('#playSpaceID').append(`<div class="bullet" id="enemybullet_${this.enemyBulletUniqueID}">
                        <img src="images/enemyBulletSprite.png" alt="Bullet">
                        </div>`);
            //Bullet (direction, speed, posX, posY, htmlElement)
            this.enemyBullet = new Bullet(1, -5, (alienAliveArray[alienBulletRandomize].alienVariableName.posX + (0.5 * this.alienWidth - 8)), alienAliveArray[alienBulletRandomize].alienVariableName.posY, $(`#enemybullet_${this.enemyBulletUniqueID}`));
            this.enemyBulletExist = 1;
            this.enemyBulletUniqueID++;
        }

        //Explosion Animations
        if (this.explosionArray.length > 0){
                this.explosionArray.forEach(
                    inst => {
                        if (inst.ongoing > 0){
                            inst.explosionAnimate();
                        }
                        //Else do nothing!
                    }
            )
        }

        //Make Player Move!
        this.player.playerAnimate();

        //if Alien All Died!

        if (this.alienArray.length <= this.alienDeadCounter) {
            this.gameNextLevel();
        } else if (this.life.lifeValue == 0) {
            //If Life Reaches Zero
            this.gameEnd("Died due to Alien's Lasers!");
        } else if (this.enemyReachPlayer == 1) {
            this.gameEnd("Alien has succesfully invaded!");
        } else {
            requestAnimationFrame(() => this.gameOngoing());
        }

    }
}

//Define the Player Character
class Player {
    constructor(direction, speed, posX, htmlElement, imagehtmlElement) {

        //Player Movement
        this.direction = direction;
        this.speed = speed;
        this.posX = posX;
        this.htmlElement = htmlElement;
        this.imagehtmlElement = imagehtmlElement;

        //CSSElement
        this.playSpaceWidth = parseInt($("#playSpaceID").css("width"));
        this.playerWidth = parseInt($(this.htmlElement).css("width"));
        this.playerHeight = parseInt($(this.htmlElement).css("height"));

        this.htmlElement.css("left", (posX + "px"));
    }

    //Player Direction
    playerDirection(direction) {
        this.direction = direction;

        if (direction > 0){
            this.imagehtmlElement.attr("src", "images/playerCharacterLeft.png");
        } else if (direction < 0){
            this.imagehtmlElement.attr("src", "images/playerCharacterRight.png");
        } else {
            this.imagehtmlElement.attr("src", "images/playerCharacter.png");
        }
    }

    //Player Movement
    playerAnimate() {
        let currentPosX = this.posX;

        let animatePosX = currentPosX + (this.speed * this.direction);

        //Check if Player Reachers Corner
        if (animatePosX > 0 && animatePosX < this.playSpaceWidth - this.playerWidth) {
            $(this.htmlElement).css("left", (animatePosX + "px"));
            this.posX = animatePosX;
        }

    }
}

class Alien {
    constructor(direction, speed, posX, posY, htmlElement) {
        this.direction = direction;
        this.speed = speed;
        this.posX = posX;
        this.posY = posY;
        this.htmlElement = htmlElement;
        this.alive = 1;

        this.alienHeight = parseInt($(this.htmlElement).css("height"));
        this.alienWidth = parseInt($(this.htmlElement).css("width"));

        this.htmlElement.css("left", (posX + "px"));
        this.htmlElement.css("bottom", (posY + "px"));
    }

    alienMove() {
        let animatePosX = this.posX + (this.speed * this.direction);

        $(this.htmlElement).css("left", (animatePosX + "px"));

        this.posX = animatePosX;
    }

    alienDirection() {
        this.direction = -(this.direction);

        //Increase Speed
        this.posX += this.direction * (0.2 * this.speed);

        this.posY = this.posY - this.alienHeight;

        $(this.htmlElement).css("bottom", (this.posY + "px"));
    }

    alienTerminate() {
        this.alive = 0;
        this.htmlElement.remove();
    }

}

//Define the Bullet
class Bullet {
    constructor(direction, speed, posX, posY, htmlElement) {
        this.direction = direction;
        this.speed = speed;
        this.posX = posX;
        this.posY = posY;
        this.htmlElement = htmlElement;

        this.htmlElement.css("left", (posX + "px"));
        this.htmlElement.css("bottom", (posY + "px"));

        this.htmlElement.css("visibility", "visible");
    }

    bulletMove() {
        this.posY += this.direction * this.speed;

        this.htmlElement.css("bottom", (this.posY + "px"));
    }

    bulletTerminate() {
        //Removes the Bullet
        this.htmlElement.remove();
    }

}

//Define the Score
class Score {
    constructor(htmlElement) {
        this.htmlElement = htmlElement;
        this.scoreValue = 0;
        this.htmlElement.text("Score " + this.scoreValue);
    }

    scoreReturn() {
        return this.scoreValue;
    }

    scoreUpdate(amount) {
        this.scoreValue = this.scoreValue + amount;
        this.htmlElement.text("Score " + this.scoreValue);
    }
}

//Define the Lives
class Life {
    constructor(htmlElement) {
        this.htmlElement = htmlElement;
        this.lifeValue = 3;
        this.htmlElement.text(this.lifeValue + " Live(s)");
    }

    lifeReturn() {
        return this.lifeValue;
    }

    lifeUpdate(amount) {
        this.lifeValue = this.lifeValue + amount;
        this.htmlElement.text(this.lifeValue + " Live(s)");
    }
}

//Define the Explosion
class Explosion {
    constructor(posX, posY, htmlElement, imagehtmlElement){
        this.posX = posX;
        this.posY = posY;
        this.htmlElement = htmlElement;
        this.imagehtmlElement = imagehtmlElement;
        this.ongoing = 1;

        //Explosion Timing is 25 Frames
        this.explosionTiming = 25;

        this.htmlElement.css("left", (posX + "px"));
        this.htmlElement.css("bottom", (posY + "px"));

        this.htmlElement.css("visibility", "visible");
    }

    explosionAnimate(){
        //To Reduce ExplosionTiming
        this.explosionTiming = this.explosionTiming-1;

        if (this.explosionTiming < 5){
            this.imagehtmlElement.attr("src", "images/explosion2.png");
        } else if (this.explosionTiming < 10){
            this.imagehtmlElement.attr("src", "images/explosion3.png");
        } else if (this.explosionTiming < 15){
            this.imagehtmlElement.attr("src", "images/explosion4.png");
        } else if (this.explosionTiming < 20){
            this.imagehtmlElement.attr("src", "images/explosion5.png");
        }

        if (this.explosionTiming < 1){
            this.ongoing = 0;
            this.explosionTerminate();
        }
    }

    explosionTerminate(){
        //Removes the Explosion
        //Adding this.ongoing 0 just Incase!
        this.ongoing = 0;
        this.htmlElement.remove();
    }
}

//Collision Code Credit to KennyYip
function collision(a, b) {
    return parseInt(a.htmlElement.css("left")) < parseInt(b.htmlElement.css("left")) + parseInt(b.htmlElement.css("width")) &&
        parseInt(a.htmlElement.css("left")) + parseInt(a.htmlElement.css("width")) > parseInt(b.htmlElement.css("left")) &&
        parseInt(a.htmlElement.css("bottom")) < parseInt(b.htmlElement.css("bottom")) + parseInt(b.htmlElement.css("height")) &&
        parseInt(a.htmlElement.css("bottom")) + parseInt(a.htmlElement.css("height")) > parseInt(b.htmlElement.css("bottom"))
}

//Prepare or Check if User has Local Storage
if (localStorage.getItem("SpaceInvaderScore") === null) {
    localStorage.setItem("SpaceInvaderScore", '[{"playerName": "AAA", "playerScore": 0}, {"playerName": "BBB", "playerScore": 0}, {"playerName": "CCC", "playerScore": 0}]');
}


function checkLocalStorage(newScore) {
    let currentLocalStorage = JSON.parse(localStorage.getItem("SpaceInvaderScore"));

    let higherValue = false;

    currentLocalStorage.forEach(
        inst => {
            if (newScore >= inst.playerScore) {
                higherValue = true;
            }
        }
    )

    return higherValue;
}

function updateLocalStorage(newName, newScore) {
    //Read the LocalStorage
    let currentLocalStorage = JSON.parse(localStorage.getItem("SpaceInvaderScore"));

    //Push the New Score
    let localStorageEntry = {
        "playerName": newName,
        "playerScore": newScore,
    };

    currentLocalStorage.push(localStorageEntry);

    currentLocalStorage.sort(function (a, b) { return b.playerScore - a.playerScore; });
    //Remove the Last Index (3)
    currentLocalStorage.splice(3, 1);

    //Update the LocalStorage
    let updatedLocalStorage = JSON.stringify(currentLocalStorage);

    localStorage.setItem("SpaceInvaderScore", updatedLocalStorage);
}

//Game Properly Starts Here!

let game = new Game(5, 8, 240);
//game.gameStart();

$('#gameStart').click(function () {
    game.gameStart();
});

$('#menuReturn').click(function () {
    game.gameMenu();
});

$("#myForm").on("submit", function (event) {
    event.preventDefault();
    //Add the Players Name to the Local Storage!
    if (checkLocalStorage(game.score.scoreValue)) {
        let formData = new FormData(event.target);

        updateLocalStorage(formData.get("name"), formData.get("score"));

        $("#formStatus").text("Data Updated!");

        game.gameMenu();

    } else {

    }
});

//Operational Functions
//Check if Arrow Keys Left and Right are pressed!
$(document).keydown(function (e) {
    if (e.keyCode == 37) {
        //If Left is Pressed
        e.preventDefault();
        game.player.playerDirection(-1);
    }

    if (e.keyCode == 39) {
        //If Right is Pressed
        e.preventDefault();
        game.player.playerDirection(1);
    }

    if (e.keyCode == 32) {
        e.preventDefault();
        game.gameOngoingBullet();
    }

    if (e.keyCode == 38 || e.keyCode == 40) {
        e.preventDefault();
    }
});

$(document).keyup(function (e) {
    if (e.keyCode == 37) {
        //If Left is Pressed
        e.preventDefault();
        game.player.playerDirection(0);
    }

    if (e.keyCode == 39) {
        //If Right is Pressed
        e.preventDefault();
        game.player.playerDirection(0);
    }
});

});