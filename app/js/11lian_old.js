$(document).ready(function()
    {
        $.facebox.settings.closeImage = 'http://app.lovelivewiki.com/js/facebox/closelabel.png'
        $.facebox.settings.loadingImage = 'http://app.lovelivewiki.com/js/facebox/loading.gif'
        var carddealer = {
            "init": function() {
                $("#total").attr("value", "0");
                $("#heart").attr("value", "0");
                $("#SR").attr("value", "0");
                $("#pSR").attr("value", "0");
                $("#UR").attr("value", "0");
                $("#pUR").attr("value", "0");
                $("#SSR").attr("value", "0");
                $("#pSSR").attr("value", "0");
                $("#RR").attr("value", "0");
                $("#pRR").attr("value", "0");
                $("#lccon").html("");
                for(var iter = 1; iter <= 11; iter++)
                {
                    $("#img" + iter.toString()).attr("src", "");
                }
            },
            "deal": function(big)
            {
                /*
                 * ======================================================
                 * 生成卡池，请在此处修改
                 */
                // 删除卡池
                var lastFilter = function(card) {
                    if(card.upicon == card.icon) return false;
                    if(737 <= card.id && card.id <= 764) return false;
                    var banlist = [703, 711, 728, 774];
                    for(id in banlist) {
                        if(id == card.id) return false;
                    }
                    if(card.id == 332) return true;
                    if(350 <= card.id && card.id <= 815) return true;
                    return false;
                }
                // SR
                var SR = cardgenerator(function(card) {
                    return card.rarity == "SR" && lastFilter(card);
                });
                // UR
                var UR = cardgenerator(function(card) {
                    return card.rarity == "UR" && lastFilter(card);
                });
                // R
                var R =  cardgenerator(function(card) {
                    return card.rarity == "R" && lastFilter(card);
                });
                // =======================================================
                //保底
                var flag = $("#back").val();
                var cards = [];

                function shuffleUseSort(aArr){
                    return aArr.sort(function(a, b){
                        return (0.5 - Math.random());
                    });
                }
                //模拟抽卡
                if(flag == "1")
                {
                    //保底
                    var count = 0;
                    for(var iter = 0; iter < 11; iter++)
                    {
                        var n1 = Math.floor(Math.random() * 100);
                        if(n1 < 1) { count++; cards.push(UR[Math.floor(Math.random() * UR.length)]); }
                        else if(n1 < 10) { count++; cards.push(SR[Math.floor(Math.random() * SR.length)]); }
                        else cards.push(R[Math.floor(Math.random() * R.length)]);
                    }
                    if(count == 0)
                    {
                        var n1 = Math.floor(Math.random() * 100);
                        if(n1 < 10) cards[0] = UR[Math.floor(Math.random() * UR.length)];
                        else cards[0] = SR[Math.floor(Math.random() * SR.length)];
                    }
                }
                else
                {
                    //非保底
                    for(var iter = 0; iter < 11; iter++)
                    {
                        var n1 = Math.floor(Math.random() * 100);
                            if(n1 < 1) cards.push(UR[Math.floor(Math.random() * UR.length)]);
                            else if(n1 < 10) cards.push(SR[Math.floor(Math.random() * SR.length)]);
                            else cards.push(R[Math.floor(Math.random() * R.length)]);
                        }
                    }

                    shuffleUseSort(cards);
                    if(!big)
                    {
                        for(var iter = 1; iter <= 11; iter++)
                        {
                            $("#img" + iter.toString()).attr( "card", JSON.stringify(cards[iter - 1]) );
                            $("#img" + iter.toString()).fadeOut("fast", function(){ var card = $.parseJSON( $(this).attr("card"));	$(this).attr("src", card.icon ); $(this).fadeIn("fast", function(){
                                $(this).bind("click", function(){
                                    var card = $.parseJSON( $(this).attr("card"));
                                    $.fancybox(
                                        $("<div></div>").append( $("<table></table>").append(
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<img></img>").attr( "src", card.navi ).css("height", "50%") ).attr("rowspan", "9"),
                                                $("<td></td>").append( $("<img></img>").attr( "src", card.upnavi ).css("height", "50%") ).attr("rowspan", "9"),
                                                $("<td></td>").append( $("<p></p>").text( card.rarity ).css("font-weight", "bold").css("fontStyle", "italic") ),
                                                $("<td></td>").append( $("<p></p>").text( card.eponym ) ).attr("colspan", "2")
                                            ),
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<p></p>").text( card.name ).css("width", "90px") ),
                                                $("<td></td>").append( $("<p></p>").text( "觉醒前" ).css("width", "50px") ),
                                                $("<td></td>").append( $("<p></p>").text( "觉醒后" ).css("width", "50px") )
                                            ),
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<p></p>").text( "Smile" ) ),
                                                $("<td></td>").append( $("<p></p>").text( card.smile[0] ) ),
                                                $("<td></td>").append( $("<p></p>").text( card.smile[1] ) )
                                            ).css("color", "red").css("font-weight", (card.attribute=="smile")?"bold":"normal"),
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<p></p>").text( "Pure" ) ),
                                                $("<td></td>").append( $("<p></p>").text( card.pure[0] ) ),
                                                $("<td></td>").append( $("<p></p>").text( card.pure[1] ) )
                                            ).css("color", "green").css("font-weight", (card.attribute=="pure")?"bold":"normal"),
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<p></p>").text( "Cool" ) ),
                                                $("<td></td>").append( $("<p></p>").text( card.cool[0] ) ),
                                                $("<td></td>").append( $("<p></p>").text( card.cool[1] ) )
                                            ).css("color", "blue").css("font-weight", (card.attribute=="cool")?"bold":"normal"),
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<p></p>").text( "技能: " + card.skill.name) ).attr("colspan", "3")
                                            ),
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<p></p>").text( card.skill.text ) ).attr("colspan", "3")
                                            ),
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<p></p>").text( "主唱技能: " + card.leader.name ) ).attr("colspan", "3")
                                            ),
                                            $("<tr></tr>").append(
                                                $("<td></td>").append( $("<p></p>").text( card.leader.text ) ).attr("colspan", "3")
                                            )
                                            //$("<tr></tr>").append(),
                                            //$("<tr></tr>").append()
                                        ).attr("border", "1").css("textAlign", "center") ),
                                        {
                                            'autoDimensions'	: false,
                                            'width'         		: 'auto',
                                            'height'        		: 'auto',
                                            //'transitionIn'		: 'none',
                                            //'transitionOut'		: 'none'
                                            'scrolling' : "auto"
                                        }
                                    );

                                }
                                );


                            }); });
                        }
                    }


                    return cards;
                },
                "update" : function(cards)
                {
                    $("#total").attr("value", (parseInt($("#total").attr("value")) + 11).toString());
                    $("#lcreq").html("50");
                    $("#heart").attr("value", (parseInt($("#heart").attr("value")) + 50).toString());
                    $("#lccon").html($("#heart").attr("value"));

                    var SR = 0;
                    var R = 0;
                    var UR = 0;
                    for(var iter = 0; iter < 11; iter++)
                    {
                        if(cards[iter].rarity == 'R') R++;
                        else if(cards[iter].rarity == 'SR') SR++;
                        else if(cards[iter].rarity == 'UR') UR++;
                    }
                    if(R == 11) $("#RR").attr("value", (parseInt($("#RR").attr("value")) + 1).toString());
                    if(SR == 1 && UR == 0) $("#SSR").attr("value", (parseInt($("#SSR").attr("value")) + 1).toString());
                    $("#SR").attr("value", (parseInt($("#SR").attr("value")) + SR).toString());
                    $("#UR").attr("value", (parseInt($("#UR").attr("value")) + UR).toString());
                    $("#pSR").attr("value", ((100.0 * parseFloat($("#SR").attr("value")) / parseFloat($("#total").attr("value"))).toFixed(2).toString() + "%"));
                    $("#pUR").attr("value", ((100.0 * parseFloat($("#UR").attr("value")) / parseFloat($("#total").attr("value"))).toFixed(2).toString() + "%"));
                    $("#pSSR").attr("value", ((100.0 * 11 * parseFloat($("#SSR").attr("value")) / parseFloat($("#total").attr("value"))).toFixed(2).toString() + "%"));
                    $("#pRR").attr("value", ((100.0 * 11 * parseFloat($("#RR").attr("value")) / parseFloat($("#total").attr("value"))).toFixed(2).toString() + "%"));
                }
        };
        $("#recruit").click(function(){
            carddealer["update"](carddealer["deal"](false));
        });
        $("#ten").click(function(){
            for(var i = 0; i < 10; i++)
                carddealer["update"](carddealer["deal"](true));
        });
        $("#clear").click(function(){
            carddealer["init"]();
        });
        carddealer["init"]();
    })
