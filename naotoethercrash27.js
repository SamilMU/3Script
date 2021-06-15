var bankroll = 1000000;
var baseBet = 100;
var roundprofit = 500;
var Activation = 0;
var ActivationNumber = 3;
var ActiDrop = 0;
var Uppoint = 150;
var upamount = 100;
var MultiplierHolder = 3;//4
var cooldown = 0;
var isBettingNow = false;
var activationcheck = false;
var lowmultifollow = false;
var Bettable = true;
var dropper = false;
var numberOf3xCashedOut = 0;
const StartingBalance = engine.getBalance();
var BalanceCheckpoint = StartingBalance;
var userProfit = 0;
var medianchecker = 0;
var gamecounter = 0;
var activationcount = 0;
var activationdropcounter = 0;
var activationholder = 0;
var currentStreakBets = [];
var currentsafebets = [];
var streaksum = 0;
var safepoint = false;
var currentstreakup = [];
var gameArray = [];
var currentBet = baseBet;

console.log('FIRST LAUNCH | WELCOME!');

engine.on('game_starting', function (info) {
    var ProfitCalculator = engine.getBalance();
    console.log('Stop Loss :' + (BalanceCheckpoint - 30000));
    gamecounter++;
    gameArray.length = Math.min(gamecounter, 100);
    console.log('');
    console.log('NEW GAME');
    console.log('Sim Bankroll : ' + bankroll/100);
    console.log('Bets : ' + currentStreakBets);
    console.log('Profit since starting the script: ' + userProfit + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
    if (cooldown < 1 && Bettable != false && activationcheck != true) {
        MultiplierHolder *= 100;
        engine.placeBet(currentBet, MultiplierHolder);
        MultiplierHolder /= 100;
        if((bankroll - currentBet) < 0){
            console.log('Insufficient Balance');
            engine.stop();
        }
        bankroll -= currentBet;
        console.log("Betting " + currentBet / 100 + " bits this game.");
        if(currentstreakup.length > 0){
            currentBet -= upamount;
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
    if(data.game_crash/100 < ActivationNumber && isBettingNow != true){
        activationcount++;
        console.log('Bust : ' + data.game_crash/100 + 'Activation Threshhold : ' + ActivationNumber);
        console.log('Activation ' + activationcount + ' of ' + Activation);
        Bettable = false;
        activationcheck = true;
    }else if(activationcount <= Activation && data.game_crash/100 >= ActivationNumber && isBettingNow != true){
        console.log('Activation Reset');
        activationcount = 0;
        activationcheck = true;
    }
    if(activationcount >= Activation && isBettingNow != true){
        console.log('Activation Satisfied.Bettable');
        Bettable = true;
        activationcheck = false;
    }
    console.log('Game Array Length :' + gameArray.length);
    if(gameArray.length > 50){
        medianchecker++;
        console.log('Median 50 : ' + engine.median(50));
            if(medianchecker >= 0 && engine.median(50) > 1.97 &&  engine.median(50) <= 2 && dropper != true){
                if((activationholder) >= 7){
                activationholder -= (ActiDrop-3);
                }
                medianchecker = 0;
                dropper = true;
                console.log('High Median Activation dropped for 1 chase');
                activationdropcounter = 2;
            }
            if(medianchecker >= 0 && engine.median(50) > 2 &&  engine.median(50) <= 2.1 && dropper != true){
                if((activationholder) >= 7){
                    activationholder -= (ActiDrop-2);
                    }
                medianchecker = 0;
                dropper = true;
                console.log('High Median Activation dropped for 1 chase');
                activationdropcounter = 2;
            }
            if(medianchecker >= 0 && engine.median(50) > 2.1 &&  engine.median(50) <= 2.2 && dropper != true){
                if((activationholder) >= 7){
                    activationholder -= (ActiDrop-1);
                    }
                medianchecker = 0;
                dropper = true;
                console.log('High Median Activation dropped for 1 chase');
                activationdropcounter = 2;
            }
            if(medianchecker >= 0 && engine.median(50) > 2.2 && dropper != true){
                if((activationholder) >= 7){
                    activationholder -= ActiDrop;
                    }
                medianchecker = 0;
                dropper = true;
                console.log('High Median Activation dropped for 1 chase');
                activationdropcounter = 2;
            }
            if(engine.median(50) <= 1.97 ){
                activationholder = Activation;
                console.log('Median lowered.Resetting activation');
            }
        }
    if (isBettingNow) {
        if (data.game_crash/100 < MultiplierHolder){
            //Lost
            console.log('Lost...');
            var ProfitCalculator = engine.getBalance();
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance)/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
            if(currentStreakBets.length >= 3){
                console.log('Multi changed to 3');
                MultiplierHolder = 3;
            }
            if(currentStreakBets.length < 4 && currentStreakBets.length > 1)
            {
                currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
            }else if(currentStreakBets.length >= 4){
                if(currentStreakBets.length == 4 && safepoint != true){
                    console.log('Streak 3 : ' + currentStreakBets);
                    currentStreakBets[2] = 300;
                    safepoint = true;
                }
                streaksum = currentStreakBets.reduce(function(a, b) { return a + b; });
                streaksum = Math.round(streaksum);
                currentBet = streaksum/2;
                currentBet /= 100;
                currentBet = Math.ceil(currentBet);
                currentBet *= 100;
                if(currentStreakBets.length > 17){
                    currentBet += 200;
                }
                console.log('StreakSum : ' + streaksum + " and current bet : " + currentBet);
                console.log("Upper Array : " + currentstreakup);
                if(currentStreakBets.length >= (Uppoint-1)){
                    console.log("Entered UpPoint");
                    if(currentstreakup.length > 1){
                        console.log("Started UpPoint Calculation");
                        upamount = currentstreakup[currentstreakup.length - 1] + currentstreakup[currentstreakup.length - 2];
                    }
                    console.log("Upamount : " + upamount);
                    currentBet += upamount;
                    currentstreakup.push(upamount);
                }
            }
        } else {
            //Won
            console.log('Won!');
            dropper = false;
            currentStreakBets = [];
            bankroll += (currentBet*MultiplierHolder);
            currentBet = baseBet;
            numberOf3xCashedOut++;
            activationcount = 0;
            cooldown = 0;
            MultiplierHolder = 3; //4
            currentstreakup = [];
            upamount = 100;
            safepoint = false;
            streaksum = 0;
            var ProfitCalculator = engine.getBalance();
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
    }else if(ProfitCalculator <= (BalanceCheckpoint-500000)){
        console.log("5000 bit deficit");
        console.log(BalanceCheckpoint);
        engine.stop();
    }else if((StartingBalance+10000) < ProfitCalculator){
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