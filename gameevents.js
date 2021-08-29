

function* start_game(){
    yield* set_dialog(
        ["欢迎使用不当文本审核系统"],
        ["开始使用"]
    );

    yield* set_dialog(
        [
            "您的权限是：基层",
            "因此，您需要筛选一系列的文本",
            "选择那些您认为无害的，没有负能量的，非境外势力引导的，不会引战且不是阴阳怪气的合理言论",
            "然后按下通过键"
        ],
        ["继续"]
    )

    yield* set_dialog(
        [
            "注意，您的筛选结果会被上级审核员进一步检查",
            "如果出现疏漏，上级会对您的评分进行扣除",
            "请一定注意细心辨别，不要让可能产生危害的言论通过"
        ],
        ["开始审核"]
    )
}

function* game_loop(){
    var index = 0;
    
    while (true) {
        var selectCount = 0;
        for (let i = 0; i < 10; i++)
        {


            var message = 
            [
                "'" + textdb[index] +"'",
                "要通过吗？"
            ]
            ;
            var select = yield* set_dialog(
                message,
                ["通过","删除评论","禁言"]
            );
            if(select == 0)
            {
                selectCount ++;
            }

            player_status["Progress"] = i + 1;

            index ++;
            if(index >= textdb.length)
            {
                index =0;
            }
        }
        var isWarning = false;
        if(selectCount > 0)
        {
            var failedCount = getRandomInt(selectCount);
            if(failedCount > 0)
            {
                isWarning = true;
                yield* set_dialog(
                    [
                        "您有" + failedCount +"条通过的结果被驳回",
                        "请千万注意，您漏掉了非常危险的言论",
                        "造成了恶劣的影响",
                        "因此上级扣除了你"+failedCount+"分"
                    ],
                    ["确定"]
                );
                player_status["Score"] -= failedCount;
            }

        }
        if(isWarning == false)
        {
            yield* set_dialog(
                [
                    "干得不错，请继续认真地审核",
                    "注意，有些言论会越来越隐蔽了",
                    "一定不要放过那些看上去没问题，但是实际上在阴阳怪气的言论"
                ],
                ["确定"]
            );
        }
        yield* set_dialog(
            [
                "一批新的评论需要您开始审核"
            ],
            ["开始"]
        );

    }
}
function* game_logic()
{
    yield* start_game();
    yield* game_loop();
}