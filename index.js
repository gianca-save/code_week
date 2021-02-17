const btn_loadData = document.querySelector('#btn_loadData')
const div_pastAppointments = document.querySelector('#past_appointments');
const div_todaysAppointments = document.querySelector('#todays_appointments');
const div_futureAppointments = document.querySelector('#future_appointments');
const future_table_title = document.querySelector('#future_table_title');
const past_table_title = document.querySelector('#past_table_title');
const todays_table_title = document.querySelector('#todays_table_title');
const first_row__past = document.querySelector('#first_row__past');
const first_row__today = document.querySelector('#first_row__today');
const first_row__future = document.querySelector('#first_row__future');

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

//renderPastFutureAppointmentCard crea le singole righe dei blocchi degli appuntamenti passati e futuri. Il blocco degli appuntamenti del giorno corrente avranno una struttura diversa. pastFutureBlock è il parametro che rappresenta il blocco (degli appuntamenti passati o di quelli futuri)
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
        appointmentCard.style.backgroundColor = '#27ff44';
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
    
    first_row__past.classList.add('first_rows');

    for (appointment of pastAppointments) {
        const pastAppointmentCard = renderPastFutureAppointmentCard(div_pastAppointments, appointment);
    }
}

function renderFutureAppointments(futureAppointments) {

    future_table_title.textContent = 'APPUNTAMENTI DELLA PROSSIMA SETTIMANA';

    first_row__future.classList.add('first_rows');

    for (appointment of futureAppointments) {
        const futureAppointmentCard = renderPastFutureAppointmentCard(div_futureAppointments, appointment);
    }
}

function renderTodaysAppointments(todaysAppointments) {

    const today = new Date()

    todays_table_title.textContent = `APPUNTAMENTI DI OGGI, ${convertDate(today)}`;

    first_row__today.classList.add('first_rows');

    for (appointment of todaysAppointments) {
        const todaysAppointmentCard = renderTodaysAppointmentCard(div_todaysAppointments, appointment);
    }
}


async function loadData() {
    await getData(state.config.base_url);

    console.log(state.doc_appointment);

    const pastAppointments = orderByDates(getPastAppointments(state.doc_appointment));
    const todaysAppointments = orderByDates(getTodaysAppointments(state.doc_appointment)); //ordino pure gli appuntamenti odierni, così se rimane tempo implemento anche la visualizzazione dell'ora...
    const futureAppointments = orderByDates(getFutureAppointments(state.doc_appointment));

    console.log('Appuntamenti della scorsa settimana: \n', pastAppointments);
    console.log('Appuntamenti di oggi: \n', todaysAppointments);
    console.log('Appuntamenti della prossima settimana: \n', futureAppointments);

    renderPastAppointments(pastAppointments);
    renderTodaysAppointments(todaysAppointments);
    renderFutureAppointments(futureAppointments);

    btn_loadData.removeEventListener('click', loadData);
    btn_loadData.classList.add('is-hidden');
}

btn_loadData.addEventListener('click', loadData);
