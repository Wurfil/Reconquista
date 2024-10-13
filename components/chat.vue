<template>
  <div class="tw-text-xl tw-h-[100px] tw-w-full tw-max-w-[900px] tw-py-5 tw-fixed tw-bg-white tw-left-0 tablet:tw-left-auto tw-top-16 tw-z-10">
    <h1 class="tw-text-primary tw-text-center tw-text-2xl tw-mt-3 header-name">
      <span class="tw-bg-[#ef3025] tw-text-white  tw-p-1"> ЧАТ-БОТ ПОДДЕРЖКИ</span> СОТРУДНИКОВ РЖД
    </h1>
  </div>
  <div class="tw-my-20">
    <div v-if="loadingChat" class="tw-flex tw-justify-center">
      <q-spinner size="36" />
    </div>
    <!--        <div v-else-if="!chatTree.length">-->
    <!--          <choose-ticket />-->
    <!--        </div>-->
    <div
      v-for="chat in chatTree"
      :key="chat"

    >
      <q-chat-message
        v-if="chat.type === 'ai'"
        class="tw-text-base tw-pr-0 laptop:tw-pr-28 before:tw-content-none "
        bg-color="white"
        text-color="black"
      >
        <template v-slot:name>
          <p class="tw-text-sm tw-opacity-50 tw-mb-2">
            Бот
          </p>
        </template>
        <template v-slot:avatar>
          <img
            class="q-message-avatar q-message-avatar--sent tw-mr-4"
            src="~/public/rzd_icon.png"
          >
        </template>
        <template #stamp>{{ chat.date ? format(new Date(chat.date), 'HH:mm') : '' }}</template>
        <div>
          <p
            class="tw-p-1"
            v-html="chat.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')" />
          <q-btn
            v-if="chat.fullAnswer !== 'Я не знаю.' && !!chat.fullAnswer"
            dense
            flat
            color="primary"
            no-caps
            @click="openAdditional(chat)">Подробнее
          </q-btn>
        </div>

      </q-chat-message>

      <q-chat-message
        v-else
        class="tw-text-base tw-ml-16 tablet:tw-pl-40 before:tw-content-none"
        bg-color="primary"
        text-color="white"
        sent
      >
        <template v-slot:name>
          <p class="tw-text-sm tw-opacity-50 tw-mb-2">
            Вы
          </p>
        </template>
        <template v-slot:avatar />
        <template #stamp>{{ chat.date ? format(new Date(chat.date), 'HH:mm') : '' }}</template>

        <p class="tw-p-1">
          {{ chat.content }}
        </p>
      </q-chat-message>
    </div>
    <q-chat-message
      v-if="loadingMessage"
      class="tw-text-base tw-border-primary"
      bg-color="white"
      style="border: none"
      text-color="gray"
    >
      <template v-slot:name>
        <strong class="tw-text-sm tw-font-normal tw-opacity-50 tw-mb-2">
          Бот
        </strong>
      </template>
      <template v-slot:avatar style="border: none">
        <img
          class="q-message-avatar q-message-avatar--sent tw-mr-4"
          src="~/public/rzd_icon.png"
        >
      </template>
      <div class="tw-py-1">
        <q-spinner-dots size="2rem" />
      </div>
    </q-chat-message>
  </div>
  <div class="tw-text-xl tw-w-full tw-max-w-[900px] tw-bg-white tw-w-10vw tw-h-[100px] tw-fixed tw-py-5 tablet:tw-left-auto tw-left-0 tw-bottom-0">
    <q-input
      :disable="loadingMessage"
      @keydown.enter="sendMessage"
      class="tw-bg-white tw-text-lg tw-z-10 tablet:tw-px-0 tw-px-2"
      rounded
      outlined
      v-model="question"
      label="Введите свой вопрос">
      <template #append>
        <q-btn
          class="hover:tw-cursor-pointer"
          color="primary"
          size="md"
          rounded
          @click="sendMessage"
          :name="mdiArrowRightBoldCircle"
        >
          Отправить
        </q-btn>
      </template>
    </q-input>
    <modal-additional-model
      :open-out="isOpenAdditionalModel"
      :text="openAdditionalModal.fullAnswer"
      :docs="openAdditionalModal.docs"
      :question="openAdditionalModal.question"
    />
  </div>
</template>

<script setup>
import { mdiArrowRightBoldCircle } from '@mdi/js';
import { format } from 'date-fns';

const openAdditionalModal = ref({
  fullAnswer: '',
  question: '',
});

const chatTree = useState('chatTree', () => []);
const question = ref('');
const loadingMessage = ref(false);
const loadingChat = ref(false);

// watch(() => chatID.value, async () => {
//   if (!isNewChatID.value) {
//     if (chatID.value) {
//       loadingChat.value = true;
//       chatTree.value = await getChat(chatID.value);
//       loadingChat.value = false;
//     } else {
//       chatTree.value = [];
//     }
//   }
// });
const isOpenAdditionalModel = ref(false);
const idChat = useState('idChat', () => null);
const choosedProfile = useState('choosedProfile');

watch(() => choosedProfile.value, () => {
  if (!idChat.value) {
    chatTree.value[0] = {
      type: 'ai',
      question: '',
      content: `Здравствуйте${choosedProfile.value.name ? `, ${choosedProfile.value.name.split(' ').slice(0, 2).join(' ')}` : ''}. Чем я могу помочь Вам?`,
      fullAnswer: '',
      date: new Date(),
    };
  }
}, { deep: true });

function openAdditional(chat) {
  openAdditionalModal.value.fullAnswer = chat.fullAnswer;
  openAdditionalModal.value.question = chat.question;
  openAdditionalModal.value.docs = chat.docs;
  isOpenAdditionalModel.value = !isOpenAdditionalModel.value;
}
const transformData = (data) => {
  const result = {};

  data.forEach(doc => {
    const { act_name, top_level_section, section_number } = doc.metadata;

    // Если такого акта еще нет в результате, создаем его
    if (!result[act_name]) {
      result[act_name] = {};
    }

    // Если такой раздел еще не создан для акта, создаем его
    if (!result[act_name][top_level_section]) {
      result[act_name][top_level_section] = [];
    }

    // Добавляем номер секции, если он еще не был добавлен
    if (!result[act_name][top_level_section].includes(section_number)) {
      result[act_name][top_level_section].push({
        section_number,
        content: doc.content,
      });
    }
  });

  // Преобразуем объект в массив для вывода
  return Object.entries(result).map(([act_name, sections]) => ({
    act_name,
    sections: Object.entries(sections).map(([top_level_section, section_numbers]) => ({
      top_level_section,
      section_numbers,
    })),
  }));
};

async function sendMessage() {
  if (!loadingMessage.value) {
    try {
      const message = {
        type: 'human',
        content: `${question.value}`,
        date: new Date(),
      };
      const questionRequestTemp = question.value;
      question.value = '';

      chatTree.value.push(message);
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
      loadingMessage.value = true;
      // if (!chatID.value) {
      //   isNewChatID.value = true;
      //   chatID.value = Date.now();
      //   useState('chats').value = [{
      //     conversation_id: chatID.value,
      //     data: {
      //       data: {
      //         content: message.content,
      //       },
      //     },
      //   }//, ...useState('chats').value
      //   ];
      // }
      const bodyResponse = {
        question: questionRequestTemp,
      };
      const isDefaultBranch = useState('isDefaultBranch');
      const choosedDocuments = useState('documents');
      if (isDefaultBranch.value) {
        bodyResponse.branch = choosedProfile.value.enterprise || 'ALL';
      } else {
        bodyResponse.docs_ids = choosedDocuments.value.filter((el) => el.checked).map((el) => el.id);
      }

      if (choosedProfile.value.name) {
        bodyResponse.user_profile = `Имя ${choosedProfile.value.name}.\
        \n Стаж ${choosedProfile.value.experience}.\
        \n Дополнительные данные: ${choosedProfile.value.characteristic}`;
      }
      console.log(bodyResponse);
      // const response = await $fetch('http://10.0.24.117:8080/predict', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: bodyResponse,
      // });
      const response = JSON.parse(`{
    "answer": "На основании доступной мне информации, вы можете претендовать на следующие выплаты:\\n\\n1. **Дополнительное вознаграждение за нерабочие праздничные дни**: Если вы не привлекались к работе в нерабочие праздничные дни, вам может быть выплачено дополнительное вознаграждение в размере 100 рублей за один такой день.\\n\\n2. **Ежемесячное пособие на ребенка**: В случае гибели работника в результате несчастного случая на производстве, его детям может выплачиваться ежемесячное пособие в размере 10 000 рублей.\\n\\n3. **Материальная помощь при рождении или усыновлении ребенка**: Вы можете получить материальную помощь в размере 5 775 рублей в 2023 году, 6 050 рублей в 2024 году и 6 300 рублей в 2025 году на каждого новорожденного или усыновленного ребенка сверх пособия, установленного законодательством РФ.\\n\\n4. **Доплата к пособию по беременности и родам**: Если выплаты по беременности и родам, выплачиваемые за счет средств Фонда социального страхования, не достигают среднемесячного заработка, то может быть произведена доплата до этого уровня.\\n\\nОбратите внимание, что для получения этих выплат необходимо соответствовать определенным условиям и соблюдать установленные процедуры. Для получения более подробной информации и уточнения ваших прав на данные выплаты, рекомендуется обратиться к отдел кадров или в профсоюзную организацию вашего предприятия.",
    "small_answer": "Вы можете претендовать на следующие выплаты:\\n\\n1. **Дополнительное вознаграждение за нерабочие праздники** - 100 рублей за день.\\n2. **Ежемесячное пособие детям** - при гибели родителя на производстве, 10 000 рублей.\\n3. **Материальная помощь при рождении/усыновлении** - разные суммы в зависимости от года.\\n4. **Доплата к пособию по беременности** - до уровня среднего заработка, если нужно.\\n\\nДля получения выплат нужны условия и процедуры, обратитесь за информацией в отдел кадров или профсоюз.",
    "docs": [
        {
            "content": "Выплачивать Работникам (за исключением Работников, получающих \\nдолжностной оклад или фикси рованную заработную плату (денежное \\nвознаграждение)) дополнительное вознаграждение за нерабочие праздничные \\nдни, в которые они не привлекались к работе, в размере 100 рублей за один \\nнерабочий праздничный день.",
            "metadata": {
                "act_id": "f72cf2d4-f6ca-470a-ad3a-3e42d963c119",
                "act_name": "Коллективный договор",
                "branch": "ALL",
                "section_number": "5.7.",
                "top_level_section": "Раздел 5. Обязательст ва в сфере организации и оплаты труда"
            }
        },
        {
            "content": "Выплачивать  ежемесячное пособие в размере 10 000 рублей \\nкаждому ребенку Работника, погибшего в результате несчастного случая на \\nпроизводстве.",
            "metadata": {
                "act_id": "f72cf2d4-f6ca-470a-ad3a-3e42d963c119",
                "act_name": "Коллективный договор",
                "branch": "ALL",
                "section_number": "6.18.",
                "top_level_section": "Раздел 6. Обязательства в сфере улучшения условий  \\nи охраны труда, и связанные с особенностями  \\nпроизводственно -технологического процесса"
            }
        },
        {
            "content": "Извещать при выплат е заработной платы каждого Работника \\n16 \\n \\nрасчетным листком (в письменной форме или, при согласии Работника, в \\nэлектронной форме) о составных частях заработной платы, причитающейся ему \\nза соответствующий период, размерах и основаниях произведенных удержаний, \\nа также об общей денежной сумме, подлежащей выплате.  \\nФорма расчетного листка утверждается Работодателем с учетом \\nмотивированного мнения выборного органа Профсоюза.",
            "metadata": {
                "act_id": "f72cf2d4-f6ca-470a-ad3a-3e42d963c119",
                "act_name": "Коллективный договор",
                "branch": "ALL",
                "section_number": "5.6.",
                "top_level_section": "Раздел 5. Обязательст ва в сфере организации и оплаты труда"
            }
        },
        {
            "content": "Производить доплату к пособию по беременности и родам, \\nвыплачиваемому за счет средств Фонда социального страхования Российской \\nФедерации, для доведения общего размера вы платы до среднемесячного \\nзаработка Работника.  \\nРазмер среднемесячного заработка Работника определяется в порядке, \\nустановленном статьей 139 Трудового кодекса Российской Федерации и \\nПоложением об особенностях порядка исчисления средней заработной платы, \\nутвержденным постановлением Правительства Российской Федерации                 \\nот 24 декабря 2007 года № 922, для оплаты отпусков и выплаты компенсации за \\nнеиспользованный отпуск.",
            "metadata": {
                "act_id": "f72cf2d4-f6ca-470a-ad3a-3e42d963c119",
                "act_name": "Коллективный договор",
                "branch": "ALL",
                "section_number": "7.20.",
                "top_level_section": "Раздел 7. Обязательства в сфере социальной защиты Работников  \\nи членов их семей"
            }
        },
        {
            "content": "Выплачивать Работнику (одному из родителей) материальную \\nпомощь в размере: в 2023 году - 5 775 рублей, в 2024 году - 6 050 рублей, в 2025 \\nгоду - 6 300 рублей:  \\nпри рождении ребенка - на каждого новорожденного сверх пособия, \\nустановленного законодательством Российской Федерации;  \\nпри усыновлении ребенка (в любом возрасте) - на каждо го ребенка сверх \\nпособия, установленного законодательством Российской Федерации.",
            "metadata": {
                "act_id": "f72cf2d4-f6ca-470a-ad3a-3e42d963c119",
                "act_name": "Коллективный договор",
                "branch": "ALL",
                "section_number": "7.19.",
                "top_level_section": "Раздел 7. Обязательства в сфере социальной защиты Работников  \\nи членов их семей"
            }
        },
        {
            "content": "Вы плачивать заработную плату не реже чем каждые полмесяца. \\nКонкретная дата выплаты заработной платы устанавливается правилами \\nвнутреннего трудового распорядка не позднее 13 календарных дней со дня \\nокончания периода, за который она начислена.  \\nВыплату заработн ой платы за первую половину месяца производить в \\nразмере 50 процентов тарифной ставки (оклада) с учетом отработанного \\nвремени не позднее 28 числа месяца, за который она начислена (за февраль - не \\nпозднее 27 февраля). Минимальный размер указанной выплаты до лжен быть не \\nниже тарифной ставки (оклада) за отработанное время.  \\nВ районах Крайнего Севера и приравненных к ним местностях, а также в \\nместностях, где в соответствии с законодательством Российской Федерации и \\nлокальными нормативными актами Компании (филиал ов Компании) \\nустановлены районные коэффициенты к заработной плате, выплату заработной \\nплаты за первую половину месяца производить с учетом установленных \\nпроцентных надбавок и районных коэффициентов.",
            "metadata": {
                "act_id": "f72cf2d4-f6ca-470a-ad3a-3e42d963c119",
                "act_name": "Коллективный договор",
                "branch": "ALL",
                "section_number": "5.4.",
                "top_level_section": "Раздел 5. Обязательст ва в сфере организации и оплаты труда"
            }
        }
    ]
}`);
      const documents = transformData(response.docs);

      // const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      loadingMessage.value = false;

      const responseMessage = {
        type: 'ai',
        question: questionRequestTemp,
        content: response.small_answer,
        docs: documents,
        fullAnswer: response.answer,
        date: new Date(),
      };
      chatTree.value.push(responseMessage);

      // reader.read().then(function processResult(result) {
      //   let token = decoder.decode(result.value);
      //   console.log(token.split('event: data\r\n')[1]);
      //   if (token.split('event: data\r\n')[1]) {
      //     try {
      //       token = JSON.parse(token.split('event: data\r\ndata: ')[1]);
      //       console.log(token);
      //       if (token.context) {
      //         console.log(token.context);
      //       }
      //       if (token?.output) {
      //         chatTree.value.at(-1).content += token.output;
      //         window.scrollTo(0, document.body.scrollHeight);
      //       }
      //     } catch (e) {
      //       console.error(e);
      //     }
      //   }

      // if (result.done) return;
      //
      // return reader.read().then(processResult);
      // });
    } catch (error) {
      alert(`Join the waiting list if you want to use models: ${error}`);
    }
  }
}
</script>
<style>
.header-name {
  font-family: RussianRail;
}

.q-message-text:last-child:before {
  display: none;
}
.q-input {
  width: 100%;
  box-sizing: border-box;
}
.q-message-text--received {
  border-radius: 15px;
  border: solid #ef3025 1px;
}

.q-message-text--sent {
  border-radius: 15px;
}

textarea {
  resize: none;
}

textarea:focus {
  outline: none;
}
</style>
