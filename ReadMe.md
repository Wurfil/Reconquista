![kandinsky-download-1727581197737](https://github.com/user-attachments/assets/e67ce54a-5cb6-424f-a451-d4b1c9e36938)

# :robot: Chat-Bot to help Russian Railways employees

### Команда Мои-Закупки предствляет решение на кейс Разработка QnA чат-бота на основе базы знаний
[Ссылка на решение](https://t.me/airina_rutube_bot)


## :exploding_head: Проблематика

Ежегодно более 100 000 сотрудников ОАО "РЖД" сталкиваются с необходимостью ознакомиться с большим количеством документов по льготам, а специалисты по кадрам не всегда успевают объяснить все детали. Дополнительную сложность создают постоянные изменения нормативных актов и наличие 3500 филиалов с собственными правилами предоставления льгот.
## :hugs: Решение

Эффективным решением станет чат-бот для поддержки сотрудников, который позволит быстро находить ответы на вопросы по документам, адаптируясь к персональным данным каждого сотрудника и учитывая его уникальные потребности.

## :building_construction: Архитектра решения

Интеллектуальный чат-бот построен на RAG-pipeline, который включает в себя:
- Bi-encoder
- Cross-encoder
- LLM

### :pencil2: Ввод пользователя и oбработка запроса

Происходит нормализация и удаление стоп слов для уменьшение шума на эмбеддингах

> [!Note]
> Мы посчитали наиболее часто встречающиеся слова на реальных данных (например здравствуйте, спасибо и т.д.)
> и включили их в стоп слова, что положительное повлияло на метрику нахождения релевантых ответов из БЗ

### :mag_right: Поиск запроса по ответам БЗ

Векторным поиском находим топ 30 релеваных документов

> [!Note]
> Для наибольшей релевантности выполняем поиск не только по собственным векторам вопросам из БЗ, а так же по перефразированным вопросам
>

### :bookmark_tabs: Фильтруем документы

LLM выполняет фильтрацию документов и выбирает k документов для генерации ответа

>[!Note]
>Для наибольшей релевантности выполняем поиск не только по собственным веторам ответов из БЗ, а так же по перефразированным ответа
>

### :bulb: Генерация ответа

На основании отфильтрованных документов, генерируем ответ
> [!Note]
> Но если с фильтрации пришло 0 документов, модель сразу ответит "Я не знаю". Поэтому у модели нет возможности
> придумывать свои ответ. Ответы всегда будут основываться на БЗ
>

### :bricks: Композиция нагядно
![805909b7-deae-4918-9464-6502a8581b39.jpg](..%2F..%2F..%2FDownloads%2F805909b7-deae-4918-9464-6502a8581b39.jpg)
# :rocket: Запуск
Решение упаковано и будет готов к работе через **2 строки**

**Для запуска нужны**
- docker
- docker-compose
- make

**Запуск инференса LLM**
```
vllm serve --dtype half --max-model-len 16000 -tp 1 Vikhrmodels/Vikhr-Nemo-12B-Instruct-R-21-09-24 --api-key token-abc123
```

**Развертывание**
```
make up
```

# :computer: Стек технологий
**БД**
- redis (хранилище связей аугментированных вопросов и вопрос из бз)
- chroma (векторное хранилище)

**Код**
- python
- langchain

# :checkered_flag: Итог
**В конечном итоге мы предлагалем ready-to-start решение у которого**

:heavy_check_mark: Быстрый инференс (до 20 секнуд)

:heavy_check_mark: Точнось и полнота ответа 0.85

:heavy_check_mark: Точность подбора документов 0.94 в топ k отобранных фильтром

:heavy_check_mark: Высокая степень защиты от галлюцинаций

:heavy_check_mark: Легкая интеграция


## made with ♥️ by Мои-Закупки for
![header-logo c7e8f395](https://github.com/user-attachments/assets/8a56ca15-e17a-4ab6-b864-017fce804610)



