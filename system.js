var worst = 0;
var worse = 0;
var common = 0;
var better = 0;
var best = 0;

var tier="UNRANKED";
var rank=0;
var LP=0;
var wins=0;
var losses=0;
var winRate=0;

var IDX = 0;
var index = 0;

$('.search-input').focus(function(){
    $(this).parent().addClass('focus');
  }).blur(function(){
    $(this).parent().removeClass('focus');
})

function searchToggle(obj, evt) {
    var container = $(obj).closest('.search-wrapper');
    if (!container.hasClass('active')) {
        container.addClass('active');
        evt.preventDefault();
    }
    else if (container.hasClass('active') && $(obj).closest('.input-holder').length == 0) {
        container.removeClass('active');

        container.find('.search-input').val('');
    }
}

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) { }
}

function myfunc() {
    location.href = "result.html";
}

function myfunc2() {
    location.href = "search.html";
}

function myfunc3() {
    location.href = "error.html";
}

function myfunc4() {
    location.href = "Index.html";
}

function setNickname() {

    var name = document.getElementById("search").value;
    window.localStorage.setItem('name', name);
    console.log(window.localStorage.getItem('name'));
}

function setResult() {

    window.localStorage.setItem('worst', worst);
    window.localStorage.setItem('worse', worse);
    window.localStorage.setItem('common', common);
    window.localStorage.setItem('better', better);
    window.localStorage.setItem('best', best);

}

function loadNickname() {
    return window.localStorage.getItem('name');
}

function setHTML() {

    document.getElementById("nickname").style.display = 'none';
    document.getElementById("tier").style.display = 'none';
    document.getElementById("leaguePoints").style.display = 'none';
    document.getElementById("wins").style.display = 'none';
    document.getElementById("losses").style.display = 'none';
    document.getElementById("winRate").style.display = 'none';
    document.getElementById("teamSkill").style.display = 'none';
    document.getElementById("restart").style.display = 'none';
    document.getElementById("share").style.display = 'none';
}


function loadInfo() {

    if (IDX == 10) {

        document.getElementById("nickname").style.display ='block';
        document.getElementById("tier").style.display ='block';
        document.getElementById("leaguePoints").style.display ='block';
        document.getElementById("wins").style.display ='block';
        document.getElementById("losses").style.display ='block';
        document.getElementById("winRate").style.display ='block';
        document.getElementById("teamSkill").style.display ='block';
        document.getElementById("restart").style.display = 'block';
        document.getElementById("share").style.display = 'block';

        document.getElementById("tier").innerHTML = tier;

        document.getElementById("leaguePoints").innerHTML = LP;

        document.getElementById("wins").innerHTML = wins;

        document.getElementById("losses").innerHTML = losses;

        document.getElementById("winRate").innerHTML = winRate;

        document.getElementById("teamSkill").innerHTML = "팀운: " + Math.max(worst, worse, common, better, best);

        setTimeout(function () {
            loadInfo();
        }, 500);
    }
    else {
        setTimeout(function () {
            loadInfo();
        }, 500);
    }
}

function enterkey(element, API_KEY) {

    var nickname = element;

    $.ajax({
        method: "GET",
        url: "https://proxy.cors.sh/https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + nickname + "?api_key=" + API_KEY,
        data: { summonerName: nickname },

        headers: {
            'x-cors-api-key': 'temp_e2ed478186cc5cafd8bc0ddfe6180560',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        },
        success: function (result) {

            console.log(result)

            $.ajax({
                method: "GET",
                url: "https://proxy.cors.sh/https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/" + result.id + "?api_key=" + API_KEY,
                data: { encryptedSummonerId: result.id },
                headers: {
                    'x-cors-api-key': 'temp_e2ed478186cc5cafd8bc0ddfe6180560',
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
                    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Origin": "https://developer.riotgames.com"
                }
            })
                .done(function (msg) {
                    console.log(msg);

                    var i = 0;

                    for (i = 0; i < 2; i++) {
                        if (msg[i].queueType == "RANKED_SOLO_5x5") {
                            console.log(msg[i].tier);
                            tier = msg[i].tier + " " + msg[i].rank;
                            LP = "점수: " + msg[i].leaguePoints + "LP";
                            wins = "wins: " + msg[i].wins;
                            losses = "losses: " + msg[i].losses;
                            winRate = "승률: " + ((msg[i].wins / (msg[i].wins + msg[i].losses)) * 100).toFixed(1) + "%";
                            break;
                        }
                    }
                })

            $.ajax({
                method: "GET",
                url: "https://proxy.cors.sh/https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" + result.puuid + "/ids?start=0&count=20&api_key=" + API_KEY,
                data: { puuid: result.puuid },
                headers: {
                    'x-cors-api-key': 'temp_e2ed478186cc5cafd8bc0ddfe6180560',
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
                    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Origin": "https://developer.riotgames.com"
                }
            })
                .done(function (msg) {

                    console.log(msg);

                    for (IDX = 0; IDX < 10; IDX++) {

                        $.ajax({
                            method: "GET",
                            url: "https://proxy.cors.sh/https://asia.api.riotgames.com/lol/match/v5/matches/" + msg[IDX] + "?api_key=" + API_KEY,
                            data: { matchId: msg[IDX] },
                            headers: {
                                'x-cors-api-key': 'temp_e2ed478186cc5cafd8bc0ddfe6180560',
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
                                "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                                "Origin": "https://developer.riotgames.com"
                            }
                        })
                            .done(function (msg) {

                                for(index=0 ; index<10 ; index++){
                                    console.log(msg);
                                    if(msg.info.participants[index].puuid == result.puuid){

                                        console.log(msg.info.participants[index].puuid);

                                        var KDA = (msg.info.participants[index].kills + msg.info.participants[index].assists) / msg.info.participants[index].deaths;

                                        console.log(KDA.toFixed(2));

                                        if(KDA == "Infinity"){
                                            console.log("퍼풱트");
                                            best++;
                                        }
                                        else if(KDA > 4){
                                            console.log("캐리")
                                            better++;
                                        }
                                        else if(KDA <= 4 && KDA > 2){
                                            console.log("평범")
                                            common++;
                                        }
                                        else if(KDA <= 2 && KDA > 1){
                                            console.log("트롤")
                                            worse++;
                                        }
                                        else if(KDA <= 1){
                                            console.log("씹트롤")
                                            worst++;
                                        }
                                    }
                                }
                            });
                    }
                });
        },
        error: function (request, status, error) {
            myfunc3();
        }
    })
}

function output() {
    console.log(worst);
    console.log(worse);
    console.log(common);
    console.log(better);
    console.log(best);
}