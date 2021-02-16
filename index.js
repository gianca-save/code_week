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

function getPastAppointments(appointments) {
    const today = new Date();
    const pastAppointments = appointments.filter(obj => { return obj.date.getDate() < today.getDate()});
    return pastAppointments;
}

function getTodaysAppointments(appointments) {
    const today = new Date();
    const todaysAppointments = appointments.filter(obj => { return obj.date.getDate() == today.getDate()});
    return todaysAppointments;
}

function getFutureAppointments(appointments) {
    const today = new Date();
    const futureAppointments = appointments.filter(obj => { return obj.date.getDate() > today.getDate()});
    return futureAppointments;
}

/* async function prova() {
    await getData(state.config.base_url);

    console.log(state.doc_appointment);

    const filtrati = getTodaysAppointments(state.doc_appointment);

    console.log(state.doc_appointment);
    console.log(filtrati);
}

prova() */

