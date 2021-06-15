var bankroll = 14000;
var maxbet = 5000;
var Stoploss = 14000;
var baseBet = 0.4;
var Activation = 5;
var ActivationNumber = 3;
var ActiDrop = 0;
var constpoint = 15;
var maxgain = 20;
var MultiplierHolder = 3; //4
var cooldown = 0;
var gainhold = false;
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
var cooldownenable = true;
var activationcheck = false; // true for checking 
var isBettingNow = false;
var lowmultifollow = false;
var Bettable = true;
var dropper = false;
var betbased = false;
var passer = false;
var lowmedacti = false;
var numberOf3xCashedOut = 0;
const StartingBalance = engine.getBalance;
var BalanceCheckpoint = StartingBalance;
var ProfitCalculator = engine.getBalance;
var userProfit = 0;
var medianchecker = 0;
var medianbig = 0;
var medianmid = 0;
var medianlow = 0;
var longtraincounter = 0;
var longtrainactivator = false;
var trainseen = 0;
var traincheck = 0;
var upgamecount = 500;
var gamecounter = 0;
var activationcount = 0;
var risecount = 0;
var activationholder = Activation;
var currentStreakBets = [];
var currentstreakupfirst = [];
var currentstreakupsecond = [];
var currentstreakupthird = [1];
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

engine.on('game_ready', async () => {
    if(gamecounter%100 == 50){console.clear();}
    ProfitCalculator = engine.getBalance;
    console.log('//////////////////////////////////////////');
    gamecounter++;
    traincheck = gamecounter;
    gameArray.length = Math.min(gamecounter, 100);
    console.log('NEW GAME');
    console.log('Game Counter :' + gamecounter);
    console.log('Sim Bankroll : ' + bankroll);
    console.log('Profit since starting the script: ' + userProfit + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
    if (cooldown < 1 && Bettable != false && activationcheck != true) {
        const round_result = await engine.placeBet(currentBet, MultiplierHolder);
        //const round_result = await engine.skip();
        result = round_result.crash;
        console.log(result);
        if((bankroll - currentBet) < 0){
            console.log('Insufficient Balance');
            engine.stop();
        }
        bankroll -= currentBet;
        console.log("Betting " + currentBet + " bits this game.");
        console.log("Round Count : " + currentStreakBets.length);
        console.log("Bet Holder : " + betholder);
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
        console.log("Bettable : " + Bettable + " activationcheck : " + activationcheck);
        const round_result = await engine.skip();
        result = round_result.crash;
        console.log(result);
        isBettingNow = false;
    }
    gameArray.unshift(result);
    if(result < ActivationNumber && isBettingNow != true && activationenable != false){
        activationcount++;
        console.log('Bust : ' + result + 'Activation Threshhold : ' + ActivationNumber);
        console.log('Activation ' + activationcount + ' of ' + Activation);
        Bettable = false;
        activationcheck = true;
    }else if(activationcount <= Activation && result >= ActivationNumber && isBettingNow != true && activationenable != false){
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
    cooldownenable = true;
    lowmedacti = true;
        medianchecker++;
        if(gamecounter>99){
            if(medianchecker >= 2 && engine.median(100) > 2.05 &&  engine.median(50) >= 2.15 && dropper != true && engine.median(25) >= 2.25){
                if((Activation) >= 7){
                    Activation -= (ActiDrop-2);
                    }
                Activation = activationholder;
                Activation += 2;
                medianchecker = 0;
                lowmedacti = true;
                dropper = true;
                baseBet = baseBetholder;
                console.log('High Median Activation dropped for 1 chase');
            }
            if(engine.median(100) <= 1.94 || engine.median(50) < 1.92 || engine.median(25) < 1.85){
                Activation = activationholder;
                Activation += 1;
                lowmedacti = true;
                console.log('Median lowered.Resetting activation');
                baseBet = 0.01;
            }
            if(engine.median(100) < medianbig || engine.median(50) < medianmid || engine.median(25) < medianlow){
                Activation = activationholder;
                Activation += 2;
                console.log('Median is lowering.Resetting activation');
                lowmedacti = true;
                if(baseBet>=baseBetholder){baseBet = baseBetholder;}
            }
            if(engine.median(100) >= medianbig && engine.median(50) >= medianmid && engine.median(25) >= medianlow && engine.median(100) >= 1.96 && engine.median(50) > 1.95 && engine.median(25) > 1.95){
                Activation = 0;
                baseBet = baseBetholder*2;     
                risecount++;
                cooldownenable = true;
                lowmedacti = true;
                if(risecount>25){
                    cooldownenable = true;
                    lowmedacti = true;
                    baseBet = baseBetholder;
                    Activaton = activationholder;
                } /// Safety.Playing with the number might give different results
                console.log('Median is rising');
            }
            console.log("MedBig : " + medianbig + " MedMid : " + medianmid + " MedLow : " + medianlow);
            console.log("Median Big : " + engine.median(100) + " Median Mid : " + engine.median(50) + " Median Low : " + engine.median(25));
        }
        if(gameArray.length > 99 && gamecounter%7 == 6){
            medianbig = engine.median(100);
        }
        if(gameArray.length > 49 && gamecounter%6 == 5){
            medianmid = engine.median(50);
        }
        if(gameArray.length > 24 && gamecounter%5 == 4){
            medianlow = engine.median(25);
        }
    if (isBettingNow) {
        if (result < MultiplierHolder){
            //Lost
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
            betted = betted1 + betted2 + betted3 + betted4;
            console.log("Betted Main : " + betted1);
            console.log("Betted Main : " + betted2);
            console.log("Betted Main : " + betted3);
            console.log("Betted Main : " + betted4);
            betted += maxgain;
            console.log("BetSum : " + betted + " , Constant Gain : " + maxgain);
            console.log("Multiplier : " + MultiplierHolder);
            constbet = betted/(MultiplierHolder - 1 );   ///(MultiplierHolder - 1 )
            console.log("Current Bet without Round : " + constbet);
            constbet *= 100;
            constbet = Math.round(constbet);
            constbet /= 100;
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
            if(currentStreakBets.length>18){
                console.log("Long train happened.All securities enabled for 1.8k games(~15 hours).");
                if(longtrainactivator!=true){trainseen++;}
                longtrainactivator = true;
                longtraincounter = gamecounter;
            }
            if(longtraincounter > 0 && (gamecounter+1800)>longtraincounter){
                longtrainactivator = false;
                trainseen = 0;
            }
            if(longtrainactivator != false){
                lowmedacti = true;
            }
            if(gamecounter > (traincheck+2875) && trainseen<1 && upgamecount > 1){
                console.log("No train seen for a long time.Rising basebet for 500 games.");
                if(upgamecount>=500){baseBetholder+=1;}
                upgamecount--;
                if(upgamecount<10){baseBetholder-=1;}
            }else{
                upgamecount = 500;
            }
            betbased = false;
            if(lowmedacti != false){
            if(currentStreakBets.length == 2 || currentStreakBets.length == 4){
                betholder.push(currentBet);
                currentBet = baseBet;
                console.log("Bet Based");
                betbased = true;
            }
        }
            if(currentStreakBets.length >= 25){
                var ProfitCalculator = bankroll;
                var betcalc = BalanceCheckpoint - ProfitCalculator;
                betcalc -= 100;
                MultiplierHolder -= 0.4;
                currentBet = betcalc/2;
    }
            // Sim
            /*if(currentStreakBets.length <= 25){
                MultiplierHolder = 9999;
                console.log("//////////// Simulating 30X");
                lowmedacti = true;
            }*/
            //
        } else {
            //Won
            console.log('Won!');
            dropper = false;
            bankroll += (currentBet*MultiplierHolder);
            if(currentStreakBets.length + Activation > 26){
                console.log("Stopped.Long train.Hash Reset");
                engine.stop();
            }
            if(gamecounter>2400){
                console.log("Day Passed");
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
            if(betbased != false ){
                if(gamecounter>100 && engine.median(100) >= medianbig && engine.median(50) >= medianmid && engine.median(25) >= medianlow && engine.median(100) >= 1.96 && engine.median(50) > 1.95 && engine.median(25) > 1.95 && result >= 4 && gameArray[1] > 4){
                    if(Math.max(...betholder)<10){
                    currentBet = Math.max(...betholder);
                    currentStreakBets.push(currentBet);
                    cooldownenable = false;
                    lowmedacti = false;
                    Activation = 0;
                    console.log("Bet Holder Inserted");
                    }
                }else{
                    currentBet = baseBet;
                }
            }else{
                betholder = [];
            }
            numberOf3xCashedOut++;
            activationcount = 0;
            if(cooldownenable!=false){cooldown = 1;}else{cooldown=0;}
            MultiplierHolder = 3; //4
            currentstreakupfirst = [];
            currentstreakupsecond = [];
            currentstreakupthird = [1];
            firstup = 1;
            secondup = 1;
            thirdup = 1;
            betted = 0;
            betted4 = 0;
            betted3 = 0;
            betted2 = 0;
            betted1 = 0;
            constbet = 0;
            gainhold = false;
            ProfitCalculator = engine.getBalance;
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
    
    if((BalanceCheckpoint+5) < ProfitCalculator){
        BalanceCheckpoint += 5;
        console.log("50+ upped.New Checkpoint : " + BalanceCheckpoint);
        //cooldown = 20;
    }

    if(currentBet > maxbet){
        console.log("MaxBet deficit");
        console.log(BalanceCheckpoint);
        engine.stop();
    }

    if((StartingBalance-Stoploss) > ProfitCalculator){
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
	let arr = gameArray.slice(0, (span ? Math.max(1, Math.min(101, span)) : 101)).map(a => a).sort((a, b) => { return a - b });
  let mid = arr.length / 2, med = mid % 1 ? arr[mid - 0.5] : (arr[mid - 1] + arr[mid]) / 2;
	return med;
};