function getWords() {
	 return {
	// Этот параметр показывает текущую версию файла
	// Меняется только при _структурных_ изменениях.
	// Например: добавление, удаление, переименование секций.
	// Добавление фраз -- НЕ структурное изменение
	version: 11,

	// Фразы
	phrases: {
		// Ключевые корни: лечис, зелёнка
		heal: [
			"Лечись прям сейчас!", "Лечись зелёнкой!", "Жуй лечебные корешки!", "Выдели время на лечение!",
			"Намажь раны зелёнкой!", "Вылечись до 100%", "Позови медбрата, тебе нужно лечение!",
			"Зови врачей, у них есть зелёнка!", "Ищи лечебные корешки!", "Пей зелёнку!", "Лечись корешками!",
			"Зелёнку пей, на голову лей!", "Выдави из корешков зелёнку!", "Наложи бинты с зелёнкой!", "Капай зелёнку в нос!",
			"Зелёнка и бинты — товарищи твои.", "Лечи раны зелеными корешками!", "Головка вава, пей зеленку!",
			"Ешь таблетки с корешками не горстями, а мешками!", "Поправляй себе здоровье, травки жуй, башка коровья!"
		],

		// Ключевые корни: молись,
		pray: [
			"Молись!", "Помолись!", "Молись, преклони колени!", "Нужна молитва.",
			"Нужна прана, молись!", "Помолишься - получишь десерт!", "Помолись, кто, если не ты?", "Поклоняйся, я требую поклонения!",
			"Молитвы пополняют прану!"
		],

		// Ключевые корни: жертва
		sacrifice: [
			"Мне нужна жертва!", "Жертвуй!", "Пожертвуй кого-нибудь или что-нибудь!",
			"Жертву давай!", "Жертвуй монстра!", "Пожертвуй ненужное!", "Пожертвуй хоть что-нибудь!", "Пожертвуешь - возьму на ручки."
		],

		// Ключевые корни: опыт
		exp: [
			"Набирайся опыта!",	"Учись!", "Набирайся знаний.", "Нужен опыт!", "Давай, ищи опыт."
		],

		// Ключевые корни: золото клад
		dig: [
			"Копай клад.", "Ищи клад.", "Бери лопату и копай.", "Нужен клад.", "Ищи клад, копай лопатой!",
			"Копай золото вот тут, под деревом!", "Выкопай клад!", "Нужно золото, копай!", "Лопату в руки и копать!",
			"Ищи золотую руду!", "Копай метро!"
		],

		// Работает: бей, ударь, ударов
		// Не работает: бить, удар
		hit: [
			"Бей противника два раза!", "Ударь два раза.", "Ударь без очереди!", "Бей с оттягом!",
			"Ударь от всей души!", "Бей, не жалей!", "Ударь противника прямо в глаз!",
			"Бей по слабым местам!", "Не жалей ударов!", "Избей противника до беспамятства!", "Не жди очереди, бей!"
		],

		// Ключевые корни: отби, щит
		// Ключевое слово: защищайся
		defend: [
			"Отбивайся!", "Отбивай!", "Постарайся отбить!", "Соверши отбив!", "Отбивание - мать выживания!",
			"Приготовь свой отбивной щит!", "Щитуй!", "Подними щиты!", "Защищайся, как никто доселе не защищался!",
			"Подразни врага щитом!", "Повысь уровень защиты!", "Используй защиту в этом бою!"
		],

		do_task: [
			"Выполняй задание!", "Делай квест!", "Делай задание.", "Выполни квест.",
			"Квест в первую очередь!"
		],

		cancel_task: [
			"Отмени задание!", "Останови квест!"
		],

		die: [
			"Умри!", "Сдохни!"
		],

		town: [
			"Возвращайся в город!", "Иди обратно в город.", "Иди назад.", "Обратно в город!"
		],	

		// Ключевые корни: Север
		walk_n: [
			"Север!", "Север?", "Север ↑", "Север (↑)"
		],

		// Ключевые корни: Юг
		walk_s: [
			"Юг!", "Юг?", "Юг ↓", "Юг (↓)"
		],

		// Ключевые корни: Запад
		walk_w: [
			"Запад!", "Запад?", "Запад ←", "Запад (←)"
		],

		// Ключевые корни: Восток
		walk_e: [
			"Восток!", "Восток?", "Восток →", "Восток (→)"
		],

		// Начало для фраз-вопросиков
		inspect_prefix: [
			"Исследуй", "Осмотри", "Рассмотри"
		],
		
		// Ключевые слова для крафта
		craft_prefix: [
			"Склей", "Собери", "Скрафти", "Соедини", "Сделай", "Слепи"
		],
		
		// Префиксы во имя
		heil: [
			"Во имя богов", "Ради меня", "Во исполнение моей воли"
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
			'prana box',
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
	}
	};
}