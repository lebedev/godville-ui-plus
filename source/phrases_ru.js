(function() {
var worker = window.wrappedJSObject || window;
var starter = setInterval(initPhrases, 100);
function initPhrases() {
if (!worker.GUIp_browser || !worker.GUIp_help_guide_link) { return; }
clearInterval(starter);

worker.GUIp_words = function() {
	return {
	// Этот параметр показывает текущую версию файла
	// Меняется только при _структурных_ изменениях.
	// Например: добавление, удаление, переименование секций.
	// Добавление фраз — НЕ структурное изменение
	version: 13,

	// Фразы
	phrases: {
		// Ключевые корни: лечис, зелёнка
		heal: [
			"Лечись прям сейчас!", "Лечись зелёнкой!", "Жуй лечебные корешки!", "Выдели время на лечение!",
			"Намажь раны зелёнкой!", "Вылечись до 100%", "Позови медбрата, тебе нужно лечение!",
			"Зови врачей, у них есть зелёнка!", "Скушай лечебные корешки!", "Пей зелёнку!", "Лечись корешками!",
			"Зелёнку пей, на голову лей!", "Выдави из корешков зелёнку!", "Наложи бинты с зелёнкой!", "Капай зелёнку в нос!",
			"Зелёнка и бинты — твои кенты.", "Лечи раны зелеными корешками!", "Головка вава, пей зеленку!",
			"Ешь таблетки с корешками не горстями, а мешками!", "Поправляй себе здоровье, травки жуй, башка коровья!",
			"Раны штопай, корешки лопай!", "Доктора зови, только не помри!",
			"Быстро раны зашивай да здоровье поправляй!", "Быстро скушай корешок, пробрало чтоб до кишок.",
			"Ешь корешки, пей зелёнку, отдохни — поправь силёнки!", "Вот зелёнка, вот бинты, подлечись скорее ты!",
			"Скушай спелый корешок, выпeй зелёнки на посошок.", "Чтобы враз не помереть, раны надо протереть!",
			"Врач идёт тебя лечить, начинай зелёнку пить.",	"Мне надоело повторять, лечись скорее, твою мать!",
			"Направь на лечение планы, намажь-ка зелёнкю раны!", "Приходи в хорошую форму! Подтяни здоровье до нормы!",
			"Ты внимаешь, пастушок? Сжуй зелёный корешок!", "Бинт, зелёнка, йод, чеснок! Исцеляйся, будет ок!",
			"В нос зелёнку, в рот таблетку, корешок хоть в ухо, детка!", "Жизнь мне сильно облегча, доползи же до врача!",
			"Две ноги, одна рука? Мажь зелёнку на бока!", "Бинты и лечебные травки помогут добраться до лавки!",
			"Тело еще пригодится, пора пить зелёнку, лечиться!"
		],

		// Ключевые корни: молись,
		pray: [
			"Молись!", "Помолись!", "Молись, преклони колени!", "Нужна молитва.",
			"Нужна прана, молись!", "Помолишься — получишь десерт!", "Помолись, кто, если не ты?", "Поклоняйся, я требую поклонения!",
			"Молитвы пополняют прану!", "Вспомни минувшие битвы! Время найди для молитвы!",	"Помолись, помолись! На арене заждались!",
			"Забудь, подопечный, о лени! Помолись, упади на колени!", "Кто, если не ты? Молитва! Поклоны Кресты!",
			"Помолись-ка, впадая в нирвану! Восполни бесценную прану!", "Молитва – дело святое! Помолись, как пристало герою!",
			"Молись Творцу, молись богам! Хоть осетинским пирогам!",
			"Хоть вальсируй, хоть пляши! Вложи в молитву часть души!", "Помолиться не забудь, прежде чем принять на грудь!",
			"Солнце светит на твой храм, помолись — печеньку дам.", "Поклоняйся только мне и молись даже во сне. ",
			"Молись и кайся, мне поклоняйся!", "Помолись-ка от души — и привалят барыши.", "Молитва помогает — тебя оберегает!",
			"Поклонись и помолись, прана быстро прыгнет ввысь!"
		],

		// Ключевые корни: жертва
		sacrifice: [
			"Мне нужна жертва!", "Жертвуй!", "Пожертвуй кого-нибудь или что-нибудь!",
			"Жертву давай!", "Жертвуй монстра!", "Пожертвуй ненужное!", "Пожертвуй хоть что-нибудь!", "Пожертвуешь — возьму на ручки.",
			"Жертве время — потехе час!", "Жертва аборта ждёт курорта.", "Трубы у меня горят, жертвуй монстров всех подряд!",
			"Кто пожертвует малёк, тот получит кошелёк.", "Видишь жертвенный альтарь — положи туда фонарь.",
			"Твоя жертва не напрасна — жертва всячески прекрасна.",	"Жертвуй мне что пожирнее, вот я что сказать имею!",
			"Надоела мне диета. Жертвуй мне, хочу банкета!", "Жертву хочу! Давай, не шучу!",
			"Во исполнение воли моей, жертвуй какой-то ненужный трофей!", "Жертвуй монстра, жертвуй дроп! Я твой бог, а не укроп!",
			"Жертвуй мне во имя мое.", "Ради моего покоя, жертву принеси рукою!", "Голод – не тётка, жертвуй мне находку!"
		],

		// Ключевые корни: опыт
		exp: [
			"Набирайся опыта!",	"Учись!", "Набирайся знаний.", "Нужен опыт!", "Давай, опыт!",
			"Учиться, учиться, и учиться!", "Ум за разум всем заразам!", "Ум — от рожденья, опыт — наваждение.",
			"Учись как лось, чтоб желание сбылось!", "Научись соображать, а не только дико ржать.",
			"Оптимизируй своё время, ум и опыт — тяжкое бремя.", "Чтоб были большие зарплаты, учись и пиши рефераты!",
			"Не гадай на гуще кофейной, опыт добавляй идейный!",
			"Опыт в жизни пригодится. Продолжай, герой, учиться!", "Опыт вбирай во все тела концы! В пятки, в сопатку, в лоб и резцы!",
			"Надо учиться и опыт качать, пользу от знаний всегда получать!", "Раз-два, раз-два! Ум качай, а не права!",
			"Учись, набирайся опыта! Попрошу без лишнего ропота!", "Опыт прокачивай, впитывай знания – так учат потомков седые предания."
		],

		// Ключевые корни: золото клад
		dig: [
			"Копай клад.", "Ищи клад.", "Бери лопату и копай.", "Нужен клад.", "Ищи клад, копай лопатой!",
			"Копай золото вот тут, под деревом!", "Выкопай клад!", "Нужно золото, копай!", "Лопату в руки и копать!",
			"Ищи золотую руду!", "Копай метро!", "Клад ищи да не свищи.", "Вот лопата, вот кирка — клад копай исподтишка.",
			"Копай мне золота бурдюк, разбогатеем как индюк.", "Покопайся в голове, кладезь мудрости своей.",
			"Прикладные искусства — золотые русла.", "К тебе не подкопаться — кладезь информации.", "Складной ножик всем поможет.",
			"Кладка яиц — дело синиц.", "Золотой покрой — клад, а не герой.", "Ищи свой путь, копай жуть.",
			"Золотухой не страдай, лучше резво ты копай.", "Клад ищи! Копай лопатой! Будешь как Мидас богатый!",
			"Копай хоть лопатой, хоть молотом! Клад ищи, да сундук с золотом!", "Копай метро, траншеи рой! Сундук ищи, затем второй!",
			"Рой под деревом землицу! Клад случайный пригодится!", "Ищи золотую руду! Копай клад, забудь ерунду!",
			"Золотой сундук – награда для рук!", "Нужно золото, копай! Землю киркой наподдай!",
			"Сила – в золоте и кладе. Землю рой вперед и сзади!", "Копай с утра и до обеда! Найди сундук, позли соседа!"
		],

		// Работает: бей, ударь, ударов
		// Не работает: бить, удар
		hit: [
			"Бей противника два раза!", "Ударь два раза.", "Ударь без очереди!", "Бей с оттягом!",
			"Ударь от всей души!", "Бей, не жалей!", "Ударь противника прямо в глаз!",
			"Бей по слабым местам!", "Не жалей ударов!", "Избей противника до беспамятства!", "Не жди очереди, бей!",
			"Бей, бей, не робей!", "Бей смело, лупи в тело!", "Бей врага, лупи слегка.", "Бей врага, врежь пинка!",
			"Бей сильнее, бей два раза, бей двумя ногами сразу!", "Врежь сильнее ты врагу, чтобы не попасть в рагу!",
			"Очереди не жди — бей и напролом иди!", "Атакуй врага скорей, бей уменьем, врежь сильней!",
			"Не шугай голубей, а врагу в морду бей!", "Атакуй как папуас — бей сильнее прямо в глаз!",
			"Бей сильнее, дважды бей, атакуй как воробей!", "Бей врага, лупи, круши! Врежь два раза от души!",
			"Эй, работяга, вдарь дважды с оттягом!", "Не жди очереди своей. Лупи с размаху, не робей!",
			"Бей пяткой с разворота! Дважды пни обормота!",	"В нокаут двойным ударом – и мана не тратится даром!",
			"Бей в глаз каждый раз! Это мой тебе приказ!", "Намни сопернику бока! Бей дважды, чтоб наверняка!",
			"Задай противнику взбучку! Преврати ударами в кучку!", "Никогда не щади адресата! Бей сильно, только без мата!",
			"Беспощадно лупи оппонента! Бей дважды, но интеллигентно!",	"Ударов не жалей! Бей до кровавых соплей!"
		],

		// Ключевые корни: отби, щит
		// Ключевое слово: защищайся
		defend: [
			"Отбивайся!", "Отбивай!", "Постарайся отбить!", "Соверши отбив!", "Отбивание — мать выживания!",
			"Приготовь свой отбивной щит!", "Щитуй!", "Поднять щиты!", "Защищайся, как никто доселе не защищался!",
			"Подразни врага щитом!", "Повысь уровень защиты!", "Используй защиту в этом бою!", "Щит хороший, блокируй рожу.",
			"Защищайся как диплом, против лома блок — лишь лом.", "Блок-посты видны вдали, защищайся как Брюс Ли.",
			"Защищаться ни к чему — блоком кирпичей ему!", "Лучшая защита — блок из кристаллита.",
			"Блокируй неприятеля — защита шпагоглотателя!", "Читай Пушкина и Блока — вот защита от порока.",
			"Сохрани одежды клок! Отбивайся, выставь блок!", "Какое небо голубое… Маши щитом в разгаре боя!",
			"Соверши отбив могучий просто так, на всякий случай!", "Отпрыгни, отскочи, отбейся! На щит, не на меня надейся!",
			"Крепости алмазной блоком защищай тылы и сбоку.", "Отбивай врага удары, выставь щит во время свары!",
			"Не будет слив тебе засчитан, ставь блок и повышай защиту!", "Голову щитом прикрой, отразив yдapoв рой!",
			"Отложив все на потом, тело прикрывай щитом!"
		],

		do_task: [
			"Выполняй задание!", "Делай квест!", "Делай задание.", "Выполни квест.", "Квест в первую очередь!",
			"Выполняй задание без зависанья.", "Квест выполняй, не то будет нагоняй!", "Квестовые отвёртки! Кому квестовые отвёртки!",
			"Ты задание делай враз, а не то получишь в глаз.", "Дано задание — решай боданием!",
			"Квест не интересен? Спой задорных песен!", "Делай квест в один присест!",
			"Слушай божества приказ. Квест выполняй на «раз-раз-раз»!", "Влево-вправо не виляй! Поскорей квест выполняй!",
			"Быстрее выполняй свое задание! Такое у тебя, герой, призвание!", "Для каникул длительных, делай квест стремительно!",
			"Не была бы честь задета, квест выполняй быстрей ракеты!", "Чтобы совесть не болела, квест выполни, окончи дело!",
			"Чтоб избежать с небес летящих молний, ты побыстрей задание исполни!"
		],

		cancel_task: [
			"Отмени задание!", "Останови квест!", "Брось задание — иди на свидянье!", "Вот те крест, отмени квест!",
			"Отмени задание ты — брось его скорей в кусты!", "Брось выпендриваться, квест сам сделается!",
			"Синдром отмены квеста — мозги как из теста!", "Слышишь глас из разных мест? Отменяй скорее квест!",
			"Отмени скорее квест, а не то поставят крест!", "Отмени задание во имя тьмы! Пусть теперь корячатся другие, а не мы!",
			"Внемли приказу, слух открой! Бросай задание, герой!", "Задание брось или дружба врозь!",
			"Заданье брось, забудь о квесте! Расслабься, съешь сосиску в тесте.", "Квест прекрати, останови! ОС в планшете обнови!",
			"Задание твое не в моде. Бросай его, вернись к природе!", "Споры не переношу. Брось задание, прошу!",
			"Хватит! Стоп! Окончен квест! Время ярмарки невест!"
		],

		die: [
			"Умри!", "Сдохни!", "Умри! Умри! Умри!", "На счет раз, два три, быстро ты умри! На счет пять умирай опять!"
		],

		town: [
			"Возвращайся в город!", "Иди обратно в город.", "Иди назад.", "Обратно в город!", "Иди домой как пёс хромой.",
			"Возвращайся поскорей, в дом родной, что всех милей!", "Город ждёт, судьба зовёт!",
			"Пойди поиграй в городки.", "Кто ведёт такой конвой?  Городничий-домовой!", "Поиграем в городки, ты иди промой мозги.",
			"В город, к дому очень нужно! Возвращайся с троп окружных!", "Не пойми меня превратно, но назад иди обратно!",
			"Давай не возмущайся! Обратно возвращайся!", "Обратно к городу сверни! Нельзя ходить в такие дни!",
			"Возвращайся в город, все пошло не так. В городе – к прилавку, а затем в кабак!",
			"Возвращайся в город, выпeй кружку кваса! Поверни обратно, надоела трасса!", "Возвращайся домой, уши с мылом помой!",
			"Не сворачивая вбок, в город дуй, как хочет бог!", "Время повернуть назад, в городе гонять парад!",
			"Без малейшей ответной реакции в город вернись к рекреации!"
		],

		// Ключевые корни: Север
		go_north: [
			"Север!", "Север?", "Север ↑", "Север (↑)"
		],

		// Ключевые корни: Юг
		go_south: [
			"Юг!", "Юг?", "Юг ↓", "Юг (↓)"
		],

		// Ключевые корни: Запад
		go_west: [
			"Запад!", "Запад?", "Запад ←", "Запад (←)"
		],

		// Ключевые корни: Восток
		go_east: [
			"Восток!", "Восток?", "Восток →", "Восток (→)"
		],

		// Начало для фраз-вопросиков
		inspect_prefix: [
			"Исследуй", "Осмотри", "Рассмотри", "Поиграй в исследователя — потряси", "Осмотрись по сторонам, и потряси",
			"Потряси воображение — осмотри", "Глянь, какой трофей красивый, осмотри"
		],

		// Ключевые слова для крафта
		craft_prefix: [
			"Склей", "Собери", "Скрафти", "Соедини", "Сделай", "Слепи", "Не спи, собери", "Вместо ласт, склей лучше",
			"Сила в единстве, соедини", "Моментально склей"
		],

		// Префиксы во имя
		exclamation: [
			"Во имя богов", "Ради меня", "Во исполнение моей воли", "Во имя моё, которого ты не знаешь", "Ради всего цветного",
			"Ради эволюции", "Во славу уравнений Максвелла", "Ради святого атеизма", "Ради науки", "Ради святого радия",
			"Ради святой простоты", "Во имя мира на земле", "Во славу себя любимого", "В честь пращуров и прищуров",
			"На благо всех и вся", "Во имя премии Дарвина", "Во веки веков", "Ради пафоса", "Ради первого встречного",
			"Чтобы помнили", "Чтобы было"
		]
	},

	usable_items: {
		types: [
			'aura box',
			'arena box',
			'black box',
			'boss box',
			'coolstory box',
			'friend box',
			'gift box',
			'good box',
			'invite',
			'heal box',
			'charge box',
			'raidboss box',
			'smelter',
			'teleporter',
			'to arena box',
			'transformer',
			'quest box'
		],
		descriptions: [
			'Этот предмет наделяет героя случайной аурой',
			'Данный предмет можно активировать только во время дуэли',
			'Этот предмет может случайным образом повлиять на героя',
			'Этот предмет ищет для героя босса',
			'Этот предмет сочиняет о герое былину',
			'Этот предмет заводит герою случайного друга из числа активных героев',
			'Этот предмет можно превратить во что-то хорошее',
			'Активация этого предмета может преподнести герою приятный сюрприз',
			'Активация инвайта увеличит счетчик доступных приглашений',
			'Этот предмет полностью восстанавливает здоровье героя',
			'Этот предмет добавляет заряд в прано-аккумулятор',
			'Этот предмет на несколько минут отправляет героя в поиск соратников для битвы с ископаемым боссом',
			'Этот предмет убивает атакующего героя монстра, либо пытается выплавить из золота героя золотой кирпич',
			'Этот предмет телепортирует героя в случайный город',
			'Этот предмет отправляет героя на арену',
			'Этот предмет превращает один или несколько жирных предметов из инвентаря героя в золотые кирпичи',
			'Этот предмет отправляет героя в мини-квест'
		]
	},

	pets: [
		{name: 'администратор годвилля', min_level: 80},
		{name: 'альфа-кентавр', min_level: 80},
		{name: 'аристокрот', min_level: 80},
		{name: 'бармаглот', min_level: 50},
		{name: 'биоволк', min_level: 40},
		{name: 'бурундук-шатун', min_level: 25},
		{name: 'быкинг', min_level: 110},
		{name: 'василиск прекрасный', min_level: 60},
		{name: 'ведмедь', min_level: 80},
		{name: 'вездекот', min_level: 40},
		{name: 'вхламинго', min_level: 75},
		{name: 'гипноманул', min_level: 18},
		{name: 'гидравлиск', min_level: 80},
		{name: 'дракошка', min_level: 45},
		{name: 'дьяволк', min_level: 80},
		{name: 'ездовой академик', min_level: 80},
		{name: 'ерундук', min_level: 18},
		{name: 'ехиднорог', min_level: 30},
		{name: 'загрызаяц', min_level: 25},
		{name: 'злось', min_level: 70},
		{name: 'йети подземелья', min_level: 100},
		{name: 'каннский лев', min_level: 65},
		{name: 'карликовый дракон', min_level: 40},
		{name: 'котопёс', min_level: 26},
		{name: 'ломокотив', min_level: 65},
		{name: 'многоногий сундук', min_level: 50},
		{name: 'мозговой слизень', min_level: 18},
		{name: 'наномедвед', min_level: 35},
		{name: 'неверморж', min_level: 100},
		{name: 'огнегривый лев', min_level: 75},
		{name: 'огнелис', min_level: 34},
		{name: 'песочный сфинкс', min_level: 70},
		{name: 'пожираф', min_level: 65},
		{name: 'потолковый лампожуй', min_level: 18},
		{name: 'почеширский кот', min_level: 18},
		{name: 'пухозаврик', min_level: 18},
		{name: 'саблекрыс', min_level: 25},
		{name: 'саблепузый тигр', min_level: 40},
		{name: 'семиногий единорог', min_level: 50},
		{name: 'серверный олень', min_level: 40},
		{name: 'сиамский ковродёр', min_level: 25},
		{name: 'слонопотам', min_level: 112},
		{name: 'субтигр', min_level: 91},
		{name: 'троянский конь', min_level: 40},
		{name: 'ультралис', min_level: 40},
		{name: 'хатуль мадан', min_level: 32},
		{name: 'хомячок-берсеркер', min_level: 33},
		{name: 'хохмяк', min_level: 25},
		{name: 'хрюкотательный зелюк', min_level: 18},
		{name: 'хтонический шушпанчик', min_level: 60},
		{name: 'ядрёнорог', min_level: 34}
	]
	};
};

worker.GUIp_locale = 'ru';

worker.GUIp_i18n = {
	// superhero
	hero: ['героя', 'герою'],
	heroine: ['героиню', 'героине'],
	ask1: 'Упросить ',
	get inspect() { return ' ' + ['потрясти', 'исследовать', 'осмотреть'][Math.floor(Math.random()*3)] + ' '; },
	ask2: 'Уговорить ',
	get craft1() {
		return ' ' + ['склеить', 'собрать', 'скрафтить', 'соединить', 'сделать', 'слепить'][Math.floor(Math.random()*6)] + ' случайную комбинацию ';
	},
	b_b: '<b>ж</b>+<b>ж</b>',
	b_b_hint: 'жирных',
	b_r: '<b>ж</b>+нж',
	b_r_hint: 'жирного и нежирного',
	r_r: 'нж+нж',
	r_r_hint: 'нежирных',
	craft2: ' предметов из инвентаря.',
	get craft_verb() { return ['Склей', 'Собери', 'Скрафти', 'Соедини', 'Сделай', 'Слепи'][Math.floor(Math.random()*6)]; },
	close: 'закрыть',
	if_something_wrong_capt: 'если что-то пошло не так',
	if_something_wrong: 'Если что-то работает не так, как должно:',
	help_refresh: 'Обновите страницу. Если баг повторяется — переходите к следующему шагу.',
	help_check_version: 'Нажмите сюда, чтоб проверить, последняя ли у вас версия дополнения.',
	help_update_chrome_1: 'Откройте страницу настроек Хрома (2). ' +
		worker.GUIp_help_guide_link + 'chrome_manual_update_1.png" title="Откроется в новой вкладке">Картинка</a>.',
	help_update_chrome_2: 'Выберите "Расширения" (3), поставьте флажок "Режим разработчика" (4), нажмите появившуюся кнопку ' +
		'"Обновить расширения" (5), подождите, пока браузер обновит расширение, снимите флажок (6). ' +
		worker.GUIp_help_guide_link + 'chrome_manual_update_2.png" title="Откроется в новой вкладке">Картинка</a>.',
	help_update_firefox_1: 'Откройте страницу дополнений Файрфокса (2 или <b>Ctrl+Shift+A</b>). ' +
		worker.GUIp_help_guide_link + 'firefox_manual_update_1.png" title="Откроется в новой вкладке">Картинка</a>.',
	help_update_firefox_2: 'Нажмите на шестеренку (3), потом "Проверить наличие обновлений" (4), подождите несколько секунд и согласитеcь ' +
		'на перезапуск браузера. ' +
		worker.GUIp_help_guide_link + 'firefox_manual_update_2.png" target="_blank" title="Откроется в новой вкладке">Картинка</a>.',
	help_back_to_step_1: 'Обратно к шагу 1.',
	help_console_1: 'Если баг остался — проверьте, нет ли пойманного вами бага в списке багов по ссылке ниже.',
	help_console_2: 'Если его нет в списке и не выдавалось сообщения с текстом и местом ошибки — откройте консоль ' +
		'(через меню или комбинацией <b>Ctrl+Shift+' + (worker.GUIp_browser === 'Firefox' ? 'K' : 'J') + '</b>). ' +
		worker.GUIp_help_guide_link + (worker.GUIp_browser === 'Firefox' ? 'firefox' : 'chrome') + '_worker.console.png" ' +
		'title="Откроется в новой вкладке">Картинка</a>.',
	help_console_3: 'Попробуйте найти в консоли что-нибудь, похожее на информацию об ошибке (' +
		worker.GUIp_help_guide_link + (worker.GUIp_browser === 'Firefox' ? 'firefox' : 'chrome') + '_console_error.png" ' +
		'title="Откроется в новой вкладке">картинка</a>). ' +
		'И с этой информацией напишите <b>Бэдлаку</b> или в тему на форуме по ссылкам ниже.',
	help_useful_links: 'Полезные ссылки: ' +
		'<a href="/gods/Бэдлак" title="Откроется в новой вкладке" target="about:blank">Бэдлак</a>, ' +
		'его <a href="skype:angly_cat">скайп</a>, ' +
		'<a href="https://github.com/zeird/godville-ui-plus/wiki/TODO-list" title="Откроется в новой вкладке" ' +
			'target="_blank">список багов и идей (aka "блокнотик")</a>, ' +
		'<a href="/forums/show_topic/2812" title="Откроется в новой вкладке" target="_blank">тема на форуме</a>, ' +
		'<a href="http://wiki.godville.net/Godville_UI+" title="Откроется в новой вкладке" target="about:blank">статья в богии</a>, ' +
		'<a href="/gods/Спандарамет" title="Откроется в новой вкладке" target="about:blank">фразы из подземелья</a>.',
	ui_settings_top_menu: 'настройки <strong>ui+</strong>',
	getting_version_no: 'Получения номера последней версии дополнения...',
	is_last_version: 'У вас последняя версия.',
	is_not_last_version_1: 'Последняя версия — <b>',
	is_not_last_version_2: '</b>. Нужно обновить вручную.',
	proceed_to_next_step: ' Переходите к следующему шагу.',
	getting_version_failed: 'Не удалось узнать номер последней версии. Если вы еще не обновлялись вручную, переходите к шагу 3, иначе к шагу 6.',
	hero_health: 'Здоровье героя',
	inventory: 'Инвентарь',
	gold: 'Золото',
	charges: 'Заряды',
	allies_health: 'Здоровье союзников',
	enemy_health: 'Здоровье соперника',
	exp: 'Опыт (проценты)',
	level: 'Уровень',
	health: 'Здоровье',
	godpower: 'Прана (проценты)',
	task: 'Задание (проценты)',
	monsters: 'Монстры',
	bricks: 'Кирпичи',
	logs: 'Дерево',
	savings: 'Сбережения (тысячи)',
	weapon: 'Оружие',
	shield: 'Щит',
	head: 'Голова',
	body: 'Тело',
	arms: 'Руки',
	legs: 'Ноги',
	talisman: 'Талисман',
	death_count: 'Смерти',
	pet_level: 'Уровень питомца',
	unknown_item_type_title: 'Неизвестный тип предмета в Godville UI+!',
	unknown_item_type_content: 'Дополнение обнаружило в вашем инвентаре неизвестную доселе категорию предмета. Пожалуйста, сообщите разработчику следующее описание: ',
	godpower_label: 'Прана',
	north: 'Север',
	go_north: ' повести команду на север',
	east: 'Восток',
	go_east: ' повести команду на восток',
	south: 'Юг',
	go_south: ' повести команду на юг',
	west: 'Запад',
	go_west: ' повести команду на запад',
	ask3: 'Попросить ',
	defend: 'отбивай',
	ask4: 'Попытаться заставить ',
	to_defend: ' принять защитную стойку, поднять щит и отбить атаку противника',
	pray: 'молись',
	ask5: 'Попросить ',
	to_pray: ' вознести молитву для пополнения праны',
	heal: 'лечись',
	ask6: 'Посоветовать ',
	to_heal: ' подлечиться подручными средствами',
	hit: 'бей',
	ask7: 'Подсказать ',
	to_hit: ' о возможности нанесения сильного удара вне очереди',
	sacrifice: 'жертвуй',
	ask8: 'Послать ',
	to_sacrifice: ' требование кровавой или золотой жертвы для внушительного пополнения праны',
	enemy_label: 'Противник',
	boss_warning_hint: 'близость к боссу',
	boss_slay_hint: 'босс',
	small_prayer_hint: 'слабая молилка',
	small_healing_hint: 'слабая лечилка',
	unknown_trap_hint: 'ловушка, заблокированная петом',
	trophy_loss_trap_hint: 'ловушка: золото или трофеи',
	low_damage_trap_hint: 'ловушка: слабый урон',
	moderate_damage_trap_hint: 'ловушка: средний урон',
	move_loss_trap_hint: 'ловушка: пропуск хода',
	boss_warning_and_trap_hint: 'близость к боссу и ловушка',
	boss_slay_and_trap_hint: 'босс и ловушка',
	health_label: 'Здоровье',
	gold_label: 'Золота',
	inventory_label: 'Инвентарь',
	level_label: 'Уровень',
	task_label: 'Задание',
	death_label: 'Смертей',
	study: 'учись',
	dig: 'копай',
	cancel_task: 'отмени',
	do_task: 'делай',
	die: 'умри',
	ask9: 'Предложить ',
	to_study: ' получить порцию опыта',
	ask10: 'Указать ',
	to_dig: ' место для копания клада или босса',
	ask11: 'Убедить ',
	to_cancel_task: ' отменить текущее задание',
	ask12: 'Открыть ',
	to_do_task: ' секрет более эффективного выполнения задания',
	ask13: 'Попросить ',
	to_die: ' увеличить на единичку счетчик смертей',
	milestones_label: 'Столбов от столицы',
	return: 'дом',
	ask14: 'Наставить ',
	to_return: ' на путь в ближайший город',
	monsters_label: 'Убито монстров',
	bricks_label: 'Кирпичей для храма',
	logs_label: 'Дерева для ковчега',
	savings_label: 'Сбережения',
	pet_status_label: 'Статус',
	pet_level_label: 'Уровень',
	gte_no_penalty: 'Сейчас можно сделать возложение без штрафов',
	gte_minor_penalty: 'Сейчас на возложения действует штраф в одну треть',
	gte_major_penalty: 'Сейчас на возложения действует штраф в две трети',
	gte_unknown_penalty: 'Нет информации о штрафах. Неопределенность разрешится после возложения или через ',
	error_message_title: 'Ошибка в Godville UI+!',
	error_message_subtitle: 'Произошла ошибка. Скопируйте следующую информацию и действуйте по инструции из окошка помощи:',
	error_message_text: 'Текст ошибки:',
	error_message_stack_trace: 'Трассировка стека',
	and: ' и ',
	ui_help: 'help',
	// options
	import_success: 'Настройки успешно импортированы',
	import_fail: 'Некорректная строка настроек',
	ui_options: 'Настройки UI+',
	import_prompt: 'Импорт настроек\nВставьте сюда строку настроек',
	export_prompt: 'Экспорт настроек\nСкопируйте отсюда строку настроек',
	bg_status_file: 'файл',
	bg_status_link: 'ссылка',
	bg_status_same: 'тот же',
	bg_status_error: 'ошибка',
	// options-page
	profile_menu_settings: 'Настройки',
	profile_menu_informers: 'Информеры',
	profile_menu_gadgets: 'Клиенты и плагины',
	profile_menu_invites: 'Приглашения',
	profile_menu_plogs: 'Подзарядки',
	ui_settings_capt: 'Настройки Godville UI+',
	disable_voice_generators: 'Выключить генераторы гласов',
	use_hero_name: 'Имя героя в гласе',
	use_hero_name_desc: 'добавляет в начало гласа обращение к герою',
	use_exclamatios: 'Восклицания в гласе',
	use_exclamatios_desc: 'добавляет в глас восклицания',
	use_short_phrases: 'Короткие фразы для гласов',
	use_short_phrases_desc: 'использует одну фразу вместо нескольких',
	disable_die_button: 'Отключить кнопку "умри"',
	disable_die_button_desc: 'для тех, кого она нервирует',
	disable_logger: 'Отключить логгер',
	disable_logger_desc: 'отключает бегущую строку с красивыми разноцветными циквирками',
	relocate_duel_buttons: 'Переместить дуэльные кнопки',
	relocate_duel_buttons_desc: 'позволяет переместить дуэльные кнопки в пантеоны',
	relocate_duel_buttons_hint: 'какие из них?',
	relocate_duel_buttons_arena: 'аренную',
	relocate_duel_buttons_challenge: 'тренировочного боя',
	forbidden_title_notices: 'Выбрать уведомления в заголовке окна',
	forbidden_title_notices_desc: 'позволяет запретить отдельные уведомления в заголовке',
	forbidden_title_notices_hint: 'какие из них?',
	forbidden_title_notices_pm: 'личка',
	forbidden_title_notices_gm: 'гильдчат',
	forbidden_title_notices_fi: 'новые сообщения на форуме',
	use_background: 'Включить фон',
	use_background_desc: 'включает облачный или другой фон',
	use_background_hint: 'какой из них?',
	use_background_cloud: 'тот самый облачный',
	use_background_file: 'свой файлом',
	use_background_link: 'или ссылкой',
	voice_timeout: 'Выбрать продолжительность таймаута',
	voice_timeout_desc: 'вместо стандартных 30 секунд',
	voice_timeout_hint: 'введите число (секунд)',
	hide_charge_button: 'Убрать кнопку "Зарядить"',
	hide_charge_button_desc: 'для тех, кто не тратит деньги',
	relocate_map: 'Поменять местами пульт и карту',
	relocate_map_desc: 'в подземельях',
	freeze_voice_button: 'Замораживать кнопку гласа',
	freeze_voice_button_desc: 'замораживает кнопку гласа в некоторых случаях',
	freeze_voice_button_after_voice: 'после реакции на глас',
	freeze_voice_button_when_empty: 'при пустом гласе',
	forbidden_craft: 'Выбрать разрешения для крафта',
	forbidden_craft_desc: 'позволяет запретить отдельные связки и категории предметов для крафта',
	forbidden_craft_b_b: '<b>жирный</b> + <b>жирный</b>',
	forbidden_craft_b_r: '<b>жирный</b> + нежирный',
	forbidden_craft_r_r: 'нежирный + нежирный',
	forbidden_craft_usable: 'включая <b>активируемые</b>',
	forbidden_craft_heal: 'включая лечилки',
	disable_page_refresh: 'Выключить автообновление страницы',
	disable_page_refresh_desc: 'при зависаниях страницы героя, одобрено демиургами',
	disable_laying_timer: 'Отключить таймер возложений',
	disable_laying_timer_desc: 'для тех, кому он мозолит глаза',
	forbidden_informers: 'Выбрать информеры вручную',
	forbidden_informers_desc: 'позволяет выбрать отображаемые информеры',
	forbidden_informers_full_godpower: 'полная прана',
	forbidden_informers_much_gold: 'много золота',
	forbidden_informers_dead: 'смерть',
	forbidden_informers_pvp: 'бой',
	forbidden_informers_arena_available: 'открытие арены',
	forbidden_informers_dungeon_available: 'открытие подземелья',
	forbidden_informers_wanted_monster: 'монстр дня',
	forbidden_informers_special_monster: 'монстр со способностями',
	forbidden_informers_tamable_monster: 'приручаемый монстр',
	forbidden_informers_pet_knocked_out: 'контузия питомца',
	forbidden_informers_close_to_boss: 'близость к боссу в подземелье',
	forbidden_informers_guild_quest: 'взятие квеста на смену гильдии',
	forbidden_informers_mini_quest: 'взятие мини-квеста',
	forbidden_informers_usable_items: 'Активируемые предметы',
	forbidden_informers_check: 'отметить',
	forbidden_informers_check_all: 'все',
	forbidden_informers_or: 'или',
	forbidden_informers_check_none: 'ни один',
	forbidden_informers_arena_box: 'используемые на арене',
	forbidden_informers_aura_box: 'наделяющие случайной аурой',
	forbidden_informers_black_box: 'оказывающие случайный эффект',
	forbidden_informers_boss_box: 'вызывающие сильного монстра',
	forbidden_informers_charge_box: 'пакующие прану за полцены',
	forbidden_informers_coolstory_box: 'сочиняющие былину',
	forbidden_informers_gift_box: 'дарующие кирпич',
	forbidden_informers_friend_box: 'заводяшие случайные знакомства',
	forbidden_informers_good_box: 'делающие что-то хорошее',
	forbidden_informers_heal_box: 'восстанавливающие здоровье',
	forbidden_informers_invite: 'инвайт на Годвилль',
	forbidden_informers_raidboss_box: 'откапывающие рейд-босса',
	forbidden_informers_quest_box: 'выдающие мини-квест',
	forbidden_informers_smelter: 'плавящие золото в кирпич',
	forbidden_informers_teleporter: 'телепортирующие в город',
	forbidden_informers_to_arena_box: 'отправляющие на арену',
	forbidden_informers_transformer: 'меняющие <b>предметы</b> на кирпичи',
	disable_pm_sound: 'Выключить звук личных сообщений',
	disable_pm_sound_desc: 'для тех, кому "дзынь" бьет по ушам',
	disable_arena_sound: 'Выключить звук арены',
	disable_arena_sound_desc: 'арены, тренировки, босса, подземелья',
	disable_links_autoreplace: 'Выключить замену ссылок картинками',
	disable_links_autoreplace_desc: 'на форуме',
	enable_debug_mode: 'Включить режим отладки',
	enable_debug_mode_desc: 'чисто девелоперская штучка',
	apply: 'Применить',
	voices_capt: 'Гласы',
	voices_heal: 'Лечись',
	voices_pray: 'Молись',
	voices_sacrifice: 'Жертвуй',
	voices_exp: 'Опыт',
	voices_dig: 'Клад',
	voices_hit: 'Бей',
	voices_do_task: 'Задание',
	voices_cancel_task: 'Отменить задание',
	voices_die: 'Умри',
	voices_town: 'В город',
	voices_defend: 'Защита',
	voices_exclamation: 'Восклицание',
	voices_inspect_prefix: 'Вопросики',
	voices_craft_prefix: 'Крафт',
	voices_north: 'Север',
	voices_south: 'Юг',
	voices_west: 'Запад',
	voices_east: 'Восток',
	voices_save: 'Сохранить',
	voices_defaults: 'Восстановить по умолчанию',
	import_export_capt: 'Импорт/экспорт настроек',
	import: 'Импорт',
	export: 'Экспорт',
	// forum
	Subscribe: 'Подписаться',
	Unsubscribe: 'Отписаться',
	subscribe: 'подписаться',
	unsubscribe: 'отписаться',
	bold_hint: 'Сделать полужирным',
	bold: 'Ж',
	underline_hint: 'Подчеркнуть',
	underline: 'П',
	strike_hint: 'Зачеркнуть',
	strike: 'З',
	italic_hint: 'Сделать курсивным',
	italic: 'К',
	quote_hint: 'Процитировать',
	code_hint: 'Выделить',
	link_hint: 'Вставить ссылку',
	unordered_list_hint: 'Оформить как неупорядоченный список',
	ordered_list_hint: 'Оформить как упорядоченный список',
	br_hint: 'Вставить перенос на новую строку',
	sup_hint: 'Сделать текст надстрочным',
	sub_hint: 'Сделать текст подстрочным',
	monospace_hint: 'Сделать текст моноширинным',
	monospace: 'мш',
	broadcast: 'трансляция',
	user_css: 'Пользовательский CSS',
	open_chat_with: 'Открыть чат c богом/богиней ',
	open_in_a_new_tab: 'Открыть в новой вкладке'
};

}
})();