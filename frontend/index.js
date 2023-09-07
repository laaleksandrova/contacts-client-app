(function() {
  const SERVER_URL = `http://localhost:3000`;
  let clientsList = [];
  let contactsArray = [];
  // переменные для сортировки
  let sortColumnProp = 'id',
      dirColumnProp = true;

  //получение данных
  async function serverAddClient(obj) {
    const response = await fetch(SERVER_URL + `/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })
    const data = await response.json();
    return data;
  };

  async function serverGetClients() {
    const response = await fetch(SERVER_URL + `/api/clients`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json();
    return data;
  };

  async function serverDeleteClient(id) {
    const response = await fetch(SERVER_URL + `/api/clients/` + id, {
      method: 'DELETE',
    })
    const data = await response.json();
    return data;
  };

  async function serverEditClient(oneClient, id = null) {
    const response = await fetch(SERVER_URL + `/api/clients/` + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(oneClient)
      })
      const data = await response.json();
      return data;
  };

  async function serverFindClients(value) {
    const response = await fetch(SERVER_URL + `/api/clients?search=${value}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json();
    return data;
  };

  // в HTML файле 'index' создается верстка элементов
  // отрисовывается строка поиска клиентов
  function createFilterForm() {
    const $formFilter = document.createElement('form'),
      $formBlock =  document.createElement('div'),
      $inputFilter= document.createElement('input'),
      $formList =  document.createElement('ul');

    $inputFilter.placeholder = 'Введите запрос';
    $inputFilter.classList.add('form-app__input');

    $formFilter.append($formBlock);
    $formBlock.append($inputFilter);
    $formBlock.append($formList);

    return {
      $formFilter,
      $inputFilter,
      $formList
    }
  }
  // отрисовывается таблица
  function createClientsTableForm() {
    const $title = document.createElement('h2'),
      $table = document.createElement('table'),
      $tableHead = document.createElement('thead'),
      $tableBody = document.createElement('tbody'),
      $tableHeadTr = document.createElement('Tr'),
      $tableHeadThId = document.createElement('Th'),
      $tableHeadThIdSpan = document.createElement('span'),
      $tableHeadThFio = document.createElement('Th'),
      $tableHeadThFioSpan = document.createElement('span'),
      $tableHeadThCreationTime = document.createElement('Th'),
      $tableHeadThCreationSpan = document.createElement('span'),
      $tableHeadThChangeTime = document.createElement('Th'),
      $tableHeadThChangeSpan = document.createElement('span'),
      $tableHeadThContacts = document.createElement('Th'),
      $tableHeadThActions = document.createElement('Th');

      $title.textContent = 'Клиенты';
      $tableHeadThId.textContent = 'ID';
      $tableHeadThFio.textContent = 'Фамилия Имя Отчество';
      $tableHeadThFioSpan.textContent = 'А-Я'
      $tableHeadThCreationTime.textContent = 'Дата и время создания';
      $tableHeadThChangeTime.textContent = 'Последние изменения';
      $tableHeadThContacts.textContent = 'Контакты';
      $tableHeadThActions.textContent = 'Действия';

      $title.classList.add('clients__title');
      $tableHeadThIdSpan.classList.add('sort-up');
      $tableHeadThFioSpan.classList.add('sort-down');
      $tableHeadThCreationSpan.classList.add('sort-down');
      $tableHeadThChangeSpan.classList.add('sort-down');


      $table.append($tableHead);
      $table.append($tableBody);
      $tableHead.append($tableHeadTr);
      $tableHeadTr.append($tableHeadThId);
      $tableHeadThId.append($tableHeadThIdSpan);
      $tableHeadTr.append($tableHeadThFio);
      $tableHeadThFio.append($tableHeadThFioSpan );
      $tableHeadTr.append($tableHeadThCreationTime);
      $tableHeadThCreationTime.append($tableHeadThCreationSpan);
      $tableHeadTr.append($tableHeadThChangeTime);
      $tableHeadThChangeTime.append($tableHeadThChangeSpan);
      $tableHeadTr.append($tableHeadThContacts);
      $tableHeadTr.append($tableHeadThActions);


      return {
        $title,
        $table,
        $tableHead,
        $tableHeadTr,
        $tableBody,
        $tableHeadThId,
        $tableHeadThFio,
        $tableHeadThCreationTime,
        $tableHeadThChangeTime,
        $tableHeadThIdSpan,
        $tableHeadThFioSpan,
        $tableHeadThCreationSpan,
        $tableHeadThChangeSpan,
      }
  }

  function formatDate(dateElement) {
    let dd = dateElement.getDay();
    dd = (dd < 10) ? '0' + dd : dd;

    let mm = dateElement.getMonth() + 1;
    mm = (mm < 10) ? '0' + mm : mm;

    let yy = dateElement.getFullYear();
    yy = (yy < 10) ? '0' + yy: yy;

    let resultDate =  dd + '.' + mm + '.' + yy ;

    return resultDate;
  }

  function formatTime(timeElement) {
    let hour = timeElement.getHours();
    hour = (hour < 10) ? '0' + hour : hour;

    let minute = timeElement.getMinutes();
    minute = (minute < 10) ? '0' + minute : minute;

    let resultTime =  hour + ':' + minute;

    return resultTime;
  }

  function newClientsTableTr(oneClient) {
    const $tableBodyTr = document.createElement('tr'),
    $tableBodyThId = document.createElement('td'),
    $tableBodyThFio = document.createElement('td'),
    $tableBodyThCreation = document.createElement('td'),
    $tableBodyThCreationDate = document.createElement('span'),
    $tableBodyThCreationTime = document.createElement('span'),
    $tableBodyThChange = document.createElement('td'),
    $tableBodyThChangeDate = document.createElement('span'),
    $tableBodyThChangeTime = document.createElement('span'),
    $tableBodyThContacts = document.createElement('td'),
    $tableBodyThActions = document.createElement('td'),
    $tableBodyThActionsChange = document.createElement('div'),
    $tableBodyThActionsChangeImg = document.createElement('img'),
    $tableBodyThActionsChangeBtn = document.createElement('button'),
    $tableBodyThActionsDelete = document.createElement('div'),
    $tableBodyThActionsDeleteImg = document.createElement('img'),
    $tableBodyThActionsDeleteBtn = document.createElement('button');

    $tableBodyTr.id = oneClient.id;
    $tableBodyThId.textContent = oneClient.id.substring(0, 6);
    $tableBodyThFio.textContent = `${oneClient.name} ${oneClient.surname} ${oneClient.lastName}`;
    $tableBodyThCreationDate.textContent = formatDate(new Date (oneClient.createdAt));
    $tableBodyThCreationTime.textContent = formatTime(new Date (oneClient.createdAt));
    $tableBodyThChangeDate.textContent = formatDate(new Date (oneClient.updatedAt));
    $tableBodyThChangeTime.textContent = formatTime(new Date (oneClient.updatedAt));
    $tableBodyThActionsChangeBtn.textContent = 'Изменить';
    $tableBodyThActionsDeleteBtn.textContent = 'Удалить';

    $tableBodyThCreationDate.classList.add('table__date');
    $tableBodyThCreationTime.classList.add('table__time');
    $tableBodyThChangeDate.classList.add('table__date');
    $tableBodyThChangeTime.classList.add('table__time');
    $tableBodyThActionsChangeBtn.classList.add('table__btn');
    $tableBodyThActionsDeleteBtn.classList.add('table__btn');

    $tableBodyThActionsChangeImg.src = './img/edit.svg';
    $tableBodyThActionsDeleteImg.src = './img/cancel.svg';

    $tableBodyThActionsChangeBtn.id = 'change-client';
    $tableBodyThActionsDeleteBtn.id = 'delete-client';

    $tableBodyTr.append($tableBodyThId);
    $tableBodyTr.append($tableBodyThFio);
    $tableBodyTr.append($tableBodyThCreation);
    $tableBodyTr.append($tableBodyThChange);
    $tableBodyTr.append($tableBodyThContacts);
    $tableBodyTr.append($tableBodyThActions);
    $tableBodyThCreation.append($tableBodyThCreationDate);
    $tableBodyThCreation.append($tableBodyThCreationTime);
    $tableBodyThChange.append($tableBodyThChangeDate);
    $tableBodyThChange.append($tableBodyThChangeTime);
    $tableBodyThActions.append($tableBodyThActionsChange);
    $tableBodyThActionsChange.append($tableBodyThActionsChangeImg);
    $tableBodyThActionsChange.append($tableBodyThActionsChangeBtn);
    $tableBodyThActions.append($tableBodyThActionsDelete);
    $tableBodyThActionsDelete.append($tableBodyThActionsDeleteImg);
    $tableBodyThActionsDelete.append($tableBodyThActionsDeleteBtn);

    // отображение иконок с контактами
    for (let contact of oneClient.contacts) {
      const $contactTelIcon = document.createElement('span');
      $contactTelIcon.classList.add('table__icon');
      const $telIconImg =  document.createElement('img');
      $tableBodyThContacts.append($contactTelIcon);
      $contactTelIcon.append($telIconImg);

     if (contact.type === "телефон") {
      $telIconImg.src = './img/tel.svg';
      $contactTelIcon.setAttribute('data-tippy-content', contact.type.substring(0, 1).toUpperCase() + contact.type.substring(1) + ': ' + contact.value);
    } else if (contact.type === "vk") {
      $telIconImg.src = './img/vk.svg';
      $contactTelIcon.setAttribute('data-tippy-content', contact.type.toUpperCase() + ': ' + contact.value);
    }  else if (contact.type === "facebook") {
      $telIconImg.src = './img/fb.svg';
      $contactTelIcon.setAttribute('data-tippy-content', contact.type.substring(0, 1).toUpperCase() + contact.type.substring(1) + ': ' + contact.value);
    }  else if (contact.type == "другое") {
      $telIconImg.src = './img/other.svg';
      $contactTelIcon.setAttribute('data-tippy-content', contact.type.substring(0, 1).toUpperCase() + contact.type.substring(1) + ': ' + contact.value);
    }  else if (contact.type === "email") {
      $telIconImg.src = './img/email.svg';
      $contactTelIcon.setAttribute('data-tippy-content', contact.type.substring(0, 1).toUpperCase() + contact.type.substring(1) + ': ' + contact.value);
    }
   }
   // модальное окно для редактирования
   let $editModalWithForm = editModalWithForm(oneClient);
   // модальное окно для  удаления
   let $deleteClientModal = deleteClientModal();
   let isModalOpen = false;

   $tableBodyThActionsChangeBtn.after($editModalWithForm.$editModal);
   $tableBodyThActionsDeleteBtn.after($deleteClientModal.$deleteModal);

   // открытие модального окна для изменения клиента
    $tableBodyThActionsChangeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    $editModalWithForm.$editModal.showModal();//
    isModalOpen = true;
    document.body.classList.add("scroll-lock");
  });

   //открытие модального окна для удаления клиента
    $tableBodyThActionsDeleteBtn.addEventListener('click', () => {
    $deleteClientModal.$deleteModal.showModal();
    isModalOpen = true;
    document.body.classList.add("scroll-lock");
   });

    //удаление клиента
    $deleteClientModal.$deleteModalBtnSave.addEventListener('click', async () => {
      await serverDeleteClient(oneClient.id);
      document.getElementById(oneClient.id).remove();
    });

   return {
    $tableBodyTr,
    $tableBodyThActionsChangeBtn,
    $tableBodyThActionsDeleteBtn,
  }
  }

  // cоздается верстка модального окна
  function createModalWithForm() {
    const  $titleModal =  document.createElement('h2'),
          $titleId = document.createElement('span'),
          $form = document.createElement('form'),
          $inputSurename = document.createElement('input'),
          $labelSurname = document.createElement('label'),
          $inputName = document.createElement('input'),
          $labelName = document.createElement('label'),
          $requiredName = document.createElement('span'),
          $inputLastname = document.createElement('input'),
          $labelLastName = document.createElement('label'),
          $requiredSurname = document.createElement('span'),
          $buttonSave = document.createElement('button'),
          $buttonCancel = document.createElement('button'),
          $buttonClose = document.createElement('button'),
          $formName = document.createElement('div'),
          $formSurname = document.createElement('div'),
          $formLastName = document.createElement('div');

    $form.classList.add('modal__form');
    $formName.classList.add('modal__column');
    $formSurname.classList.add('modal__column');
    $formLastName.classList.add('modal__column');
    $titleModal.classList.add('modal__title');
    $titleId.classList.add('modal__id');
    $inputName.classList.add('modal__input');
    $inputSurename.classList.add('modal__input');
    $inputLastname.classList.add('modal__input');
    $buttonSave.classList.add('button-save');
    $buttonCancel.classList.add('button-cancele');
    $buttonClose.classList.add('button-close');
    $labelName.classList.add('modal__label');
    $labelSurname.classList.add('modal__label');
    $labelLastName.classList.add('modal__label');
    $requiredName.classList.add('modal__label');
    $requiredSurname.classList.add('modal__label');
    $labelName.for = 'name';
    $labelSurname.for = 'surname';
    $labelLastName.for = 'lastName';
    $inputName.id = 'name';
    $inputSurename.id = 'surname';
    $inputLastname.id = 'lastName';
    $inputName.type = 'text';
    $inputLastname.type = 'text';
    $inputSurename.type = 'text';

    $titleModal.innerHTML = 'Новый клиент';
    $inputName.placeholder = 'Имя';
    $inputSurename.placeholder = 'Фамилия';
    $inputLastname.placeholder = 'Отчество';
    $buttonSave.textContent = 'Сохранить';
    $buttonCancel.textContent = 'Отмена';
    $requiredName.textContent = '*';
    $requiredSurname.textContent = '*';
    $labelName.textContent = 'Имя';
    $labelSurname.textContent = 'Фамилия';
    $labelLastName.textContent = 'Отчество';

    $form.append($formName);
    $formName.append($labelName);
    $formName.append($inputName);
    $form.append($formSurname);
    $formSurname.append($labelSurname);
    $formSurname.append($inputSurename);
    $form.append($formLastName);
    $formLastName.append($labelLastName);
    $formLastName.append($inputLastname);
    $form.append($buttonSave);
    $titleModal.after($titleId);
    $labelName.append($requiredName);
    $labelSurname.append($requiredSurname);

    return {
      $titleModal,
      $form,
      $inputSurename,
      $inputName,
      $inputLastname,
      $buttonSave,
      $buttonCancel,
      $buttonClose,
      $titleId,
      $labelName,
      $labelSurname,
      $labelLastName,
    }
  }
  // отрисовывается блок контактов
  function createClientContactForm() {
    const $formContacts = document.createElement('div'),
          $contacFormtDiv = document.createElement('div'),
          $contactSelect = document.createElement('select'),
          $contactInput = document.createElement('input'),
          $buttonContacts = document.createElement('button');

    $contactInput.placeholder = 'Введите данные контакта';

    let typeValues = [
      'телефон',
      'email',
      'facebook',
      'vk',
      'другое',
    ]

    for (let typeValue of  typeValues) {
      let $contactOptionValue = document.createElement('option');
      $contactOptionValue.value = typeValue;
      $contactOptionValue.textContent = typeValue.substring(0, 1).toUpperCase() + typeValue.substring(1);
      $contactSelect.append($contactOptionValue);
      if ($contactOptionValue.value === 'телефон') {
        $contactOptionValue.setAttribute('selected', 'selected');
      }
    }

    $buttonContacts.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.00001 3.66665C6.63334 3.66665 6.33334 3.96665 6.33334 4.33331V6.33331H4.33334C3.96668 6.33331 3.66668 6.63331 3.66668 6.99998C3.66668 7.36665 3.96668 7.66665 4.33334 7.66665H6.33334V9.66665C6.33334 10.0333 6.63334 10.3333 7.00001 10.3333C7.36668 10.3333 7.66668 10.0333 7.66668 9.66665V7.66665H9.66668C10.0333 7.66665 10.3333 7.36665 10.3333 6.99998C10.3333 6.63331 10.0333 6.33331 9.66668 6.33331H7.66668V4.33331C7.66668 3.96665 7.36668 3.66665 7.00001 3.66665ZM7.00001 0.333313C3.32001 0.333313 0.333344 3.31998 0.333344 6.99998C0.333344 10.68 3.32001 13.6666 7.00001 13.6666C10.68 13.6666 13.6667 10.68 13.6667 6.99998C13.6667 3.31998 10.68 0.333313 7.00001 0.333313ZM7.00001 12.3333C4.06001 12.3333 1.66668 9.93998 1.66668 6.99998C1.66668 4.05998 4.06001 1.66665 7.00001 1.66665C9.94001 1.66665 12.3333 4.05998 12.3333 6.99998C12.3333 9.93998 9.94001 12.3333 7.00001 12.3333Z" fill="#9873FF"/>
    </svg> Добавить контакт`;

    $contacFormtDiv.classList.add('contact-form');
    $contactSelect.classList.add('js-choice');
    $contactInput.classList.add('contact-form__input');
    $buttonContacts.classList.add('contact-form__button');
    $contacFormtDiv.classList.add('visibility-hidden');

    $formContacts.append($contacFormtDiv);
    $formContacts.append($buttonContacts);
    $contacFormtDiv.append($contactSelect);
    $contacFormtDiv.append($contactInput);

    return{
      $formContacts,
      $contacFormtDiv,
      $contactSelect,
      $contactInput,
      $buttonContacts
    }
  };

  function createClientContactsList() {
    const $clientContactsList = document.createElement('ul');
    $clientContactsList.classList.add('contact-list');
    return  $clientContactsList;
  }

  function createClientContactsItemElement(contactObj) {
    const $clientContactsItem = document.createElement('li'),
    $typeContactsItem = document.createElement('div'),
    $valueContactsItem = document.createElement('input'),
    $clientContactsBtn = document.createElement('button');

    $clientContactsItem.classList.add('contact-item');
    $typeContactsItem.classList.add('contact-item__type');
    $valueContactsItem.classList.add('contact-item__value');
    $clientContactsBtn.classList.add('contact-item__btn');
    $clientContactsBtn.setAttribute('data-tippy-content', 'Удалить контакт');
    $typeContactsItem.textContent = contactObj.type.substring(0, 1).toUpperCase() + contactObj.type.substring(1);
    $valueContactsItem.value = contactObj.value;

    $clientContactsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      $clientContactsItem.remove();
      let $clientContactForm = createClientContactForm();
      let $clientContactsListElement = createClientContactsList();
      $clientContactsListElement.after($clientContactForm.$formContacts);
    });

    $clientContactsItem.append($typeContactsItem);
    $clientContactsItem.append($valueContactsItem);
    $clientContactsItem.append($clientContactsBtn);

    return {
      $clientContactsItem,
      $clientContactsBtn,
      $typeContactsItem,
      $valueContactsItem
    }
  }
  // отрисовывается модальное окно для формы удаления данных о клиете
  function deleteClientModal() {
    const  $deleteModal = document.createElement('dialog'),
    $deleteModalTitle = document.createElement('h2'),
    $deleteModalText = document.createElement('div'),
    $deleteModalBtnSave = document.createElement('button'),
    $deleteModalBtnClose = document.createElement('button'),
    $deleteModalBtnCancel = document.createElement('button');

    $deleteModal.classList.add('modal', 'delete-modal');
    $deleteModalTitle.classList.add('modal__title', 'delete-modal__title');
    $deleteModalText.classList.add('delete-modal__text');
    $deleteModalBtnSave.classList.add('button-save');
    $deleteModalBtnCancel.classList.add('button-cancele');
    $deleteModalBtnClose.classList.add('button-close');

    $deleteModalTitle.textContent = 'Удалить клиента';
    $deleteModalText.textContent = 'Вы действительно хотите удалить данного клиента?';
    $deleteModalBtnSave.textContent = 'Удалить';
    $deleteModalBtnCancel.textContent = 'Отмена';

    $deleteModal.append($deleteModalTitle);
    $deleteModal.append($deleteModalText);
    $deleteModal.append($deleteModalBtnSave);
    $deleteModal.append($deleteModalBtnCancel);
    $deleteModal.append($deleteModalBtnClose);

    // закрытие модального окна для удаления клиента
    $deleteModalBtnClose.addEventListener('click', (e) => {
      e.preventDefault();
      $deleteModal.close();
      document.body.classList.remove("scroll-lock");
    });

    //  отмена модального окна для удаления клиента
    $deleteModalBtnCancel.addEventListener('click', (e) => {
      e.preventDefault();
      $deleteModal.close();
      document.body.classList.remove("scroll-lock");
    });

    document.addEventListener('click', (e) => {
      if (e.target == $deleteModal) {
        $deleteModal.close();
        document.body.classList.remove("scroll-lock");
      }
    });

    return {
      $deleteModal,
      $deleteModalBtnSave,
      $deleteModalBtnCancel,
      $deleteModalBtnClose,
    }
  }
  // отрисовывается модальное окно для формы редактирования данных о клиете
  function editModalWithForm(oneClient) {
    const  $editModal = document.createElement('dialog');
    $editModal.classList.add('modal');
    let $clientModalWithForm = createModalWithForm();
    let $clientContactsListElement = createClientContactsList();
    let $clientContactForm = createClientContactForm();

    $clientModalWithForm.$titleId.textContent = 'ID: ' + oneClient.id.substring(0, 6);
    $clientModalWithForm.$titleModal.textContent = 'Изменить данные';
    $clientModalWithForm.$inputSurename.value = oneClient.surname;
    $clientModalWithForm.$inputName.value = oneClient.name;
    $clientModalWithForm.$inputLastname.value = oneClient.lastName;

    for (let contact of oneClient.contacts) {
      const $createContact = createClientContactsItemElement(contact)
      $createContact.$typeContactsItem.textContent = contact.type.substring(0, 1).toUpperCase() + contact.type.substring(1);
      $createContact.$valueContactsItem.value = contact.value;
      $clientContactsListElement.append($createContact.$clientContactsItem);
    }
    //добавление контакта по клику
    $clientContactForm.$buttonContacts.addEventListener('click', (e) => {
      e.preventDefault();
      $clientContactsListElement.classList.add('contact-list--active');
      $clientContactForm.$contacFormtDiv.classList.remove('visibility-hidden');
      if (!$clientContactForm.$contactInput.value) {
        return
      }
      let newContactObj = {
        type: $clientContactForm.$contactSelect.value,
        value: $clientContactForm.$contactInput.value,
      }
      oneClient.contacts.push(newContactObj);
      if (oneClient.contacts.length > 9) {
        $clientContactForm.$formContacts.classList.add('visibility-hidden');
      }
      $clientContactForm.$contactInput.value = '';
      //отрисовывается тело списка контактов
      let $clientContactsItemElement = createClientContactsItemElement(newContactObj);
      $clientContactsListElement.append($clientContactsItemElement.$clientContactsItem);
    });

    $clientModalWithForm.$form.addEventListener('submit', async () => {
      // e.preventDefault();
      if (!$clientModalWithForm.$inputSurename.value || !$clientModalWithForm.$inputName.value || !$clientModalWithForm.$inputLastname.value) {
       return
      }
      let contacts = [];
      const contactTypes = $editModal.querySelectorAll('.contact-item__type');
      const contactValues = $editModal.querySelectorAll('.contact-item__value');
      for (let i = 0; i < contactTypes.length; i++) {
        contacts.push({
            type: contactTypes[i].textContent.toLowerCase(),
            value: contactValues[i].value
        });
      }
      let client = {
        name: $clientModalWithForm.$inputSurename.value,
        surname: $clientModalWithForm.$inputName.value,
        lastName: $clientModalWithForm.$inputLastname.value,
        contacts: contacts
      }
      let serverDataObj = await serverEditClient(client, oneClient.id);
      //закрытие при сохранении
      $editModal.close();
      document.body.classList.remove("scroll-lock");
    });

    // закрытие модального окна
    $clientModalWithForm.$buttonClose.addEventListener('click', (e) => {
      e.preventDefault();
      $editModal.close();
      document.body.classList.remove("scroll-lock");
    });

    $clientModalWithForm.$buttonCancel.addEventListener('click', (e) => {
      e.preventDefault();
      $editModal.close();
      document.body.classList.remove("scroll-lock");
    });

    document.addEventListener('click', (e) => {
      if (e.target == $editModal) {
        $editModal.close();
        document.body.classList.remove("scroll-lock");
      }
    });

    $editModal.append($clientModalWithForm.$titleModal);
    $editModal.append($clientModalWithForm.$buttonClose);
    $editModal.append($clientModalWithForm.$form);
    $editModal.append($clientModalWithForm.$buttonCancel);
    $clientModalWithForm.$titleModal.after($clientModalWithForm.$titleId);
    $clientModalWithForm.$inputLastname.after($clientContactsListElement);
    $clientContactsListElement.after($clientContactForm.$formContacts);

     // подключение Choices
     const element = $editModal.querySelector('.js-choice');
     const choices = new Choices(element, {
      searchEnabled: false,
      itemSelectText: '',
      allowHTML: true,
     });

    return {
      $editModal,
    }
  }

  document.addEventListener('DOMContentLoaded', async function() {
    // получаем данные
    let serverGetData = await serverGetClients();
      if (serverGetData) {
        clientsList = serverGetData;
      }
    //вызываем поочередно функции
    //результат функции размещаем внутри контейнера
    const $formApp = document.getElementById('form-app'),
    $clientsFilterForm = createFilterForm();
    $formApp.append($clientsFilterForm.$formFilter);

    const $clientsApp = document.getElementById('clients-app'),
    $clientsTableForm = createClientsTableForm();
    $clientsApp.append($clientsTableForm.$title);
    $clientsApp.append($clientsTableForm.$table);

    // модальное окно
    let $clientModalWithForm = createModalWithForm();

    //поле для списка контактов
    let $clientContactsListElement = createClientContactsList();
    $clientModalWithForm.$inputLastname.after($clientContactsListElement);

    // поле для формы контактов
    let $clientContactForm = createClientContactForm();
    $clientContactsListElement.after($clientContactForm.$formContacts);

    //модальное окно для добавления данных
    let $addClientModal = addClientModal();
    let isModalOpen = false;

    // модальное окно для  удаления данных
    let $deleteClientModal = deleteClientModal();

    // отрисовывается тело таблицы
    function renderClientsTable(clientsList) {
      let copyClientsList = [...clientsList];
      $clientsTableForm.$tableBody.innerHTML = '';

      // сортировка
      copyClientsList = copyClientsList.sort(function(a,b) {
         let sort = a[sortColumnProp] < b[sortColumnProp];
         if (dirColumnProp == false) sort = a[sortColumnProp] > b[sortColumnProp];
         if (sort) return -1;
      });

      // отрисовка таблицы
      for (let oneClient of copyClientsList) {
        let $newtableBodyTr = newClientsTableTr(oneClient);
        $clientsTableForm.$tableBody.append($newtableBodyTr.$tableBodyTr);
      }
    }
    renderClientsTable(clientsList);

    // отрисовываются изменений клиента в таблиe
    for (let oneClient of clientsList) {
      editModalWithForm(oneClient);
      renderClientsTable(clientsList);
    }

    // условия сортировки
    $clientsTableForm.$tableHeadThId.addEventListener('click', function(){
      sortColumnProp = 'id';
      dirColumnProp = !dirColumnProp;
      if (dirColumnProp == false) {
        $clientsTableForm.$tableHeadThIdSpan.classList.remove('sort-up');
        $clientsTableForm.$tableHeadThIdSpan.classList.add('sort-down');
      } else  {
        $clientsTableForm.$tableHeadThIdSpan.classList.remove('sort-down');
        $clientsTableForm.$tableHeadThIdSpan.classList.add('sort-up');
      }
      renderClientsTable(clientsList);
    });

    $clientsTableForm.$tableHeadThFio.addEventListener('click', function(){
      sortColumnProp = 'surname';
      dirColumnProp = !dirColumnProp;
      if (dirColumnProp == false) {
        $clientsTableForm.$tableHeadThFioSpan.classList.remove('sort-up');
        $clientsTableForm.$tableHeadThFioSpan.classList.add('sort-down');
      } else  {
        $clientsTableForm.$tableHeadThFioSpan.classList.remove('sort-down');
        $clientsTableForm.$tableHeadThFioSpan.classList.add('sort-up');
      }
      renderClientsTable(clientsList);
    });

    $clientsTableForm.$tableHeadThCreationTime.addEventListener('click', function(){
      sortColumnProp = 'createdAt';
      dirColumnProp = !dirColumnProp;
      if (dirColumnProp == false) {
        $clientsTableForm.$tableHeadThCreationSpan.classList.remove('sort-up');
        $clientsTableForm.$tableHeadThCreationSpan.classList.add('sort-down');
      } else  {
        $clientsTableForm.$tableHeadThCreationSpan.classList.remove('sort-down');
        $clientsTableForm.$tableHeadThCreationSpan.classList.add('sort-up');
      }
      renderClientsTable(clientsList);
    });

    $clientsTableForm.$tableHeadThChangeTime.addEventListener('click', function(){
      sortColumnProp = 'updatedAt';
      dirColumnProp = !dirColumnProp;
      if (dirColumnProp == false) {
        $clientsTableForm.$tableHeadThChangeSpan.classList.remove('sort-up');
        $clientsTableForm.$tableHeadThChangeSpan.classList.add('sort-down');
      } else  {
        $clientsTableForm.$tableHeadThChangeSpan.classList.remove('sort-down');
        $clientsTableForm. $tableHeadThChangeSpan.classList.add('sort-up');
      }
      renderClientsTable(clientsList);
    });

    // открытие  модального окна для создания нового клиента
    const $addClientButton = document.getElementById('add-client');
    $addClientButton.addEventListener('click', (e) => {
      e.preventDefault();
      $addClientModal.$modalElement.showModal();
      isModalOpen = true;
      document.body.classList.add("scroll-lock");

      $clientModalWithForm.$titleId.textContent = '';
      $clientModalWithForm.$titleModal.innerHTML = 'Новый клиент';
      $clientModalWithForm.$inputSurename.value = '';
      $clientModalWithForm.$inputName.value = '';
      $clientModalWithForm.$inputLastname.value = '';

      $clientContactsListElement.innerHTML = '';
      createClientContactForm();
    });

    function addClientModal() {
      const $modalElement = document.getElementById("favDialog");
      // добавляется контакт по клику
      $clientContactForm.$buttonContacts.addEventListener('click', (e) => {
        e.preventDefault();
        $clientContactsListElement.classList.add('contact-list--active');
        $clientContactForm.$contacFormtDiv.classList.remove('visibility-hidden');
        if (!$clientContactForm.$contactInput.value) {
          return
        }
        let newContactObj = {
          type: $clientContactForm.$contactSelect.value,
          value: $clientContactForm.$contactInput.value,
        }
        contactsArray.push(newContactObj);
        if (contactsArray.length > 9) {
          $clientContactForm.$formContacts.classList.add('visibility-hidden');
        } else {
          $clientContactForm.$formContacts.classList.remove('visibility-hidden');
        }
        $clientContactForm.$contactInput.value = '';
        //отрисовывается тело списка контактов
        let $clientContactsItemElement = createClientContactsItemElement(newContactObj);
        $clientContactsListElement.append($clientContactsItemElement.$clientContactsItem);
      });

      $clientModalWithForm.$form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!$clientModalWithForm.$inputSurename.value || !$clientModalWithForm.$inputName.value || !$clientModalWithForm.$inputLastname.value) {
         return
        }
        let newClientObj = {
          name: $clientModalWithForm.$inputSurename.value,
          surname: $clientModalWithForm.$inputName.value,
          lastName: $clientModalWithForm.$inputLastname.value,
          contacts: contactsArray
        }
        let serverDataObj = await serverAddClient(newClientObj);
        // таблицa отрисовывается заново
        let $newtableBodyTr = newClientsTableTr(serverDataObj);
        $clientsTableForm.$tableBody.append($newtableBodyTr.$tableBodyTr);
        // закрытие модального окна
        $modalElement.close();
        isModalOpen = false;
        document.body.classList.remove("scroll-lock");
      });

      // закрытие модального окна
      $clientModalWithForm.$buttonClose.addEventListener('click', (e) => {
        e.preventDefault();
        $modalElement.close();
        isModalOpen = false;
        document.body.classList.remove("scroll-lock");
      });

      $clientModalWithForm.$buttonCancel.addEventListener('click', (e) => {
        e.preventDefault();
        $modalElement.close();
        isModalOpen = false;
        document.body.classList.remove("scroll-lock");
      });

      document.addEventListener('click', (e) => {
        if (e.target == $modalElement) {
          $modalElement.close();
          document.body.classList.remove("scroll-lock");
        }
      });

      $modalElement.append($clientModalWithForm.$titleModal);
      $modalElement.append($clientModalWithForm.$buttonClose);
      $modalElement.append($clientModalWithForm.$form);
      $modalElement.append($clientModalWithForm.$buttonCancel);
      $clientModalWithForm.$titleModal.after($clientModalWithForm.$titleId);
      $clientModalWithForm.$inputLastname.after($clientContactsListElement);
      $clientContactsListElement.after($clientContactForm.$formContacts);

       // подключение Choices
       const element = document.querySelector('.js-choice');
       const choices = new Choices(element, {
        searchEnabled: false,
        itemSelectText: '',
        allowHTML: true,
       });

      return {
        $modalElement,
      }
    }

    // поиск
    function findClient(clients) {
      clients.forEach(client => {
        const $formItem = document.createElement('li'),
              $formLink = document.createElement('a');

        $formItem.classList.add('find-list__item');
        $formLink.classList.add('find-list__link');

        $formLink.textContent = `${client.surname} ${client.name} ${client.lastName}`;
        $formLink.href = '#';

        $formItem.append($formLink);
        $clientsFilterForm.$formList.append($formItem);

        return {
          $formItem,
          $formLink,
        }
     });

      $clientsFilterForm.$formList.classList.add('visibility-hidden');

      const renderTable = async (str) => {
        const dataServer = await serverFindClients(str);
        $clientsTableForm.$tableBody.innerHTML = '';

        for (let oneClient of dataServer) {
        let $newtableBodyTr = newClientsTableTr(oneClient);
        $clientsTableForm.$tableBody.append($newtableBodyTr.$tableBodyTr);
        }
      }

      $clientsFilterForm.$inputFilter.addEventListener('input', async (e) => {
        e.preventDefault();
        const value = $clientsFilterForm.$inputFilter.value.trim();
        const foundItems = document.querySelectorAll('.find-list__link');
        let timerId;
        clearTimeout(timerId);

        timerId = setTimeout(() => {
          if (value !== '') {
            renderTable(value);
            foundItems.forEach(link => {
              if (link.innerText.search(value) == -1){
                link.classList.add('visibility-hidden');
                link.innerHTML = link.innerText;
              } else {
                link.classList.remove('visibility-hidden');
                $clientsFilterForm.$formList.classList.remove('visibility-hidden');
                const  str = link.innerText;
              }
            });
          } else {
            foundItems.forEach(link => {
              $clientsTableForm.$tableBody.innerHTML = '';

              clients.forEach(oneClient => {
                let $newtableBodyTr = newClientsTableTr(oneClient);
                $clientsTableForm.$tableBody.append($newtableBodyTr.$tableBodyTr);
              });
                link.classList.remove('visibility-hidden');
                $clientsFilterForm.$formList.classList.add('visibility-hidden');
                link.innerHTML = link.innerText;
            });
          }
        }, 300);
      });
    }
    findClient(clientsList);

    // подключение Typpy
    tippy('[data-tippy-content]');
  });
}) ();
