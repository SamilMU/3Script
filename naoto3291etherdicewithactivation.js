var bankroll = 11000;
var maxbet = 11000;
var stoploss = 450000;
var wingoal = 450000;
var baseBet = 0.01;
var Activation = 3;
var ActivationNumber = 3;
var constpoint = 20;
var maxgain = 0;
var roundadder = 0;
var MultiplierHolder = 9999; //4
var cooldown = 0;
var gainhold = false;
var Firstlayer = false;
var Firstpoint = 3;
var firstup = 100;
var Secondlayer = false;
var Secondpoint = 6;
var secondup = 100;
var Thirdlayer = false;
var Thirdpoint = 10;
var thirdup = 100;
var activationcheck = true; // true for checking 
var isBettingNow = false;
var lowmultifollow = false;
var Bettable = true;
var medianup = false;
var betcheck = false;
var woncheck = false;
var betholder = baseBet;
/*maxgain = maxgain*100;
maxbet = maxbet*100;
baseBet = (baseBet*100);
stoploss = stoploss*100;
wingoal = wingoal*100;*/
Firstpoint = (Firstpoint - 1);
var numberOf3xCashedOut = 0;
const StartingBalance = engine.getBalance;
var BalanceCheckpoint = StartingBalance;
var ProfitCalculator = engine.getBalance;
var userProfit = 0;
var medianchecker = 0;
var gamecounter = 0;
var activationcount = 0;
var activationholder = 0;
var addedroundholder = roundadder;
var currentStreakBets = [];
var currentstreakupfirst = [];
var currentstreakupsecond = [];
var currentstreakupthird = [];
currentstreakupthird.push(0.01);
var betted1 = 0;
var betted2 = 0;
var betted3 = 0;
var betted4 = 0;
var betted = 0;
var constbet = 0;
var gameArray = [];
var streakcounter = 0;
var greenstreak = 0;
var streakholder = [];
var difference = 0;
var differenceholder = [];
var currentBet = baseBet;
console.log('FIRST LAUNCH | WELCOME!');

engine.on('game_ready', async () => {
    console.clear();
    ProfitCalculator = engine.getBalance;
    gamecounter++;
    gameArray.length = Math.min(gamecounter, 100);
    console.log('');
    console.log('NEW GAME');
    console.log("Max Gain : " + maxgain);
    console.log('Sim Bankroll : ' + bankroll);
    console.log('Profit since starting the script: ' + userProfit + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
    if (cooldown < 1 && Bettable != false && activationcheck != true) {
        //const round_result = await engine.placeBet(currentBet, MultiplierHolder);
        const round_result = await engine.skip();
        result = round_result.crash;
        console.log(result);
        /*MultiplierHolder *= 100;
        engine.placeBet(currentBet, MultiplierHolder);
        MultiplierHolder /= 100;*/
        if((bankroll - currentBet) < 0){
            console.log('Insufficient Balance');
            engine.stop();
        }
        bankroll -= currentBet;
        console.log("Betting " + currentBet + " bits this game.");
        console.log("Bet Streak : " + currentStreakBets);
        console.log("Bet Streak Length : " + currentStreakBets.length);
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
        console.log("Bettable : " + Bettable + " activationcheck : " + activationcheck);
        const round_result = await engine.skip();
        result = round_result.crash;
        console.log(result);
        isBettingNow = false;
    }
    gameArray.unshift(result);
    if(result < 3){
        streakcounter++;
        console.log("Current Train : " + streakcounter);
        console.log("Previous Trains : " + streakholder);
        console.log("Differences : " + differenceholder);
        console.log("Difference Till last long train : " + (gamecounter-difference));
    }else{
        if(streakcounter > 15){
            if(difference > 0){
            differenceholder.unshift(difference);
            }
            difference = gamecounter;
            streakholder.unshift(streakcounter);
        }
        if(streakcounter > 30){
            console.log("30+ Streak");
            engine.stop();
        }
        streakcounter = 0;
    }
    console.log("100 median : " + engine.median(100));
    console.log("50 median : " + engine.median(50));
    console.log("25 median : " + engine.median(25));
    // For now, try a range, later try out only playing in green and increasing medians.
    if(engine.median(100) > 1.96 && engine.median(100) < 2.11 && gameArray.length>100){
        if(engine.median(50) > 1.90 && engine.median(50) < 2.1){
            if(engine.median(25) > 1.80 && engine.median(25) < 2.1){
                medianup = true;
                console.log("Median Hit.Increasing Bet");
            }
        }
    }else{
        // 6 9 12 18 24
        if(currentStreakBets.length == 5 || currentStreakBets.length == 8 || currentStreakBets.length == 11 || currentStreakBets.length == 17 || currentStreakBets.length == 23){
            currentBet = baseBet;
            console.log("Bet round added.Net Profit : " + (betted-(currentBet*3)))
        }
        medianup = false;
    }
    if(result < ActivationNumber && isBettingNow != true && Activation > 0){
        activationcount++;
        console.log('Bust : ' + result + 'Activation Threshhold : ' + ActivationNumber);
        console.log('Activation ' + activationcount + ' of ' + Activation);
        Bettable = false;
        activationcheck = true;
    }else if(activationcount <= Activation && result >= ActivationNumber && isBettingNow != true && Activation > 0){
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
    if(result >= 3){
        greenstreak++;
        console.log("Green Streak : " + greenstreak);
    }else{
        greenstreak = 0;
    }
    console.log("Betcheck : " + betcheck);
    if (isBettingNow) {
        if (result < MultiplierHolder){
            //Lost
            console.log('Lost...');
            var ProfitCalculator = engine.getBalance;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance);
            }else{
                userProfit = -(StartingBalance - ProfitCalculator);
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
            betted = betted1 + betted2 + betted3 + betted4 - currentstreakupthird[0];
            console.log("Betted Main : " + betted1);
            console.log("Betted 1 : " + betted2);
            console.log("Betted 2 : " + betted3);
            console.log("Betted 3 : " + betted4);
            betted += maxgain;
            console.log("BetSum : " + betted + " , Constant Gain : " + maxgain);
            console.log("Multiplier : " + MultiplierHolder);
            betted *= 100;
            betted = Math.round(betted);
            constbet = betted/(MultiplierHolder - 1);   ///(MultiplierHolder - 1)
            betted /= 100;
            console.log("Current Bet without Round : " + constbet);
            constbet /= 100;
            constbet = Math.round(constbet);
            console.log("ConstBet : " + constbet);
            if(constbet < currentBet && currentStreakBets.length >= constpoint){
                gainhold = true;
                console.log("Entered Constant Point");
                currentBet = constbet;
                console.log("Current Bet : " + currentBet);
            }
            if(currentStreakBets.length > 29){
                console.log("30 Streak.Breaking");
                currentStreakBets = [];
                currentBet = baseBet;
                engine.stop();
            }
            if (currentStreakBets.length > 1) {
                currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
            }
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
            if(currentStreakBets.length > 14 ){
                if(betcheck != true){
                    betcheck = true;
                    betholder = currentBet;
                    console.log("Got the bet : " + betholder);
                }
                currentBet = baseBet;
                MultiplierHolder = 3;
            }
            // Sim
            /*if(currentStreakBets.length > 37){
                MultiplierHolder = 3;
            }*/
            //
        } else {
            //Won
            console.log('Won!');
            if((currentStreakBets.length + Activation) > 30){
            console.log("30+ Red streak.Change Seed");
            engine.stop();
            }
            currentStreakBets = [];
            if(result >= MultiplierHolder && Activation > 0){
                activationcheck = true;
            }
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
            if(medianup != false){
                baseBet = 1;
            }else{
                baseBet = 0.01;
            }
            currentBet = baseBet;
            if(betcheck != false && result >= 4 && greenstreak > 1){
                betcheck = false;
                currentBet = betholder;
                currentStreakBets.push(currentBet);
                activationcheck = false;
                console.log("Betholder is true.New Bet : " + betholder);
            }
            numberOf3xCashedOut++;
            activationcount = 0;
            cooldown = 0;
            addedroundholder = roundadder;
            MultiplierHolder = 4; //4
            currentstreakupfirst = [];
            currentstreakupsecond = [];
            currentstreakupthird = [];
            firstup = 0.01;
            secondup = 0.01;
            thirdup = 0.01;
            betted = 0;
            betted4 = 0;
            betted3 = 0;
            betted2 = 0;
            betted1 = 0;
            constbet = 0;
            gainhold = false;
            ProfitCalculator = engine.getBalance;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance );
            }else{
                userProfit = -(StartingBalance - ProfitCalculator);
            }
        }
    } else {
        if(betcheck != false && result >= 4 && greenstreak > 1){
            currentBet = betholder;
            currentStreakBets.push(currentBet);
            activationcheck = false;
            Bettable = true;
            console.log("Betholder is true.New Bet : " + betholder);
        }
        if (cooldown > 0) {
            console.log("Decrementing cooldown...");
            cooldown--;
        }
    }
    
    if((BalanceCheckpoint+50) < ProfitCalculator){
        BalanceCheckpoint += 50;
        console.log("50+ upped.New Checkpoint : " + BalanceCheckpoint);
        //cooldown = 20;
    }
    
    if((StartingBalance-stoploss) > ProfitCalculator){
        console.log("Stop Loss reached");
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

engine.median = function (span) {
	let arr = gameArray.slice(0, (span ? Math.max(1, Math.min(101, span)) : 101)).map(a => a).sort((a, b) => { return a - b });
  let mid = arr.length / 2, med = mid % 1 ? arr[mid - 0.5] : (arr[mid - 1] + arr[mid]) / 2;
	return med;
};