var bankroll = 14000000;
var maxbet = 1800;
var stoploss = 4500;
var wingoal = 4500;
var baseBet = 31;
var Activation = 0;
var ActivationNumber = 3;
var constpoint = 15;
var maxgain = 1000;
var roundadder = 0;
var MultiplierHolder = 4; //4
var cooldown = 0;
var gainhold = false;
var Firstlayer = true;
var Firstpoint = 3;
var firstup = 100;
var Secondlayer = true;
var Secondpoint = 6;
var secondup = 100;
var Thirdlayer = true;
var Thirdpoint = 10;
var thirdup = 100;
var activationcheck = false; // true for checking 
var isBettingNow = false;
var lowmultifollow = false;
var Bettable = true;
maxgain = maxgain*100;
maxbet = maxbet*100;
baseBet = (baseBet*100);
stoploss = stoploss*100;
wingoal = wingoal*100;
Firstpoint = (Firstpoint - 1);
var numberOf3xCashedOut = 0;
const StartingBalance = engine.getBalance();
var BalanceCheckpoint = StartingBalance;
var ProfitCalculator = engine.getBalance();
var userProfit = 0;
var medianchecker = 0;
var gamecounter = 0;
var activationcount = 0;
var activationholder = 0;
var addedroundholder = roundadder;
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
var gameArray = [];
var currentBet = baseBet;
var constbet = 0;
console.log('FIRST LAUNCH | WELCOME!');

engine.on('game_starting', function (info) {
    ProfitCalculator = engine.getBalance();
    gamecounter++;
    gameArray.length = Math.min(gamecounter, 100);
    console.log('');
    console.log('NEW GAME');
    console.log("Max Gain : " + maxgain);
    console.log('Sim Bankroll : ' + bankroll/100);
    console.log('Profit since starting the script: ' + userProfit + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
    if (cooldown < 1 && Bettable != false && activationcheck != true) {
        MultiplierHolder *= 100;
        engine.placeBet(currentBet, MultiplierHolder);
        MultiplierHolder /= 100;
        /*if((bankroll - currentBet) < 0){
            console.log('Insufficient Balance');
            engine.stop();
        }*/
        bankroll -= currentBet;
        console.log("Betting " + currentBet / 100 + " bits this game.");
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
        console.log("Cooldown for the next " + cooldown + " games...");
        isBettingNow = false;
    }
});
engine.on('game_started', function(data) {
    console.log('Game Started.');
    console.log('Bet Array : ' + currentStreakBets);
});

engine.on('game_crash', function(data) {
    gameArray.unshift(data.game_crash/100);
    if(data.game_crash/100 < ActivationNumber && isBettingNow != true && Activation > 0){
        activationcount++;
        console.log('Bust : ' + data.game_crash/100 + 'Activation Threshhold : ' + ActivationNumber);
        console.log('Activation ' + activationcount + ' of ' + Activation);
        Bettable = false;
        activationcheck = true;
    }else if(activationcount <= Activation && data.game_crash/100 >= ActivationNumber && isBettingNow != true && Activation > 0){
        console.log('Activation Reset');
        activationcount = 0;
        activationcheck = true;
    }
    if(activationcount >= Activation && isBettingNow != true && Activation > 0){
        console.log('Activation Satisfied.Bettable');
        Bettable = true;
        activationcount = 0;
        activationcheck = false;
    }
    if (isBettingNow) {
        if (data.game_crash/100 < MultiplierHolder){
            //Lost
            console.log('Lost...');
            var ProfitCalculator = engine.getBalance;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance)/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
            if(addedroundholder > 0){
                currentStreakBets = [];
                addedroundholder -= 1;
                console.log("Round Added.Remaining : " + addedroundholder);
            }
            if(currentStreakBets.length >= 3){
                console.log('Multi changed to 3');
                MultiplierHolder = 3; //3
            }
            if(currentStreakBets.length%10 == 0 || currentStreakBets.length%10 == 1 || currentStreakBets.length%10 == 2){
                lowmultifollow = true;
            }else{
                lowmultifollow = false;
            }
            if(currentStreakBets.length > 5 && lowmultifollow != false){
                console.log('Multi changed to 2.8');
                MultiplierHolder = (2.8);  //2.8
            }
            if (currentStreakBets.length > 1) {
                currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
                if(currentStreakBets.length >= (Firstpoint-1) && Firstlayer != false){
                    console.log("Entered FirstPoint");
                    if(currentstreakupfirst.length > 1){
                        console.log("Started UpPoint Calculation");
                        firstup = currentstreakupfirst[currentstreakupfirst.length - 1] + currentstreakupfirst[currentstreakupfirst.length - 2];
                    }
                    console.log("First Upamount : " + firstup);
                    currentBet += firstup;
                    currentstreakupfirst.push(firstup);
                    console.log("First Array : " + currentstreakupfirst);
                    console.log("New Bet : " + currentBet);
                }
                if(currentStreakBets.length >= (Secondpoint-1) && Secondlayer != false){
                    console.log("Entered SecondPoint");
                    if(currentstreakupsecond.length > 1){
                        console.log("Started UpPoint Calculation");
                        secondup = currentstreakupsecond[currentstreakupsecond.length - 1] + currentstreakupsecond[currentstreakupsecond.length - 2];
                    }
                    console.log("Second Upamount : " + secondup);
                    currentBet += secondup;
                    currentstreakupsecond.push(secondup);
                    console.log("Second Array : " + currentstreakupsecond);
                    console.log("New Bet : " + currentBet);
                }
                if(currentStreakBets.length >= (Thirdpoint-1) && Thirdlayer != false){
                    console.log("Entered ThirdPoint");
                    if(currentstreakupthird.length > 1){
                        console.log("Started UpPoint Calculation");
                        thirdup = currentstreakupthird[currentstreakupthird.length - 1] + currentstreakupthird[currentstreakupthird.length - 2];
                    }
                    console.log("Third Upamount : " + thirdup);
                    currentBet += thirdup;
                    currentstreakupthird.push(thirdup);
                    console.log("Third Array : " + currentstreakupthird);
                    console.log("New Bet : " + currentBet);
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
            console.log("Betted Main : " + betted1);
            console.log("Betted Main : " + betted2);
            console.log("Betted Main : " + betted3);
            console.log("Betted Main : " + betted4);
            betted += maxgain;
            console.log("BetSum : " + betted + " , Constant Gain : " + maxgain);
            console.log("Multiplier : " + MultiplierHolder);
            constbet = betted/(MultiplierHolder - 1);   ///(MultiplierHolder - 1 )
            console.log("Current Bet without Round : " + constbet);
            constbet /= 100;
            constbet = Math.round(constbet);
            constbet *= 100;
            console.log("ConstBet : " + constbet);
            if(constbet < currentBet && currentStreakBets.length >= constpoint){
                gainhold = true;
                console.log("Entered Constant Point");
                currentBet = constbet;
                console.log("Current Bet : " + currentBet);
            }
            // Sim
            /*if(currentStreakBets.length > 37){
                MultiplierHolder = 3;
            }*/
            //
        } else {
            //Won
            console.log('Won!');
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
            bankroll += (currentBet*MultiplierHolder);
            currentBet = baseBet;
            numberOf3xCashedOut++;
            activationcount = 0;
            cooldown = 0;
            addedroundholder = roundadder;
            MultiplierHolder = 4; //4
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
            ProfitCalculator = engine.getBalance();
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance )/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
        }
    } else {
        if (cooldown > 0) {
            console.log("Decrementing cooldown...");
            cooldown--;
        }
    }
    
    if((BalanceCheckpoint+5000) < ProfitCalculator){
        BalanceCheckpoint += 5000;
        console.log("50+ upped.New Checkpoint : " + BalanceCheckpoint);
        //cooldown = 20;
    }

    if((StartingBalance-stoploss) > ProfitCalculator){
        console.log("StopLoss deficit");
        console.log(ProfitCalculator);
        engine.stop();
    }

    if(currentBet > maxbet){
        console.log("MaxBet deficit");
        console.log(BalanceCheckpoint);
        engine.stop();
    }

    if((StartingBalance+wingoal) < ProfitCalculator){
        console.log("Win Goal reached");
        console.log(ProfitCalculator);
        engine.stop();
        }
    else{
        console.log("No need for profit check.");
    }
    console.log('END GAME');
    
});
