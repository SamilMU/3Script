var bankroll = 150000;
var maxbet = 1800000;
var stoploss = 14000;
var baseBet = 1;
var MultiplierHolder = 3; //4
var cooldown = 0;
var isBettingNow = false;
var Bettable = true;
var multidropamount = 0.5;
var numberOf3xCashedOut = 0;
const StartingBalance = bankroll;
var BalanceCheckpoint = StartingBalance;
var ProfitCalculator = bankroll;
var userProfit = 0;
var gamecounter = 0;
var currentStreakBets = [];
var gameArray = [];
var gamecounter = 0;
var streakcounter = 0;
var streakholder = [];
var difference = 0;
var differenceholder = [];
var currentBet = baseBet;
var betholder = currentBet;
var constbet = 0;

console.log('FIRST LAUNCH | WELCOME!');

engine.on('game_ready', async () => {
    ProfitCalculator = bankroll;
    gamecounter++;
    gameArray.length = Math.min(gamecounter, 100);
    console.log('');
    console.log('NEW GAME');
    console.log('Sim Bankroll : ' + bankroll);
    console.log('BR : ' + ProfitCalculator);
    if (cooldown < 1 && Bettable != false) {
        const round_result = await engine.placeBet(currentBet, MultiplierHolder);
        //const round_result = await engine.skip();
        result = round_result.crash;
        console.log(result);
        /*MultiplierHolder *= 100;
        engine.placeBet(currentBet, MultiplierHolder);
        MultiplierHolder /= 100;*/
        bankroll -= currentBet;
        console.log("Betting " + currentBet + " bits this game.");
        currentStreakBets.push(currentBet);
        console.log("Bet Streak : " + currentStreakBets);
        console.log("Bet Streak Length : " + currentStreakBets.length);
        var sum = currentStreakBets.reduce(function(a, b) { return a + b; }, 0);
        console.log("Bet Sum : " + sum);
        console.log("Net Profit if won : " + ((currentBet*MultiplierHolder)-sum));
        isBettingNow = true;
        multidropamount = 0.5;
    } else {
        const round_result = await engine.skip();
        result = round_result.crash;
        console.log(result);
        console.log("Bettable : " + Bettable);
        console.log("Cooldown for the next " + cooldown + " games...");
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
        difference = gamecounter;
        streakholder.unshift(streakcounter);
        if(difference > 0){
        differenceholder.unshift(difference);
        }
    }
    if(streakcounter > 30){
        console.log("30+ Streak");
    }
    streakcounter = 0;
}
console.log('Game Array Length :' + gameArray.length);
    if (isBettingNow) {        
        if (result < MultiplierHolder){ //MultiplierHolder
            //Lost
            console.log('Lost...');
            var ProfitCalculator = bankroll;
            var betcalc = BalanceCheckpoint - ProfitCalculator;
            currentBet = betcalc/2;
            //
        } else {
            //Won
            console.log('Won!');
            currentStreakBets = [];
            bankroll += (currentBet*MultiplierHolder);
            currentBet = baseBet;
            betholder = currentBet;
            numberOf3xCashedOut++;
            cooldown = 0;
            MultiplierHolder = 3; //4
            ProfitCalculator = bankroll;
        }
    } else {
        if (cooldown > 0) {
            console.log("Decrementing cooldown...");
            cooldown--;
        }
    }
    
    /*
    if(bankroll<0){
        console.log("Crashed");
        engine.stop();
    }
    */
    ProfitCalculator = bankroll;
    if(BalanceCheckpoint < ProfitCalculator){
        BalanceCheckpoint = ProfitCalculator;
        console.log("Upped.New Checkpoint : " + BalanceCheckpoint);
    }

    if(currentBet > maxbet){
        console.log("MaxBet deficit");
        console.log(BalanceCheckpoint);
        engine.stop();
    }
    
    if((BalanceCheckpoint-stoploss) > ProfitCalculator){
        console.log("Stoploss reached");
        console.log(ProfitCalculator);
        engine.stop();
        }

    if((BalanceCheckpoint+100000000) < ProfitCalculator){
        console.log("Limit reached");
        console.log(ProfitCalculator);
        engine.stop();
        }
    else{
        console.log("No need for profit check.");
    }
    console.log('END GAME');
    
});

/*engine.median = function (span) {
	let arr = gameArray.slice(0, (span ? Math.max(1, Math.min(101, span)) : 101)).map(a => a).sort((a, b) => { return a - b });
  let mid = arr.length / 2, med = mid % 1 ? arr[mid - 0.5] : (arr[mid - 1] + arr[mid]) / 2;
	return med;
};*/