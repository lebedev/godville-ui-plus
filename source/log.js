(function() {
'use strict';
// log

window.GUIp = window.GUIp || {};

GUIp.log = {};

GUIp.log.godname = localStorage.getItem('GUIp:lastGodname');
GUIp.log.customDomain = !location.href.match(/^https?:\/\/(godville\.net|godvillegame\.com)\/duels\/log/);
GUIp.log.xhrCount = 0;
GUIp.log.chronicles = {};
GUIp.log.directionlessMoveIndex = 0;
GUIp.log.directionlessMoveCombo = "";
GUIp.log.dungeonPhrases = [
    'bossHint',
    'boss',
    'bonusGodpower',
    'bonusHealth',
    'trapUnknown',
    'trapTrophy',
    'trapGold',
    'trapLowDamage',
    'trapModerateDamage',
    'trapMoveLoss',
    'jumpingDungeon',
    'pointerMarker'
];

GUIp.log.corrections = { n: 'north', e: 'east', s: 'south', w: 'west' };
GUIp.log.pointerRegExp = new RegExp('[^а-яa-z](северо-восток|северо-запад|юго-восток|юго-запад|' +
                                                    'север|восток|юг|запад|' +
                                                    'очень холодно|холодно|свежо|тепло|очень горячо|горячо|' +
                                                    'north-east|north-west|south-east|south-west|' +
                                                    'north|east|south|west|' +
                                                    'freezing|very cold|cold|mild|warm|hot|burning|very hot|hot)', 'gi');


GUIp.log.get_key = function(key) {
    return 'GUIp_' + GUIp.log.godname + ':' + key;
};

GUIp.log.storageSet = function(id, value) {
    localStorage.setItem(GUIp.log.get_key(id), value);
    return value;
};

GUIp.log.storageGet = function(id) {
    var val = localStorage.getItem(GUIp.log.get_key(id));
    if (val === 'true') { return true; }
    if (val === 'false') { return false; }
    return val;
};

GUIp.log.getXHR = function(path, success_callback, fail_callback, extra_arg) {
    if (GUIp.log.xhrCount++ > 3) {
        return;
    }
    var xhr = new XMLHttpRequest();
    if (extra_arg) {
        xhr.extra_arg = extra_arg;
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) {
            return;
        } else if (xhr.status === 200) {
            if (success_callback) {
                success_callback(xhr);
            }
        } else if (fail_callback) {
            fail_callback(xhr);
        }
    };

    xhr.open('GET', path, true);
    xhr.send();
};

GUIp.log.clearDungeonPhrases = function() {
    for (var key in localStorage) {
        if (key.match(/^LogDB:/)) {
            localStorage.removeItem(key);
        }
    }
};

GUIp.log.parseDungeonPhrases = function(xhr) {
    var j = 0;
    for (var i = 0, temp, len = this.dungeonPhrases.length; i < len; i++) {
        if (!(temp = xhr.responseText.match(new RegExp('<p>' + this.dungeonPhrases[i] + '\\b([\\s\\S]+?)<\/p>')))) {
            continue;
        }
        temp = temp[1].replace(/&#8230;/g, '...').replace(/^<br>\n|<br>$/g, '').replace(/<br>\n/g, '|');
        this[this.dungeonPhrases[i] + 'RegExp'] = new RegExp(temp);
        localStorage.setItem('LogDB:' + this.dungeonPhrases[i] + 'Phrases', temp);
        j++;
    }
    if (j) {
        localStorage.setItem('LogDB:lastUpdate', Date.now());
        this.initColorMap();
    } else {
        this.fallbackColorization();
    }
};

GUIp.log.parseSingleChronicle = function(texts, infls, step) {
    if (!this.chronicles[step]) {
        this.chronicles[step] = { direction: null, marks: [], pointers: [], jumping: false, directionless: false, text: texts.join(' '), infls: infls.join('\n') };
    }
    // First step isn't an actual "step".
    if (step === 1) {
        return;
    }
    var i, len, j, len2, chronicle = this.chronicles[step];
    for (j = 0, len2 = texts.length; j < len2; j++) {
        texts[j] = texts[j].replace(/offered to trust h.. gut feeling\./, '');
        for (i = 0, len = this.dungeonPhrases.length - 1; i < len; i++) {
            if (texts[j].match(this[this.dungeonPhrases[i] + 'RegExp']) && chronicle.marks.indexOf(this.dungeonPhrases[i]) === -1) {
                chronicle.marks.push(this.dungeonPhrases[i]);
            }
        }
        var firstSentence = texts[j].match(/^.*?[\.!\?](?:\s|$)/);
        if (firstSentence) {
            var direction = firstSentence[0].match(/[^\w\-А-Яа-я](север|восток|юг|запад|north|east|south|west)/);
            if (direction) {
                chronicle.direction = direction[1];
            }
            chronicle.directionless = chronicle.directionless || !!firstSentence[0].match(/went somewhere|too busy bickering to hear in which direction to go next|The obedient heroes move in the named direction/);
            chronicle.jumping = chronicle.jumping || !!firstSentence[0].match(this.jumpingDungeonRegExp);
        }
    }
    if (texts.join(' ').match(this.pointerMarkerRegExp)) {
        var middle = texts.join(' ').match(/^.+?\.(.+)[.!?].+?[.!?]$/)[1];
        var pointer, pointers = middle.match(this.pointerRegExp);
        for (i = 0, len = pointers.length; i < len; i++) {
            switch (pointers[i].replace(/^./, '')) {
            case 'северо-восток':
            case 'north-east': pointer = 'north_east'; break;
            case 'северо-запад':
            case 'north-west': pointer = 'north_west'; break;
            case 'юго-восток':
            case 'south-east': pointer = 'south_east'; break;
            case 'юго-запад':
            case 'south-west': pointer = 'south_west'; break;
            case 'север':
            case 'north': pointer = 'north'; break;
            case 'восток':
            case 'east': pointer = 'east'; break;
            case 'юг':
            case 'south': pointer = 'south'; break;
            case 'запад':
            case 'west': pointer = 'west'; break;
            case 'очень холодно':
            case 'very cold':
            case 'freezing': pointer = 'freezing'; break;
            case 'холодно':
            case 'cold': pointer = 'cold'; break;
            case 'свежо':
            case 'mild': pointer = 'mild'; break;
            case 'тепло':
            case 'warm': pointer = 'warm'; break;
            case 'горячо':
            case 'hot': pointer = 'hot'; break;
            case 'очень горячо':
            case 'very hot':
            case 'burning': pointer = 'burning'; break;
            }
            if (chronicle.pointers.indexOf(pointer) === -1) {
                chronicle.pointers.push(pointer);
            }
        }
    }
};

GUIp.log.fallbackColorization = function() {
    this.prepareMap();
    this.highlightTreasuryZone();
};

GUIp.log.initColorMap = function() {
    var updateRequired = false;
    // get markers if needed
    if (+localStorage.getItem('LogDB:lastUpdate') < (Date.now() - 3*60*60*1000)) {
        updateRequired = true;
    }
    if (!localStorage.getItem('LogDB:pointerMarkerPhrases') || updateRequired) {
        if (!GUIp.log.customDomain) {
            var customChronicler = this.storageGet('Option:customDungeonChronicler') || '';
            this.getXHR('/gods/' + (customChronicler.length >= 3 ? customChronicler : 'Dungeoneer'), this.parseDungeonPhrases.bind(this), this.fallbackColorization.bind(this));
        } else {
            var dungeonPhrasesURL = this.storageGet('Option:customDungeonURL') || '/dungeondb';
            this.getXHR(dungeonPhrasesURL, this.parseDungeonPhrases.bind(this), this.fallbackColorization.bind(this));
        }
        return;
    } else {
        for (var i = 0, len = this.dungeonPhrases.length; i < len; i++) {
            this[this.dungeonPhrases[i] + 'RegExp'] = new RegExp(localStorage.getItem('LogDB:' + this.dungeonPhrases[i] + 'Phrases'));
        }
    }
    // do it
    this.prepareMap();
    this.parseChronicles();
    this.describeMap();
    this.highlightTreasuryZone();
};

GUIp.log.prepareMap = function() {
    // make dmap feel a bit like normal map
    document.querySelector('#dmap').innerHTML = document.querySelector('#dmap').innerHTML.replace(/>\s{2,}</g, "><");
    var cells = document.querySelectorAll('.dml .dmc');
    for (var i = 0, len = cells.length; i < len; i++) {
        if (cells[i].textContent.trim().match(/@/)) {
            cells[i].classList.add('map_pos');
            break;
        }
    }
};

GUIp.log.parseChronicles = function() {
    var step, step_max = document.getElementById('fight_log_capt').textContent.match(/([0-9]+)/);
    if (!step_max || step_max[0] === '1') {
        return;
    }
    var lastNotParsed, texts = [], infls = [],
        matches = document.querySelector('#last_items_arena').innerHTML.match(/<div class="new_line ?"( style="[^"]*")?>[\s\S]*?<div class="text_content .*?">[\s\S]+?<\/div>/g),
        reversed = !!location.href.match('sort=desc');
    if (reversed) {
        matches.reverse();
    }
    step = 1;
    step_max = +step_max[0];

    for (var i = 0; step <= step_max; i++) {
        if (!matches[i]) {
            if (step !== step_max) {
                window.console.log('not enough steps detected! required: '+step_max+', got: '+step);
            }
            break;
        }
        lastNotParsed = true;
        if (!matches[i].match(/<div class="text_content infl">/)) {
            texts.push(matches[i].match(/<div class="text_content ">([\s\S]+?)<\/div>/)[1].trim().replace(/&#39;/g, "'"));
        } else {
            infls.push(matches[i].match(/<div class="text_content infl">([\s\S]+?)(<span|<\/div>)/)[1].trim().replace(/&#39;/g, "'"));
        }
        if (!reversed && matches[i].match(/<div class="new_line ?" style="[^"]+">/) ||
             reversed && (!matches[i+1] || matches[i+1].match(/<div class="new_line ?" style="[^"]+">/))) {
            GUIp.log.parseSingleChronicle(texts, infls, step);
            lastNotParsed = false;
            texts = [];
            infls = [];
            step++;
        }
    }
    if (lastNotParsed) {
        GUIp.log.parseSingleChronicle(texts, infls, step);
    }
};

GUIp.log.enumerateSteps = function() {
    var i, len, step, stepholder, steplines = [], dcapt = false,
        matches = document.querySelector('#last_items_arena').getElementsByClassName('new_line'),
        reversed = !!location.href.match('sort=desc'),
        duel = !document.getElementById('fight_log_capt').textContent.match(/Хроника подземелья|Dungeon Journal/) || location.href.match('boss=');
    for (i = 0, len = matches.length; i < len; i++) {
        steplines.push(matches[i]);
    }
    if (reversed) {
        steplines.reverse();
    }
    for (i = 0, step = duel ? 0 : 1, len = steplines.length; i < len; i++) {
        stepholder = steplines[i].getElementsByClassName('d_capt')[0];
        stepholder.title = GUIp.i18n.step_n+step;
        dcapt |= stepholder.textContent.length > 0;
        if ((!reversed && steplines[i].style.length > 0 || reversed && (!steplines[i+1] || steplines[i+1].style.length > 0)) && (!duel || dcapt)) {
            step++;
            dcapt = false;
        }
    }
};

GUIp.log.describeMap = function() {
    var step, mark_no, marks_length, steptext, lasttext, titlemod, titletext, currentCell,
        trapMoveLossCount = 0,
        coords = GUIp.log.calculateExitXY(),
        steps = Object.keys(this.chronicles),
        steps_max = steps.length;
    for (step = 1; step <= steps_max; step++) {
        if (this.chronicles[step].directionless) {
            var shortCorrection = (GUIp.log.storageGet(this.logID + 'corrections') || [])[this.directionlessMoveIndex++];
            if (shortCorrection) {
                this.chronicles[step].direction = this.corrections[shortCorrection];
            } else {
                window.console.log('warning: detected directionless move! the following direction (re-)calculation is currently in beta and might not work at all under some circumstances!');
                this.chronicles[step].direction = GUIp.log.calculateDirectionlessMove(coords, step);
            }
            this.chronicles[step].directionless = false;
        }
        GUIp.log.moveCoords(coords, this.chronicles[step]);
        currentCell = document.querySelectorAll('#dmap .dml')[coords.y].children[coords.x];
        if (currentCell.textContent.trim() === '#') {
            break;
        }
        for (mark_no = 0, marks_length = this.chronicles[step].marks.length; mark_no < marks_length; mark_no++) {
            currentCell.classList.add(this.chronicles[step].marks[mark_no]);
        }
        if (!currentCell.title.length && this.chronicles[step].pointers.length) {
            currentCell.title = '[' + GUIp.i18n.map_pointer + ': ' + GUIp.i18n[this.chronicles[step].pointers[0]] + (this.chronicles[step].pointers[1] ? GUIp.i18n.or + GUIp.i18n[this.chronicles[step].pointers[1]] : '') + ']';
        }
        steptext = this.chronicles[step].text.replace('.»', '».').replace(/(\!»|\?»)/g, '$1.'); // we're not going to do natural language processing, so just simplify nested sentence (yeah, result will be a bit incorrect)
        steptext = steptext.match(/[^\.]+[\.]+/g);
        if (step === 1) {
            steptext = steptext.slice(0, -1);
        } else if (step === steps_max) {
            steptext = steptext.slice(1);
        } else if (this.chronicles[step].marks.indexOf('boss') !== -1) {
            steptext = steptext.slice(1, -2);
        } else if (this.chronicles[step].marks.indexOf('trapMoveLoss') !== -1 || trapMoveLossCount) {
            if (!trapMoveLossCount) {
                steptext = steptext.slice(1);
                trapMoveLossCount++;
            } else {
                steptext = steptext.slice(0, -1);
                trapMoveLossCount = 0;
            }
        } else {
            steptext = steptext.length > 2 ? steptext.slice(1, -1) : steptext.slice(0, -1);
        }
        //steptext = (this.chronicles[step].infls ? this.chronicles[step].infls + '\n' : '') + steptext.join('').trim();
        steptext = steptext.join('').trim();
        if (currentCell.title.length) {
            titlemod = false;
            titletext = currentCell.title.split('\n');
            for (var i = 0, len = titletext.length; i < len; i++) {
                lasttext = titletext[i].match(/^(.*?) : (.*?)$/);
                if (lasttext && lasttext[2] === steptext) {
                    titletext[i] = lasttext[1] + ', #' + step + ' : ' + steptext;
                    titlemod = true;
                    break;
                }
            }
            if (!titlemod) {
                titletext.push('#' + step + ' : ' + steptext);
            }
            currentCell.title = titletext.join('\n');
        } else {
            currentCell.title = '#' + step + ' : ' + steptext;
        }
    }
    var heroesCoords = GUIp.log.calculateXY(document.getElementsByClassName('map_pos')[0]);
    if (heroesCoords.x !== coords.x || heroesCoords.y !== coords.y) {
        window.console.log('chronicle processing failed, coords diff: x: ' + (heroesCoords.x - coords.x) + ', y: ' + (heroesCoords.y - coords.y) + '.');
    }
};

GUIp.log.highlightTreasuryZone = function() {
    if (document.querySelectorAll('#dmap .dml').length) {
        var i, j, ik, jk, len, chronolen = +Object.keys(this.chronicles).reverse()[0],
            $boxML = document.querySelectorAll('#dmap .dml'),
            $boxMC = document.querySelectorAll('#dmap .dmc'),
            kRow = $boxML.length,
            kColumn = $boxML[0].textContent.length,
            MaxMap = 0,          // count of any pointers
            MaxMapThermo = 0, // count of thermo pointers
            MapArray = [];
        for (i = 0; i < kRow; i++) {
            MapArray[i] = [];
            for (j = 0; j < kColumn; j++) {
                MapArray[i][j] = ('?!@'.indexOf($boxML[i].textContent[j]) !== - 1) ? 0 : -1;
            }
        }
        for (var si = 0; si < kRow; si++) {
            // Ищем где мы находимся
            j = $boxML[si].textContent.indexOf('@');
            //    Ищем указатели
            for (var sj = 0; sj < kColumn; sj++) {
                var ij, ttl = '',
                    pointer = $boxML[si].textContent[sj],
                    chronopointers = chronolen > 1 ? this.chronicles[chronolen].pointers : [];
                /* [E] check if current position has some directions in chronicle */
                if (pointer === '@' && chronopointers.length) {
                    for (i = 0, len = chronopointers.length; i < len; i++) {
                        switch (chronopointers[i]) {
                            case 'north_east': ttl += '↗'; break;
                            case 'north_west': ttl += '↖'; break;
                            case 'south_east': ttl += '↘'; break;
                            case 'south_west': ttl += '↙'; break;
                            case 'north':      ttl += '↑'; break;
                            case 'east':       ttl += '→'; break;
                            case 'south':      ttl += '↓'; break;
                            case 'west':       ttl += '←'; break;
                            case 'freezing': ttl += '✵'; break;
                            case 'cold':     ttl += '❄'; break;
                            case 'mild':     ttl += '☁'; break;
                            case 'warm':     ttl += '♨'; break;
                            case 'hot':      ttl += '☀'; break;
                            case 'burning':  ttl += '✺'; break;
                        }
                    }
                    window.console.log("current position has pointers: " + ttl);
                }
                if ('←→↓↑↙↘↖↗⌊⌋⌈⌉∨<∧>'.indexOf(pointer) !== -1 || ttl.length && ttl.match('←|→|↓|↑|↙|↘|↖|↗')) {
                    MaxMap++;
                    $boxMC[si * kColumn + sj].style.color = 'green';
                    /* [E] get directions from the arrows themselves, not relying on parsed chronicles */
                    if (!ttl.length) {
                        switch (pointer) {
                            case '⌊': ttl = '↑→'; break;
                            case '⌋': ttl = '↑←'; break;
                            case '⌈': ttl = '↓→'; break;
                            case '⌉': ttl = '↓←'; break;
                            case '∨': ttl = '↖↗'; break;
                            case '<': ttl = '↗↘'; break;
                            case '∧': ttl = '↙↘'; break;
                            case '>': ttl = '↖↙'; break;
                            default: ttl = pointer; break;
                        }
                    }
                    for (ij = 0, len = ttl.length; ij < len; ij++){
                        if ('→←↓↑↘↙↖↗'.indexOf(ttl[ij]) !== - 1){
                            for (ik = 0; ik < kRow; ik++) {
                                for (jk = 0; jk < kColumn; jk++) {
                                    var istep = parseInt((Math.abs(jk - sj) - 1) / 5),
                                        jstep = parseInt((Math.abs(ik - si) - 1) / 5);
                                    if ('←→'.indexOf(ttl[ij]) !== -1 && ik >= si - istep && ik <= si + istep ||
                                        ttl[ij] === '↓' && ik >= si + istep ||
                                        ttl[ij] === '↑' && ik <= si - istep ||
                                        '↙↘'.indexOf(ttl[ij]) !== -1 && ik > si + istep ||
                                        '↖↗'.indexOf(ttl[ij]) !== -1 && ik < si - istep) {
                                        if (ttl[ij] === '→' && jk >= sj + jstep ||
                                            ttl[ij] === '←' && jk <= sj - jstep ||
                                            '↓↑'.indexOf(ttl[ij]) !== -1 && jk >= sj - jstep && jk <= sj + jstep ||
                                            '↘↗'.indexOf(ttl[ij]) !== -1 && jk > sj + jstep ||
                                            '↙↖'.indexOf(ttl[ij]) !== -1 && jk < sj - jstep) {
                                            if (MapArray[ik][jk] >= 0) {
                                                MapArray[ik][jk]+=1024;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if ('✺☀♨☁❄✵'.indexOf(pointer) !== -1 || ttl.length && '✺☀♨☁❄✵'.indexOf(ttl) !== -1) {
                    MaxMapThermo++;
                    $boxMC[si*kColumn + sj].style.color = 'green';
                    /* [E] if we're standing on the pointer - use parsed value from chronicle */
                    if (ttl.length) {
                        pointer = ttl;
                    }
                    var ThermoMinStep = 0;    //    Минимальное количество шагов до клада
                    var ThermoMaxStep = 0;    //    Максимальное количество шагов до клада
                    switch(pointer) {
                        case '✺': ThermoMinStep = 1; ThermoMaxStep = 2; break;    //    ✺ - очень горячо(1-2)
                        case '☀': ThermoMinStep = 3; ThermoMaxStep = 5; break;    //    ☀ - горячо(3-5)
                        case '♨': ThermoMinStep = 6; ThermoMaxStep = 9; break;    //    ♨ - тепло(6-9)
                        case '☁': ThermoMinStep = 10; ThermoMaxStep = 13; break;    //    ☁ - свежо(10-13)
                        case '❄': ThermoMinStep = 14; ThermoMaxStep = 18; break;    //    ❄ - холодно(14-18)
                        case '✵': ThermoMinStep = 19; ThermoMaxStep = 100; break;    //    ✵ - очень холодно(19)
                    }
                    //    thermo map data
                    var MapData = {
                        kColumn: kColumn,
                        kRow: kRow,
                        minStep: ThermoMinStep,
                        maxStep: ThermoMaxStep,
                        scanList: []
                    };
                    for (ik = -1; ik <= kRow; ik++) {
                        for (jk = -1; jk <= kColumn; jk++) {
                            if (ik < 0 || jk < 0 || ik === kRow || jk === kColumn) {
                                MapData[ik+':'+jk] = { explored: false, specway: false, scanned: false, wall: false, unknown: true };
                                continue;
                            }
                            MapData[ik + ':' + jk] = {
                                explored: '#?!'.indexOf($boxML[ik].textContent[jk]) === -1,
                                specway: false,
                                scanned: false,
                                wall: $boxML[ik].textContent[jk] === '#',
                                unknown: $boxML[ik].textContent[jk] === '?'
                            };
                        }
                    }
                    // remove unknown marks from cells located near explored ones
                    for (ik = 0; ik < kRow; ik++) {
                        for (jk = 0; jk < kColumn; jk++) {
                            if (MapData[ik + ':' + jk].explored) {
                                for (i = -1; i <= 1; i++) {
                                    for (j = -1; j <= 1; j++) {
                                        if (MapData[(ik + i) + ':' + (jk + j)]) { MapData[(ik + i) + ':' + (jk + j)].unknown = false; }
                                    }
                                }
                            }
                        }
                    }
                    //
                    GUIp.mapIteration(MapData, si, sj, 0, false);
                    //
                    for (ik = 0; ik < kRow; ik++) {
                        for (jk = 0; jk < kColumn; jk++) {
                            if (MapData[ik + ':' + jk].step < ThermoMinStep && MapData[ik + ':' + jk].explored && !MapData[ik + ':' + jk].specway) {
                                MapData[ik + ':' + jk].scanned = true;
                                MapData.scanList.push({i:ik, j:jk, lim:(ThermoMinStep - MapData[ik + ':' + jk].step)});
                            }
                        }
                    }
                    while (MapData.scanList.length) {
                        var scanCell = MapData.scanList.shift();
                        for (var cell in MapData) {
                            if (MapData[cell].substep) {
                                MapData[cell].substep = 0;
                            }
                        }
                        GUIp.mapSubIteration(MapData, scanCell.i, scanCell.j, 0, scanCell.lim, false);
                    }
                    //
                    for (ik = ((si - ThermoMaxStep) > 0 ? si - ThermoMaxStep : 0); ik <= ((si + ThermoMaxStep) < kRow ? si + ThermoMaxStep : kRow - 1); ik++) {
                        for (jk = ((sj - ThermoMaxStep) > 0 ? sj - ThermoMaxStep : 0); jk <= ((sj + ThermoMaxStep) < kColumn ? sj + ThermoMaxStep : kColumn - 1); jk++) {
                            if (MapData[ik + ':' + jk].step >= ThermoMinStep & MapData[ik + ':' + jk].step <= ThermoMaxStep) {
                                if (MapArray[ik][jk] >= 0) {
                                    MapArray[ik][jk]+=128;
                                }
                            } else if (MapData[ik + ':' + jk].step < ThermoMinStep && MapData[ik + ':' + jk].specway) {
                                if (MapArray[ik][jk] >= 0) {
                                    MapArray[ik][jk]++;
                                }
                            }
                        }
                    }
                }
            }
        }
        //    Отрисовываем возможный клад
        if (MaxMap !== 0 || MaxMapThermo !== 0) {
            for (i = 0; i < kRow; i++) {
                for (j = 0; j < kColumn; j++) {
                    if (MapArray[i][j] === 1024*MaxMap + 128*MaxMapThermo) {
                        $boxMC[i * kColumn + j].style.color = ($boxML[i].textContent[j] === '@') ? 'blue' : 'red';
                    } else {
                        for (ik = 0; ik < MaxMapThermo; ik++) {
                            if (MapArray[i][j] === 1024*MaxMap + 128*ik + (MaxMapThermo - ik)) {
                                $boxMC[i*kColumn + j].style.color = ($boxML[i].textContent[j] === '@') ? 'blue' : 'darkorange';
                            }
                        }
                    }
                }
            }
        }
    }
};

GUIp.log.moveCoords = function(coords, chronicle) {
    if (chronicle.direction) {
        var step = chronicle.jumping ? 2 : 1;
        switch(chronicle.direction) {
        case 'север':
        case 'north': coords.y -= step; break;
        case 'восток':
        case 'east': coords.x += step; break;
        case 'юг':
        case 'south': coords.y += step; break;
        case 'запад':
        case 'west': coords.x -= step; break;
        }
    }
};

GUIp.log.calculateXY = function(cell) {
    var coords = {};
    coords.x = GUIp.log.getNodeIndex(cell);
    coords.y = GUIp.log.getNodeIndex(cell.parentNode);
    return coords;
};

GUIp.log.calculateExitXY = function() {
    var exit_coords = { x: null, y: null },
        cells = document.querySelectorAll('.dml .dmc');
    for (var i = 0, len = cells.length; i < len; i++) {
        if (cells[i].textContent.trim().match(/В|E/)) {
            exit_coords = GUIp.log.calculateXY(cells[i]);
            break;
        }
    }
    if (!exit_coords.x) {
        exit_coords = GUIp.log.calculateXY(document.getElementsByClassName('map_pos')[0]);
    }
    return exit_coords;
};

GUIp.log.getRPerms = function(array, size, initialStuff, output) {
    if (initialStuff.length >= size) {
        output.push(initialStuff);
    } else {
        for (var i = 0; i < array.length; ++i) {
            this.getRPerms(array, size, initialStuff.concat(array[i]), output);
        }
    }
};

GUIp.log.getAllRPerms = function(array, size) {
    var output = [];
    this.getRPerms(array, size, [], output);
    return output;
};

GUIp.log.calculateDirectionlessMove = function(initCoords, initStep) {
    var i, len, j, len2, coords = { x: initCoords.x, y: initCoords.y },
        dmap = document.querySelectorAll('#dmap .dml'),
        heroesCoords = GUIp.log.calculateXY(document.getElementsByClassName('map_pos')[0]),
        steps = Object.keys(this.chronicles),
        directionless = 0;

    window.console.log('going to calculate directionless moves from step #'+initStep);
    for (i = initStep, len = steps.length; i <= len; i++) {
        if (this.chronicles[i].directionless) {
            directionless++;
        }
        GUIp.log.moveCoords(coords, this.chronicles[i]);
    }

    var variations = this.getAllRPerms('nesw'.split(''),directionless);

    for (i = 0, len = variations.length; i < len; i++) {
        //window.console.log('trying combo '+variations[i].join());
        coords = { x: initCoords.x, y: initCoords.y };
        directionless = 0;
        for (j = initStep, len2 = steps.length; j <= len2; j++) {
            if (this.chronicles[j].directionless) {
                GUIp.log.moveCoords(coords, { direction: this.corrections[variations[i][directionless]] });
                directionless++;
            } else {
                GUIp.log.moveCoords(coords, this.chronicles[j]);
            }
            if (!dmap[coords.y] || !dmap[coords.y].children[coords.x] || dmap[coords.y].children[coords.x].textContent.match(/#|!|\?/)) {
                break;
            }
        }
        if (heroesCoords.x - coords.x === 0 && heroesCoords.y - coords.y === 0) {
            var currentCorrections = this.storageGet(GUIp.log.logID + 'corrections') || '';
            window.console.log('found result: '+variations[i].join());
            this.directionlessMoveCombo = currentCorrections + variations[i].join('');
            if (!this.customDomain) {
                this.storageSet(GUIp.log.logID + 'corrections', currentCorrections + variations[i].join(''));
            }
            return this.corrections[variations[i][0]];
        }
    }
};

GUIp.log.getNodeIndex = function(node) {
    var i = 0;
    while ((node = node.previousElementSibling)) {
        i++;
    }
    return i;
};

GUIp.log.deleteOldEntries = function() {
    for (var key in localStorage) {
        if (key.match('GUIp_' + GUIp.log.godname + ':Log:\\w{5}:') && !key.match(GUIp.log.logID + '|' + GUIp.log.storageGet('Log:current'))) {
            localStorage.removeItem(key);
        }
    }
};

GUIp.log.updateButton = function() {
    var i;
    if (!isNaN(GUIp.log.storageGet(GUIp.log.logID + 'sentToLEM' + GUIp.log.requestLimit)) && Date.now() - GUIp.log.storageGet(GUIp.log.logID + 'sentToLEM' + GUIp.log.requestLimit) < GUIp.log.timeFrameSeconds*1000) {
        var time = GUIp.log.timeFrameSeconds - (Date.now() - GUIp.log.storageGet(GUIp.log.logID + 'sentToLEM' + GUIp.log.requestLimit))/1000,
            minutes = Math.floor(time/60),
            seconds = Math.floor(time%60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        GUIp.log.button.innerHTML = GUIp.i18n.send_log_to_LEMs_script + GUIp.i18n.till_next_try + minutes + ':' + seconds;
        GUIp.log.button.setAttribute('disabled', 'disabled');
    } else {
        var tries = 0;
        for (i = 0; i < GUIp.log.requestLimit; i++) {
            if (isNaN(GUIp.log.storageGet(GUIp.log.logID + 'sentToLEM' + i)) || Date.now() - GUIp.log.storageGet(GUIp.log.logID + 'sentToLEM' + i) > GUIp.log.timeFrameSeconds*1000) {
                tries++;
            }
        }
        GUIp.log.button.innerHTML = GUIp.i18n.send_log_to_LEMs_script + GUIp.i18n.tries_left + tries;
        GUIp.log.button.removeAttribute('disabled');
    }
};

GUIp.log.saverSendLog = function() {
    var i, div = document.createElement('div'), inputs = '<input type="hidden" name="bosses_count" value="' + GUIp.log.saverBossesCnt + '"><input type="hidden" name="log_id" value="' + GUIp.log.saverLogId + '">';
    for (i = 0; i < GUIp.log.saverPages.length; i++) {
        inputs += '<input type="hidden" name="' + i + '">';
    }
    div.insertAdjacentHTML('beforeend', '<form method="post" action="'+GUIp.log.saverURL+'" enctype="multipart/form-data" accept-charset="utf-8">' + inputs + '</form>');
    for (i = 0; i < GUIp.log.saverPages.length; i++) {
        div.querySelector('input[name="' + i + '"]').setAttribute('value', GUIp.log.saverPages[i]);
    }
    document.body.appendChild(div);
    div.firstChild.submit();
    document.body.removeChild(div);
};

GUIp.log.saverFetchPage = function(boss_no) {
    GUIp.log.xhrCount = 0;
    GUIp.log.getXHR(location.protocol + '//' + location.host + location.pathname + (boss_no ? '?boss=' + boss_no : ''), GUIp.log.saverProcessPage.bind(null), GUIp.log.saverFetchFailed.bind(null), boss_no);
};

GUIp.log.saverProcessPage = function(xhr) {
    var boss_no = xhr.extra_arg || 0;
    if (!xhr.responseText.match(/Извините, но по этой ссылке найти хронику не удалось./)) {
        GUIp.log.saverPages.push(xhr.responseText.replace(/<img[^>]+>/g, '')
                                 .replace(/<script[\s\S]+?<\/script>/g, '')
                                 .replace(/\.css\?\d+/g, '.css')
                                 .replace(/трое суток/, GUIp.log.saverBanner));
        if (boss_no < GUIp.log.saverBossesCnt) {
            GUIp.log.saverFetchPage(boss_no + 1);
        } else {
            GUIp.log.saverSendLog();
        }
    } else {
        GUIp.log.saverRemoveLoader();
        window.alert('При сохранении произошла ошибка - хроника не существует.');
    }
};

GUIp.log.saverFetchFailed = function() {
    GUIp.log.saverRemoveLoader();
    window.alert('При запросе хроники произошла ошибка.\nПопробуйте еще раз.');
};

GUIp.log.saverAddLoader = function() {
    document.body.insertAdjacentHTML('beforeend', '<div id="godvillepehu_loader" style="position: fixed; left: 50%; top: 50%; margin: -24px; padding: 8px; background: rgba(255,255,255,0.9);"><img src="'+GUIp.log.saverLoaderGIF+'"></div>');
};

GUIp.log.saverRemoveLoader = function() {
    if (document.getElementById('godvillepehu_loader')) {
        document.body.removeChild(document.getElementById('godvillepehu_loader'));
    }
};

GUIp.log.saverPrepareLog = function() {
    GUIp.log.saverURL = '//gdvl.tk/upload.php';
    GUIp.log.saverBanner = 'до тепловой смерти Вселенной (или пока не умрет сервер) благодаря <a href="//godville.net/gods/Mave">Mave</a> и <a href="//godville.net/gods/Бэдлак">Бэдлаку</a>';
    GUIp.log.saverLoaderGIF = '//gdvl.tk/images/loader.gif';
    try {
        GUIp.log.saverLogId = (location.href.match(/^https?:\/\/godville.net\/duels\/log\/(.{5})/) || [])[1];
        GUIp.log.saverPages = [];
        if (!GUIp.log.saverLogId) {
            throw 'можно загружать только логи Годвилля';
        }
        if (document.getElementById('search_status') && document.getElementById('search_status').textContent.match(/Извините, но по этой ссылке найти хронику не удалось./)) {
            throw 'лог отсутствует';
        }
        var translation = document.getElementsByClassName('lastduelpl')[1];
        if (translation && translation.textContent.match(/прямая трансляция/)) {
            throw 'нельзя загрузить трансляцию';
        }
        if (document.getElementById('godvillepehu_loader')) {
            window.alert('Лог уже загружается!');
            return;
        } else {
            GUIp.log.saverAddLoader();
        }
        GUIp.log.saverBossesCnt = document.querySelectorAll('a[href*="boss"]').length;
        GUIp.log.saverFetchPage(null);
    } catch(e) {
        GUIp.log.saverRemoveLoader();
        window.alert('Ошибка: ' + e);
    }
};

GUIp.log.starter = function() {
    if (!GUIp.locale || !GUIp.i18n) { return; }
    clearInterval(starterInt);

    // add some styles
    if (GUIp.browser !== 'Opera') {
        GUIp.addCSSFromURL(GUIp.getResource('superhero.css'), 'guip_css');
    }

    // add save links
    if (!GUIp.log.customDomain && GUIp.locale === 'ru' && (!document.getElementsByClassName('lastduelpl')[1] || !document.getElementsByClassName('lastduelpl')[1].textContent.match(/прямая трансляция/))) {
        document.getElementsByClassName('lastduelpl_f')[1].insertAdjacentHTML('beforeend', '<div>Сохранить в <a id="gdvltk_saver" style="-webkit-user-select: none; -moz-user-select: none; user-select: none;">gdvl.tk</a></div>');
        document.getElementById('gdvltk_saver').onclick = function(e) {
            e.preventDefault();
            var d=document,c="createElement",h=d.head,a="appendChild",tn="script",s=d[c](tn);s.src='//gdvl.tk/send.js';h[a](s);
        };
    }

    if (location.href.match('boss=') || !document.getElementById('fight_log_capt').textContent.match(/Хроника подземелья|Dungeon Journal/)) {
        GUIp.log.enumerateSteps();
        return;
    }

    try {
        this.logID = 'Log:' + location.href.match(/duels\/log\/([^\?]+)/)[1] + ':';
        var steps = +document.getElementById('fight_log_capt').textContent.match(/(?:Хроника подземелья \(шаг|Dungeon Journal \(step) (\d+)\)/)[1];
        // add step numbers to chronicle log
        GUIp.log.enumerateSteps();
        // add a map for a translation-type chronicle
        if (!document.querySelector('#dmap') && steps === +GUIp.log.storageGet(GUIp.log.logID + 'steps')) {
            var map = JSON.parse(GUIp.log.storageGet(GUIp.log.logID + 'map')),
                map_elem = '<div id="hero2"><div class="box"><fieldset style="min-width:0;"><legend>' + GUIp.i18n.map + '</legend><div id="dmap" class="new_line">';
            for (var i = 0, ilen = map.length; i < ilen; i++) {
                map_elem += '<div class="dml" style="width:' + (map[0].length * 21) + 'px;">';
                for (var j = 0, jlen = map[0].length; j < jlen; j++) {
                    map_elem += '<div class="dmc">' + map[i][j] + '</div>';
                }
                map_elem += '</div>';
            }
            map_elem += '</div></fieldset></div></div>';
            document.getElementById('right_block').insertAdjacentHTML('beforeend', map_elem);
        }
        // add some colors to the map. if possible
        if (document.querySelector('#dmap')) {
            GUIp.log.initColorMap.call(GUIp.log);
        }
        // send button and other stuff
        var $box = document.querySelector('#hero2 fieldset') || document.getElementById('right_block');
        if (location.href.match('sort')) {
            $box.insertAdjacentHTML('beforeend', '<span>' + GUIp.i18n.wrong_entries_order + '</span>');
            return;
        }
        var steps_min = GUIp.log.storageGet('LEMRestrictions:FirstRequest') || 12;
        if (steps < steps_min) {
            $box.insertAdjacentHTML('beforeend', '<span>' + GUIp.i18n.the_button_will_appear_after + steps_min + GUIp.i18n.step + '</span>');
            return;
        }
        $box.insertAdjacentHTML('beforeend',
            '<form target="_blank" method="post" enctype="multipart/form-data" action="//www.godalert.info/Dungeons/index' + (GUIp.locale === 'en' ? '-eng' : '') + '.cgi" id="send_to_LEM_form" style="padding-top: calc(2em + 3px);">' +
                '<input type="hidden" id="fight_text" name="fight_text">' +
                '<input type="hidden" name="map_type" value="map_graphic">' +
                '<input type="hidden" name="min" value="X">' +
                '<input type="hidden" name="partial" value="X">' +
                '<input type="hidden" name="room_x" value="">' +
                '<input type="hidden" name="room_y" value="">' +
                '<input type="hidden" name="Submit" value="' + GUIp.i18n.get_your_map + '">' +
                '<input type="hidden" name="guip" value="1">' +
                '<input type="checkbox" id="match" name="match" value="1"><label for="match">' + GUIp.i18n.search_database + '</label>' +
                '<div id="search_mode" style="display: none;">' +
                    '<input type="checkbox" id="match_partial" name="match_partial" value="1"><label for="match_partial">' + GUIp.i18n.relaxed_search + '</label>' +
                    '<div><input type="radio" id="exact" name="search_mode" value="exact"><label for="exact">' + GUIp.i18n.exact + '</label></div>' +
                    '<div><input type="radio" id="high" name="search_mode" value="high"><label for="high">' + GUIp.i18n.high_precision + '</label></div>' +
                    '<div><input type="radio" id="medium" name="search_mode" value="medium" checked=""><label for="medium">' + GUIp.i18n.normal + '</label></div>' +
                    '<div><input type="radio" id="low" name="search_mode" value="low"><label for="low">' + GUIp.i18n.primary + '</label></div>' +
                '</div>' +
                '<table style="box-shadow: none; width: 100%;"><tr>' +
                    '<td style="border: none; padding: 0;"><label for="stoneeater">' + GUIp.i18n.corrections + '</label></td>' +
                    '<td style="border: none; padding: 0 1.5px 0 0; width: 100%;"><input type="text" id="stoneeater" name="stoneeater" value="' + (GUIp.log.storageGet(GUIp.log.logID + 'corrections') || GUIp.log.directionlessMoveCombo) + '" style=" width: 100%; padding: 0;"></td>' +
                '</tr></table>' +
                '<input type="checkbox" id="high_contrast" name="high_contrast" value="1"><label for="high_contrast">' + GUIp.i18n.high_contrast + '</label>' +
                '<button id="send_to_LEM" style="font-size: 15px; height: 100px; width: 100%;">' +
            '</form>');
        document.querySelector('#fight_text').value = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">' +
                                                            document.getElementsByTagName('html')[0].innerHTML.replace(/<(?:script|style)[\S\s]+?<\/(?:script|style)>/g, '')
                                                                                                              .replace(/onclick="[^"]+?"/g, '')
                                                                                                              .replace(/"javascript[^"]+"/g, '""')
                                                                                                              .replace(/<form[\s\S]+?<\/form>/g, '')
                                                                                                              .replace(/<iframe[\s\S]+?<\/iframe>/g, '')
                                                                                                              .replace(/\t/g, '')
                                                                                                              .replace(/<div[^>]+class="dmc[^>]+>/g,'<div class="dmc">')
                                                                                                              .replace(/ {2,}/g, ' ')
                                                                                                              .replace(/\n{2,}/g, '\n') +
                                                      '</html>';
        this.button = document.getElementById('send_to_LEM');
        this.timeFrameSeconds = (GUIp.log.storageGet('LEMRestrictions:TimeFrame') || 20)*60;
        this.requestLimit = GUIp.log.storageGet('LEMRestrictions:RequestLimit') || 5;

        var match = document.getElementById('match'),
            search_mode = document.getElementById('search_mode'),
            high_contrast = document.getElementById('high_contrast');
        this.button.onclick = function(e) {
            e.preventDefault();
            for (var i = GUIp.log.requestLimit; i > 1; i--) {
                GUIp.log.storageSet(GUIp.log.logID + 'sentToLEM' + i, GUIp.log.storageGet(GUIp.log.logID + 'sentToLEM' + (i - 1)));
            }
            GUIp.log.storageSet(GUIp.log.logID + 'sentToLEM1', Date.now());
            GUIp.log.updateButton();
            this.form.submit();
            document.getElementById('match').checked = false;
            document.getElementById('match_partial').checked = false;
            document.getElementById('medium').click();
            document.getElementById('search_mode').style.display = "none";
        };

        GUIp.log.updateButton();
        setInterval(function() {
            GUIp.log.updateButton();
            GUIp.log.deleteOldEntries();
        }, 1000);
        match.onchange = function() {
            search_mode.style.display = search_mode.style.display === 'none' ? 'block' : 'none';
        };
        high_contrast.checked = localStorage.getItem('GUIp_highContrast') === 'true';
        high_contrast.onchange = function() {
            localStorage.setItem('GUIp_highContrast', document.getElementById('high_contrast').checked);
        };
    } catch(e) {
        window.console.log(e);
    }
};

var starterInt = setInterval(function() { GUIp.log.starter(); }, 50);

})();
