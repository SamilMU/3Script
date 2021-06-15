var config = {
    baseBet: { value: 3100, type: 'balance', label: 'Base bet' },
    maxBet: {value: 1800000, type: 'balance', label: 'Maximum Bet Limit'},
    stoploss:{value: 150000, type: 'balance', label: 'Stop Loss'},
    Wingoal:{value: 1500000, type: 'balance', label: 'Gain Goal to Stop'},
    constpoint: {value: 15, type: 'text', label: 'Fixed Profit Starting Point'},
    maxgain: {value: 700, type: 'balance', label: 'Fixed Profit'},
    roundadder: {value: 0, type: 'text', label: 'Adds Null rounds to beginning'},
    Multiplier: {value: 4, type: 'text', label: 'Multiplier'},
    Cooldown: {value: 1, type: 'text', label: 'Cooldown'},
    Firstlayer:{
    value: 'true',
    type: 'radio',
    label: 'First Layer',
    options: {
    true: {
        value: 1,
        type: 'text',
        label: 'Activate'
        },
    false: {
        type: 'noop',
        label: 'Deactivate'
        },  
    }
    },
    Secondlayer:{
    value: 'true',
    type: 'radio',
    label: 'Second Layer',
    options: {
    true: {
        value: 7,
        type: 'text',
        label: 'Activate'
        },
    false: {
        type: 'noop',
        label: 'Deactivate'
        },  
    }
    },
    Thirdlayer:{
    value: 'true',
    type: 'radio',
    label: 'Third Layer',
    options: {
    true: {
        value: 10,
        type: 'text',
        label: 'Activate'
        },
    false: {
        type: 'noop',
        label: 'Deactivate'
        },  
    }
    },
    Fourthlayer:{
        value: 'true',
        type: 'radio',
        label: 'Fourth Layer',
        options: {
        true: {
            value: 10,
            type: 'text',
            label: 'Activate'
            },
        false: {
            type: 'noop',
            label: 'Deactivate'
            },  
        }
        },
    Acticheck:{
    value: 'false',
    type: 'radio',
    label: 'Activation',
    options: {
    true: {
        value: 4,
        type: 'text',
        label: 'Activation Count'
        },
    false: {
        type: 'noop',
        label: 'No Activation'
        },  
    }
        },
    Activationno: {value: 4, type: 'text', label: 'Activation Number'},
    cooldownenable: {value: true, type: 'checkbox', label: 'Cooldown On/Off'}
};


var maxbet = config.maxBet.value;
var baseBet = config.baseBet.value;
var cooldownenable = config.cooldownenable.value;
var acticheck = config.Acticheck.value; // true for checking 
var activationcheck = acticheck; // true for checking 
var Activation = config.Acticheck.options.true.value;
var ActivationNumber = config.Activationno.value;
var constpoint = config.constpoint.value;
var maxgain = config.maxgain.value;
var roundadder = config.roundadder.value;
var MultiplierHolder = config.Multiplier.value; //4
var cooldown = 0;
var Firstlayer = config.Firstlayer.value;
var Firstpoint = config.Firstlayer.options.true.value;
var firstup = 100;
var Secondlayer = config.Secondlayer.value;
var Secondpoint = config.Secondlayer.options.true.value;
var secondup = 100;
var Thirdlayer = config.Thirdlayer.value;
var Thirdpoint = config.Thirdlayer.options.true.value;
var thirdup = 100;
var Fourthlayer = config.Fourthlayer.value;
var Fourthpoint = config.Fourthlayer.options.true.value;
var fourthup = 100;
var gainhold = false;
var isBettingNow = false;
var lowmultifollow = false;
var Bettable = true;
var numberOf3xCashedOut = 0;
const StartingBalance = userInfo.balance;
var BalanceCheckpoint = StartingBalance;
var ProfitCalculator = userInfo.balance;
var userProfit = 0;
var medianchecker = 0;
var gamecounter = 0;
var activationcount = 0;
var activationdropcounter = 0;
var activationholder = config.Acticheck.options.true.value;
var addedroundholder = roundadder;
var currentStreakBets = [];
var currentstreakupfirst = [];
var currentstreakupsecond = [];
var currentstreakupthird = [];
var currentstreakupfourth = [100];
var betted1 = 0;
var betted2 = 0;
var betted3 = 0;
var betted4 = 0;
var betted5 = 0;
var betted = 0;
var constbet = 0;
var mediandircheck = 0;
var currentBet = baseBet;
var constbet = 0;

log('FIRST LAUNCH | WELCOME!');
log("FL : " + Firstlayer + " SL " + Secondlayer + " TL " + Thirdlayer + " FL " + Fourthlayer);

engine.on('GAME_STARTING', function () {
    ProfitCalculator = userInfo.balance;
    gamecounter++;
    log('');
    log('NEW GAME');
    log('Game Counter : ' + gamecounter);
    log('Bankroll : ' + ProfitCalculator);
    log("Max Gain at Constant Point: " + maxgain);
    log('Profit since starting the script: ' + userProfit + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
        if (cooldown < 1 && Bettable != false && activationcheck != 'true') {
        engine.bet(currentBet, MultiplierHolder);
        log("Betting " + currentBet / 100 + " bits this game.");
        if(gainhold != true){
            if(currentstreakupfirst.length > 0){
                currentBet -= firstup;
            }
            if(currentstreakupsecond.length > 0){
                currentBet -= secondup;
            }   
            if(currentstreakupthird.length > 0){
                currentBet -= thirdup;
            }
            if(currentstreakupfourth.length > 1){
                currentBet -= fourthup;
            }
        }
        currentStreakBets.push(currentBet);
        log('Bet Array : ' + currentStreakBets);
        isBettingNow = true;
    } else {
        log("Cooldown for the next " + cooldown + " games...");
        isBettingNow = false;
    }
});

engine.on('GAME_ENDED', function () {
let gameInfos = engine.history.first();
if(gameInfos.bust < ActivationNumber && isBettingNow != true && acticheck != 'false'){
    activationcount++;
    log('Bust : ' + gameInfos.bust + ' Activation Threshhold : ' + ActivationNumber);
    log('Activation ' + activationcount + ' of ' + activationholder);
    Bettable = false;
    activationcheck = 'true';
}else if(activationcount <= Activation && isBettingNow != true && acticheck != 'false'){
    activationcheck = 'true';
    log('Bust : ' + gameInfos.bust);
    log('Activation Reset');
    activationcount = 0;
}
if(activationcount >= Activation && isBettingNow != true && acticheck != 'false'){
    Bettable = true;
    activationcheck = 'false';
    log('Bust : ' + gameInfos.bust);
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
            log('CP0');
            if(currentStreakBets.length >= 3){
                log('Multi changed to 3');
                MultiplierHolder = 3; //3
            }
            if(currentStreakBets.length%10 == 0 || currentStreakBets.length%10 == 1 || currentStreakBets.length%10 == 2){
                lowmultifollow = true;
            }else{
                lowmultifollow = false;
            }
            if(currentStreakBets.length > 5 && lowmultifollow != false){
                log('Multi changed to 2.8');
                MultiplierHolder = 2.8; //2.8
            }
            if (currentStreakBets.length > 1) {
                currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
            }
            log('CP1');
            betted1 = 0;
            betted2 = 0;
            betted3 = 0;
            betted4 = 0;
            betted5 = 0;
            betted = 0;
            constbet = 0;
            betted1 = currentStreakBets.reduce(function(a, b) { return a + b; }, 0);
            betted2 = currentstreakupfirst.reduce(function(a, b) { return a + b; }, 0);
            betted3 = currentstreakupsecond.reduce(function(a, b) { return a + b; }, 0);
            betted4 = currentstreakupthird.reduce(function(a, b) { return a + b; }, 0);
            betted5 = currentstreakupfourth.reduce(function(a, b) { return a + b; }, 0);
            betted = betted1 + betted2 + betted3 + betted4 + betted5 - 100;
            log('CP2');
            log("BetSum Main Layer : " + betted1);
            log("BetSum First Layer : " + betted2);
            log("BetSum Second Layer : " + betted3);
            log("BetSum Third Layer : " + betted4);
            log("BetSum Fourth Layer : " + betted5);
            betted += maxgain;
            log("BetSum : " + betted + " , Constant Gain : " + maxgain);
            log("Multiplier : " + MultiplierHolder);
            constbet = betted/(MultiplierHolder-1);   ///(MultiplierHolder - 1 )
            log("Current Bet without Constant Point : " + currentBet);
            constbet /= 100;
            constbet = Math.round(constbet);
            constbet *= 100;
            log('CP3');
            log("Current Bet if Constant Profit Point Reached : " + constbet);
            if(constbet < currentBet && currentStreakBets.length >= constpoint){
                gainhold = true;
                log("Entered Constant Profit Point");
                currentBet = constbet;
                log("Current Bet : " + currentBet);
            }
            log("Length " + currentStreakBets.length + " GH " + gainhold);
            log('CP4');
            if(currentStreakBets.length >= (Firstpoint-1) && Firstlayer != 'false' && gainhold != true){
                log("Entered FirstPoint");
                if(currentstreakupfirst.length > 1){
                    log("Started UpPoint Calculation");
                    firstup = currentstreakupfirst[currentstreakupfirst.length - 1] + currentstreakupfirst[currentstreakupfirst.length - 2];
                }
                log("First Upamount : " + firstup);
                currentBet += firstup;
                currentstreakupfirst.push(firstup);
                log("First Array : " + currentstreakupfirst);
                log("New Bet : " + currentBet);
            }
            if(currentStreakBets.length >= (Secondpoint-1) && Secondlayer != 'false' && gainhold != true){
                log("Entered SecondPoint");
                if(currentstreakupsecond.length > 1){
                    log("Started UpPoint Calculation");
                    secondup = currentstreakupsecond[currentstreakupsecond.length - 1] + currentstreakupsecond[currentstreakupsecond.length - 2];
                }
                log("Second Upamount : " + secondup);
                currentBet += secondup;
                currentstreakupsecond.push(secondup);
                log("Second Array : " + currentstreakupsecond);
                log("New Bet : " + currentBet);
            }
            if(currentStreakBets.length >= (Thirdpoint-1) && Thirdlayer != 'false' && gainhold != true){
                log("Entered ThirdPoint");
                if(currentstreakupthird.length > 1){
                    log("Started UpPoint Calculation");
                    thirdup = currentstreakupthird[currentstreakupthird.length - 1] + currentstreakupthird[currentstreakupthird.length - 2];
                }
                log("Third Upamount : " + thirdup);
                currentBet += thirdup;
                currentstreakupthird.push(thirdup);
                log("Third Array : " + currentstreakupthird);
                log("New Bet : " + currentBet);
            }
            if(currentStreakBets.length >= (Fourthpoint-1) && Fourthlayer != 'false' && gainhold != true){
                log("Entered FourthPoint");
                if(currentstreakupfourth.length > 1){
                    log("Started UpPoint Calculation");
                    thirdup = currentstreakupfourth[currentstreakupfourth.length - 1] + currentstreakupfourth[currentstreakupfourth.length - 2];
                }
                log("Fourth Upamount : " + fourthup);
                currentBet += fourthup;
                currentstreakupfourth.push(thirdup);
                log("Fourth Array : " + currentstreakupfourth);
                log("New Bet : " + currentBet);
            }
            // Sim 
            /*
            if(currentStreakBets.length > 37){
                MultiplierHolder = 3;
            }
            */
            //
        } else {
            //Won
            log('Won!');
            currentStreakBets = [];
            if(currentstreakupfirst.length > 0){
            currentBet += firstup;
            }
            if(currentstreakupsecond.length > 0){
                currentBet += secondup;
            }
            if(currentstreakupthird.length > 0){
                currentBet += thirdup;
            }
            if(currentstreakupfourth.length > 1){
                currentBet += fourthup;
            }
            currentBet = config.baseBet.value;
            numberOf3xCashedOut++;
            activationcount = 0;
            cooldown = config.Cooldown.value;
            addedroundholder = roundadder;
            MultiplierHolder = config.Multiplier.value; //4 
            currentstreakupfirst = [];
            currentstreakupsecond = [];
            currentstreakupthird = [];
            currentstreakupfourth = [100];
            firstup = 100;
            secondup = 100;
            thirdup = 100;
            fourthup = 100;
            betted = 0;
            betted5 = 0;
            betted4 = 0;
            betted3 = 0;
            betted2 = 0;
            betted1 = 0;
            constbet = 0;
            gainhold = false;
            isBettingNow = false;
            ProfitCalculator = userInfo.balance;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance )/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
            }
    } else {
        if (cooldown > 0) {
            log("Decrementing cooldown...");
            cooldown--;
            isBettingNow = false;
        }
    }
    // Wut
    if(activationdropcounter < 2){
        activationholder = config.Acticheck.options.true.value;
    }

    // Wingoal and StopLoss
    if((BalanceCheckpoint+5000) < ProfitCalculator){
        BalanceCheckpoint += 5000;
        log("50+ upped.New Checkpoint : " + BalanceCheckpoint);
        //cooldown = 20;
    }
    if(ProfitCalculator <= (StartingBalance-config.stoploss.value)){
        log(BalanceCheckpoint);
        stop("Stop-Loss activated.");
    }
    if(currentBet > config.maxBet.value){
        log("Stop Triggered. Was about to bet : " + currentBet);
        stop("Script Stopped");
    }
    if((StartingBalance+config.Wingoal.value) < ProfitCalculator){
        log("Limit reached");
        log(ProfitCalculator);
        stop("Stop-win activated.");
        }
    else{
        log("No need for profit check.");
    }
    log('END GAME');
});
