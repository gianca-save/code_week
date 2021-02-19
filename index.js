const btn_loadData = document.querySelector('#btn_loadData');
const div_pastAppointments = document.querySelector('#past_appointments');
const div_todaysAppointments = document.querySelector('#todays_appointments');
const div_futureAppointments = document.querySelector('#future_appointments');
const future_table_title = document.querySelector('#future_table_title');
const past_table_title = document.querySelector('#past_table_title');
const todays_table_title = document.querySelector('#todays_table_title');
const first_row__past = document.querySelector('#first_row__past');
const first_row__today = document.querySelector('#first_row__today');
const first_row__future = document.querySelector('#first_row__future');
const btn_priority_past = document.querySelector('#btn_order1');
const btn_priority_today = document.querySelector('#btn_order2');
const btn_priority_future = document.querySelector('#btn_order3');



/* UTILITIES */

const state = {
    config: {
        base_url: 'https://jsonplaceholder.typicode.com/todos',
        error_mess: 'La richiesta non è andata a buon fine :/'
    },
    
    doc_appointment: null
}

/* getData si occupa della richeista dei dati dall'url e del salvataggio della loro conversione JSON nell'oggetto state.

setData si occupa dell'inserimento dei dati aggiuntivi (priority e date) negli oggetti appointment recepiti */

async function getData(url) {

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw error;
        }

        const responseJSON = await response.json();

        results = setData(responseJSON);
        
        state.doc_appointment = results;
        console.log(state.doc_appointment)

        return results;
    }

    catch(err) {
        console.log(state.config.error_mess, err);
        //metti una pagina html extra di errore
    }
}

function setData(responseList) {
    
    const result = responseList.map(appointment => {
    appointment['priority'] = generateRandomNumber(4);
    appointment['date'] = generateRandomDate();

    return appointment;
    });

    return result;

}

/* Funzioni per la gestione delle date */

function accessDate(obj) {
   const date = obj.date.getTime();
   return date; 
}

//versione modificata dell'algoritmo di ordinamento BubbleSort. Usa accessDate() per accedere alla data dei singoli oggetti
function orderByDates(list) {
    for (let i = 0; i < list.length; i++) {
        let exchange = false;
        for (let j=1; j<((list.length)-i); j++) {
            if (accessDate(list[j-1]) > accessDate(list[j])) {
                let temp = list[j-1];
                list[j-1] = list[j];
                list[j] = temp;
                exchange = true;
            }
        }

        if (exchange === false) {
            break;
        }
    }

    return list;
}

function convertDate(date) {

    let day = '';
    let month = '';

    switch (date.getDay()) {
        case 0:
            day = 'Domenica';
            break;
        case 1:
            day = 'Lunedì';
            break;
        case 2:
            day = 'Martedì';
            break;
        case 3:
            day = 'Mercoledì';
            break;
        case 4:
            day = 'Giovedì';
            break;
        case 5:
            day = 'Venerdì';
            break;
        case 6:
            day = 'Sabato';
            break;
    }

    switch (date.getMonth()) {
        case 0:
            month = 'Gennaio';
            break;
        case 1:
            month = 'Febbraio';
            break;
        case 2:
            month = 'Marzo';
            break;
        case 3:
            month = 'Aprile';
            break;
        case 4:
            month = 'Maggio';
            break;
        case 5:
            month = 'Giugno';
            break;
        case 6:
            month = 'Luglio';
            break;
        case 7:
            month = 'Agosto';
            break;
        case 8:
            month = 'Settembre';
            break;
        case 9:
            month = 'Ottobre';
            break;
        case 10:
            month = 'Novembre';
            break;
        case 11:
            month = 'Dicembre';
            break;        
    }

    const result_date = `${day}, ${date.getDate()} ${month} ${date.getFullYear()}`;

    return result_date;
}

/* Funzioni generatrici Random */
//604.800.000: i millisecondi in una settimana
function generateRandomDate() {
    const today = new Date();
    const from = new Date(today.getTime() - 604800000);
    const to = new Date(today.getTime() + 604800000);

    const random_date = new Date(from.getTime() + (Math.random() * (to.getTime() - from.getTime())));

    return random_date;
    
}

function generateRandomNumber(num) {
    const random = Math.random();
     
    const result = Math.floor(random*num) + 1;

    return result;
}

/* Funzioni di filtraggio date */

function getPastAppointments(appointments) {
    const today = new Date();
    const pastAppointments = appointments.filter(obj => {
        
        if (obj.date.getMonth() === today.getMonth()) {
            return obj.date.getDate() < today.getDate();
        }

        else if (obj.date.getMonth() < today.getMonth()) {
            return obj;
        }

    });
    return pastAppointments;
}

function getTodaysAppointments(appointments) {
    const today = new Date();
    const todaysAppointments = appointments.filter(obj => { return (obj.date.getDate() === today.getDate() && obj.date.getMonth() === today.getMonth())});
    return todaysAppointments;
}

function getFutureAppointments(appointments) {
    const today = new Date();
    const futureAppointments = appointments.filter(obj => {
        
        if (obj.date.getMonth() === today.getMonth()) {
            return obj.date.getDate() > today.getDate();
        }

        else if (obj.date.getMonth() > today.getMonth()) {
            return obj;
        }});
    //gli appuntamenti futuri non possono essere completati!
    for (appointment of futureAppointments) {
        appointment.completed = false;
    }

    return futureAppointments;
}

/* Funzioni di creazione dei blocchi di visite */

//renderPastFutureAppointmentCard crea le singole righe dei blocchi degli appuntamenti passati e futuri. Il blocco degli appuntamenti del giorno corrente avrà una struttura diversa. pastFutureBlock è il parametro che rappresenta il blocco (degli appuntamenti passati o di quelli futuri)
function renderPastFutureAppointmentCard(pastFutureBlock, appointment) {
    const appointmentCard = document.createElement('div');
    const patientName = document.createElement('h3');
    const examinationType = document.createElement('p');
    const appointmentID = document.createElement('p');
    const appointmentDate = document.createElement('p');
    const priorityLevel = document.createElement('p');
    const completed = document.createElement('div');

    patientName.textContent = appointment.userId;
    examinationType.textContent = appointment.title;
    appointmentID.textContent = appointment.id;
    appointmentDate.textContent = convertDate(appointment.date);
    priorityLevel.textContent = appointment.priority;

    appointmentCard.appendChild(appointmentID);
    appointmentCard.appendChild(patientName);
    appointmentCard.appendChild(examinationType);
    appointmentCard.appendChild(appointmentDate);
    appointmentCard.appendChild(priorityLevel);
    appointmentCard.appendChild(completed);

    pastFutureBlock.appendChild(appointmentCard);

    appointmentCard.classList.add('appointment_card');

    if (appointment.completed == true) {
        appointmentCard.style.backgroundColor = '#04E824';
        appointmentCard.style.color = 'white';
    }

    return appointmentCard;

}

function renderTodaysAppointmentCard(todaysBlock, appointment) {
    const appointmentCard = document.createElement('div');
    const patientName = document.createElement('h3');
    const examinationType = document.createElement('p');
    const appointmentID = document.createElement('p');
    const priorityLevel = document.createElement('p');
    const completed = document.createElement('div');

    patientName.textContent = appointment.userId;
    examinationType.textContent = appointment.title;
    appointmentID.textContent = appointment.id;
    priorityLevel.textContent = appointment.priority;

    appointmentCard.appendChild(appointmentID);
    appointmentCard.appendChild(patientName);
    appointmentCard.appendChild(examinationType);
    appointmentCard.appendChild(priorityLevel);
    appointmentCard.appendChild(completed);

    todaysBlock.appendChild(appointmentCard);

    appointmentCard.classList.add('appointment_card_t');

    return appointmentCard;
}

function renderPastAppointments(pastAppointments) {  

    past_table_title.textContent = 'APPUNTAMENTI DELLA SCORSA SETTIMANA';

    if (pastAppointments.length === 0) {
        div_pastAppointments.textContent = 'Nessun appuntamento.'
    }

    else {
    
        first_row__past.classList.add('appointment_card');

        for (appointment of pastAppointments) {
            const pastAppointmentCard = renderPastFutureAppointmentCard(div_pastAppointments, appointment);
        }
    }
}

function renderFutureAppointments(futureAppointments) {

    if (futureAppointments.length === 0) {
        div_futureAppointments.textContent = 'Nessun appuntamento.'
    }

    else {

        future_table_title.textContent = 'APPUNTAMENTI DELLA PROSSIMA SETTIMANA';

        first_row__future.classList.add('appointment_card');

        for (appointment of futureAppointments) {
            const futureAppointmentCard = renderPastFutureAppointmentCard(div_futureAppointments, appointment);
        }
    }
}

function renderTodaysAppointments(todaysAppointments) {

    const today = new Date();

    if (todaysAppointments.length === 0) {
        div_todaysAppointments.textContent = `Nessun appuntamento per oggi, ${convertDate(today)}`;
    }

    else {

        todays_table_title.textContent = `APPUNTAMENTI DI OGGI, ${convertDate(today)}`;

        first_row__today.classList.add('appointment_card');

        for (appointment of todaysAppointments) {
            const todaysAppointmentCard = renderTodaysAppointmentCard(div_todaysAppointments, appointment);
        }
    }
}


//Funzione che dia un nome ai pazienti sulla base dell'ID

function giveName() {
    for (appointment of state.doc_appointment) {
        switch (appointment.userId) {
            case 1:
                appointment.userId = 'Peter Parker';
                break;
            case 2:
                appointment.userId = 'Matt Murdock';
                break;
            case 3:
                appointment.userId = 'James Howlett';
                break;
            case 4:
                appointment.userId = 'Anthony Stark';
                break;
            case 5:
                appointment.userId = 'Steve Rogers';
                break;
            case 6:
                appointment.userId = 'Clint Barton';
                break;
            case 7:
                appointment.userId = 'Mary Jane Watson';
                break;
            case 8:
                appointment.userId = 'Gwendoline Stacy';
                break;
            case 9:
                appointment.userId = 'Felicia Hardy';
                break;
            case 10:
                appointment.userId = 'Anna Maria Marconi';
                break;
        }
    }
}


async function loadData() {
    await getData(state.config.base_url);

    giveName(); //rinomino i pazienti

    const pastAppointments = orderByDates(getPastAppointments(state.doc_appointment));
    const todaysAppointments = orderByDates(getTodaysAppointments(state.doc_appointment)); //ordino anche gli appuntamenti odierni
    const futureAppointments = orderByDates(getFutureAppointments(state.doc_appointment));

    console.log('Appuntamenti della scorsa settimana: \n', pastAppointments);
    console.log('Appuntamenti di oggi: \n', todaysAppointments);
    console.log('Appuntamenti della prossima settimana: \n', futureAppointments);

    renderPastAppointments(pastAppointments);
    renderTodaysAppointments(todaysAppointments);
    renderFutureAppointments(futureAppointments);

    btn_loadData.removeEventListener('click', loadData);
    btn_loadData.classList.add('is-hidden');

    /* btn_priority_past.classList.add('btn_order');
    btn_priority_today.classList.add('btn_order');
    btn_priority_future.classList.add('btn_order'); */
}

btn_loadData.addEventListener('click', loadData);

/* function orderCards() {
    orderByPriority(div_pastAppointments.children);
}

btn_priority_past.addEventListener('click', orderCards)


function getPriority(card) { //qui ci devo passare la card del singolo appuntamento
    const info = card.children;
    const priority = parseInt(info[4].textContent);

    return priority;
}

//per ordinare con priorità, devo necessariamente passare in input alla funzione l'insieme delle card, quindi i figli di appointments che vanno da tipo il quinto fino allìultimo (i primi figli sono bottoni e righe varie!)

function orderByPriority(list) {
    for (let i = 3; i < list.length; i++) {
        let exchange = false;
        for (let j=1; j<((list.length)-i); j++) {
            if (getPriority(list[j-1]) > getPriority(list[j])) {
                let temp = list[j-1];
                list[j-1] = list[j];
                list[j] = temp;
                exchange = true;
            }
        }

        if (exchange === false) {
            break;
        }
    }
} */
