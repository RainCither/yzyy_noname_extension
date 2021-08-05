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
                    "yzyy_taiyi":["male", "shen", 3, ["yzyy_huanshen",], ["forbidai", "des:天生地养，抱守如一。"]],
                    "yzyy_xuling": ["female", "shen", 3, ["yzyy_tianxin", "yzyy_guixu","yzyy_qianyi","yzyy_souxun", "yzyy_shenlin","yzyy_xuwu", ], ["forbidai", "des:游凡巡幽，居天塌道。天心如一，命运造化。"]],
                },
                translate: {
                    "yzyy_taiyi":"太一",
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
                    yzyy_huanshen: {
                        unique: true,
                        forced: true,
                        init: function (player) {
                            if (!player.storage.yzyy_huanshen) {
                                player.storage.yzyy_huanshensha = false;
                                player.storage.yzyy_huanshentao = false;
                                player.storage.yzyy_huanshenshan = false;
                                player.storage.yzyy_huanshenwuxie = false;
                                player.storage.yzyy_huanshen = {
                                    list: [],
                                    owned: [],
                                    player: player,
                                    zhuSkill: [],
                                    juexing: [],
                                    limited: [],
                                    locked: [],
                                }
                            }
                        },
                        get: function (player, num) {
                            var skills2 = [];
                            if (typeof num != 'number') num = 1;
                            while (num--) {
                                var name = player.storage.yzyy_huanshen.list.randomRemove();
                                var skills = lib.character[name][3].slice(0);
                                var update = function (str, info, skill, currrentSkill) {
                                    currrentSkill = currrentSkill || skill
                                    str = str.replace(/<\/?.+?\/?>/g, '')
                                    if (info.juexing || str.indexOf('觉醒技') == 0 || str.indexOf('限定技') == 0
                                        || info.zhuSkill || info.limited || (info.intro && info.intro.content == 'limited')
                                        || get.is.locked(currrentSkill)) {
                                        if (info.limited || str.indexOf('限定技') == 0 || (info.intro && info.intro.content == 'limited')) {
                                            player.storage.yzyy_huanshentao = true;
                                            player.storage.yzyy_huanshen.limited.add(name);
                                        }
                                        if (str.indexOf('觉醒技') == 0 || info.juexing) {
                                            player.storage.yzyy_huanshenwuxie = true;
                                            player.storage.yzyy_huanshen.juexing.add(name);
                                        }
                                        if (get.is.locked(currrentSkill)) {
                                            player.storage.yzyy_huanshenshan = true;
                                            player.storage.yzyy_huanshen.locked.add(name);
                                        }
                                        if (info.zhuSkill || str.indexOf('主公技') == 0) {
                                            player.storage.yzyy_huanshensha = true;
                                            player.storage.yzyy_huanshen.zhuSkill.add(name);
                                        }
                                    }
                                    info.group && groupSkill(info.group, skill)
                                }
                                var groupSkill = function (skill, skillx) {
                                    if (Array.isArray(skill)) {
                                        for (var i of skill) {
                                            var str = lib.translate[i + '_info'];
                                            var info = lib.skill[i];
                                            if (!str) str = ""
                                            if (!info) {
                                                skills.remove(skillx)
                                                continue;
                                            }
                                            if (player.skills.contains(i)) {
                                                skills.remove(skillx);
                                                continue;
                                            }
                                            update(str, info, skillx, i)
                                        }
                                    } else {
                                        var info = lib.skill[skill]
                                        if (!info) return false
                                        var str = lib.translate[skill + '_info']
                                        if (!str) str = ""
                                        update(str, info, skillx)
                                    }
                                }
                                for (var j of skills.slice(0)) {
                                    var info = lib.skill[j]
                                    var str = lib.translate[j + "_info"]
                                    if (!info || !str) {
                                        skills.remove(j)
                                        continue;
                                    }
                                    update(str, info, j);
                                }
                                skills2 = skills2.concat(skills);
                                player.storage.yzyy_huanshen.owned.push(name);
                                player.popup(name);
                                game.log(player, '获得了一张武将牌');
                            }
                            var mark = player.marks.yzyy_huanshen;
                            if (mark.firstChild) {
                                mark.firstChild.remove();
                            }
                            mark.setBackground(player.name, 'character');
                            player.addSkill(skills2, true);
                        },
                        update: function (player, name) {
                            player.storage.yzyy_huanshen.owned.remove(name);
                            if (player.storage.yzyy_huanshen.zhuSkill.includes(name)) {
                                player.storage.yzyy_huanshen.zhuSkill.remove(name);
                            }
                            if (player.storage.yzyy_huanshen.locked.includes(name)) {
                                player.storage.yzyy_huanshen.locked.remove(name);
                            }
                            if (player.storage.yzyy_huanshen.limited.includes(name)) {
                                player.storage.yzyy_huanshen.limited.remove(name);
                            }
                            if (player.storage.yzyy_huanshen.juexing.includes(name)) {
                                player.storage.yzyy_huanshen.juexing.remove(name);
                            }
                            player.storage.yzyy_huanshen.list.push(name);
                            if (player.storage.yzyy_huanshen.zhuSkill.length < 1)
                                player.storage.yzyy_huanshensha = false;
                            if (player.storage.yzyy_huanshen.locked.length < 1)
                                player.storage.yzyy_huanshenshan = false;
                            if (player.storage.yzyy_huanshen.limited.length < 1)
                                player.storage.yzyy_huanshentao = false;
                            if (player.storage.yzyy_huanshen.juexing.length < 1)
                                player.storage.yzyy_huanshenwuxie = false;
                        },
                        presha: function () {
                            'step 0'
                            var list = player.storage.yzyy_huanshen.zhuSkill;
                            var str = '将拥有主公技的武将牌当做【' + '杀' + '】使用或打出';
                            event.dialog = ui.create.dialog(str, [list, 'character']);
                            var next = player.chooseButton(event.dialog, true, function (button) {
                                return 1;
                            });
                            'step 1'
                            if (result.bool) {
                                var name = result.buttons[0].link;
                                lib.skill.yzyy_huanshen.update(player, name);
                            }
                            else {
                                event.finish();
                            }
                        },
                        preshan: function () {
                            'step 0'
                            var list = player.storage.yzyy_huanshen.locked;
                            var str = '将拥有锁定技的武将牌当做【' + '闪' + '】使用或打出';
                            event.dialog = ui.create.dialog(str, [list, 'character']);
                            var next = player.chooseButton(event.dialog, true, function (button) {
                                return 1;
                            });
                            'step 1'
                            if (result.bool) {
                                var name = result.buttons[0].link;
                                lib.skill.yzyy_huanshen.update(player, name);
                            }
                            else {
                                event.finish();
                            }
                        },
                        pretao: function () {
                            'step 0'
                            var list = player.storage.yzyy_huanshen.limited;
                            var str = '将拥有限定技的武将牌当做【' + '桃' + '】使用或打出';
                            event.dialog = ui.create.dialog(str, [list, 'character']);
                            var next = player.chooseButton(event.dialog, true, function (button) {
                                return 1;
                            });
                            'step 1'
                            if (result.bool) {
                                var name = result.buttons[0].link;
                                lib.skill.yzyy_huanshen.update(player, name);
                            }
                            else {
                                event.finish();
                            }
                        },
                        prewuxie: function () {
                            'step 0'
                            var list = player.storage.yzyy_huanshen.juexing;
                            var str = '将拥有觉醒技的武将牌当做【' + '无懈可击' + '】使用或打出';
                            event.dialog = ui.create.dialog(str, [list, 'character']);
                            var next = player.chooseButton(event.dialog, true, function (button) {
                                return 1;
                            });
                            'step 1'
                            if (result.bool) {
                                var name = result.buttons[0].link;
                                lib.skill.yzyy_huanshen.update(player, name);
                            }
                            else {
                                event.finish();
                            }
                        },
                        ai: {
                            skillTagFilter: function (player, tag) {
                                switch (tag) {
                                    case 'respondSha': {
                                        if (!player.storage.yzyy_huanshensha) return false;
                                        break;
                                    }
                                    case 'respondShan': {
                                        if (!player.storage.yzyy_huanshenshan) return false;
                                        break;
                                    }
                                    case 'save': {
                                        if (!player.storage.yzyy_huanshentao) return false;
                                        break;
                                    }
                                }
                            },
                            save: true,
                            respondSha: true,
                            respondShan: true,
                            threaten: 3,
                        },
                        group: ["yzyy_huanshen1", "yzyy_huanshen2", "yzyy_huanshen3", "yzyy_huanshen4", "yzyy_huanshen5", "yzyy_huanshen6", "yzyy_huanshen7"],
                        intro: {
                            content: function (storage, player) {
                                var str = '';
                                var list = storage.owned;
                                if (list.length) {
                                    str += get.translation(list[0]);
                                    for (var i = 1; i < list.length; i++) {
                                        str += '、' + get.translation(list[i]);
                                    }
                                }
                                var skills = player.additionalSkills['yzyy_huanshen'];
                                if (skills.length) {
                                    str += '<p>当前技能：' + get.translation(skills[0]);
                                    for (var i = 1; i < skills.length; i++) {
                                        str += '、' + get.translation(skills[i]);
                                    }
                                }
                                return str;
                            },
                            mark: function (dialog, content, player) {
                                var list = content.owned;
                                if (list.length) {
                                    dialog.addAuto([list, 'character']);
                                    if (content.locked.length > 0) {
                                        dialog.addText('拥有锁定技的武将（闪）');
                                        dialog.add([content.locked, 'character']);
                                    };
                                    if (content.limited.length > 0) {
                                        dialog.addText('拥有限定技的武将（桃）');
                                        dialog.add([content.limited, 'character']);
                                    };
                                    if (content.juexing.length > 0) {
                                        dialog.addText('拥有觉醒技的武将（无懈）');
                                        dialog.add([content.juexing, 'character']);
                                    };
                                    if (content.zhuSkill.length > 0) {
                                        dialog.addText('拥有主公技的武将（杀）');
                                        dialog.add([content.zhuSkill, 'character']);
                                    };
                                }
                            },
                        },
                        mark: true,
                    },
                    yzyy_huanshen1: {
                        trigger: {
                            global: ["gameStart", "phaseBefore"],
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event, player) {
                            return !player.storage.yzyy_huansheninited;
                        },
                        content: function () {
                            for (var i in lib.character) {
                                if (lib.filter.characterDisabled2(i)) continue;
                                player.storage.yzyy_huanshen.list.add(i);
                            }
                            for (var i = 0; i < game.players.length; i++) {
                                player.storage.yzyy_huanshen.list.remove([game.players[i].name]);
                                player.storage.yzyy_huanshen.list.remove([game.players[i].name1]);
                                player.storage.yzyy_huanshen.list.remove([game.players[i].name2]);
                            }
                            lib.skill.yzyy_huanshen.get(player, 2);
                            player.storage.yzyy_huansheninited = true;
                        },
                    },
                    yzyy_huanshen2: {
                        trigger: {
                            player: ["phaseBegin", "damageEnd"],
                        },
                        forced: true,
                        priority: 10,
                        filter: function (event, player) {
                            return player.storage.yzyy_huanshen && player.storage.yzyy_huanshen.list &&
                                player.storage.yzyy_huanshen.list.length > 0;
                        },
                        content: function () {
                            lib.skill.yzyy_huanshen.get(player);
                        },
                        ai: {
                            maixie: true,
                        },
                    },
                    yzyy_huanshen3: {
                        forced: true,
                        enable: ["chooseToUse", "chooseToRespond"],
                        prompt: "拥有限定技的武将牌当做【桃】使用或打出",
                        filter: function (event, player) {
                            return player.storage.yzyy_huanshentao;
                        },
                        popname: true,
                        filterCard: function () { return false; },
                        selectCard: -1,
                        viewAs: {
                            name: "tao",
                        },
                        onuse: function (result, player) {
                            var next = game.createEvent('yzyy_huanshenCards');
                            next.player = player;
                            next.setContent(lib.skill.yzyy_huanshen.pretao);
                        },
                        onrespond: function (result, player) {
                            var next = game.createEvent('yzyy_huanshenCards');
                            next.player = player;
                            next.setContent(lib.skill.yzyy_huanshen.pretao);
                        },
                        ai: {
                            basic: {
                                order: function (card, player) {
                                    if (player.hasSkillTag('pretao')) return 5;
                                    return 2;
                                },
                                useful: [8, 6.5, 5, 4],
                                value: [8, 6.5, 5, 4],
                            },
                            result: {
                                target: function (player, target) {
                                    // if(player==target&&player.hp<=0) return 2;
                                    if (player.hasSkillTag('nokeep')) return 2;
                                    var nd = player.needsToDiscard();
                                    var keep = false;
                                    if (nd <= 0) {
                                        keep = true;
                                    }
                                    else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
                                        keep = true;
                                    }
                                    var mode = get.mode();
                                    if (target.hp >= 2 && keep && target.hasFriend()) {
                                        if (target.hp > 2 || nd == 0) return 0;
                                        if (target.hp == 2) {
                                            if (game.hasPlayer(function (current) {
                                                if (target != current && get.attitude(target, current) >= 3) {
                                                    if (current.hp <= 1) return true;
                                                    if ((mode == 'identity' || mode == 'versus' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
                                                }
                                            })) {
                                                return 0;
                                            }
                                        }
                                    }
                                    if (target.hp < 0 && target != player && target.identity != 'zhu') return 0;
                                    var att = get.attitude(player, target);
                                    if (att < 3 && att >= 0 && player != target) return 0;
                                    var tri = _status.event.getTrigger();
                                    if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                                        if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                                            var num = game.countPlayer(function (current) {
                                                if (current.identity == 'fan') {
                                                    return current.countCards('h', 'tao');
                                                }
                                            });
                                            if (num > 1 && player == target) return 2;
                                            return 0;
                                        }
                                    }
                                    if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                                        if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                                            return 0;
                                        }
                                    }
                                    if (mode == 'stone' && target.isMin() &&
                                        player != target && tri && tri.name == 'dying' && player.side == target.side &&
                                        tri.source != target.getEnemy()) {
                                        return 0;
                                    }
                                    return 2;
                                },
                                "target_use": function (player, target) {
                                    // if(player==target&&player.hp<=0) return 2;
                                    if (player.hasSkillTag('nokeep', true, null, true)) return 2;
                                    var nd = player.needsToDiscard();
                                    var keep = false;
                                    if (nd <= 0) {
                                        keep = true;
                                    }
                                    else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
                                        keep = true;
                                    }
                                    var mode = get.mode();
                                    if (target.hp >= 2 && keep && target.hasFriend()) {
                                        if (target.hp > 2 || nd == 0) return 0;
                                        if (target.hp == 2) {
                                            if (game.hasPlayer(function (current) {
                                                if (target != current && get.attitude(target, current) >= 3) {
                                                    if (current.hp <= 1) return true;
                                                    if ((mode == 'identity' || mode == 'versus' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
                                                }
                                            })) {
                                                return 0;
                                            }
                                        }
                                    }
                                    if (target.hp < 0 && target != player && target.identity != 'zhu') return 0;
                                    var att = get.attitude(player, target);
                                    if (att < 3 && att >= 0 && player != target) return 0;
                                    var tri = _status.event.getTrigger();
                                    if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                                        if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                                            var num = game.countPlayer(function (current) {
                                                if (current.identity == 'fan') {
                                                    return current.countCards('h', 'tao');
                                                }
                                            });
                                            if (num > 1 && player == target) return 2;
                                            return 0;
                                        }
                                    }
                                    if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                                        if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                                            return 0;
                                        }
                                    }
                                    if (mode == 'stone' && target.isMin() &&
                                        player != target && tri && tri.name == 'dying' && player.side == target.side &&
                                        tri.source != target.getEnemy()) {
                                        return 0;
                                    }
                                    return 2;
                                },
                            },
                            tag: {
                                recover: 1,
                                save: 1,
                            },
                        },
                    },
                    yzyy_huanshen4: {
                        forced: true,
                        enable: ["chooseToUse", "chooseToRespond"],
                        prompt: "将拥有主公技的武将牌当做普通【杀】使用或打出",
                        filter: function (event, player) {
                            return player.storage.yzyy_huanshensha;
                        },
                        popname: true,
                        filterCard: function () { return false; },
                        selectCard: -1,
                        viewAs: {
                            name: "sha",
                        },
                        onuse: function (result, player) {
                            var next = game.createEvent('yzyy_huanshenCards');
                            next.player = player;
                            next.setContent(lib.skill.yzyy_huanshen.presha);
                        },
                        onrespond: function (result, player) {
                            var next = game.createEvent('yzyy_huanshenCards');
                            next.player = player;
                            next.setContent(lib.skill.yzyy_huanshen.presha);
                        },
                        ai: {
                            basic: {
                                useful: [5, 1],
                                value: [5, 1],
                            },
                            order: function () {
                                if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
                                return 3;
                            },
                            result: {
                                target: function (player, target) {
                                    if (player.hasSkill('jiu') && !target.hasSkillTag('filterDamage', null, {
                                        player: player,
                                        card: { name: 'sha' },
                                    })) {
                                        if (get.attitude(player, target) > 0) {
                                            return -7;
                                        }
                                        else {
                                            return -4;
                                        }
                                    }
                                    return -1.5;
                                },
                            },
                            tag: {
                                respond: 1,
                                respondShan: 1,
                                damage: function (card) {
                                    if (card.nature == 'poison') return;
                                    return 1;
                                },
                                natureDamage: function (card) {
                                    if (card.nature) return 1;
                                },
                                fireDamage: function (card, nature) {
                                    if (card.nature == 'fire') return 1;
                                },
                                thunderDamage: function (card, nature) {
                                    if (card.nature == 'thunder') return 1;
                                },
                                poisonDamage: function (card, nature) {
                                    if (card.nature == 'poison') return 1;
                                },
                            },
                            canLink: function (player, target, card) {
                                if (!target.isLinked() && !player.hasSkill('wutiesuolian_skill')) return false;
                                if (target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                                    target: target,
                                    card: card,
                                }, true)) return false;
                                if (player.hasSkill('jueqing') || target.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
                                return true;
                            },
                        },
                    },
                    yzyy_huanshen5: {
                        forced: true,
                        enable: ["chooseToUse", "chooseToRespond"],
                        prompt: "将拥有锁定技的武将牌当做【闪】使用或打出",
                        filter: function (event, player) {
                            return player.storage.yzyy_huanshenshan;
                        },
                        popname: true,
                        filterCard: function () { return false; },
                        selectCard: -1,
                        viewAs: {
                            name: "shan",
                        },
                        onuse: function (result, player) {
                            var next = game.createEvent('yzyy_huanshenCards');
                            next.player = player;
                            next.setContent(lib.skill.yzyy_huanshen.preshan);
                        },
                        onrespond: function (result, player) {
                            var next = game.createEvent('yzyy_huanshenCards');
                            next.player = player;
                            next.setContent(lib.skill.yzyy_huanshen.preshan);
                        },
                        ai: {
                            basic: {
                                useful: [7, 2],
                                value: [7, 2],
                            },
                            result: {
                                player: 1,
                            },
                            order: 3,
                        },
                    },
                    yzyy_huanshen6: {
                        forced: true,
                        enable: ["chooseToUse", "chooseToRespond"],
                        prompt: "将拥有觉醒技的武将牌当做【无懈可击】使用或打出",
                        viewAsFilter: function (player) {
                            if (!player.storage.yzyy_huanshenwuxie) return false;
                            return true;
                        },
                        popname: true,
                        filterCard: function () { return false; },
                        selectCard: -1,
                        viewAs: {
                            name: "wuxie",
                        },
                        onuse: function (result, player) {
                            var next = game.createEvent('yzyy_huanshenCards');
                            next.player = player;
                            next.setContent(lib.skill.yzyy_huanshen.prewuxie);
                        },
                        onrespond: function (result, player) {
                            var next = game.createEvent('yzyy_huanshenCards');
                            next.player = player;
                            next.setContent(lib.skill.yzyy_huanshen.prewuxie);
                        },
                        ai: {
                            basic: {
                                useful: [6, 4],
                                value: [6, 4],
                            },
                            result: {
                                player: 1,
                            },
                            expose: 0.2,
                        },
                    },
                    yzyy_huanshen7: {
                        forced: true,
                        enable: "phaseUse",
                        prompt: "移除一个技能",
                        filter: function (card, player, target) {
                            return true;
                        },
                        content: function () {
                            'step 0'
                            var list = player.getSkills();
                            list.remove(lib.character[player.name][3]);
                            var dialog = ui.create.dialog('forcebutton');
                            dialog.add('选择要移除的技能');
                            var clickItem = function () {
                                _status.event._result = this.link;
                                dialog.close();
                                game.resume();
                            };
                            for (var i = 0; i < list.length; i++) {
                                var item = dialog.add('<div class="popup pointerdiv" style="width:50%;display:inline-block;text-align: center">【' + get.translation(list[i]) + '】</div>');
                                item.firstChild.addEventListener('click', clickItem);
                                item.firstChild.link = list[i];
                            }
                            dialog.add(ui.create.div('.placeholder'));
                            event.switchToAuto = function () {
                                event._result = event.skillai();
                                dialog.close();
                                game.resume();
                            };
                            _status.imchoosing = true;
                            game.pause();
                            'step 1'
                            _status.imchoosing = false;
                            var link = result;
                            player.removeSkill(link);
                            game.log(player, '移除了技能', '【' + get.translation(link) + '】');
                            game.delay();
                        },
                    },
                    yzyy_xuwu: {
                        audio: "2",
                        forced: true,
                        init: function (player) {
                            if (player.name != "yzyy_xuling") {
                                player.removeSkill("yzyy_xuwu");
                                return;
                            }
                            player._trueMe = player;
                            var arr = ["clearSkills", "disableSkill", "disabledSkills", "goMad", "skip", "reinit", "disableEquip", "disableJudge"];
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
                                    player.xuhp = player.maxHp;
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
                                audio: "2",
                                trigger: {
                                    player: ["loseMaxHpBegin", "loseHpBefore","damageBegin", "linkBefore", "turnOverBefore",],
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
                    yzyy_qianyi: {
                        audio: "2",
                        forced: true,
                        group: ["yzyy_qianyi_gong","yzyy_qianyi_shou"],
                        subSkill: {
                            gong:{
                                audio: "2",
                                trigger: {
                                    source: "damageBegin",
                                },
                                priority: -9,
                                forced: true,
                                content: function () {
                                    "step 0"
                                    player.chooseTarget('是否选择一名角色让其成为此伤害的来源？').set('ai', function (target) {
                                        return -ai.get.attitude(player, target);
                                    });
                                    "step 1"
                                    if (result.bool && result.targets && result.targets.length) {
                                        player.line(result.targets[0], 'green');
                                        trigger.source = result.targets[0];
                                        result.targets[0].line(trigger.player, 'green');
                                        trigger.trigger();
                                    }else{
                                        delete trigger.source;
                                    }
                                },
                                sub: true,
                            },
                            shou:{
                                audio: "2",
                                trigger: {
                                    player: "damageBefore",
                                },
                                forced: true,
                                content: function () {
                                    'step 0'
                                    var card = get.cards();
                                    event.color = get.color(card);
                                    trigger.player.showCards(card);
                                    game.cardsDiscard(card);
                                    'step 1'
                                    if( event.color == "black") {
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
                        },
                    },
                    yzyy_qianshou: {
                        group:["yzyy_qianshou_mark","yzyy_qianshou_buff"],
                        subSkill:{
                            mark:{
                                trigger: {
                                    player: "damageEnd",
                                },
                                filter: function (event, player) {
                                    return event.source;
                                },
                                content: function () {
                                    trigger.source.addMark("yzyy_qianshou_mark",trigger.num);
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
                                    return event.player.hasMark("yzyy_qianshou_mark");
                                },
                                content: function () {
                                    "step 0"
                                    trigger.player.removeMark("yzyy_qianshou_mark", 1);
                                    trigger.player.judge();
                                    "step 1"
                                    var target = trigger.player;
                                    switch (result.suit) {
                                        case 'heart': target.loseHp(); target.draw(); break;
                                        case 'diamond': target.link(); target.damage("nosource", 1, "fire"); break;
                                        case 'spade': target.addTempSkill("yzyy_yigong_buff1"); target.addMark("yzyy_yigong_buff1",1,false);  player.draw();break;
                                        case 'club':target.turnOver(); target.randomDiscard(); break;
                                    }
                                    "step 2"
                                    if(trigger.player.hasMark("yzyy_qianshou_mark")) event.goto(0);
                                },
                                sub:true,
                            },
                            buff1:{
                                onremove:true,
                                mark:true,
                                mod:{
                                    maxHandcard:function(player,num){
                                        return num-player.countMark('rewangzun2');
                                    },
                                },
                                intro:{content:'手牌上限-#'},
                            },
                        },
                    },
                    yzyy_tianxin: {
                        audio: "2",
                        enable: "phaseUse",
                        forced: true,
                        usable: 1,
                        init:function(player){
                            player.storage.yzyy_tianxin_txsha = 0;
                        },
                        content: function () {
                            "step 0"
                            player.storage.yzyy_tianxin_txsha = 0;
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
                                player.storage.yzyy_tianxin_txsha++;
                                event.goto(1);
                            } else {
                                player.addTempSkill("yzyy_tianxin_txsha");
                                card.fix();
                                ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                game.updateRoundNumber(); 
                            }
                        },
                        subSkill:{
                            txsha:{
                                onremove:true,
                                mark:true,
                                marktext:"行",
                                intro:{ 
                                    name:"天行",
                                    content:'使用【杀】的次数上限+#',
                                },
                                mod:{
                                    cardUsable:function(card,player,num){
                                        if(card.name=='sha' && player.storage.yzyy_tianxin_txsha) return num + player.storage.yzyy_tianxin_txsha;
                                    },
                                },
                            },
                        },
                    },
                    yzyy_guixu: {
                        audio: "2",
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
                                audio: "2",
                                mark: true,
                                marktext:"掷",
                                intro: {
                                    name:"掷杀",
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
                                else if (get.type(name) == 'basic') list.push(['基本', '', name]);
                                else if (get.type(name) == 'equip') list.push(['装备', '', name]);
                                else if (get.type(name) == 'trick' || get.type(name) == 'delay') list.push(['锦囊', '', name]);
                                else list.push(['未知', '', name]);
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
                        frequent:true,
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
                                audio: "2",
                                forced: true,
                                trigger: { global: 'phaseBeginStart' },
                                filter: function (event, player) {
                                    if (lib.config.autoskilllist.contains('yzyy_shenlin')) return false;
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
                    "yzyy_huanshen": "幻神",
                    "yzyy_huanshen_info": "锁定技，游戏开始时，你从武将牌堆中随机获得两张武将牌。你获得武将牌上的技能。每到你的回合开始时或你受到一次伤害后，你随机获得一张武将牌。你可以将拥有锁定技的武将牌当做【闪】使用或打出；将拥有主公技的武将牌当做普通【杀】使用或打出；将拥有限定技的武将牌当做【桃】使用或打出；将拥有觉醒技的武将牌当做【无懈可击】使用或打出。出牌阶段，你可以移除任意技能",
                    "yzyy_huanshen1": "幻神·生",
                    "yzyy_huanshen2": "幻神·幻",
                    "yzyy_huanshen3": "幻神·桃",
                    "yzyy_huanshen4": "幻神·杀",
                    "yzyy_huanshen5": "幻神·闪",
                    "yzyy_huanshen6": "幻神·无懈",
                    "yzyy_huanshen7": "幻神·灭",
                    "yzyy_xuwu": "虚无",
                    "yzyy_xuwu_info": "锁定技。当你成为一张牌的目标时，有90%的概率令此牌失效然后获得此牌。当你受到伤害时，有90%的概率防止此伤害。你的体力上限无法降低。准备阶段，你置空判定区，并摸x张牌下（x为弃置数）。你的手牌没有上限，出牌无视距离，非延时锦囊牌不能被无懈可击响应。 铁索，翻面，混乱，体力流失，封印对你无效。免疫一般即死。死亡后复活。每有一名角色死亡，你增加一点体力上限，并回复一点体力。",
                    "yzyy_yigong":"弈攻",
                    "yzyy_yigong_info":"受到伤害后，伤害来源获得一枚【弃】标记。拥有【弃】标记的角色，其出牌阶段开始时判定，♥流失一点体力并摸一张牌、♠减一手牌上限并令你摸一张牌、♦横置并受到一点火焰伤害、♣翻面并随机弃置一张牌",
                    "yzyy_qianyi":"谦弈",
                    "yzyy_qianyi_info":"锁定技。当你对一名角色造成伤害前，可以选择一名角色让其成为此伤害的来源，否则视为无来源。当你受到伤害时，展示牌堆顶的一张牌，然后置入弃牌堆。若结果为红色，你可以选择一名角色替你承受此次伤害，并摸x张牌。若为黑色，你摸x张牌。(x为此次受到的伤害值)",
                    "yzyy_tianxin": "天行",
                    "yzyy_tianxin_info": "出牌阶段限一次，你可展示牌堆顶的一张牌并使用之。若如此做，你重复此流程，直到你以此法展示的牌无法使用为止。每以此法使用一张牌，你使用杀的上限+1。",
                    "yzyy_guixu": "同掷",
                    "yzyy_guixu_info": "出牌阶段，你可以弃置X张牌，选择一名目标也弃置X张牌。若你弃置的牌中有杀，则下次【杀】的伤害加y（y为你弃置杀的数量）。",
                    "yzyy_souxun": "铸宝",
                    "yzyy_souxun_info": '出牌阶段限x次，你可以声明一张卡牌名称，然后若牌堆里有和你声明的同名称卡牌，你随机获得一张。（x为你的体力值）',
                    "yzyy_shenlin":"神临",
                    "yzyy_shenlin_info":'出牌阶段限一次，你可以展示一张手牌，并交给一名角色，然后令其获得一个【临】标记。有【临】标记的角色，回合将由你控制。其濒死时，移除【临】标记（标记最多不超过你的体力上限）<span class="bluetext" style="color:#FF6500">你可以关闭【自动发动】使技能不发动</span>',
                    "yzyy_shenlin2":"降神",
                    "yzyy_shenlin2_info":"神降",

                },
            },
            intro: "",
            author: "raincither",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        }, files: { "character": ["yzyy_xuling.jpg","yzyy_taiyi.jpg"], "card": [], "skill": [] }
    }
})