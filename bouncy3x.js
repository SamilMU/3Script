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
var cooldown = 0;
var isBettingNow = false;
var numberOf3xCashedOut = 0;
var currentRedStreak = 0;
const StartingBalance = userInfo.balance;
var BalanceCheckpoint = StartingBalance;
var userProfit = 0;
var currentStreakBets = [];
var gamecounter = 0;
var Multiplier = 8;
var betholder = config.baseBet.value;

log('FIRST LAUNCH | WELCOME!');

engine.on('GAME_STARTING', function () {
    var gameInfos = engine.history.first();
    var ProfitCalculator = userInfo.balance;
    gamecounter++;
    log('');
    log(gamecounter);
    log('NEW GAME')
    log('Profit since starting the script: ' + userProfit + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
    if (cooldown == 0) {
        engine.bet(currentBet, Multiplier);
        currentStreakBets.push(currentBet);
        log("Betting " + currentBet / 100 + " bits this game.");
        isBettingNow = true;
    } else {
        log("Cooldown for the next " + cooldown + " games...");
        isBettingNow = false;
    }
});

engine.on('GAME_ENDED', function () {
    gameInfos = engine.history.first();
    if (isBettingNow) {
        if (!gameInfos.cashedAt) {
            //Lost
            var ProfitCalculator = userInfo.balance;
            log('Lost...');
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance)/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
            betholder = (betholder*1.33)
            log(betholder);
            currentBet = betholder;
            log("1.33 step" + currentBet);
            currentBet = currentBet/100;
            log("/100 step" + currentBet);
            currentBet = Math.round(currentBet);
            log("round step" + currentBet);
            currentBet = currentBet*100;
            log("*100 step" + currentBet);
        } else {
            //Won
            log('Won!');
            var ProfitCalculator = userInfo.balance;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance )/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
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
            if(recovermode === true){
                log("Recovery Reset");
                recovery = false;
                recovermode = false;
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
/*    if((BalanceCheckpoint+5000) < ProfitCalculator){
        BalanceCheckpoint += 5000;
        log("50+ upped.New Checkpoint : " + BalanceCheckpoint);
        //cooldown = 20;
    }else if(ProfitCalculator <= (BalanceCheckpoint-40000)){
        log("400 bit deficit");
        log(BalanceCheckpoint);
        stop("Stop-Loss activated.");
    }else if((StartingBalance+10000) < ProfitCalculator){
        log("Limit reached");
        log(ProfitCalculator);
        stop("Stop-win activated.");
        }
    else{
        log("No need for profit check.");
    }*/
    log('END GAME');
});