var config = {
    baseBet: { value: 3100, type: 'balance', label: 'Base bet' },
    maxBet: {value: 18000000, type: 'balance', label: 'Maximum Bet Limit'},
    constpoint: {value: 15, type: 'text', label: 'Fixed Profit Starting Point'},
    maxgain: {value: 7000, type: 'balance', label: 'Fixed Profit'},
    roundadder: {value: 0, type: 'text', label: 'Adds Null rounds to beginning'},
    Multiplier: {value: 4, type: 'text', label: 'Multiplier'},
    Cooldown: {value: 1, type: 'text', label: 'Cooldown'},
    Firstlayer:{
    value: 'true',
    type: 'radio',
    label: 'First Layer',
    options: {
    true: {
        value: 2,
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
        value: 8,
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
        value: 15,
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
    ActiDrop: {value: 5,type: 'text', label:'Max Activation Drop(Minimum is 4)'},

};


var maxbet = config.maxBet.value;
var baseBet = config.baseBet.value;
var acticheck = config.Acticheck.value; // true for checking 
var activationcheck = acticheck; // true for checking 
var Activation = config.Acticheck.options.true.value;
var ActivationNumber = config.Activationno.value;
var ActiDrop = config.ActiDrop.value;
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
var gainhold = false;
var isBettingNow = false;
var lowmultifollow = false;
var Bettable = true;
var dropper = false;
var numberOf3xCashedOut = 0;
const StartingBalance = userInfo.balance;
var BalanceCheckpoint = StartingBalance;
var ProfitCalculator = userInfo.balance;
var userProfit = 0;
var medianchecker = 0;
var gamecounter = 0;
var activationcount = 0;
var activationdropcounter = 0;
var activationholder = 0;
var addedroundholder = config.roundadder.value;
var currentStreakBets = [];
var currentstreakupfirst = [];
var currentstreakupsecond = [];
var currentstreakupthird = [100];
var betted1 = 0;
var betted2 = 0;
var betted3 = 0;
var betted4 = 0;
var betted = 0;
var constbet = 0;
var mediandircheck = 0;
var gameArray = [];
var currentBet = baseBet;
var constbet = 0;

log('FIRST LAUNCH | WELCOME!');

engine.on('GAME_STARTING', function () {
    var ProfitCalculator = userInfo.balance;
    gamecounter++;
    gameArray.length = Math.min(gamecounter, 100);
    log('');
    log('NEW GAME');
    log("Max Gain : " + maxgain);
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
            if(currentstreakupthird.length > 1){
                currentBet -= thirdup;
            }
        }
        currentStreakBets.push(currentBet);
        isBettingNow = true;
    } else {
        log("Cooldown for the next " + cooldown + " games...");
        isBettingNow = false;
    }
});

engine.on('GAME_ENDED', function () {
    let gameInfos = engine.history.first();
    gameArray = engine.history.toArray();
    gameArray.unshift(gameInfos);
    if(gameInfos.bust < ActivationNumber && isBettingNow != true && acticheck != 'false'){
        activationcheck = true;
        activationcount++;
        log('Bust : ' + gameInfos.bust + ' Activation Threshhold : ' + ActivationNumber);
        log('Activation ' + activationcount + ' of ' + activationholder);
        Bettable = false;
        activationcheck = true;
    }else if(activationcount <= Activation && isBettingNow != true && acticheck != 'false'){
        activationcheck = true;
        log('Activation Reset');
        activationcount = 0;
    }
    if(activationcount >= Activation && isBettingNow != true && acticheck != 'false'){
        Bettable = true;
        activationcheck = false;
        log('Activation reached.');
        activationcount = 0;
    }
    if(acticheck != 'false'){
    if(gameArray.length > 50 && ActiDrop > 0){
    medianchecker++;
    log('Median 50 : ' + engine.median());
    if(medianpoint != true){
    mediandircheck++;
    if(mediandircheck < 2){
        medianhist = engine.median(50);
    }
    if(mediandircheck > 3){
    var medianpoint = true;
    }
    }
    if(mediandircheck > 3 ){
    log('Entered median direction control');
    log('Median history : ' + medianhist);
    log('Current Median : ' + engine.median(50));
    if(medianhist >= (engine.median(50)+ (0.10)) && isBettingNow != true){
        dropper = true;
        mediandircheck = 0;
        log('Median is going down.Disabled activation dropper');
        activationholder = config.Activation.value;
    }else{
        log('Median is not dropping fast.Continue as normal');
        mediandircheck = 0;
        medianpoint = false;
    }
}
        if(medianchecker >= 0 && engine.median(50) > 1.97 && dropper != true){
            if((activationholder) >= 10){
            activationholder -= (config.ActiDrop.value-3);
            }
            medianchecker = 0;
            dropper = true;
            log('High Median Activation dropped for 2 wins');
            activationdropcounter = 2;
        }else if(medianchecker >= 5 && engine.median(50) > 2 && dropper != true){
            if((activationholder) >= 10){
                activationholder -= (config.ActiDrop.value-2);
                }
            medianchecker = 0;
            dropper = true;
            log('High Median Activation dropped for 2 wins');
            activationdropcounter = 2;
        }else if(medianchecker >= 5 && engine.median(50) > 2.1 && dropper != true){
            if((activationholder) >= 6){
                activationholder -= (config.ActiDrop.value-1);
                }
            medianchecker = 0;
            dropper = true;
            log('High Median Activation dropped for 2 wins');
            activationdropcounter = 3;
        }else if(medianchecker >= 5 && engine.median(50) > 2.2 && dropper != true){
            if((activationholder) >= 5){
                activationholder -= config.ActiDrop.value;
                }
            medianchecker = 0;
            dropper = true;
            log('High Median Activation dropped for 2 wins');
            activationdropcounter = 4;
        }
        if(engine.median(50) <= 1.97 && drupper != true){
            activationholder = config.Activation.value;
            log('Median lowered.Resetting activation');
            drupper = true;
        }
        if(engine.median(50) <= 1.94 && drupper != true){
            activationholder = (config.Activation.value+3);
            log('Median is low.Activation increased by 3');
            drupper = true;
        }
        if(engine.median(50) <= 1.91 && drupper != true){
            activationholder = (config.Activation.value+6);
            log('Median is low.Activation increased by 3');
            drupper = true;
        }
        if(engine.median(50) <= 1.87 && drupper != true){
            activationholder = (config.Activation.value+9);
            log('Median is low.Activation increased by 3');
            drupper = true;
        }
    }
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
            if(currentStreakBets.length%10 == 0 || currentStreakBets.length%10 == 1 || currentStreakBets.length%10 == 2){
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
                if(currentStreakBets.length >= (Firstpoint-1) && Firstlayer != false){
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
                if(currentStreakBets.length >= (Secondpoint-1) && Secondlayer != false){
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
                if(currentStreakBets.length >= (Thirdpoint-1) && Thirdlayer != false){
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
            }
            betted1 = 0;
            betted2 = 0;
            betted3 = 0;
            betted4 = 0;
            betted = 0;
            constbet = 0;
            betted1 = currentStreakBets.reduce(function(a, b) { return a + b; }, 0);
            betted2 = currentstreakupfirst.reduce(function(a, b) { return a + b; }, 0);
            betted3 = currentstreakupsecond.reduce(function(a, b) { return a + b; }, 0);
            betted4 = currentstreakupthird.reduce(function(a, b) { return a + b; }, 0);
            betted = betted1 + betted2 + betted3 + betted4 - 100;
            log("Betted First Layer : " + betted1);
            log("Betted Second Layer : " + betted2);
            log("Betted Third Layer : " + betted3);
            log("Betted Fourth Layer : " + betted4);
            betted += maxgain;
            log("BetSum : " + betted + " , Constant Gain : " + maxgain);
            log("Multiplier : " + MultiplierHolder);
            constbet = betted/(MultiplierHolder - 1);   ///(MultiplierHolder - 1 )
            //log("Current Bet without Round : " + constbet);
            constbet /= 100;
            constbet = Math.round(constbet);
            constbet *= 100;
            log("Current Bet if Constant Profit Point Reached : " + constbet);
            if(constbet < currentBet && currentStreakBets.length >= constpoint){
                gainhold = true;
                log("Entered Constant Profit Point");
                currentBet = constbet;
                log("Current Bet : " + currentBet);
            }
            // Sim
            /*if(currentStreakBets.length > 37){
                MultiplierHolder = 3;
            }*/
            //
        } else {
            //Won
            log('Won!');
            dropper = false;
            currentStreakBets = [];
            if(currentstreakupfirst.length > 0){
            currentBet += firstup;
            }
            if(currentstreakupsecond.length > 0){
                currentBet += secondup;
            }
            if(currentstreakupthird.length > 1){
                currentBet += thirdup;
            }
            currentBet = config.baseBet.value;
            numberOf3xCashedOut++;
            activationcount = 0;
            cooldown = 0;
            addedroundholder = config.roundadder.value;
            MultiplierHolder = config.Multiplier.value; //4
            currentstreakupfirst = [];
            currentstreakupsecond = [];
            currentstreakupthird = [];
            firstup = 100;
            secondup = 100;
            thirdup = 100;
            betted = 0;
            betted4 = 0;
            betted3 = 0;
            betted2 = 0;
            betted1 = 0;
            constbet = 0;
            gainhold = false;
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
        }
    }
    // Wut
    if(activationdropcounter < 2){
        activationholder = config.Activation.value;
    }

    // Wingoal and StopLoss
    if((BalanceCheckpoint+5000) < ProfitCalculator){
        BalanceCheckpoint += 5000;
        log("50+ upped.New Checkpoint : " + BalanceCheckpoint);
        //cooldown = 20;
    }else if(ProfitCalculator <= (BalanceCheckpoint-500000)){
        log("5000 bit deficit");
        log(BalanceCheckpoint);
        stop("Stop-Loss activated.");
    }else if((StartingBalance+500000) < ProfitCalculator){
        log("Limit reached");
        log(ProfitCalculator);
        stop("Stop-win activated.");
        }
    else{
        log("No need for profit check.");
    }
    log('END GAME');
});

engine.median = function (span) {
	let arr = gameArray.slice(0, (span ? Math.max(1, Math.min(50, span)) : 50)).map(a => a).sort((a, b) => { return a - b });
    let mid = arr.length / 2, med = mid % 1 ? arr[mid - 0.5] : (arr[mid - 1] + arr[mid]) / 2;
	return med;
};