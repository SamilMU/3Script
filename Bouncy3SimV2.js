var config = {
    noopExample: { type: 'noop', label: 'Base Bet' },
    baseBet: { value: 1500, type: 'balance', label: 'Base bet' },
    fixedOrRandom: {
        value: 'fixed', type: 'radio', label: 'Fixed or random waiting time',
        options: {
            fixed: { value: 5, type: 'text', label: 'Fixed cooldown' },
            random: { value: "3-7", type: 'text', label: 'Random (min-max)' }
        }
    }
}

//3x chasing script by @Cannonball
//Feel free to tip, as is it a free script
//Also feel free to ping me if you got questions
//Will continuously chase 3x
//->Will wait the cooldown value you set
//-->Will bet "base bet" value for two games, then do an addition of the two last amount that we have bet
//Has logging functionalities, press F12

var currentBet = config.baseBet.value;
var loopcounter = 0;
var cooldown = 0;
var Bettable = false;
var isBettingNow = false;
var numberOf3xCashedOut = 0;
var userProfit = 0;
var currentStreakBets = [];
var waitime = 50;
var gamecounter = 0;
var gamecounterbig = 0;
var gameInfo = [];

log('FIRST LAUNCH | WELCOME!');

engine.on('GAME_STARTING', function () {
    gameInfo.push(engine.history.first());
    log('');
    log('NEW GAME')
   gamecounter ++;
   gamecounterbig++;
    log('Profit since starting the script: ' + userProfit / 100 + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
    if (cooldown == 0 /*&& Bettable != false*/) {
        engine.bet(currentBet, 3);
        currentStreakBets.push(currentBet);
        log("Betting " + currentBet / 100 + " bits this game.");
        isBettingNow = true;
        waitime -= 1;
    } else {
        log("Cooldown for the next " + cooldown + " games...");
        isBettingNow = false;
    }
});

engine.on('GAME_ENDED', function () {
    let gameInfos = engine.history.first();
    if (isBettingNow) {
        if (!gameInfos.cashedAt) {
            //Lost
            log('Lost...');
            userProfit -= currentBet;
            if (currentStreakBets.length > 1) {
                currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
            }
           if( currentStreakBets.length >= 7){
                log("Entered this part");
                cooldown = 5;
                var lastitem = currentStreakBets[-1];
                currentStreakBets = [];
                }
        } else {
            //Won
            log('Won!');
            userProfit += currentBet * 3;
            if (config.fixedOrRandom.value == "fixed") {
                cooldown = config.fixedOrRandom.options.fixed.value;
            } else {
                let randomValueStr = config.fixedOrRandom.options.random.value;
                let dashIndex = randomValueStr.indexOf("-");
                let min = parseInt(randomValueStr.substring(0, dashIndex));
                let max = parseInt(randomValueStr.substring(dashIndex + 1, randomValueStr.length));
                if (isNaN(min) || isNaN(max)) {
                    stop("Cannot parse min and max values. Use min-max, with min and max as numbers");
                }
                cooldown = Math.floor(Math.random() * (max - min) + min);
                log(cooldown + " has been chosen as cooldown");
            }
            currentStreakBets = [];
            currentBet = config.baseBet.value;
            numberOf3xCashedOut++;
        }
    } else {
        if (cooldown > 0) {
            log("Decrementing cooldown...");
            cooldown--;
        }
    }

/*if(gamecounter > 1000){
 cooldown = 100;
 gamecounter = 0;
}
if(gamecounterbig > 10000){
    cooldown= 500;
    gamecounterbig = 0;
}*/
    log('END GAME');
});