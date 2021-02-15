//Prima di tutto, lavoriamo sul formato Date... mi serve di sicuro una funzione (di mia creazione, perché sono FiKo) che converta la data nel formato che voglio io. Ricorda: il conteggio di giorni/mesi parte sempre da 0, il primo giorno della settimana sarebbe la Domenica (Sunday))

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

//Passiamo ora a creare la funzione che generi una data random. Per comodità (e per evitare che il Medico vada in pensione nel 3000!), la funzione genererà la data all'interno di un intervallo di una settimana costruito a partire dalla data odierna. In questo modo, manteniamo verosimiglianza per il programma.

//604.800.000: i millisecondi in una settimana
function generateRandomDate() {
    const today = new Date();
    const from = new Date(today.getTime() - 604800000);
    const to = new Date(today.getTime() + 604800000);

    const random_date = new Date(from.getTime() + (Math.random() * (to.getTime() - from.getTime())));

    return random_date;
    
}
