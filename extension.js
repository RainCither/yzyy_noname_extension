game.import("extension", function (lib, game, ui, get, ai, _status) {
    return {
        name: "雨筝", 
        content: function (config, pack) {

        }, 
        precontent: function () {

        }, 
        config: {}, 
        help: {}, 
        package: {
            character: {
                character: {
                    "yzyy_xuling": ["female", "shen", 3, ["yzyy_tianxin", "yzyy_guixu", "yzyy_sourceshift","yzyy_damageshift","yzyy_souxun", "yzyy_shenlin","yzyy_xuwu", ], ["forbidai", "des:游凡巡幽，居天塌道。天心如一，命运造化。"]],
                },
                translate: {
                    "yzyy_xuling": "虚琳",
                },
            },
            card: {
                card: {
                },
                translate: {
                },
                list: [],
            },
            skill: {
                skill: {
                    yzyy_xuwu: {
                        forced: true,
                        init: function (player) {
                            if (player.name != "yzyy_xuling") {
                                player.removeSkill("yzyy_xuwu");
                                return;
                            }
                            player._trueMe = player;
                            var arr = ["clearSkills", "disableSkill", "disabledSkills", "goMad", "link", "turnOver", "skip", "reinit", "disableEquip", "disableJudge"];
                            for (var i in arr) {
                                player[arr[i]] = function () {
                                    player.popup("虚·空");
                                    player.$fullscreenpop('这里是永恒的虚空', 'fire');
                                };
                                Object.freeze(player[i]);
                            }
                        },
                        mod: {
                            maxHandcard: function (player) {
                                return Infinity;
                            },
                            targetInRange: function (card, player, target, now) {
                                return true;
                            },
                            wuxieRespondable: function (card, player, target, current) {
                                if (player != current) {
                                    return false;
                                }
                            },
                            playerEnabled: function (card, player, target) {
                                return true;
                            },
                        },
                        group: ["yzyy_xuwu_js", "yzyy_xuwu_wl", "yzyy_xuwu_tf", "yzyy_xuwu_die", "yzyy_xuwu_ts",],
                        subSkill: {
                            ts:{
                                trigger: {
                                    global: "dieAfter",
                                },
                                priority: Infinity,
                                forced: true,
                                content: function () {
                                    player.gainMaxHp();
                                    player.recover();
                                },
                                sub:true,
                            },
                            die: {
                                trigger: {
                                    player: ["dieBegin", "changeHp"],
                                },
                                priority: Infinity,
                                forced: true,
                                forceDie: true,
                                init: function (player) {
                                    player.xuhp = player.hp;
                                    var yongsheng = window.setInterval(function () {
                                        if (player.isDead()) {
                                            if (player.maxHp < 4) player.maxHp = 3;
                                            player.revive(Math.max(1, game.me.maxHp));
                                            player.draw(game.players.length);
                                        }
                                        if (false) {
                                            game.addGlobalSkill('yzyy_tianfa');
                                            window.clearInterval(yongsheng);
                                        }
                                    }, 1000);
                                },
                                content: function () {
                                    if (event.triggername == "changeHp") {
                                        player.xuhp += trigger.num;
                                        player.hp = player.xuhp;
                                    }
                                    else if (player.xuhp > 0 || player.hp > 0 || player.maxHp < 1) {
                                        if (trigger.source) trigger.source.die();
                                        trigger.untrigger;
                                        trigger.finish();
                                        player.hp = player.xuhp;
                                        if (player.maxHp < 4) player.maxHp = 3;
                                        player.update();
                                    }else if(game.hasPlayer(function (current) { return current.hasMark('yzyy_shenlin_mark') })){
                                        trigger.untrigger;
                                        trigger.finish();
                                        player.recover();
                                    }
                                },
                                sub:true,
                            },
                            tf:{
                                trigger: {
                                    target: "useCardToBefore",
                                },
                                forced: true,
                                filter: function (event, player, name) {
                                    if (Math.random() < 0.9 && event.target == player && event.player != player) {
                                        return true;
                                    }
                                    return false;
                                },
                                content: function () {
                                    if (trigger.cards && get.position(trigger.cards[0]) == 'd' && get.itemtype(trigger.cards[0]) == 'card') {
                                        player.gain(trigger.cards[0], 'gain2');
                                    }
                                    trigger.untrigger();
                                    trigger.finish();
                                },
                                sub: true,
                            },
                            wl: {
                                audio: "ext:太一:2",
                                trigger: {
                                    player: ["loseMaxHpBegin", "loseHpBefore","damageBegin"],
                                },
                                forced: true,
                                filter: function (event, player, name) {
                                    if(name == "damageBegin" && Math.random() > 0.9){
                                        if(event.num > 1 ) event.num = 1;
                                        return false;
                                    } 
                                    return true;
                                },
                                content: function () {
                                    trigger.untrigger();
                                    trigger.finish();
                                },
                                sub: true,
                            },
                            js: {
                                trigger: {
                                    player: "phaseJudgeBegin",
                                },
                                forced: true,
                                content: function () {
                                    player.discard(player.getCards('j'));
                                    player.draw(player.countCards('j'));
                                },
                                filter: function (event, player) {
                                    return player.countCards('j') > 0;
                                },
                                sub: true,
                            },
                        },
                    },
                    yzyy_sourceshift: {
                        trigger: {
                            source: "damageBegin4",
                        },
                        priority: -9,
                        forced: true,
                        content: function () {
                            "step 0"
                            player.chooseTarget('是否选择一名角色让其成为此伤害的来源？', function (card, player, target) {
                                return player != target;
                            }).set('ai', function (target) {
                                return -ai.get.attitude(player, target);
                            });
                            "step 1"
                            if (result.bool && result.targets && result.targets.length) {
                                player.line(result.targets[0], 'green');
                                trigger.source = result.targets[0];
                                result.targets[0].line(trigger.player, 'green');
                            }
                            else {
                                event.finish();
                            }
                        },
                        group: ["yzyy_sourceshift_buff","yzyy_sourceshift_mark"],
                        subSkill: {
                            mark:{
                                trigger: {
                                    source: "damageBegin3",
                                },
                                prompt:"令其获得一枚【弃】标记，其出牌阶段开始时判定，♥受一火伤、♠受一雷伤、♦受一流失、♣翻面",
                                content: function () {
                                    trigger.player.addMark("yzyy_sourceshift_mark");
                                },
                                marktext: '弃',
                                intro: {
                                    name: '弃',
                                    name2: '弃子',
                                    content: 'mark',
                                },
                                sub:true,
                            },
                            buff:{
                                trigger: {
                                    global: 'phaseUseBefore',
                                },
                                priority: -9,
                                forced: true,
                                filter: function (event, player) {
                                    return event.player.hasMark("yzyy_sourceshift_mark");
                                },
                                content: function () {
                                    "step 0"
                                    trigger.player.removeMark("yzyy_sourceshift_mark", 1);
                                    trigger.player.judge();
                                    "step 1"
                                    switch (result.suit) {
                                        case 'heart': trigger.player.damage("nosource", 1, "fire"); break;
                                        case 'diamond': trigger.player.loseHp(); break;
                                        case 'spade': trigger.player.damage("nosource", 1, "thunder"); break;
                                        case 'club': trigger.player.turnOver(); break;
                                    }
                                    "step 2"
                                    if(trigger.player.hasMark("yzyy_sourceshift_mark")) event.goto(0);
                                },
                                sub:true,
                            },
                        },
                    },
                    yzyy_damageshift: {
                        audio: "ext:太一:2",
                        trigger: {
                            player: "damageBefore",
                        },
                        forced: true,
                        content: function () {
                            'step 0'
                            player.judge();
                            'step 1'
                            if(result.color == "black") {
                               player.draw(trigger.num);
                               event.finish();
                            }
                            'step 2'
                            player.chooseTarget('是否选择一名角色转移伤害？', function (card, player, target) {
                                return player != target;
                            }).set('ai', function (target) {
                                return -ai.get.attitude(player, target);
                            });
                            'step 3'
                            trigger.cancel();
                            if (result.bool && result.targets && result.targets.length) {
                                player.line(result.targets[0], 'green');
                                result.targets[0].damage(trigger.source || 'nosource', trigger.num, trigger.nature);
                                result.targets[0].draw(trigger.num);
                            }

                        },
                        sub: true,
                    },
                    yzyy_tianxin: {
                        audio: "ext:太一:2",
                        enable: "phaseUse",
                        forced: true,
                        usable: 1,
                        init:function(player){
                            player.storage.txsha = 0;
                        },
                        content: function () {
                            "step 0"
                            'step 1'
                            var card = get.cards()[0];
                            event.card = card;
                            player.showCards(card);
                            if (!player.hasUseTarget(card)) {
                                player.addTempSkill("yzyy_tianxin_txsha");
                                card.fix();
                                ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                game.updateRoundNumber();
                                event.finish();
                            }
                            'step 2'
                            var next = player.chooseUseTarget(card, true);
                            if (get.info(card).updateUsable == 'phaseUse') next.addCount = false;
                            'step 3'
                            if (result.bool) {
                                player.storage.txsha++;
                                event.goto(1);
                            } else {
                                player.addTempSkill("yzyy_tianxin_txsha");
                                card.fix();
                                ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                game.updateRoundNumber(); 
                            }
                        },
                        ai: {
                            order: 1,
                            result: {
                                player: function (player) {
                                    return 0;
                                },
                            },
                        },
                    },
                    yzyy_tianxin_txsha:{
                        onremove:true,
                        intro:{
                            content:'使用【杀】的次数上限+#',
                        },
                        mod:{
                            cardUsable:function(card,player,num){
                                if(card.name=='sha' && player.storage.txsha) return num + player.storage.txsha;
                            },
                        },
                    },
                    yzyy_guixu: {
                        audio: "ext:太一:2",
                        enable: "phaseUse",
                        forced: true,
                        init: function (player) {
                            if (player.name != "yzyy_xuling") {
                                player.removeSkill("yzyy_guixu");
                            }
                        },
                        filter: function (event, player) {
                            return player.countCards('h') > 0 && game.hasPlayer(function (current) { return current != player && current.countCards('he') > 0});
                        },
                        filterCard: true,
                        selectCard: function () {
                            if (ui.selected.targets.length) return [1, ui.selected.targets[0].countCards('h')];
                            return [1, Infinity];
                        },
                        filterTarget: function (event, player, target) {
                            return target != player && target.countCards('he') >= Math.max(1, ui.selected.cards.length);
                        },
                        check: function (card) {
                            if (!game.hasPlayer(function (current) {
                                return current != _status.event.player && get.attitude(_status.event.player, current) < 0 && current.countCards('he') > ui.selected.cards.length;
                            })) return 0;
                            return 6 - get.value(card);
                        },
                        content: function () {
                            for (var i in cards) {
                                if (cards[i].name == "sha") {
                                    player.storage.yzyy_guixu_eff++;
                                }
                            }
                            if (player.storage.yzyy_guixu_eff > 0) player.markSkill("yzyy_guixu_eff");
                            target.chooseToDiscard(cards.length, 'he', true);
                        },
                        ai: {
                            order: 10,
                            result: {
                                target: -1,
                            },
                        },
                        group: "yzyy_guixu_eff",
                        subSkill: {
                            eff: {
                                mark: true,
                                intro: {
                                    content: "下一张杀的伤害基数+#",
                                },
                                trigger: {
                                    player: "useCard",
                                },
                                filter: function (event) {
                                    return event.card && event.card.name == 'sha';
                                },
                                forced: true,
                                content: function () {
                                    if (!trigger.baseDamage) trigger.baseDamage = 1;
                                    trigger.baseDamage += player.storage.yzyy_guixu_eff;
                                    player.unmarkSkill("yzyy_guixu_eff");
                                    player.storage.yzyy_guixu_eff = 0;
                                },
                                init: function (player) {
                                    player.storage.yzyy_guixu_eff = 0;
                                },
                                onremove: function (player) {
                                    delete player.storage.yzyy_guixu_eff;
                                },
                                ai: {
                                    damageBonus: true,
                                },
                                sub:true,
                            },
                        },
                    },
                    yzyy_souxun: {
                        audio: 2,
                        enable: 'phaseUse',
                        forced: true,
                        unique: true,
                        init: function (player) {
                            if (player.name != "yzyy_xuling") {
                                player.removeSkill("yzyy_souxun");
                            }
                        },
                        filter: function (event, player, name) {
                            return player.countSkill('yzyy_souxun') < player.hp;
                        },
                        content: function () {
                            'step 0'
                            var list = [];
                            for (var i = 0; i < lib.inpile.length; i++) {
                                var name = lib.inpile[i];
                                if (name == 'sha') {
                                    list.push(['基本', '', 'sha']);
                                    list.push(['基本', '', 'sha', 'fire']);
                                    list.push(['基本', '', 'sha', 'thunder']);
                                }
                                else if (get.type(name) == 'trick') list.push(['锦囊', '', name]);
                                else if (get.type(name) == 'basic') list.push(['基本', '', name]);
                                else if (get.type(name) == 'equip') list.push(['装备', '', name]);
                            }
                            var dialog = ui.create.dialog('搜集：选择要声明的卡牌名称', [list, 'vcard']);
                            player.chooseButton(dialog, function (button) {
                                var player = _status.event.player;
                                if (player.isDamaged()) return (button.link[2] == 'tao') ? 1 : -1;
                                if (player.countCards('h', 'sha')) return (button.link[2] == 'jiu') ? 1 : -1;
                                if (!player.countCards('h', 'sha')) return (button.link[2] == 'sha') ? 1 : -1;
                                if (player.countCards('h') < 3) return (button.link[2] == 'wuzhong') ? 1 : -1;
                                return Math.ceil(Math.random()) + ai.get.value(button.link[2]);
                            }, true);
                            'step 1'
                            player.popup(result.links[0][2]);
                            var card
                            if (result.links[0][2] == 'sha' && result.links[0][3] == 'fire') {
                                var attsha = function (card) { if (card.name == 'sha' && card.nature == 'fire') return true; }
                                card = get.cardPile(attsha);
                            }
                            else if (result.links[0][2] == 'sha' && result.links[0][3] == 'thunder') {
                                var attsha = function (card) { if (card.name == 'sha' && card.nature == 'thunder') return true; }
                                card = get.cardPile(attsha);
                            }
                            else if (!card) card = get.cardPile(result.links[0][2]);
                            if (card) player.gain(card, 'gain2');
                        },
                        ai: {
                            threaten: 1.5,
                            result: {
                                player: 1,
                            },
                            order: 9,
                        },
                    },
                    yzyy_shenlin: {
                        init: function (player) {
                            if (player.name != "yzyy_xuling") {
                                player.removeSkill("yzyy_shenlin");
                            } else {
                                player._trueMe = player;
                            }
                        },
                        forced: true,
                        group: ["yzyy_shenlin_mark","yzyy_shenlin_control","yzyy_shenlin_rmark"],
                        subSkill: {
                            mark:{
                                audio: 2,
                                enable: 'phaseUse',
                                forced: true,
                                usable: 1,
                                filter: function (event, player) {
                                    var markNum = game.countPlayer(function (current) { return current.hasMark('yzyy_shenlin_mark') });
                                    if( game.players.length - 1 <= markNum) return false;
                                    if (player.countCards('h') && markNum < player.maxHp) return true;
                                },
                                position: 'h',
                                selectCard: 1,
                                selectTarget: 1,
                                filterCard: true,
                                filterTarget: function (card, player, target) {
                                    return player != target && !target.hasMark("yzyy_shenlin_mark");
                                },
                                delay: false,
                                check: function (card) {
                                    return 6 - get.value(card);
                                },
                                content: function () {
                                    'step 0'
                                    player.showCards(cards);
                                    'step 1'
                                    targets[0].gain(cards[0], player, 'visible');
                                    player.$give(cards[0], targets[0]);
                                    targets[0].addMark('yzyy_shenlin_mark');
                                },
                                marktext: '临',
                                intro: {
                                    name: '神临',
                                    name2: '神临',
                                    content: 'mark',
                                },
                                sub:true,
                            },
                            control: {
                                audio: "ext:太一:2",
                                forced: true,
                                trigger: { global: 'phaseBeginStart' },
                                filter: function (event, player) {
                                    if (lib.config.autoskilllist.contains('rixiang4')) return false;
                                    return player != event.player && !event.player._trueMe && event.player.hasMark("yzyy_shenlin_mark");
                                },
                                logTarget: 'player',
                                skillAnimation: true,
                                animationColor: 'key',
                                content: function () {
                                    trigger.player._trueMe = player;
                                    game.addGlobalSkill('autoswap');
                                    if (trigger.player == game.me) {
                                        game.notMe = true;
                                        if (!_status.auto) ui.click.auto();
                                    }
                                    trigger.player.addSkill('yzyy_shenlin2');
                                },
                                sub:true,
                            },
                            rmark:{
                                trigger: {
                                    global: 'dyingBefore', 
                                },
                                forceDie: true,
                                forced: true,
                                filter: function (event, player) {
                                    return event.player.hasMark("yzyy_shenlin_mark");
                                },
                                content: function () {
                                    trigger.player.removeMark('yzyy_shenlin_mark');
                                },
                            },
                        }
                    },
                    yzyy_shenlin2: {
                        trigger: {
                            player: ['phaseEnd', 'dyingBegin'],
                        },
                        lastDo: true,
                        charlotte: true,
                        forceDie: true,
                        forced: true,
                        silent: true,
                        content: function () {
                            player.removeSkill('yzyy_shenlin2');
                        },
                        onremove: function (player) {
                            if (player == game.me) {
                                if (!game.notMe) game.swapPlayerAuto(player._trueMe)
                                else delete game.notMe;
                                if (_status.auto) ui.click.auto();
                            }
                            delete player._trueMe;
                        },
                    },
                },
                translate: {
                    "yzyy_xuwu": "虚无",
                    "yzyy_xuwu_info": "锁定技。当你成为一张牌的目标时，有90%的概率令此牌失效然后获得此牌。当你受到伤害时，有90%的概率防止此伤害。你的体力上限无法降低。准备阶段，你置空判定区，并摸x张牌下（x为弃置数）。你的手牌没有上限，出牌无视距离，非延时锦囊牌不能被无懈可击响应。 铁索，翻面，混乱，体力流失，封印对你无效。免疫一般即死。死亡后复活。每有一名角色死亡，你增加一点体力上限，并回复一点体力。",
                    "yzyy_sourceshift":"亡奕",
                    "yzyy_sourceshift_info":"当你即将对一名角色造成伤害时，可以令其获得一枚【弃】标记，然后可以选择一名角色让其成为此伤害的来源。拥有【弃】标记的角色，其出牌阶段开始时判定，♥受一火伤、♠受一雷伤、♦受一流失、♣翻面",
                    "yzyy_damageshift":"谦守",
                    "yzyy_damageshift_info":"锁定技。当你受到伤害时，进行判定。若结果为红色，你可以选择一名角色替你承受此次伤害，并摸x张牌。若为黑色，你摸x张牌。(x为此次受到的伤害值)",
                    "yzyy_tianxin": "天行",
                    "yzyy_tianxin_info": "出牌阶段限一次，你可展示牌堆顶的一张牌并使用之。若如此做，你重复此流程，直到你以此法展示的牌无法使用为止。每以此法使用一张牌，你使用杀的上限+1。",
                    "yzyy_guixu": "速击",
                    "yzyy_guixu_info": "出牌阶段，你可以弃置X张牌，选择一名目标也弃置X张牌。若你弃置的牌中有杀，则下次【杀】的伤害加y（y为你弃置杀的数量）。",
                    "yzyy_souxun": "宝库",
                    "yzyy_souxun_info": '出牌阶段限x次，你可以声明一张卡牌名称，然后若牌堆里有和你声明的同名称卡牌，你随机获得一张。（x为你的体力值）',
                    "yzyy_shenlin":"神临",
                    "yzyy_shenlin_info":"出牌阶段限一次，你可以展示一张手牌，并交给一名角色，然后令其获得一个【临】标记。有【临】标记的角色，回合将由你控制。其濒死时，移除【临】标记（标记最多不超过你的体力上限）",
                    "yzyy_shenlin2":"神临·降",
                    "yzyy_shenlin2_info":"神降",

                },
            },
            intro: "",
            author: "raincither",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        }, files: { "character": ["yzyy_xuling.jpg",], "card": [], "skill": [] }
    }
})