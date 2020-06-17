/*
    *
        *
            * Сапёр 9*9 клеток, 10 мин *
        *
    *
*/

let tablo = document.querySelector('#tablo'); // Табло с оставшимися минами
let startReset = document.getElementById('reset'); // Кнопка начала-сброса
let cellsBlock = document.getElementById('miner-body'); // Отец всех полей с возможными минами
let cells = document.getElementsByClassName('miner-cell'); // Множество всех полей с возможными минами
let arr = []; // Массив с ячейками, содержащими мины
let timer = document.getElementById("timer"); // Input с таймером
let timerId; // ID таймера
let tempRand;
let minesObj = {}; // Объект для связи мин с ячейками, для их проверки

const minesCount = 9; // Количество мин (Ставить на единицу меньше нужного)
const minCell = 1;     // от 1 ячейки
const maxCell = 81;    // до 81 ячейки

let tempMines = 0;

console.log(arr);


// Таймер в хедере
function startTimer() {
    timer.value++;

    if (timer.value<10) {
        timer.value = ''+0+0+timer.value;
    }
    if ((timer.value>=10) && (timer.value<100)) {
        timer.value = ''+0+timer.value;
    }
    document.getElementById("timer").setAttribute('value',  timer.value);
}

// Проверка на мину
function checkMine(target, arr) {
    let id = target.getAttribute('data-id');

    if (id == null) { 
        return; 
    }

    for (var element in arr) {
        // debugger
        if (arr[element] == id ) {
            target.classList.add('miner-cell--error');
            console.log('Бабах! Ячейка с миной = ', id);
        }
    }
}

// Создание массива с минами
function randomMines(min, max, quantity) {
    // Создание рандомного числа от мин до макс включая
    function rand() {
        return min - 0.5 + Math.random() * (max - min + 1);
    }
    // Проверка на то, чтобы не было одинаковых рандомных чисел
    function checkTheSameRand() {
        tempRand = Math.round(rand());
        if (arr.includes(tempRand)) { 
            checkTheSameRand();
        }
        return tempRand;
    }

    for (let i=0; i<=quantity; i++) {
        arr[i] = checkTheSameRand();
    }
    return arr;
}

// Проверка того, сколько осталось бомб (Нужна проверка для случаев победы или неправильно расположения мин)
function checkNumberOfBombs() {
    console.log(cells);
    
    for (let element in cells) {
        if (cells.hasOwnProperty(element)) {
           if (cells[element].classList.contains('miner-cell--bomb')) {
                tempMines++;
           }
        }
        tablo.value = minesCount - tempMines;
    }
    tempMines = 0;
}
// Проверки пустых ячеек
// function checkCell(x,y) {
//     if ((x == 1) && (y == 1)) {

//     }
// }
// 
function minesObjFn(arr) {
    console.log(arr);
    
}
// Функция запуска игры
function start() {
    if (startReset.value == 'Start') {
        timerId = setInterval(() => startTimer(), 1000);
        startReset.value = 'Reset';
        arr = randomMines(minCell, maxCell, minesCount); // Создание массива с минами
        minesObj = minesObjFn(arr);
    } else if (startReset.value == 'Reset') {
        timer.value = '000';
        clearInterval(timerId);
        startReset.value = 'Start';
        arr = [];
    }

    for (var element in cells) {
        if (cells.hasOwnProperty(element)) {
             cells[element].classList.remove('miner-cell--error');
        }
    }

    console.log(arr);
    return arr;
}

// Клик по старту
startReset.addEventListener('click', function(e) {
    e.preventDefault();
    start(e);
});
// Клик по ячейке
cellsBlock.addEventListener('click', function(e) {
    e.preventDefault();
    let x = e.target.getAttribute('data-x');
    let y = e.target.getAttribute('data-y');

    if (startReset.value == 'Start') {
        start();
        checkMine(e.target, arr);
    } else {
        checkMine(e.target, arr);
    }
    console.log(e.target);
});

// Правый клик по ячейке - установка флажка
cellsBlock.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.target.classList.toggle('miner-cell--bomb');
    if (startReset.value == 'Start') {
        start();
        checkNumberOfBombs();
    } else {
        checkNumberOfBombs();
    }
    return false;
}, false);
