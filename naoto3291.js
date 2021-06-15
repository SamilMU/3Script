var config = {
    noopExample: { type: 'noop', label: 'Base Bet' },
    baseBet: { value: 3600, type: 'balance', label: 'Base bet' },
    Uppoint: {value: 1, type: 'text', label: 'Bet Upper start round'},
    ActivationNo: {value: 4, type: 'text', label: 'Activation Point'},
    Activation: {value: 4, type: 'text', label: 'Activation Count'},
    };

// JasonLaurie

var currentBet = config.baseBet.value;
var MultiplierHolder = 4;
var upamount = 100;
var cooldown = 0;
var isBettingNow = false;
var lowmultifollow = false;
var numberOf3xCashedOut = 0;
const StartingBalance = userInfo.balance;
var BalanceCheckpoint = StartingBalance;
var userProfit = 0;
var activationcount = 0;
var gamecounter = 0;
var currentStreakBets = [];
var currentstreakup = [];
var Bettable = true;

log('FIRST LAUNCH | WELCOME!');

engine.on('GAME_STARTING', function () {
    var ProfitCalculator = userInfo.balance;
    gamecounter++;
    log('');
    log('NEW GAME');
    log('Profit since starting the script: ' + userProfit + ' bits.');
    if (cooldown == 0 && Bettable == true) {
        engine.bet(currentBet, MultiplierHolder);
        log("Betting " + (currentBet / 100) + " bits this game.");
        if(currentstreakup.length > 0){
            currentBet -= upamount;
        }
        currentStreakBets.push(currentBet);
        isBettingNow = true;
    } else {
        log('Waiting.Cooldown : ' + cooldown);
        isBettingNow = false;
    }
});

engine.on('GAME_ENDED', function () {
    let gameInfos = engine.history.first();
    if(gameInfos.bust < config.ActivationNo.value && isBettingNow != true){
        activationcount++;
        log('Activation ' + activationcount + ' of ' + config.Activation.value);
        Bettable = false;
    }else if(activationcount <= (config.Activation.value) && isBettingNow != true){
        log('Activation Reset');
        activationcount = 0;
    }
    if(activationcount >= (config.Activation.value) && isBettingNow != true){
        Bettable = true;
        log('Activation reached.');
        activationcount = 0;
    }
    if (isBettingNow) {
        if (!gameInfos.cashedAt) {
            //Lost
            log('Lost...');
            var ProfitCalculator = userInfo.balance;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance)/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
            if(currentStreakBets.length >= 3){
                log('Multi changed to 3');
                MultiplierHolder = 3;
            }
            if((currentStreakBets.length%10) == 0 || (currentStreakBets.length%10) == 1 || (currentStreakBets.length%10) == 2){
                lowmultifollow = true;
            }else{
                lowmultifollow = false;
            }
            if(currentStreakBets.length > 5 && lowmultifollow != false){
                log('Multi changed to 2.8');
                MultiplierHolder = 2.8;
            }
            if (currentStreakBets.length > 1) {
                currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
                log("Upper Array : " + currentstreakup);
            }
            if(currentStreakBets.length >= (config.Uppoint.value-1)){
                log("Entered UpPoint");
                if(currentstreakup.length > 1){
                    log("Started UpPoint");
                    upamount = currentstreakup[currentstreakup.length - 1] + currentstreakup[currentstreakup.length - 2];
                }
                log("Upamount : " + upamount);
                currentBet += upamount;
                currentstreakup.push(upamount);
            }
        } else {
            //Won
            log('Won!');
            var ProfitCalculator = userInfo.balance;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance )/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
            currentStreakBets = [];
            currentBet = (config.baseBet.value);
            numberOf3xCashedOut++;
            cooldown = 1;
            MultiplierHolder = 4;
            currentstreakup = [];
            upamount = 100;
            activationcount = 0;
        }
    }else {
        if (cooldown > 0) {
            log("Decrementing cooldown...");
            cooldown--;
        }
    }
    log('END GAME');
});