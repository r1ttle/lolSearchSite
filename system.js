
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


function enterkey(element) {

    var nickname = element.value;

    $.ajax({
        method: "GET",
        url: "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + nickname + "?api_key=RGAPI-5c96ae2e-82d4-4c7e-b7ca-329fd661ef0b",
        data: { summonerName: nickname },
        
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        }
    })
        .done(function (msg) {

            alert("success!");
            console.log(msg.accountId);

            $.ajax({
                method: "GET",
                url: "https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/" + msg.accountId + "?api_key=RGAPI-5c96ae2e-82d4-4c7e-b7ca-329fd661ef0b",
                data: { encryptedAccountId: msg.accountId },
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

                    for (index = 0; index < 10; index++) {
                        gameID[index] = msg.matches[index].gameId
                        console.log(gameID[index])

                        $.ajax({
                            method: "GET",
                            url: "https://kr.api.riotgames.com/lol/match/v4/matches/" + gameID[index] + "?api_key=RGAPI-5c96ae2e-82d4-4c7e-b7ca-329fd661ef0b",
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
                            })
                    }
                });
        });
        
}