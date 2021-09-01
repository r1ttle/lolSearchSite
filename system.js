function searchToggle(obj, evt) {
    var container = $(obj).closest('.search-wrapper');
    if (!container.hasClass('active')) {
        container.addClass('active');
        evt.preventDefault();
    }
    else if (container.hasClass('active') && $(obj).closest('.input-holder').length == 0) {
        container.removeClass('active');
        // clear input
        container.find('.search-input').val('');
    }
}

function myfunc() {
    location.href = "search.html";
}

function setNickname(elem) {

    var name = elem;
    window.localStorage.setItem('name', name);
    console.log(window.localStorage.getItem('name'));
}

function loadNickname() {
    return window.localStorage.getItem('name');
}

function enterkey(element) {

    var nickname = element;

    $.ajax({
        method: "GET",
        url: "https://cors0327.herokuapp.com/https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + nickname + "?api_key=RGAPI-5c96ae2e-82d4-4c7e-b7ca-329fd661ef0b",
        data: { summonerName: nickname },

        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        },
        success: function (result) {

            alert("success!");

            console.log(result)

            $.ajax({
                method: "GET",
                url: "https://cors0327.herokuapp.com/https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/" + result.id + "?api_key=RGAPI-5c96ae2e-82d4-4c7e-b7ca-329fd661ef0b",
                data: { encryptedSummonerId: result.id },
                headers: {
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
                            document.getElementById("type").innerHTML = "__솔로랭크__"
                            document.getElementById("tier").innerHTML = msg[i].tier + " " + msg[i].rank;
                            document.getElementById("leaguePoints").innerHTML = "점수: " + msg[i].leaguePoints + "LP";
                            document.getElementById("wins").innerHTML = "wins: " + msg[i].wins;
                            document.getElementById("losses").innerHTML = "losses: " + msg[i].losses;
                            document.getElementById("winRate").innerHTML = "승률: " + ((msg[i].wins /  (msg[i].wins + msg[i].losses))*100).toFixed(1) + "%";
                            break;
                        }
                    }
                })

            $.ajax({
                method: "GET",
                url: "https://cors0327.herokuapp.com/https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/" + result.accountId + "?api_key=RGAPI-5c96ae2e-82d4-4c7e-b7ca-329fd661ef0b",
                data: { encryptedAccountId: result.accountId },
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
                    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Origin": "https://developer.riotgames.com"
                }
            })
                .done(function (msg) {

                    var index;
                    var gameID = [];

                    for (index = 0; index < 50; index++) {
                        gameID[index] = msg.matches[index].gameId

                        $.ajax({
                            method: "GET",
                            url: "https://cors0327.herokuapp.com/https://kr.api.riotgames.com/lol/match/v4/matches/" + gameID[index] + "?api_key=RGAPI-5c96ae2e-82d4-4c7e-b7ca-329fd661ef0b",
                            data: { matchId: gameID[index] },
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
                                "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                                "Origin": "https://developer.riotgames.com"
                            }
                        })
                            .done(function (msg) {

                                console.log(msg);

                                var KDA;
                                var myTeam;
                                var myKDA = 0;
                                var otherKDA = 0;

                                var mySkill;
                                var teamSkill;

                                for (index = 0; index < 10; index++) {
                                    if (msg.participantIdentities[index].player.summonerName == nickname) {
                                        if (parseFloat(((msg.participants[index].stats.kills + msg.participants[index].stats.assists) / msg.participants[index].stats.deaths)).toFixed(2) == Infinity) {
                                            myKDA = parseFloat(((msg.participants[index].stats.kills + msg.participants[index].stats.assists)).toFixed(2));
                                        }
                                        else {
                                            myKDA = parseFloat(((msg.participants[index].stats.kills + msg.participants[index].stats.assists) / msg.participants[index].stats.deaths).toFixed(2));
                                        }
                                        myTeam = msg.participants[index].teamId;
                                    }
                                    KDA = ((msg.participants[index].stats.kills + msg.participants[index].stats.assists) / msg.participants[index].stats.deaths).toFixed(2);
                                    console.log(msg.participantIdentities[index].player.summonerName + ",  kda:" + KDA);
                                }


                                for (index = 0; index < 10; index++) {
                                    if (msg.participants[index].teamId == myTeam && msg.participantIdentities[index].player.summonerName != nickname) {

                                        if (parseFloat(((msg.participants[index].stats.kills + msg.participants[index].stats.assists) / msg.participants[index].stats.deaths)).toFixed(2) == Infinity) {
                                            otherKDA += parseFloat((msg.participants[index].stats.kills + msg.participants[index].stats.assists).toFixed(2));
                                        }
                                        else {
                                            otherKDA += parseFloat(((msg.participants[index].stats.kills + msg.participants[index].stats.assists) / msg.participants[index].stats.deaths).toFixed(2));
                                        }
                                    }
                                }

                                otherKDA /= 4;

                                console.log("나의 KDA : " + myKDA);
                                console.log("팀원의 KDA : " + otherKDA);

                                if (otherKDA < 1) {
                                    teamSkill = "인력거";
                                }
                                else if (1 <= otherKDA && otherKDA < 2) {
                                    teamSkill = "마차";
                                }
                                else if (2 <= otherKDA && otherKDA <= 3) {
                                    teamSkill = "자가용";
                                }
                                else if (3 <= otherKDA && otherKDA <= 6) {
                                    teamSkill = "버스";
                                }
                                else if (otherKDA > 5) {
                                    teamSkill = "KTX";
                                }

                                console.log("팀운 : " + teamSkill);
                            })
                    }
                });
        },
        error: function (request, status, error) {
            alert("존재하지 않는 소환사 이름입니다.");
        }
    })
}