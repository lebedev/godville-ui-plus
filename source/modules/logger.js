// logger
window.GUIp = window.GUIp || {};

GUIp.logger = {};

GUIp.logger.WIDTH_MARGIN = 100;

GUIp.logger.init = function() {
    document.getElementById('hero_block').insertAdjacentHTML(
        'afterbegin',
        '<ul id="logger" style="mask: url(#fader_masking);"></ul>'
    );

    this._container = document.getElementById('logger');
    this.separatorIsNeeded = false;
    this.dungeonWatchers = [
        ['Map_Allies_HP', 'a:hp', GUIp.i18n.allies_health],
        ['Map_Charges',   'ch',   GUIp.i18n.charges,     ],
        ['Map_Exp',       'exp',  GUIp.i18n.exp,         ],
        ['Map_Gold',      'gld',  GUIp.i18n.gold,        ],
        ['Map_HP',        'hp',   GUIp.i18n.hero_health, ],
        ['Map_Inv',       'inv',  GUIp.i18n.inventory,   ]
    ];
    this.fightWatchers = [
        ['Enemies_HP',     'e:hp',  GUIp.i18n.enemy_health ],
        ['Enemy_Gold',     'e:gld', GUIp.i18n.gold         ],
        ['Enemy_Inv',      'e:inv', GUIp.i18n.inventory    ],
        ['Hero_Allies_HP', 'a:hp',  GUIp.i18n.allies_health],
        ['Hero_Charges',   'ch',    GUIp.i18n.charges      ],
        ['Hero_Gold',      'h:gld', GUIp.i18n.gold         ],
        ['Hero_HP',        'h:hp',  GUIp.i18n.hero_health  ],
        ['Hero_Inv',       'h:inv', GUIp.i18n.inventory    ]
    ];
    this.fieldWatchers = [
        ['Bricks',    'br',        GUIp.i18n.bricks     ],
        ['Charges',   'ch',        GUIp.i18n.charges    ],
        ['Death',     'death',     GUIp.i18n.death_count],
        ['Equip1',    'eq1',       GUIp.i18n.weapon     ],
        ['Equip2',    'eq2',       GUIp.i18n.shield     ],
        ['Equip3',    'eq3',       GUIp.i18n.head       ],
        ['Equip4',    'eq4',       GUIp.i18n.body       ],
        ['Equip5',    'eq5',       GUIp.i18n.arms       ],
        ['Equip6',    'eq6',       GUIp.i18n.legs       ],
        ['Equip7',    'eq7',       GUIp.i18n.talisman   ],
        ['Exp',       'exp',       GUIp.i18n.exp        ],
        ['Gold',      'gld',       GUIp.i18n.gold       ],
        ['HP',        'hp',        GUIp.i18n.health     ],
        ['Inv',       'inv',       GUIp.i18n.inventory  ],
        ['Level',     'lvl',       GUIp.i18n.level      ],
        ['Logs',      'wd',        GUIp.i18n.logs       ],
        ['Monster',   'mns',       GUIp.i18n.monsters   ],
        ['Pet_Level', 'pet_level', GUIp.i18n.pet_level  ],
        ['Savings',   'rtr',       GUIp.i18n.savings    ],
        ['Task',      'tsk',       GUIp.i18n.task       ]
    ];
    this.commonWatchers = [
        ['Females',  'females', GUIp.i18n.females ],
        ['Godpower', 'gp',      GUIp.i18n.godpower],
        ['Males',    'males',   GUIp.i18n.males   ]
    ];
};
GUIp.logger._appendStr = function(cssClass, aText, aHint) {
    if (this.separatorIsNeeded) {
        this.separatorIsNeeded = false;
        if (this._container.children.length) {
            this._container.insertAdjacentHTML('beforeend', '<li class="separator">|</li>');
        }
    }

    this._container.insertAdjacentHTML('beforeend', '<li class="' + cssClass + '" title="' + aHint + '">' + aText + '</li>');

    var firstEntry;
    while (
        (firstEntry = this._container.querySelector('li')) &&
        (this._container.scrollWidth > this._container.getBoundingClientRect().width + this.WIDTH_MARGIN ||
         firstEntry.classList.contains('separator'))
    ) {
        firstEntry.remove();
    }

    this._container.scrollLeft = this._container.scrollWidth - this._container.getBoundingClientRect().width;

};
GUIp.logger._watchStatsValue = function(aId, aName, aDescription) {
    // Remove id prefixes.
    aId = aId.replace(/^Hero_|^Map_/, '');

    var cssClass = aId.replace(/\d$/, '').toLowerCase();

    var i, len, diff;
    if (aName === 'a:hp' && !GUIp.storage.get('Option:sumAlliesHp')) {
        var damageData = [];
        for (i = 1, len = GUIp.stats.Allies_Count(); i <= len; i++)
        {
            diff = GUIp.storage.set_with_diff('Logger:'+ (GUIp.data.isDungeon ? 'Map' : 'Hero') + '_Ally' + i + '_HP', GUIp.stats.Ally_HP(i));
            if (diff) {
                damageData.push({ num: i, diff: diff, cnt: 0, fuzz: 0, cntf: 0 });
            }
        }
        if (!damageData.length) {
            return;
        }
        for (i = 0, len = damageData.length; i < len; i++) {
            for (var j = (i + 1); j < damageData.length; j++) {
                if (damageData[j].processed) {
                    continue;
                }
                if (damageData[i].diff === damageData[j].diff) {
                    damageData[i].cnt++;
                    damageData[j].processed = true;
                } else if (Math.abs(damageData[i].diff - damageData[j].diff) < 3) {
                    damageData[i].cntf++;
                    damageData[i].fuzz = (damageData[i].fuzz ? damageData[i].fuzz : damageData[i].diff) + damageData[j].diff;
                    damageData[j].processed = true;
                }
            }
        }
        damageData.sort(function(a,b) {return a.cnt === b.cnt ? a.num - b.num : b.cnt - a.cnt;});
        for (i = 0, len = damageData.length; i < len; i++) {
            if (damageData[i].processed) {
                continue;
            }
            if (damageData[i].fuzz) {
                GUIp.logger._appendStr(cssClass, 'a:hp' + (damageData[i].fuzz > 0 ? '⨦' : '≂') + Math.abs(Math.round((damageData[i].fuzz + damageData[i].diff * damageData[i].cnt)/(damageData[i].cnt + damageData[i].cntf + 1))) + 'x' + (damageData[i].cnt + damageData[i].cntf + 1), aDescription);
            } else if (damageData[i].cnt > 0) {
                GUIp.logger._appendStr(cssClass, 'a:hp' + (damageData[i].diff > 0 ? '+' : '') + damageData[i].diff + 'x' + (damageData[i].cnt + 1), aDescription);
            } else {
                GUIp.logger._appendStr(cssClass, 'a' + damageData[i].num + ':hp' + (damageData[i].diff > 0 ? '+' : '') + damageData[i].diff, aDescription);
            }
        }
        return;
    }
    if (aName === 'e:hp' && !GUIp.storage.get('Option:sumAlliesHp')) {
        for (i = 1, len = GUIp.stats.Enemies_Count(); i <= len; i++)
        {
            diff = GUIp.storage.set_with_diff('Logger:Enemy'+i+'_HP', GUIp.stats.Enemy_HP(i));
            if (diff) {
                GUIp.logger._appendStr(cssClass, 'e' + (len > 1 ? i : '') + ':hp' + (diff > 0 ? '+' : '') + diff, aDescription);
            }
        }
        return;
    }
    var status;
    diff = GUIp.storage.set_with_diff('Logger:' + aId, GUIp.stats[aId]());
    if (diff) {
        // Если нужно, то преобразовываем в число с одним знаком после запятой
        if (parseInt(diff) !== diff) { diff = diff.toFixed(1); }
        // Добавление плюcа, минуса или стрелочки
        if (diff < 0) {
            if (aName === 'exp' && +GUIp.storage.get('Logger:Level') !== GUIp.stats.Level()) {
                status = '→' + GUIp.stats.Exp();
            } else if (aName === 'tsk' && GUIp.storage.get('Logger:Task_Name') !== GUIp.stats.Task_Name()) {
                GUIp.storage.set('Logger:Task_Name', GUIp.stats.Task_Name());
                status = '→' + GUIp.stats.Task();
            } else {
                status = diff;
            }
        } else {
            status = '+' + diff;
        }
        // pet changing
        if (aName === 'pet_level' && GUIp.storage.get('Logger:Pet_NameType') !== GUIp.stats.Pet_NameType()) {
            status = '→' + GUIp.stats.Pet_Level();
        }
        GUIp.logger._appendStr(cssClass, aName + status, aDescription);
    }
};
GUIp.logger._updateWatchers = function(aWatchers) {
    for (var i = 0, len = aWatchers.length; i < len; i++) {
        GUIp.logger._watchStatsValue.apply(null, aWatchers[i]);
    }
};
GUIp.logger.update = function() {
    if (GUIp.storage.get('Option:disableLogger')) {
        this._container.style.display = 'none';
        return;
    } else {
        this._container.style.display = 'block';
    }
    if (GUIp.data.isDungeon) {
        GUIp.logger._updateWatchers(this.dungeonWatchers);
    } else if (GUIp.data.isFight) {
        GUIp.logger._updateWatchers(this.fightWatchers);
    } else {
        GUIp.logger._updateWatchers(this.fieldWatchers);
    }
    GUIp.logger._updateWatchers(this.commonWatchers);
    this.separatorIsNeeded = true;
};
