game.import("extension", function (lib, game, ui, get, ai, _status) {
    return {
        name: "雨筝", 
        editable:false,
        content: function (config, pack) {

            

            //修复 概念武将与十周年UI 同时生效时 按钮背景多出来一块
            var selectcontrols = function(event){
                    if(event.target.id == "dui-controls"){
                        event.target.addEventListener("DOMSubtreeModified", function(event){
                            if(event.target["getElementsByClassName"] == undefined) return;
                            const list = event.target.getElementsByClassName("combo-control");
                            if(list.length != 0){
                                list[0].style.setProperty('background-image', 'none', 'important');
                            }
                        });
                        document.removeEventListener("DOMSubtreeModified", selectcontrols);
                    } 
                }
            document.addEventListener("DOMSubtreeModified", selectcontrols);

            //颜色代码
            var style1=document.createElement('style');
            style1.innerHTML=".player .identity[data-color='yinshi'],";
            style1.innerHTML+="div[data-nature='yinshi'],";
            style1.innerHTML+="span[data-nature='yinshi'] {text-shadow: black 0 0 1px,rgba(93,63,81,1) 0 0 2px,rgba(93,63,81,1) 0 0 5px,rgba(93,63,81,1) 0 0 10px,rgba(93,63,81,1) 0 0 10px}";
            style1.innerHTML+="div[data-nature='yinshim'],";
            style1.innerHTML+="span[data-nature='yinshim'] {text-shadow: black 0 0 1px,rgba(255,192,203,1) 0 0 2px,rgba(255,192,203,1) 0 0 5px,rgba(255,192,203,1) 0 0 5px,rgba(255,192,203,1) 0 0 5px,black 0 0 1px;}";
            style1.innerHTML+="div[data-nature='yinshimm'],";
            style1.innerHTML+="span[data-nature='yinshimm'] {text-shadow: black 0 0 1px,rgba(255,128,204,1) 0 0 2px,rgba(255,128,204,1) 0 0 2px,rgba(255,128,204,1) 0 0 2px,rgba(255,128,204,1) 0 0 2px,black 0 0 1px;}";
            
            lib.group.add('yinshi');
            lib.translate.yinshi='隐';
            lib.translate.yinshi2='隐';
            lib.groupnature.yinshi='yinshi';
            /*十周年UI武将名背景*/
            var yinshiTenUi=document.createElement('style');
            yinshiTenUi.innerHTML=".player>.camp-zone[data-camp='yinshi']>.camp-back {background: linear-gradient(to bottom, rgb(192,72,81), rgb(236,118,150), rgb(93,63,81));}";        
            /*十周年UI势力*/       
            yinshiTenUi.innerHTML+=".player>.camp-zone[data-camp='yinshi']>.camp-name {text-shadow: 0 0 5px rgb(93,63,81), 0 0 10px rgb(93,63,81), 0 0 15px rgb(93,63,81);}";        
            document.head.appendChild(yinshiTenUi);

            //---------------------------------- 变换颜色 ----------------------------------//
			var style=document.createElement('style');
			style.innerHTML="@keyframes yuzheng_character_config{"
            style.innerHTML+=0+'%{color:rgb(192,72,81);}';
            style.innerHTML+=25+'%{color:rgb(236,118,150);}';
            style.innerHTML+=50+'%{color:rgb(255,128,204);}';
            style.innerHTML+=75+'%{color:rgb(255,0,204);}';
            style.innerHTML+=100+'%{color:rgb(93,63,81);}';
			style.innerHTML+="}";
			document.head.appendChild(style);

            if(config.yuzheng){
                for(var i in lib.characterPack['yuzheng']) {
                if(lib.character[i][4].indexOf("forbidai")<0)lib.character[i][4].push("forbidai");
                };
            };//选项触发内容，原因见config

            if (config.yuzheng_boos) {
                lib.arenaReady.push(function() {			            
                    var yuzheng_character = lib.characterPack['yuzheng'];
                        for (i in yuzheng_character) {
                            var boos = yuzheng_character[i][4];
                            if (boos.indexOf("boss") >= 0) {
                                boos[boos.indexOf("boss")] = '';
                                boos[boos.indexOf("bossallowed")] = '';
                            }						
                        }							       
                });
            }
        }, 
        precontent: function (config) {
            if(config.enable){
                game.import('character',function(){
                    var yuzheng = {
                        name: 'yuzheng',
                        connect:true,
                        characterSort:{
                            yuzheng:{
                                "yzyy_booshen":["yzyy_xuling",],
                                "yzyy_tianming":["yzyy_taiyi","yzyy_zhiqi","yzyy_xinjing","yzyy_huanhua"],
                           },
                       },				
                        character:{
                            yzyy_xuling: ["female", "shen", 1, ["yzyy_xuwu","yzyy_jimie","yzyy_guixu", "yzyy_shenlin",], ["boss"]],

                            yzyy_taiyi:["male", "yinshi", 3, ["yzyy_huanshen",], []],
                            yzyy_zhiqi:["male", "yinshi", 3, ["yzyy_yichuang","yzyy_yishou","yzyy_zhengzi"], []],
                            yzyy_xinjing:["female", "yinshi", 3, ["yzyy_fuzhi",], []],
                            yzyy_huanhua:["female", "yinshi", 4, ["yzyy_huanhua",], []],
                        },
                        //武将介绍（选填）
                        characterIntro:{
                            yzyy_taiyi: "天生地养，抱守如一。",
                            yzyy_xuling:"游凡巡幽，居天塌道。天心如一，命运造化。",
                            yzyy_zhiqi:"世事如棋，万物在心",
                        },
                        //武将标题（用于写称号或注释）（选填）
                        characterTitle:{},
                        //珠联璧合武将（选填）
                        perfectPair:{},
                        //技能（必填）
                        skill: {

                            yzyy_jshiyan:{
                                audio: "2",
                                forced: true,
                                init: function (player) {
                                    
                                },
                                group:["huimeng"],
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
                            },

                            yzyy_huanshen: {
                                unique: true,
                                locked: true,
                                forced: true,
                                init: function (player) {
                                    if (!player.storage.yzyy_huanshen) {
                                        player.storage.yzyy_huanshenzhi = false;
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
                                            common:[],
                                        }
                                    }
                                },
                                selectSkills: function (player, list) {
                                    'step 0'
                                    event.dialog=ui.create.dialog('forcebutton');
                                    event.dialog.add('选择获得一项技能');
                                    for(var i=0;i<list.length;i++){
                                        if(lib.translate[list[i]+'_info']){
                                            var translation=get.translation(list[i]);
                                            if(translation[0]=='新'&&translation.length==3){
                                                translation=translation.slice(1,3);
                                            }
                                            else{
                                                translation=translation.slice(0,2);
                                            }
                                            var item = event.dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【'+
                                            translation+'】</div><div>'+lib.translate[list[i]+'_info']+'</div></div>');
                                            
                                            item.firstChild.addEventListener(lib.config.touchscreen?'touchend':'click',ui.click.button);
                                            item.firstChild.link=list[i];
                                            for(var j in lib.element.button){
                                                item[j]=lib.element.button[j];
                                            }
                                            event.dialog.buttons.add(item.firstChild);
                                        }
                                    }
                                    event.dialog.add(ui.create.div('.placeholder'));
                                    var next = player.chooseButton(event.dialog, true,[0,Infinity], function (button) {
                                        return 1;
                                    });
                                    'step 1'
                                    event.dialog.close();
                                    if (result.bool) {
                                        var names = result.links;
                                        player.addSkill(names);
                                        for(var i=0; i<names.length;i++) player.popup(names[i]);
                                    }
                                    else {
                                        event.finish();
                                    }
                                },
                                judgeSkillType: function(player, name){
                                    var update = function (str, info, skill, currrentSkill) {
                                        currrentSkill = currrentSkill || skill
                                        str = str.replace(/<\/?.+?\/?>/g, '')
                                        var common = 0;
                                        
                                        if (info.limited || (info.intro && info.intro.content == 'limited') ||  str.indexOf('限定技') == 0) {
                                            player.storage.yzyy_huanshen.limited.add(name);
                                            player.storage.yzyy_huanshentao = true;
                                            common += 1;
                                        }
                                        if (info.juexing || str.indexOf('觉醒技') == 0) {
                                            player.storage.yzyy_huanshen.juexing.add(name);
                                            player.storage.yzyy_huanshenwuxie = true;
                                            common += 1;
                                        }
                                        if (get.is.locked(currrentSkill)) {
                                            player.storage.yzyy_huanshen.locked.add(name);
                                            player.storage.yzyy_huanshenshan = true;
                                            common += 1;
                                        }
                                        if (info.zhuSkill || str.indexOf('主公技') == 0) {
                                            player.storage.yzyy_huanshen.zhuSkill.add(name);
                                            player.storage.yzyy_huanshensha = true;
                                            common += 1;
                                        }
                                        
                                        if(info.group){
                                            common += groupSkill(info.group, skill)
                                        }

                                        return common;
                                    }
                                    var groupSkill = function (skill, skillx) {
                                        var common = 0;
                                        if (Array.isArray(skill)) {
                                            for (var i of skill) {
                                                var str = lib.translate[i + '_info'];
                                                var info = lib.skill[i];
                                                if (!str) str = ""
                                                if (!info) {
                                                    skills.remove(skillx)
                                                    continue;
                                                }
                                                common += update(str, info, skillx, i)
                                            }
                                        } else {
                                            var info = lib.skill[skill]
                                            if (!info) return false
                                            var str = lib.translate[skill + '_info']
                                            if (!str) str = ""
                                            common += update(str, info, skillx)
                                        }
                                        return common;
                                    }
                                    var skills = lib.character[name][3].slice(0);
                                    //检测该武将是否有无特殊技能
                                    var common = 0;
                                    for (var j of skills.slice(0)) {
                                        var info = lib.skill[j]
                                        var str = lib.translate[j + "_info"]
                                        //判断技能与描述是否存在
                                        if (!info || !str) {
                                            skills.remove(j)
                                            continue;
                                        }
                                        common += update(str, info, j);
                                    }
                                    if(common == 0){
                                        player.storage.yzyy_huanshen.common.add(name);
                                        player.storage.yzyy_huanshenzhi = true;
                                    }
                                    return skills;
                                }, 
                                get: function (player, num) {
                                    var skills2 = [];
                                    if (typeof num != 'number') num = 1;
                                    while (num--) {
                                        //随机获取武将
                                        var name = player.storage.yzyy_huanshen.list.randomRemove();
                                        var skills = lib.skill.yzyy_huanshen.judgeSkillType(player,name);
                                        
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
                                    return skills2;
                                },
                                update: function (player, name) {
                                    //清除数组里的技能
                                    player.storage.yzyy_huanshen.owned.remove(name);
                                    player.storage.yzyy_huanshen.common.remove(name);
                                    player.storage.yzyy_huanshen.zhuSkill.remove(name);
                                    player.storage.yzyy_huanshen.locked.remove(name);
                                    player.storage.yzyy_huanshen.limited.remove(name);
                                    player.storage.yzyy_huanshen.juexing.remove(name);
                                    //添加到待选列表
                                    if(Array.isArray(name)){
                                        for(var i=0; i<name.length;i++)
                                            player.storage.yzyy_huanshen.list.push(name[i]);
                                    }else{
                                        player.storage.yzyy_huanshen.list.push(name);
                                    }
                                    
                                    //重新判断是否拥有虚拟牌
                                    if (player.storage.yzyy_huanshen.common.length < 1)
                                        player.storage.yzyy_huanshenzhi = false;
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
                                    var next = player.chooseButton(event.dialog, true,function (button) {
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
                                prezhiheng: function(){
                                    'step 0'
                                    var list = player.storage.yzyy_huanshen.common;
                                    var str = '选择任意其他武将牌弃置，并莫等量的牌';
                                    event.dialog = ui.create.dialog(str, [list, 'character']);
                                    var next = player.chooseButton(event.dialog, true,[0, Infinity], function (button) {
                                        return 1;
                                    });
                                    'step 1'
                                    if (result.bool) {
                                        var names = result.links;
                                        player.draw(names.length);
                                        lib.skill.yzyy_huanshen.update(player, names);
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
                                group: ["yzyy_huanshen1", "yzyy_huanshen2", "yzyy_huanshen3", "yzyy_huanshen4", "yzyy_huanshen5", "yzyy_huanshen6", "yzyy_huanshen7", "yzyy_huanshen8"],
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
                                            // dialog.addAuto([list, 'character']);
                                            if (content.common.length > 0) {
                                                dialog.addText('普通武将（制衡）');
                                                dialog.add([content.common, 'character']);
                                            };
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
                                    global: ["gameStart"],
                                },
                                forced: true,
                                priority: Infinity,
                                filter: function (event, player) {
                                    return !player.storage.yzyy_huansheninited;
                                },
                                content: function () {
                                    'step 0'
                                    for (var i in lib.character) {
                                        if (lib.filter.characterDisabled2(i)) continue;
                                        player.storage.yzyy_huanshen.list.add(i);
                                    }
                                    // for (var i = 0; i < game.players.length; i++) {
                                    //     player.storage.yzyy_huanshen.list.remove([game.players[i].name]);
                                    //     player.storage.yzyy_huanshen.list.remove([game.players[i].name1]);
                                    //     player.storage.yzyy_huanshen.list.remove([game.players[i].name2]);
                                    // }
                                    var list = lib.skill.yzyy_huanshen.get(player, 2);
                                    event.dialog=ui.create.dialog('forcebutton');
                                    event.dialog.add('选择获得一项技能');
                                    for(var i=0;i<list.length;i++){
                                        if(lib.translate[list[i]+'_info']){
                                            var translation=get.translation(list[i]);
                                            if(translation[0]=='新'&&translation.length==3){
                                                translation=translation.slice(1,3);
                                            }
                                            else{
                                                translation=translation.slice(0,2);
                                            }
                                            var item = event.dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【'+
                                            translation+'】</div><div>'+lib.translate[list[i]+'_info']+'</div></div>');
                                            
                                            item.firstChild.addEventListener(lib.config.touchscreen?'touchend':'click',ui.click.button);
                                            item.firstChild.link=list[i];
                                            for(var j in lib.element.button){
                                                item[j]=lib.element.button[j];
                                            }
                                            event.dialog.buttons.add(item.firstChild);
                                        }
                                    }
                                    event.dialog.add(ui.create.div('.placeholder'));
                                    var next = player.chooseButton(event.dialog, true,[0,Infinity], function (button) {
                                        return 1;
                                    });
                                    'step 1'
                                    event.dialog.close();
                                    if (result.bool) {
                                        var names = result.links;
                                        player.addSkill(names);
                                        for(var i=0; i<names.length;i++) player.popup(names[i]);
                                    }
                                    else {
                                        event.finish();
                                    }
                                    player.storage.yzyy_huansheninited = true;
                                },
                            },
                            yzyy_huanshen2: {
                                trigger: {
                                    player: ["phaseBegin", "damageEnd"],
                                },
                                forced: true,
                                priority: Infinity,
                                filter: function (event, player) {
                                    return player.storage.yzyy_huanshen && player.storage.yzyy_huanshen.list &&
                                        player.storage.yzyy_huanshen.list.length > 0;
                                },
                                content: function () {
                                    'step 0'
                                    var list = lib.skill.yzyy_huanshen.get(player);
                                    event.dialog=ui.create.dialog('forcebutton');
                                    event.dialog.add('选择获得一项技能');
                                    for(var i=0;i<list.length;i++){
                                        if(lib.translate[list[i]+'_info']){
                                            var translation=get.translation(list[i]);
                                            if(translation[0]=='新'&&translation.length==3){
                                                translation=translation.slice(1,3);
                                            }
                                            else{
                                                translation=translation.slice(0,2);
                                            }
                                            var item = event.dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【'+
                                            translation+'】</div><div>'+lib.translate[list[i]+'_info']+'</div></div>');
                                            
                                            item.firstChild.addEventListener(lib.config.touchscreen?'touchend':'click',ui.click.button);
                                            item.firstChild.link=list[i];
                                            for(var j in lib.element.button){
                                                item[j]=lib.element.button[j];
                                            }
                                            event.dialog.buttons.add(item.firstChild);
                                        }
                                    }
                                    event.dialog.add(ui.create.div('.placeholder'));
                                    var next = player.chooseButton(event.dialog, true,[0,Infinity], function (button) {
                                        return 1;
                                    });
                                    'step 1'
                                    event.dialog.close();
                                    if (result.bool) {
                                        var names = result.links;
                                        player.addSkill(names);
                                        for(var i=0; i<names.length;i++) player.popup(names[i]);
                                    }
                                    else {
                                        event.finish();
                                    }
                                },
                                ai: {
                                    maixie: true,
                                },
                            },
                            //限定 桃
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
                            //主公 杀
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
                            //锁定 闪
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
                            //觉醒 无懈
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
                                init:function(player){
                                    player.yzyyGetSkills=function(arg2){
                                        var skills=this.skills.slice(0);
                                        var i,j;
                                        for(var i in this.additionalSkills){
                                            if(Array.isArray(this.additionalSkills[i])&&(arg2||i.indexOf('hidden:')!==0)){
                                                for(j=0;j<this.additionalSkills[i].length;j++){
                                                    if(this.additionalSkills[i][j]){
                                                        skills.add(this.additionalSkills[i][j]);
                                                    }
                                                }
                                            }
                                            else if(this.additionalSkills[i]&&typeof this.additionalSkills[i]=='string'){
                                                skills.add(this.additionalSkills[i]);
                                            }
                                        }
                                        for(var i in this.tempSkills){
                                            skills.add(i);
                                        }
                                        skills.addArray(this.hiddenSkills);
                                        return skills;
                                    }
                                },
                                filter: function (card, player, target) {
                                    return true;
                                },
                                content: function () {
                                    'step 0'
                                    var list = player.yzyyGetSkills();
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
                                    delete player.storage[link];
                                    game.log(player, '移除了技能', '【' + get.translation(link) + '】');
                                    game.delay();
                                },
                            },
                            yzyy_huanshen8: {
                                forced: true,
                                enable: "phaseUse",
                                prompt: "移除一个武将",
                                filter: function (card, player, target) {
                                    if (!player.storage.yzyy_huanshenzhi) return false;
                                    return true;
                                },
                                content: function () {
                                    var next = game.createEvent('yzyy_huanshenCards');
                                    next.player = player;
                                    next.setContent(lib.skill.yzyy_huanshen.prezhiheng);
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
                                    
                                    Object.freeze(player._trueMe);
                                    
                                    
                                    //置空技能
                                    var arr = ["clearSkills", "disableSkill", "disabledSkills", "goMad", "skip", "reinit", "disableEquip", "disableJudge"];
                                    for (var i in arr) {
                                        player[arr[i]] = function () {
                                            player.popup("虚·空");
                                            //player.$fullscreenpop('这里是永恒的虚空', 'fire');
                                        };
                                        Object.freeze(player[i]);
                                    }
                                    //复活
                                    var yongsheng = window.setInterval(function () {
                                        if (player.isDead()) {
                                            if (player.maxHp < 4) player.maxHp = 3;
                                            player.revive(Math.max(1, player.maxHp));
                                            player.draw(game.players.length);
                                        }
                                    }, 1000);
                                },
                                mod: {
                                    maxHandcard: function (player) {
                                        return player.maxHp;
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
                                group: ["yzyy_xuwu_my", "yzyy_xuwu_tf", "yzyy_xuwu_ts",],
                                subSkill: {
                                    tf:{
                                        trigger: {
                                            target: "useCardToTargeted",
                                        },
                                        forced: true,
                                        filter: function (event, player) {
                                            return true;
                                        },
                                        content: function () {
                                            player.draw();
                                        }
                                    },
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
                                    my: {
                                        trigger: {
                                            player: ["dieBegin","loseMaxHpBegin", "loseHpBefore", "linkBefore", "turnOverBefore",],
                                        },
                                        priority: Infinity,
                                        forced: true,
                                        forceDie: true,
                                        content: function () {
                                            if (player.hp > 0||player.countCards('he')>0) {
                                                trigger.untrigger;
                                                trigger.finish();
                                                player.recover(1 - player.hp);
                                            }
                                            
                                        },
                                        sub:true,
                                    },
                                },
                            },
                            yzyy_jimie: {
                                audio: "2",
                                enable: "phaseUse",
                                forced: true,
                                usable: 1,
                                init:function(player){
                                    
                                },
                                content: function () {
                                    'step 0'
                                    var card=get.cards()[0];
                                    event.card=card;
                                    player.showCards(card);
                                    if(!player.hasUseTarget(card)){
                                        card.fix();
                                        ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
                                        game.updateRoundNumber();
                                        event.finish();
                                    }
                                    'step 1'
                                    var next=player.chooseUseTarget(card,true);
                                    if(get.info(card).updateUsable=='phaseUse') next.addCount=false;
                                    'step 2'
                                    if(result.bool) event.goto(0);
                                    else{
                                        card.fix();
                                        ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
                                        game.updateRoundNumber();
                                    }
                                },
                            },
                            yzyy_guixu: {
                                audio: 2,
                                enable: 'phaseUse',
                                forced: true,
                                unique: true,
                                init: function (player) {
                                    if (player.name != "yzyy_xuling") {
                                        player.removeSkill("yzyy_guixu");
                                    }
                                },
                                filter: function (event, player, name) {
                                    return player.countSkill('yzyy_guixu') <= player.hp;
                                },
                                content:function(){
                                    'step 0'
                                    var controls=[];
                                    if(ui.cardPile.hasChildNodes()) controls.push('选择牌堆中的一张牌');
                                    if(ui.discardPile.hasChildNodes()) controls.push('选择弃牌堆中的一张牌');
                                    if(game.hasPlayer(function(current){
                                        return current.countCards('hej')>0;
                                    })) controls.push('选择一名角色区域内的一张牌');
                                    if(!controls.length){event.finish();return;}
                                    event.controls=controls;
                                    var next=player.chooseControl();
                                    next.set('choiceList',controls)
                                    next.set('prompt','请选择要获得卡牌的来源');
                                    next.ai=function(){return 0};
                                    'step 1'
                                    result.control=event.controls[result.index];
                                    var list=['弃牌堆','牌堆','角色'];
                                    for(var i=0;i<list.length;i++){
                                        if(result.control.indexOf(list[i])!=-1){event.index=i;break;}
                                    }
                                    if(event.index==2){
                                        player.chooseTarget('请选择要移动的卡牌的来源',true,function(card,kagari,target){
                                            return target.countCards('hej')>0;
                                        });
                                    }
                                    else{
                                        var source=ui[event.index==0?'discardPile':'cardPile'].childNodes;
                                        var list=[];
                                        for(var i=0;i<source.length;i++) list.push(source[i]);
                                        player.chooseButton(['请选择要获得的卡牌',list],true).ai=get.buttonValue;
                                    }
                                    'step 2'
                                    if(event.index==2){
                                        player.line(result.targets[0]);
                                        event.target1=result.targets[0];
                                        player.choosePlayerCard(result.targets[0],true,'hej').set('visible',true);
                                    }
                                    else{
                                        event.card=result.links[0];
                                    }
                                    'step 3'
                                    if(event.index==2) event.card=result.cards[0];
                                    'step 4'
                                    var list=['手牌区'];
                                    if(lib.card[card.name].type=='equip'&&player.isEmpty(lib.card[card.name].subtype)) list.push('装备区');
                                    if(list.length==1) event._result={control:list[0]};
                                    else{
                                        player.chooseControl(list).set('prompt','把'+get.translation(card)+'置入...').ai=function(){return 0};
                                    }
                                    'step 5'
                                    
                                    if(result.control=='手牌区'){
                                        var next=player.gain(card);
                                        if(event.target1){
                                            next.source=event.target1;
                                            next.animate='giveAuto';
                                        }
                                        else next.animate='draw';
                                    }
                                    else if(result.control=='装备区'){
                                        if(event.target1) event.target1.$give(card,player);
                                        player.equip(card);
                                    }                
                                    'step 6'
                                    game.updateRoundNumber();
                                },
                                ai:{
                                    order:10,
                                    result:{player:1},
                                },
                            },
                            yzyy_shenlin: {
                                init: function (player) {
                                    if (player.name != "yzyy_xuling") {
                                        player.removeSkill("yzyy_shenlin");
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
                                            global: ['dyingBefore',"damageBefore"], 
                                        },
                                        forceDie: true,
                                        forced: true,
                                        filter: function (event, player) {
                                            return event.player.hasMark("yzyy_shenlin_mark")&&event.name == "damageBefore" ? event.num>1:true;
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

                            yzyy_yichuang:{
                                audio: "2",
                                forced: true,
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
                                }
                            },
                            yzyy_yishou: {
                                audio: "2",
                                forced: true,
                                audio: "2",
                                trigger: {
                                    player: "damageBefore",
                                },
                                forced: true,
                                content: function () {
                                    'step 0'
                                    //展示牌堆顶一张牌然后置入弃牌堆
                                    event.card = get.cards();
                                    trigger.player.showCards(event.card);
                                    game.cardsDiscard(event.card);
                                    'step 1'
                                    //如果黑色 摸牌 结束
                                    if( get.color(event.card) == "black") {
                                        player.draw(2 * trigger.num);
                                        event.finish();
                                    }
                                    'step 2'
                                    // 其他 选择 转移目标
                                    player.chooseTarget('是否选择一名角色转移伤害？', function (card, player, target) {
                                        return player != target;
                                    }).set('ai', function (target) {
                                        return -ai.get.attitude(player, target);
                                    });
                                    'step 3'
                                    // 如果选择 防止此伤害 并让其受到此伤害
                                    if (result.bool && result.targets && result.targets.length) {
                                        trigger.cancel();
                                        player.line(result.targets[0], 'green');
                                        result.targets[0].damage(trigger.source || 'nosource', trigger.num, trigger.nature);
                                        result.targets[0].draw(trigger.num);
                                    }
                                }, 
                            },
                            yzyy_zhengzi: {
                                group:["yzyy_zhengzi_mark","yzyy_zhengzi_buff"],
                                subSkill:{
                                    mark:{
                                        trigger: {
                                            player: ["discardAfter",],
                                        },
                                        forced: true,
                                        filter:function (event,player){					
                                            if(!event.cards) return false;
                                            return event.cards.length > 1;
                                        },
                                        content: function () {
                                            'step 0'
                                            player.chooseTarget('是否令一名角色获一枚【征】标记？', function (card, player, target) {
                                                return player != target;
                                            }).set('ai', function (target) {
                                                return -ai.get.attitude(player, target);
                                            });
                                            'step 1'
                                            if (result.bool && result.targets && result.targets.length) {
                                                player.line(result.targets[0], 'green');
                                                result.targets[0].addMark("yzyy_zhengzi_mark",1);
                                            }
                                        },
                                        marktext: '征',
                                        intro: {
                                            name: '征子',
                                            content: 'mark',
                                        },
                                        sub:true,
                                    },
                                    buff:{
                                        trigger: {
                                            global: 'phaseBegin',
                                        },
                                        priority: -9,
                                        forced: true,
                                        filter: function (event, player) {
                                            return event.player.hasMark("yzyy_zhengzi_mark");
                                        },
                                        content: function () {
                                            "step 0"
                                            trigger.player.judge();
                                            "step 1"
                                            if(result.color == "red"){
                                                trigger.player.addMark("yzyy_zhengzi_mark", 1);
                                                event.goto(0);                                             
                                            }else{
                                                var num = trigger.player.countMark("yzyy_zhengzi_mark");
                                                trigger.player.chooseToDiscard('he','弃置至少'+ num +'张牌或流失' + num +"点体力",num).set('ai',function(card){
                                                    if(_status.event.res>=0) return 6-get.value(card);
                                                    if(get.type(card)!='basic'){
                                                        return 10-get.value(card);
                                                    }
                                                    return 8-get.value(card);
                                                });
                                            }
                                            "step 2"
                                            var num = trigger.player.countMark("yzyy_zhengzi_mark");
                                            if(!result.bool){
                                                trigger.player.loseHp(num);
                                            }
                                            trigger.player.removeMark("yzyy_zhengzi_mark", num);
                                        },
                                        sub:true,
                                    },
                                },
                            },

                            yzyy_fuzhi:{
                                audio:2,
                                trigger:{
                                    global:'gameStart',
                                    player: "phaseZhunbeiBegin",
                                },
                                forced: true,
                                //frequent:true,
                                // filter: function (event, player) {
                                //     if (lib.config.autoskilllist.contains('yzyy_fuzhi')) return false;
                                //     return true;
                                // },
                                content:function(){
                                    'step 0'
                                    player.chooseTarget(get.prompt2('yzyy_fuzhi'),lib.filter.notMe).set('ai',function(target){
                                        var player=_status.event.player;
                                            var list=[];
                                            if(lib.character[target.name]) list.addArray(lib.character[target.name][3]);
                                            if(lib.character[target.name1]) list.addArray(lib.character[target.name1][3]);
                                            if(lib.character[target.name2]) list.addArray(lib.character[target.name2][3]);
                                            list=list.filter(function(i){
                                                return !player.hasSkill(i);
                                            });
                                            if(!list.length) return 0;
                                        return 1+Math.random();
                                    });
                                    'step 1'
                                    if(result.bool){
                                        var target=result.targets[0];
                                        player.logSkill('yzyy_fuzhi',target);
                                        var list=[];
                                        if(lib.character[target.name]) list.addArray(lib.character[target.name][3]);
                                        if(lib.character[target.name1]) list.addArray(lib.character[target.name1][3]);
                                        if(lib.character[target.name2]) list.addArray(lib.character[target.name2][3]);
                                        player.addSkill(list);
                                        game.broadcastAll(function(list){
                                            lib.character.yzyy_xinjing[3].addArray(list);
                                            game.expandSkills(list);
                                            //语音替换
                                            // for(var i of list){
                                            //     var info=lib.skill[i];
                                            //     if(!info) continue;
                                            //     if(!info.audioname2) info.audioname2={};
                                            //     info.audioname2.yzyy_xinjing='yzyy_fuzhi';
                                            // }
                                        },list);
                                    }
                                },
                            },

                            yzyy_huanhua:{
                                audio:2,
                                trigger:{
                                    global:'gameStart',
                                    player: ["phaseBeginStart","damageBefore"],
                                },
                                forced: true,
                                priority: 20,
                                init:function(player){
                                    if (player.name != "yzyy_huanhua") {
                                        player.removeSkill("yzyy_huanhua");
                                        return;
                                    }
                                    var list=[],skills=[];
                                    for(var i in lib.character){
                                        if(lib.filter.characterDisabled2(i)||lib.filter.characterDisabled(i)) continue;
                                        list.push(i);
                                    }
                                    for(var i of list){
                                        for(var j of lib.character[i][3]){
                                            if(j=='yzyy_huanhua') continue;
                                            var skill=lib.skill[j];
                                            if(!skill||skill.zhuSkill) continue;
                                            var info=lib.translate[j+'_info'];
                                            if(info) skills.add(j);
                                        }
                                    }
                                    player.storage.yzyy_huanhuaList=skills;
                                },
                                content:function () {
                                    'step 0'
                                    player.chooseBool("是否发动 【幻化】");
                                    'step 1'
                                    if(!result.bool){
                                        event.finish();
                                        return;
                                    }
                                    'step 2'
                                    var list=player.storage.yzyy_huanhuaList.randomGets(3);
                                    if(!list.length){
                                        event.finish();
                                        return;
                                    }
                                    event.dialog=ui.create.dialog('forcebutton');
                                    event.dialog.add('选择获得一项技能');
                                    for(var i=0;i<list.length;i++){
                                        if(lib.translate[list[i]+'_info']){
                                            var translation=get.translation(list[i]);
                                            if(translation[0]=='新'&&translation.length==3){
                                                translation=translation.slice(1,3);
                                            }
                                            else{
                                                translation=translation.slice(0,2);
                                            }
                                            var item = event.dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【'+
                                            translation+'】</div><div>'+lib.translate[list[i]+'_info']+'</div></div>');
                                            
                                            item.firstChild.addEventListener(lib.config.touchscreen?'touchend':'click',ui.click.button);
                                            item.firstChild.link=list[i];
                                            for(var j in lib.element.button){
                                                item[j]=lib.element.button[j];
                                            }
                                            event.dialog.buttons.add(item.firstChild);
                                        }
                                    }
                                    event.dialog.add(ui.create.div('.placeholder'));
                                    var next = player.chooseButton(event.dialog, true,[0,1], function (button) {
                                        return 1;
                                    });
                                    'step 3'
                                    event.dialog.close();
                                    if (!result.bool || result.links.length == 0) {
                                        event.finish();
                                        return;
                                    }
                                    event.skill = result.links;
                                    var list = [];
                                    list.addArray(player.storage.yzyy_huanhua);
                                    list.push("cancel2");
                                    player.chooseControl(list).set('prompt','选择要替换的技能');
                                    'step 4'
                                    var res = result.control;
                                    if(res == "cancel2"){
                                        event.finish();
                                        return;
                                    }
					                player.storage.yzyy_huanhua.remove(res);
                                    player.removeSkill(res);
                                    //恢复一般限定技
                                    delete player.storage[res];
                                    player.storage.yzyy_huanhua.push(event.skill);
                                    player.addSkill(player.storage.yzyy_huanhua);
                                    player.popup(event.skill);
                                },
                                group:["yzyy_huanhua_start"],
                                subSkill:{
                                    start:{
                                        audio:2,
                                        forced: true,
                                        priority: 21,
                                        trigger:{
                                            global:'gameStart',
                                        },
                                        init: function (player) {
                                            player.storage.yzyy_huanhua = [];
                                        },
                                        content:function(){
                                            var num = {a:1,b:2,c:4,d:6,e:8,f:10,g:12}[lib.config.extension_雨筝_yzyy_huanhua_num||'c'];
                                            var list = player.storage.yzyy_huanhuaList.randomGets(num);
                                            player.storage.yzyy_huanhua.addArray(list);
                                            player.addSkill(list);
                                        }
                                    }
                                
                                },
                            },
                        },
                        //翻译（必填）
                        translate: {
                            
                            //武将组名
                            yzyy_booshen:"归墟",
                            yzyy_tianming:"天命",

                            //武将名
                            yzyy_xuling: '虚琳',
                            yzyy_taiyi:"太一",
                            yzyy_zhiqi:"执棋",
                            yzyy_xinjing:"心镜",
                            yzyy_huanhua:"幻化",

                            yzyy_jshiyan:"实验",
                            yzyy_jshiyan_info:"仅供测试使用",

                            //技能名与描述
                            yzyy_xuwu: "虚无",
                            yzyy_xuwu_info: '<span class="bluetext" style="color:#DC143C">虚无技</span>你的手牌上限为体力值上限，出牌无视距离。 铁索，翻面，混乱，体力流失，封印对你无效。有人死亡时增加一点体力上限并恢复一点体力。当你成为使用牌的目标时摸一张牌',
                            yzyy_jimie: "寂灭",
                            yzyy_jimie_info: "出牌阶段限一次，你可展示牌堆顶的一张牌并使用之。若如此做，你重复此流程，直到你以此法展示的牌无法使用为止。",
                            yzyy_guixu: "归墟",
                            yzyy_guixu_info: '出牌阶段限X次，你可以选择一张不在游戏外的牌，然后将其置于你的手牌/装备区内。(x为你的体力值）',
                            yzyy_shenlin:"神临",
                            yzyy_shenlin_info:'出牌阶段限一次，你可以展示一张手牌，并交给一名角色，然后令其获得一个【临】标记。有【临】标记的角色，回合将由你控制。其濒死或受到大于1的伤害后，移除【临】标记（标记最多不超过你的体力上限）<span class="bluetext" style="color:#FF6500">你可以关闭【自动发动】使技能不发动</span>',
                            yzyy_shenlin2:"降神",

                            yzyy_huanshen: "幻神",
                            yzyy_huanshen_info: "锁定技，游戏开始时，你随机获得两张武将牌。受到伤害后，你随机获得一张武将牌。你选择获得武将牌上的技能。你可以将拥有锁定技的武将牌当做【闪】使用或打出；将拥有主公技的武将牌当做普通【杀】使用或打出；将拥有限定技的武将牌当做【桃】使用或打出；将拥有觉醒技的武将牌当做【无懈可击】使用或打出。出牌阶段，你可以移除任意技能",
                            yzyy_huanshen1: "幻神·生",
                            yzyy_huanshen2: "幻神·幻",
                            yzyy_huanshen3: "幻神·桃",
                            yzyy_huanshen4: "幻神·杀",
                            yzyy_huanshen5: "幻神·闪",
                            yzyy_huanshen6: "幻神·防",
                            yzyy_huanshen7: "幻神·灭",
                            yzyy_huanshen8: "幻神·制",

                            yzyy_yichuang:"易創",
                            yzyy_yichuang_info:"锁定技。当你对一名角色造成伤害前，可以选择一名角色让其成为此伤害的来源，否则视为无来源。",
                            yzyy_yishou:"弈守",
                            yzyy_yishou_info:"锁定技。当你受到伤害时，展示牌堆顶的一张牌，然后置入弃牌堆。若结果为红色，你可以选择一名角色替你承受此次伤害并摸x张牌。若为黑色，你摸2x张牌。(x为此次受到的伤害值)。",
                            yzyy_zhengzi:"征子",
                            yzyy_zhengzi_info:"你因弃置而同时失去至少两张牌时，你可以选择一名角色获得1枚【征】标记。拥有【征】标记的角色，其准备阶段判定，若为红色，获得1枚【征】标记并继续判定、否则，其选择一项弃置x张牌或流失x点体力。然后移除所有【征】标记。(x为判定次数)",

                            yzyy_fuzhi:"复制",
                            yzyy_fuzhi_info:'锁定技。游戏或准备阶段开始时，你可以选择一名角色获取其技能。',

                            yzyy_huanhua:"幻化",
                            yzyy_huanhua_info:'锁定技。游戏开始时你随机获得四(设置可调)个技能。回合开始时，你可以从三个技能中选择一个替换之',
                        },
                    };
                    //由于以此法加入的武将包武将图片是用源文件的，所以要用此法改变路径
                    for(var i in yuzheng.character){
                        if(!yuzheng.character[i][4]) yuzheng.character[i][4]=[];
                        if(lib.device||lib.node){
                            yuzheng.character[i][4].push('ext:雨筝/'+i+'.jpg');
                        }else{
                            yuzheng.character[i][4].push('db:extension-雨筝:'+i+'.jpg');
                        }
                    }
                    return yuzheng;
                });
                
                lib.config.all.characters.push('yuzheng');
                if(!lib.config.characters.contains('yuzheng')) lib.config.characters.push('yuzheng');
                // 包名翻译
                lib.translate['yuzheng_character_config'] = '<span style="-webkit-animation:yuzheng_character_config 8s infinite;animation:yuzheng_character_config 8s infinite;">雨筝</span>';

            /**
                //卡包（手牌）
                game.import('card',function(){
                    //卡包名
                    var cardPackageName ={
                        //卡包命名
                        name:'卡包名英文',
                        //卡包是否可以联机
                        connect:true,
                        //卡格式
                        card:{
                            '卡名':{
                                //卡牌图片
                                image:'ext:扩展名/卡名.jpg', 
                                //以下与一般卡牌一样
                            },
                        },
                        //技能
                        skill:{},
                        //翻译
                        translate:{},
                        //牌堆添加
                        list:[],
                    };

                    return cardPackageName;

                    });

                    lib.translate['卡包名英文_card_config']='卡包名';
                    lib.config.all.cards.push('卡包名英文');
                    //包名翻译
                    if(!lib.config.cards.contains('卡包名英文')) lib.config.cards.push('卡包名英文');
                    };
            */
            }		     
        }, 
        config: {

            "yuzheng_boos": {
                "name":"使用挑战boss",
                "intro":"重启游戏生效。可以选用本扩展中的挑战BOSS",
                 init:false,
            },
            yzyy_huanhua_num: {
                name:"幻化设置 幻化技能数量",
                intro:"幻化设置 幻化技能数量",
                item:{
                    a:"1",
                    b:"2",
                    c:"4",
                    d:"6",
                    e:"8",
                    f:"10",
                    g:"12",
                },
                init: "c",
                onclick:function(item){
                    game.saveExtensionConfig("雨筝","yzyy_huanhua_num",item);
                }
            },
            //由于以此法添加的武将包自带的禁用按钮无法使用，需要写这个选项来禁用该武将包武将（单机）
            //"yuzheng":{"name":"将武将包名内武将设为禁用","init":false},

        }, 
        help: {}, 
        package: {
            character: {},
            card: {},
            skill: {},
            intro: "",
            author: "raincither",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        },
    }
})