var bankroll = 1550000;
var maxbet = 560000;
var Stoploss = 1550000;
var baseBet = 100;
var Activation = 0;
var ActivationNumber = 3;
var ActiDrop = 0;
var constpoint = 15;
var maxgain = 100;
var MultiplierHolder = 3; //4
var cooldown = 0;
var gainhold = false;
var normalplay = false;
var Firstlayer = false;
var Firstpoint = 3;
var firstup = 100;
var Secondlayer = false;
var Secondpoint = 14;
var secondup = 100;
var Thirdlayer = false;
var Thirdpoint = 18;
var thirdup = 100;
var activationenable = true;
var activationcheck = false; // true for checking 
var cooldownenable = true;
var isBettingNow = false;
var lowmultifollow = false;
var Bettable = true;
var dropper = false;
var betbased = false;
var passer = false;
var lowmedacti = false;
var numberOf3xCashedOut = 0;
const StartingBalance = engine.getBalance();
var BalanceCheckpoint = StartingBalance;
var ProfitCalculator = engine.getBalance();
var userProfit = 0;
var medianbig = 0;
var medianmid = 0;
var medianlow = 0;
var longtraincounter = 0;
var longtrainactivator = false;
var trainseen = 0;
var traincheck = 0;
var upgamecount = 50;
var gamecounter = 0;
var activationcount = 0;
var risecount = 0;
var activationholder = Activation;
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
var betholder = [];
var baseBetholder = baseBet;
var gameArray = [];
var currentBet = baseBet;
console.log('FIRST LAUNCH | WELCOME!');

engine.on('game_starting', function (info) {
    ProfitCalculator = engine.getBalance();
    gamecounter++;
    traincheck = gamecounter;
    gameArray.length = Math.min(gamecounter, 100);
    console.log('');
    console.log('NEW GAME');
    console.log('Sim Bankroll : ' + bankroll/100);
    console.log('Profit since starting the script: ' + userProfit + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
    if (cooldown < 1 && Bettable != false && activationcheck != true) {
        /*MultiplierHolder *= 100;
        engine.placeBet(currentBet, MultiplierHolder);
        MultiplierHolder /= 100;*/
        if((bankroll - currentBet) < 0){
            console.log('Insufficient Balance');
            engine.stop();
        }
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
        if(lowmedacti != false){
        if(currentStreakBets.length == 3 || currentStreakBets.length == 5 || currentStreakBets.length == 12){
            currentStreakBets.pop();
            currentStreakBets.unshift(currentBet);
        }
    }
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
    cooldownenable = true;
    if(data.game_crash/100 < ActivationNumber && isBettingNow != true && activationenable != false){
        activationcount++;
        console.log('Bust : ' + data.game_crash/100 + 'Activation Threshhold : ' + ActivationNumber);
        console.log('Activation ' + activationcount + ' of ' + Activation);
        Bettable = false;
        activationcheck = true;
    }else if(activationcount <= Activation && data.game_crash/100 >= ActivationNumber && isBettingNow != true && activationenable != false){
        console.log('Activation Reset');
        activationcount = 0;
        activationcheck = true;
    }
    if(activationcount >= Activation && isBettingNow != true && activationenable != false){
        console.log('Activation Satisfied.Bettable');
        Bettable = true;
        activationcheck = false;
    }
    console.log('Game Array Length :' + gameArray.length);
    console.log('Median 50 : ' + engine.median(50));
    if(gamecounter>99){
    if(engine.median(50) <= medianmid && engine.median(25) <= medianlow){
        Activation = activationholder;
        risecount = 0;
        console.log('Median is lowering.Resetting activation');
        baseBet = baseBetholder;
    }
    if((engine.median(100) >= medianbig && engine.median(50) >= medianmid && engine.median(25) >= medianlow)){
        Activation = 0;
        risecount++;                            ///////Rising Activation 19 train happened.Blew Up first because of it.Tighthen the requirements to activate it.
        lowmedacti = false;
        if(risecount>100){
            lowmedacti = true;
            Activaton = activationholder;
        } /// Safety.Playing with the number might give different results
        console.log('Median is rising');
    }
    if(engine.median(100) > 1.94 &&  engine.median(50) > 1.91 && dropper != true && engine.median(25) > 1.9 ){
        if((Activation) >= 7){
            Activation -= (ActiDrop-3);
        }
        Activation = activationholder;
        baseBet = baseBetholder;
        dropper = true;
        lowmedacti = true;
        console.log('High Median Activation dropped for 1 chase');
    }
    if(engine.median(100) > 1.98 || engine.median(50) >= 2.05 ){  //|| engine.median(25) >= 2.10
        if((Activation) >= 7){
            Activation -= (ActiDrop-2);
            }
        Activation = activationholder;
        Activation += 2;
        lowmedacti = true;
        dropper = true;
        baseBet = baseBetholder;
        console.log('High Median Activation dropped for 1 chase');
    }
}
    if(gameArray.length > 99 && gamecounter%7 == 6){
        medianbig = engine.median(100);
    }
    if(gameArray.length > 24 && gamecounter%6 == 5){
        medianmid = engine.median(50);
    }
    if(gameArray.length > 24 && gamecounter%5 == 4){
        medianlow = engine.median(25);
    }
    if (isBettingNow) {
        if (data.game_crash/100 < MultiplierHolder){
            //Lost
            if(normalplay != false){
                lowmedacti = false;
                constpoint = 19;
            }
            console.log('Lost...');
            var ProfitCalculator = engine.getBalance;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance)/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
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
            constbet = betted/(MultiplierHolder-1);   ///(MultiplierHolder - 1 )
            console.log("Current Bet without Round : " + constbet);
            constbet /= 100;
            constbet = Math.round(constbet);
            constbet *= 100;
            console.log("ConstBet : " + constbet);
            console.log("Current Bet : " + currentBet + " Streak length : " + currentStreakBets.length + " Constant Point : " + constpoint);
            if(constbet < currentBet && currentStreakBets.length >= constpoint){
                gainhold = true;
                console.log("Entered Constant Point");
                currentBet = constbet;
                console.log("Current Bet : " + currentBet);
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
            if(currentStreakBets.length>=16){
                console.log("Long train happened.All securities enabled for 1.8k games(~15 hours).");
                if(longtrainactivator!=true){trainseen++;}
                longtrainactivator = true;
                longtraincounter = gamecounter;
                if(upgamecount<50){
                    baseBetholder-=100;
                    upgamecount=50;
                }
            }
            if(longtraincounter > 0 && (longtraincounter+1800)<gamecounter){
                longtrainactivator = false;
                trainseen = 0;
            }
            if(longtrainactivator != false){
                lowmedacti = true;
            }
            if(gamecounter > (traincheck+2875) && trainseen<1 && upgamecount > 1){
                console.log("No train seen for a long time.Rising basebet for 50 games.");
                if(upgamecount>=50){lowmedacti=false;}
                upgamecount--;
                if(upgamecount<=1){lowmedacti=true;}
            }else{
                upgamecount = 50;
            }
            // Sim
            /*if(currentStreakBets.length <= 40){
                MultiplierHolder = 9999;
                lowmedacti = true;
                console.log("//////////// Testing");
                if (currentStreakBets.length < 8 && currentStreakBets.length>1) {
                    currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
                }
            }*/
            //
            betbased = false;
            if(lowmedacti != false){
            if(currentStreakBets.length == 2 ){
                betholder.push(currentBet);
                currentBet = baseBet;
                currentBet /= 100;
                currentBet = Math.round(currentBet);
                currentBet *= 100;
                console.log("Bet Based");
                betbased = true;
            }else if(currentStreakBets.length == 4){ 
                betholder.push(currentBet);
                currentBet = currentStreakBets[currentStreakBets.length - 2] + currentStreakBets[currentStreakBets.length - 3];
                currentBet /= 100;
                currentBet = Math.round(currentBet);
                currentBet *= 100;
                console.log("Bet Based");
                betbased = true;
            }else if(currentStreakBets.length == 11){             
                betholder.push(currentBet);
                currentBet = currentStreakBets[currentStreakBets.length - 2] + currentStreakBets[currentStreakBets.length - 3];
                currentBet -= 100;
                currentBet /= 100;
                currentBet = Math.round(currentBet);
                currentBet *= 100;
                currentBet -= 100;
                console.log("Bet Based");
                betbased = true;}
            else if(currentStreakBets.length == 12){             
                currentBet += 300;
                currentBet /= 100;
                currentBet = Math.round(currentBet);
                currentBet *= 100;
                console.log("Bet Based");
            }
        }
        } else {
            //Won
            console.log('Won!');
            if(normalplay != false){
                cooldownenable = false;
                constpoint = 19;
            }
            bankroll += (currentBet*MultiplierHolder);
            if((currentStreakBets.length + Activation) > 22){
                console.log("Stopped.Long train.");
                engine.stop();
            }
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
            currentBet = baseBet;
            if(gamecounter>100 && engine.median(100) >= medianbig && engine.median(50) >= medianmid && engine.median(25) >= medianlow && engine.median(100) >= 1.96 && engine.median(50) >= 1.95 && engine.median(25) >= 1.95 && engine.median(100) <= 1.98 && engine.median(50) <= 2.05 && engine.median(25) <= 2.10 && data.game_crash/100 >= 4 && gameArray[1] > 4){
            if(Math.max(...betholder)<8){
            currentBet = Math.max(...betholder);
            currentStreakBets.push(currentBet);
            cooldownenable = false;
            lowmedacti = false;
            Activation = 0;
            console.log("Bet Holder Inserted");
            }else{
                currentBet = baseBet;
                if(Math.max(...betholder)>=8 || betholder.length>5){
                var temp = Math.max(...betholder);
                betholder = [];
                betholder.push(temp/2);
            }}}
            numberOf3xCashedOut++;
            activationcount = 0;
            if(cooldownenable!=false){cooldown = 1;}else{cooldown=0;}
            MultiplierHolder = 3; //4
            currentstreakupfirst = [];
            currentstreakupsecond = [];
            currentstreakupthird = [100];
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
    
    if(BalanceCheckpoint <= ProfitCalculator){
        BalanceCheckpoint = ProfitCalculator;
        console.log("50+ upped.New Checkpoint : " + BalanceCheckpoint);
        //cooldown = 20;
    }

    if(currentBet > maxbet){
        console.log("MaxBet deficit");
        console.log(BalanceCheckpoint);
        engine.stop();
    }

    if((BalanceCheckpoint-Stoploss) > ProfitCalculator){
        console.log("Limit reached");
        console.log(ProfitCalculator);
        engine.stop();
        }

    if((StartingBalance+100000000) < ProfitCalculator){
        console.log("Limit reached");
        console.log(ProfitCalculator);
        engine.stop();
        }
    else{
        console.log("No need for profit check.");
    }
    console.log('END GAME');
    
});

engine.median = function (span) {
	let arr = gameArray.slice(0, (span ? Math.max(1, Math.min(101, span)) : 101)).map(a => a).sort((a, b) => { return a - b ;});
    let mid = arr.length / 2, med = mid % 1 ? arr[mid - 0.5] : (arr[mid - 1] + arr[mid]) / 2;
	return med;
};
