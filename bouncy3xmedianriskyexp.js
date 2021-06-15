var config = {
    noopExample: { type: 'noop', label: 'Base Bet' },
    baseBet: { value: 100, type: 'balance', label: 'Base bet' },
    RedCount: { value: 3, type: 'text', label: 'Stop after red count'},
    Green: { value: 3, type: 'text', label: 'What counts as green'},
    StopLoss: { value: 1000000, type: 'balance', label: 'Stop-Loss'},
    trainesc: { value: 9, type: 'text', label: 'Red Train Stop Round'},
    StopWon: { value: 1000000, type: 'balance', label: 'Stop-Won'},
    SaveHold: { value: 3, type: 'text', label: 'Recovery Activation'},
    fixedOrRandom: {
        value: 'fixed', type: 'radio', label: 'Fixed or random waiting time',
        options: {
            fixed: { value: 0, type: 'text', label: 'Fixed cooldown' }
        }
    }
}

engine.median = function (span) {
	let arr = engine.history.slice(0, (span ? Math.max(1, Math.min(50, span)) : 50)).map(a => a.bust).sort((a, b) => { return a - b })
    let mid = arr.length / 2, med = mid % 1 ? arr[mid - 0.5] : (arr[mid - 1] + arr[mid]) / 2;
	return med;
};

engine.average = function (spanner) {
	let arr = engine.history.slice(0, (spanner ? Math.max(1, Math.min(50, spanner)) : 50)).map(a => a.bust).sort((a, b) => { return a - b })
    let ave = arr.reduce((a, b) => a + b, 0)/arr.length;
	return ave;
};

engine.redspotter = function (trainspan) {
    let arr = engine.history.slice(0, (trainspan ? Math.max(1, Math.min(50, trainspan)) : 50)).map(a => a.bust);
    return arr;
};


//Check if overlaps, it is gonna fuck it up.

var currentBet = config.baseBet.value;
//var enteredcd = config.fixedOrRandom.options.fixed.value;   Still could be a good strategy
var hundrollcounter = 0;
var highrollcounter = 0;
var betupper = 3;
var hundrolls = [1];
var highrolls = [1];
var eightupper = 0;
var currentRedStreak = 0;
var greenstreak = 0;
var lastgreenstreak = 0;
var solocount = 0;
var aftertrain = false;
var plusprofit = true;
var trainsfound = 0;
var longtrainchecker = false;
var cooldown = 0;//7
var trainlocations = [];
var isBettingNow = false;
var lastgamewin = true;
var numberOf3xCashedOut = 0;
const StartingBalance = userInfo.balance;
var BalanceCheckpoint = StartingBalance;
var MultiplierHolder = config.Green.value;
var userProfit = 0;
var currentStreakBets = [];
var wonbalance = 0;
var lostbalance = 0;
var gamecounter = 0;
var medianchecker = 0;
var lowmedian = 0;
var highmedian = 0;
//Save Slowly and at green streaks
var greenstreakchecker = 0;
var savehold1 = false;
var savehold2 = false;
var savehold3 = false;
//Continue on winning
var greencont = true;
var sum = 0;
var forthcounter = 0;

var forthcountercheck = false;

var previousbet = config.baseBet.value;

log('FIRST LAUNCH | WELCOME!');
engine.bet(currentBet, MultiplierHolder);

engine.on('GAME_STARTING', function () {
//--------------------------Define Elements----------------------------------------------// 
    let allgames = engine.history.toArray();
    var ProfitCalculator = userInfo.balance;
    let gameInfos = engine.history.first();
    var rowcounter = 0;
    var counter = 0;
    medianchecker++;
    var Bettable1 = true;    //was true for the working part.still on trial
    var Bettable2 = true;   //was true for the working part.still on trial
    var Bettable3 = true;   //was true for the working part.still on trial
    log('');
    log('NEW GAME');
    log("Last Game : " + gameInfos.bust);
    log("Won Balance : " + wonbalance/100);
    log("Profit Calc : " + ProfitCalculator/100);
    log(`Last 25 Bust Median : ${engine.median(25)}`);
    log(`Last 50 Bust Median : ${engine.median()}`);
    log('Profit since starting the script: ' + userProfit + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
//--------------------------Ongoing RedTrain Checkpoint----------------------------------------------//    
    if (gameInfos.bust < config.Green.value) {
        currentRedStreak++;
        if(greenstreak == 1){
            solocount++;
        }else if(greenstreak > 1){
            solocount = 0;
        }
        greenstreak = 0;
        aftertrain = false;
    } else {
        currentRedStreak = 0;
    }
    if(gameInfos.bust > config.Green.value){
        greenstreak++;
        lastgreenstreak = greenstreak;
    }
    log("Last Green Streak Length : " + lastgreenstreak);
    log("Solo Green Count : " + solocount);
    if(gameInfos.bust > 3.99){
        aftertrain = true;
        log("Condition 4 has been met.");
        if(forthcounter <= config.RedCount.value+1){
            forthcountercheck = false;
            log("Forth counter was smaller/oreq than 4");
            forthcounter = 0;
        }else if(forthcounter > config.RedCount.value+1){
            log("Forth counter was bigger than 4.Can't Bet");
            //aftertrain = false;
            forthcounter = 0;
            forthcountercheck = true;
        }
    }
    if(gameInfos.bust < 4){
        forthcounter++;
        log("Increased Forth Count");
        log(forthcounter);
    }
//--------------------------RedTrain Checkpoint------------------------------------------------//
    for(var i=0; i < allgames.length; i++){
        if(allgames[i].bust >= 100){
            hundrollcounter += 1;
            hundrolls.push(allgames[i].bust);
        }
        if(allgames[i].bust > 30 && allgames[i].bust < 100){
            highrollcounter += 1;
            highrolls.push(allgames[i].bust);
        }
        //log("Entered for");
        if(allgames[i].bust < 3){
            counter += 1;
            var prev = i-1;
            //log("Found a low bust");
            if(prev != -1 && allgames[prev].bust < 3){
                rowcounter += 1;
                //log("Found 2 low busts in a row");
                if(rowcounter >= 7){
                    longtrainchecker = true;
                    eightupper += 1;
                }
            }   
        }   else if (longtrainchecker != false ){
            log("Found 7 + " + eightupper + " low busts in a row");
            log("Distance to current game = " +  ((i+1) - counter));
            longtrainchecker = false;
            var trlocation = i - counter;
            trainlocations.push(trlocation);
            //log("Trainlocation found : " + trainlocations);
            trainsfound += 1;
            var trainlength = counter;
            eightupper = 0;
            rowcounter = 0;
        } else{
            counter = 0;
            rowcounter = 0;
        }
    }
    for(var x = 0;x < trainlocations.length;x++){
        if(trainlocations[x] > 50 || trainlocations[x] == 0){
            trainlocations.splice(x,1);
        }
    }
//--------------------------Multiplier Drowner Checkpoint----------------------------------------------//

// Calculate the multiplier downer
if (cooldown == 0 || greencont != false) {
    
    if(gamecounter < 1){
        log("Starting round.Betting");
        Bettable1 = true;
        greencont = false;
    }
    else if(aftertrain != false){///check
        Bettable1 = false;
        if(lastgreenstreak > 1 || solocount > 5){
        log("No ongoing redstreak.Entered after 4.");
        Bettable1 = true;
        greencont = false;
    }}
    else if(currentRedStreak > config.RedCount.value){
        log("Not Suitable to Bet.Redcount activated");
        Bettable1 = false;
        greencont = false;
    }/*else if(gameInfos.bust < 1.99){
        Bettable1 = false;
        greencont = false;
    }
    else if(aftertrain != true && forthcountercheck != false){
        Bettable1 = false;
        greencont = false;
        log("AfterTrain is false.Not Betting");
    }else if(forthcounter > 4){
        Bettable1 = false;
        greencont = false;
        log("Forth Counter is bigger than 4.Can't Bet");
    }*/
    if(aftertrain != false && gamecounter >= 1){
            Bettable1 = true;
            log("Continuing Streak until red hits")
            greencont = true;
        }
    
log("Bet Phase 1 : "+ Bettable1);
log("Bet Matrix : " + currentStreakBets);
//--------------------------Average and Median Checkpoint----------------------------------------------//
    if(medianchecker === 3){
        if(engine.median(25) < lowmedian && engine.median(25) < 1.75){
            if(cooldown == 0){
                cooldown = 3;
                }
        }else if(engine.median() < highmedian && engine.median() < 1.85){
            if(cooldown == 0){
                cooldown = 6;
                }
        }
        lowmedian = engine.median(25);
        highmedian = engine.median();
        medianchecker = 0;
    }
    if(engine.median() < 1.8 && engine.median(25) < 1.7 ) 
    {
        log("Medians (25,50) are low.");
        log("Skipping.")
        Bettable2 = false;
    }
    else if(engine.median() < engine.median(25) && engine.median(25) > 1.9 && engine.median() > 1.75) 
    {
        log("Medians (25,50) are getting good.");
        log("Playing.")
        Bettable2 = true;
    }
    /*else if(engine.median() >= 1.70 && engine.median() < 1.90) 
    {   log("Median (1,70+).Multi (2.2).");
        Bettable2 = true;
        MultiplierHolder = (2.2);
}*/
    else if(engine.median() >= 1.9 && engine.median() < 2.10 ) 
    {   log("Median (1,9+).Multi (2.2).");
        Bettable2 = true;
        //MultiplierHolder = (2.2);
        MultiplierHolder = config.Green.value;
}
    else if(engine.median() >= 2.10 && engine.median() < 2.35) 
    {   log("Median (2.10+).");
        Bettable2 = true;
        //MultiplierHolder = (2.2);  //3
        MultiplierHolder = config.Green.value;
}
    else if(engine.median() >= 2.35) 
    {   log("Median (2.35+).")
        Bettable2 = true;
        MultiplierHolder = config.Green.value;
        }
    if(engine.median(25) <= engine.median() && engine.median(25) > 1.80){
        log("25 med low and/or falling");
        config.baseBet.value = previousbet;
        //MultiplierHolder = (2.2);
        MultiplierHolder = config.Green.value;
        Bettable2 = true;
    }
    else if(engine.median(25) > engine.median() && engine.median(25) > 2.00){
        log("25 med rising");
        config.baseBet.value = previousbet;
        MultiplierHolder = config.Green.value;
        Bettable2 = true;
    }
    else if(engine.median(25) > 2.40 && engine.median() > 2.20){
        log("25 and 50 up.");
        config.baseBet.value += 200;
        MultiplierHolder = config.Green.value;
        Bettable2 = true;
        greenstreakchecker++;
        if(greenstreakchecker > 5){
            log("SaveHold Recover Activated");
            if(savehold1 != false){
            currentBet = (saveholder/2);
            saveholder /= 2;
            if(savehold2 != false){
            currentBet = (saveholder2/2);
            saveholder2 /= 2;
            if(savehold3 != false){
            currentBet = (saveholder3/2);
            saveholder3 /= 2;
            }
            }}
            greenstreakchecker = greenstreakchecker - (greenstreakchecker/2);
            if(greenstreakchecker < 3){
                greenstreakchecker = 0;
            }
        }
    }else if(engine.median(25) < 2 && engine.median() > 2){
        if(cooldown == 0){
        cooldown = 3;
        }
        log("25 falling and 50 is up.Waiting 3 after this.");
        config.baseBet.value = previousbet;
        Bettable2 = false;
    }
    if( gamecounter < 1 ){ Bettable2 = true;}
    log("Bet Phase 2 : "+ Bettable2);
    gamecounter++;
//--------------------------Redtrain Waypoint----------------------------------------------//
    Redtrainwaypoint:    
        if(trainsfound > 1){    
            if(trainlength > 10 && trainlocations[0] < 20){
                
                log("Found a train longer than 10");
                log("Checking if it is applicable for 2x");
                if(engine.median() > 1.9 && engine.median() < 2.10) 
                {   if(engine.average() > 2 && engine.average() < 8){
                        if(hundrollcounter < 1 || highrollcounter < 2){
                            log("It is.Multiplier is 2.2.Checking for 7 streaks.");
                            //MultiplierHolder = 2.2;
                            Bettable3 = true;
                        }
                    }}else{
                        log("It is not.Too close and too big.Checking ongoing.");
                        if(currentRedStreak > 5){
                            //cooldown = 6;
                            Bettable3 = false;
                            //break Redtrainwaypoint;
                        }else{
                            log("Not ongoing.Betting")
                            Bettable3 = true;
                            //break Redtrainwaypoint;
                        }

                    }
            }
            else if(trainlength >= 8 && trainlength <= 10 && trainlocations[0] < 6){
                //cooldown = 3;
                Bettable3 = false;
                log("Found a train between 8 and 10 and close.");
                //break Redtrainwaypoint;
            }
            else(trainsfound < 8 && trainlocations[0] < 10)
            {
                log("Found a train of 7");
                log("If not ongoing, betting next round.");
                if(currentRedStreak > 9){
                    log("It is ongoing, waiting 3 rounds.");
                    //cooldown = 3;
                    Bettable3 = false;
                    //break Redtrainwaypoint;
                }else{
                    log("It is not ongoing.Betting")
                    Bettable3 = true;
                    //break Redtrainwaypoint;
            }}}else{
                log("No trains found.");
                Bettable3 = true;
            }    
//--------------------------Play----------------------------------------------//
    if(Bettable1 != false && Bettable2 != false){
        // This check needs to be weight based and it should effect the multi and the bet.
        // That way it can be more efficient.This is too brute.
        /*if(Bettable3 != false && betupper > 0){
            currentBet += 100;
            betupper = 0;
        }*/
        //It is needed for bigger bankrolls.Disabled for now.
        /*if(recoverycounter < 0){
            log("Recovery Mode is on.Betting " + calcholder + "For 20 rounds.")
            currentBet = calcholder;
            recoverycounter -= 1;
        }*/
        engine.bet(currentBet, MultiplierHolder);
        currentStreakBets.push(currentBet);
        log("Betting " + currentBet / 100 + " bits this game.");
        isBettingNow = true;
    }} else {
        log("Cooldown for the next " + cooldown + " games...");
        isBettingNow = false;
    }
});

engine.on('GAME_ENDED', function () {
    let gameInfos = engine.history.first();
    if (isBettingNow) {
        if (!gameInfos.cashedAt) {
            //Lost
            var ProfitCalculator = userInfo.balance;
            lostbalance = ProfitCalculator;
            log('Lost...');
            lastgamewin = false;
            greencont = false;
            ///userProfit -= currentBet;
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance)/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
            if (currentStreakBets.length > 1) {
                log(currentStreakBets);
                var sum = currentStreakBets.reduce(function(a, b) { return a + b; }, 0);
                if(currentStreakBets.length > 4 && plusprofit != false){
                sum = (sum + 200);
                plusprofit = false;
                }
                sum = (sum/200);   //200 safer ?
                sum = Math.ceil(sum);
                sum = sum*100;
                log(sum);
                currentBet = sum;
            /*if(MultiplierHolder == 3){
                currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
                betupper --;
            }
            else if(MultiplierHolder == (2.2)){
                betupper --;
                log(currentStreakBets);
                var sum = currentStreakBets.reduce(function(a, b) { return a + b; }, 0);
                if(currentStreakBets.length > 4){
                sum = (sum + 200);
                }
                sum = (sum/200);   //200 safer ?
                sum = Math.ceil(sum);
                sum = sum*100;
                log(sum);
                currentBet = sum;
            }*/
            }
        } else {
            //Won
            var ProfitCalculator = userInfo.balance;
            wonbalance = ProfitCalculator;
            log('Won!');
            lastgamewin = true;
            if(gameInfos.bust > 3.99){
                greencont = true;
            }
            if (ProfitCalculator > StartingBalance){
                userProfit = (ProfitCalculator - StartingBalance )/100;
            }else{
                userProfit = -(StartingBalance - ProfitCalculator)/100;
            }
            if(currentBet == sum && currentStreakBets.length >= config.SaveHold.value && savehold1 != true){
                var saveholder = currentBet;
                savehold1 = true;
                log("Entered First Save Point.");
            }else if(currentBet == sum && currentStreakBets.length >= config.SaveHold.value && savehold2 != true && savehold1 != false){
                var saveholder2 = currentBet;
                savehold2 = true;
            }else if(currentBet == sum && currentStreakBets.length >= config.SaveHold.value && savehold3 != true && savehold2 != false && savehold1 != false){
                var saveholder3 = currentBet;
                savehold3 = true;
            }
            cooldown = config.fixedOrRandom.options.fixed.value;
            currentRedStreak = 0;
            betupper = 3;
            currentStreakBets = [];
            currentBet = config.baseBet.value;
            plusprofit = true;
            numberOf3xCashedOut++;
            sum = 0;
        }
    } else {
        if (cooldown > 0) {
            log("Decrementing cooldown...");
            cooldown--;
            log(cooldown + " left");
        }
    }
    if(currentStreakBets.length > config.trainesc.value){
        Bettable1 = false;
        if(gameInfos.bust >= 4){
            Bettable1 = true;
            cooldown = 0;
        }
    }
//--------------------------Max Profit Checkpoint----------------------------------------------// 
if(ProfitCalculator <= (BalanceCheckpoint - config.StopLoss.value)){
    log(config.StopLoss.value + " bit lost");
    log(BalanceCheckpoint);
    stop("Stop-Loss activated.");
}else if(ProfitCalculator > BalanceCheckpoint){
    BalanceCheckpoint = ProfitCalculator;
    log("Balance updated.");
}
else if(ProfitCalculator >= (StartingBalance+config.StopWon.value)){
    stop("Stop-Won activated.");
}

    log('END GAME');
});