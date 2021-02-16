const div_pastAppointments = document.querySelector('#past_appointments');
const div_todaysAppointments = document.querySelector('#todays_appointments');
const div_futureAppointments = document.querySelector('#future_appointments');

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

/* function orderDates(dateList) {
    const n = dateList.length;
    for (const i = 0; i < n; i++) {
        const switch = false;
        for (const j=1; j<(n-i)) {
            if (dateList[j-1] > dateList[j]) {
                const temp = dateList[j-1];
                dateList[j-1] = dateList[j];
                dateList[j] = temp;
                swtich = true;
            }
        }

        if (!scambia) {
            break;
        }
    }

    return dateList;
} */

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

    patientName.textContent = `Paziente: ${appointment.userId}`;
    examinationType.textContent = `Tipo di visita: ${appointment.title}`;
    appointmentID.textContent = `ID visita: ${appointment.id}`;
    appointmentDate.textContent = `Data: ${convertDate(appointment.date)}`;
    priorityLevel.textContent = `Livello di priorità: ${appointment.priority}`;

    appointmentCard.appendChild(patientName);
    appointmentCard.appendChild(examinationType);
    appointmentCard.appendChild(appointmentID);
    appointmentCard.appendChild(appointmentDate);
    appointmentCard.appendChild(priorityLevel);
    appointmentCard.appendChild(completed);

    pastFutureBlock.appendChild(appointmentCard);

    return appointmentCard;

}

function renderTodaysAppointmentCard(todaysBlock, appointment) {
    const appointmentCard = document.createElement('div');
    const patientName = document.createElement('h3');
    const examinationType = document.createElement('p');
    const appointmentID = document.createElement('p');
    const priorityLevel = document.createElement('p');
    const completed = document.createElement('div');

    patientName.textContent = `Paziente: ${appointment.userId}`;
    examinationType.textContent = `Tipo di visita: ${appointment.title}`;
    appointmentID.textContent = `ID visita: ${appointment.id}`;
    priorityLevel.textContent = `Livello di priorità: ${appointment.priority}`;

    appointmentCard.appendChild(patientName);
    appointmentCard.appendChild(examinationType);
    appointmentCard.appendChild(appointmentID);
    appointmentCard.appendChild(priorityLevel);
    appointmentCard.appendChild(completed);

    todaysBlock.appendChild(appointmentCard);

    return appointmentCard;
}

function renderPastAppointments(pastAppointments) {    

    for (appointment of pastAppointments) {
        const pastAppointmentCard = renderPastFutureAppointmentCard(div_pastAppointments, appointment);
        //associare CLASSE!!!
    }
}

function renderFutureAppointments(futureAppointments) {

    for (appointment of futureAppointments) {
        const futureAppointmentCard = renderPastFutureAppointmentCard(div_futureAppointments, appointment);
        //associare CLASSE!!!
    }
}

function renderTodaysAppointments(todaysAppointments) {

    for (appointment of todaysAppointments) {
        const todaysAppointmentCard = renderTodaysAppointmentCard(div_todaysAppointments, appointment);
        //associare CLASSE!!!
    }
}



async function prova() {
    await getData(state.config.base_url);

    console.log(state.doc_appointment);

    const filtrati1 = getPastAppointments(state.doc_appointment);
    const filtrati2 = getTodaysAppointments(state.doc_appointment);
    const filtrati3 = getFutureAppointments(state.doc_appointment)

    console.log(state.doc_appointment);
    console.log(filtrati1);
    console.log(filtrati2);
    console.log(filtrati3);

    renderPastAppointments(filtrati1);
    renderTodaysAppointments(filtrati2);
    renderFutureAppointments(filtrati3);
}

prova()

