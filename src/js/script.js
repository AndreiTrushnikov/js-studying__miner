/* Сапёр 9*9 клеток, 10 мин */

let tablo = document.querySelector('#tablo'); // Табло с оставшимися минами
let startReset = document.getElementById('reset'); // Кнопка начала-сброса
let cellsBlock = document.getElementById('miner-body'); // Отец всех полей с возможными минами
let cells = document.getElementsByClassName('miner-cell'); // Множество всех полей с возможными минами
let arrWithRandomMines = []; // Массив с ячейками, содержащими мины
let timer = document.getElementById("timer"); // Input с таймером
let timerId; // ID таймера
let tempRand;
let minesObj = {}; // Объект для связи мин с ячейками, для их проверки
let numberOfMines;

const minesCount = 10; // Количество мин
const minCell = 1;     // от 1 ячейки
const maxCell = 81;    // до 81 ячейки
const maxX = 9;
const maxY = 9;
let tempCell;
let tempMines = 0;

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

// Если попался на мину
function loser() {
    timer.value = '000';
    clearInterval(timerId);
    startReset.value = 'Start';
    arrWithRandomMines = [];
    cellsBlock.classList.add('lose');
}

// Проверка на мину
// function checkMine(target, arrWithRandomMines) {
//     let id = target.getAttribute('data-id');

//     if (id == null) {
//         return;
//     }

//     for (var element in arrWithRandomMines) {
//         // debugger
//         if (arrWithRandomMines[element] == id ) {
//             target.classList.add('miner-cell--error');
//             console.log('Бабах! Ячейка с миной = ', id);
//             loser();
//             return;
//         }
//     }
// }

// Создание массива с минами
function randomMines(min, max, quantity) {
    // Создание рандомного числа от мин до макс включая
    function rand() {
        return min - 0.5 + Math.random() * (max - min + 1);
    }
    // Проверка на то, чтобы не было одинаковых рандомных чисел
    function checkTheSameRand() {
        tempRand = Math.round(rand());
        if (arrWithRandomMines.includes(tempRand)) { 
            checkTheSameRand();
        }
        return tempRand;
    }

    for (let i=0; i<quantity; i++) {
        arrWithRandomMines[i] = checkTheSameRand();
    }
    return arrWithRandomMines;
}

// Проверка того, сколько осталось бомб (Нужна проверка для случаев победы или неправильно расположения мин)
function checkNumberOfBombs() {
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

// Создание общего объекта со всеми ячейками и минами
function minesObjFn(arrWithRandomMines,maxX,maxY) {
    minesObj = {};
    let x = 1;
    let y = 1;
    // console.log(arrWithRandomMines);
    console.log(maxX*maxY - (maxX-1));
    
    // создание пустого объекта ячеек
    for (var i=1; i<=maxX*maxY; i++) {
        let place;
        // 1
        if (i == '1') {
            place = 'leftTopCorner';
        }
        // 2-8
        else if ((i>1) && (i<maxX)) {
            place = 'topHorizontalLine'; 
        }
        // 9
        else if (i == maxX) {
            place = 'rightTopCorner';
        }
        // 18,27,36 .. 72
        else if ((i % maxX == 0) && (i != maxX) && (i != maxX*maxY)) {
            place = 'rightVerticalLine';
        }
        // 10,19,28,37
        else if (((i-1) % maxX == 0) && (i != maxX*maxY - (maxX-1))) {
            place = 'leftVerticalLine';
        }
        // 73
        else if (i == maxX*maxY - (maxX-1)) {
            place = 'leftBottomCorner';
        }
        // 74-80
        else if ((i> maxX*maxY - (maxX-1)) && (i<maxX*maxY)) {
            place = 'bottomHorizontalLine'; 
        }
        // 81
        else if (i == maxX*maxY) {
            place = 'rightBottomCorner';
        }
        else {
            place = 'center';
        }

        minesObj[i] = {"x": x,"y":y, mine: false,place: place};
        x++;
        if (x == 10) {
            y++;
            x = 1;
        }
    }

    // добавление мин
    for (var el in minesObj) {
        if (arrWithRandomMines.includes(parseInt(el))) {
            minesObj[el].mine = true;
        }
    }

    return minesObj;
}

// Проверки пустых ячеек
function checkCell(target, minesObj) {
    console.log(minesObj);
    // проверка на мину
    let cell = parseInt(target.getAttribute('data-id'));
    
    if (cell == null) {
        return;
    }
    if (minesObj[`${cell}`].mine == true) {
        target.classList.add('miner-cell--error');
        console.log('Бабах! Ячейка с миной = ', cell);
        loser();
        return;
    } else {
        // console.log(minesObj[cell]);
        // 1-9(max)
        // 10,

        if ( minesObj[cell].place == 'leftTopCorner') {
            console.log('leftTopCorner');
        }
        if ( minesObj[cell].place == 'rightTopCorner') {
            console.log('rightTopCorner');
        }
        if ( minesObj[cell].place == 'leftBottomCorner') {
            console.log('leftBottomCorner');
        }
        if ( minesObj[cell].place == 'rightBottomCorner') {
            console.log('rightBottomCorner');
        }
        if ( minesObj[cell].place == 'topHorizontalLine') {
            console.log('topHorizontalLine');
        }
        if ( minesObj[cell].place == 'bottomHorizontalLine') {
            console.log('bottomHorizontalLine');
        }
        if ( minesObj[cell].place == 'leftVerticalLine') {
            console.log('leftVerticalLine');
        }
        if ( minesObj[cell].place == 'rightVerticalLine') {
            console.log('rightVerticalLine');
        }
        if ( minesObj[cell].place == 'center') {
            console.log('center');
        }


        let x = minesObj[cell].x;
        let y = minesObj[cell].y;
        let count = 0;
        let siblingsObj = {
            1: {"x": x-1,"y":y-1,mine:'',id:'',isCheck: false},
            2: {"x": x  ,"y":y-1,mine:'',id:'',isCheck: false},
            3: {"x": x+1,"y":y-1,mine:'',id:'',isCheck: false},
            4: {"x": x-1,"y":y  ,mine:'',id:'',isCheck: false},
            5: {"x": x+1,"y":y  ,mine:'',id:'',isCheck: false},
            6: {"x": x-1,"y":y+1,mine:'',id:'',isCheck: false},
            7: {"x": x  ,"y":y+1,mine:'',id:'',isCheck: false},
            8: {"x": x+1,"y":y+1,mine:'',id:'',isCheck: false}
        };
    
        console.log('siblingsObj before',siblingsObj);
        
        // Собираем новый объект с соседями, с указателями на мину
    
        // if ()
        for (let mineEl in minesObj) {
            if (minesObj.hasOwnProperty(mineEl)) {
                // console.log('mineEl',mineEl);
                
                for (let newMineEl in siblingsObj) {
                    if (siblingsObj.hasOwnProperty(newMineEl)) {
                        // console.log('newMineEl',newMineEl);
                        
                        // Если есть мина в основном объекте, то добавляем id в новый объект
                        // console.log(minesObj[mineEl].mine);
                        // siblingsObj[]
                        // if (minesObj[mineEl].mine == true) {
                        //     siblingsObj[newMineEl].id = mineEl;
                        // }
                    }
                }
            }
        }
    
        console.log('siblingsObj after',siblingsObj);
        
    
        // debugger
        target.classList.add('miner-cell--free');
    
        // if (count == 0) {
    
        // }
    
        return count;
    }
   
}

// Очистка поля 
function clearField() {
    for (var cell in cells) {
        if (cells.hasOwnProperty(cell)) {
            cells[cell].classList.remove("miner-cell--bomb");
            cells[cell].innerHTML = '';
        }
    }
}

// Функция запуска игры
function start() {
    console.clear();
    cellsBlock.classList.remove('lose');
   
    if (startReset.value == 'Start') {
        timerId = setInterval(() => startTimer(), 1000);
        startReset.value = 'Reset';
        arrWithRandomMines = randomMines(minCell, maxCell, minesCount); // Создание массива с минами
        minesObj = minesObjFn(arrWithRandomMines,maxX,maxY);
        
    } else if (startReset.value == 'Reset') {
        // Очищаем всё
        timer.value = '000';
        clearInterval(timerId);
        startReset.value = 'Start';
        arrWithRandomMines = [];
        minesObj = {};
        clearField();
    }

    for (var element in cells) {
        if (cells.hasOwnProperty(element)) {
             cells[element].classList.remove('miner-cell--error');
             cells[element].classList.remove('miner-cell--free');
        }
    }

    console.log(arrWithRandomMines);
    return arrWithRandomMines;
}

// Клик по ячейке
cellsBlock.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.classList.contains('miner-body')) {
        return;
    }

    if (cellsBlock.classList.contains('lose')) {
        return;
    }

    console.log('e.target=', e.target);

    if (startReset.value == 'Start') {
        start();
        // checkMine(e.target, arrWithRandomMines);
        numberOfMines = checkCell(e.target, minesObj); // проверка ячейки и возврат количества мин рядом

        if ((numberOfMines == null) || (numberOfMines == 0)) {
            e.target.innerHTML = '';
        } else {
            e.target.innerHTML = numberOfMines;
        }
    } else {
        // checkMine(e.target, arrWithRandomMines);
        numberOfMines = checkCell(e.target, minesObj); // проверка ячейки и возврат количества мин рядом

        if ((numberOfMines == null) || (numberOfMines == 0)) {
            e.target.innerHTML = '';
        } else {
            e.target.innerHTML = numberOfMines;
        }
    }
    console.log(e.target);
});

// Правый клик по ячейке - установка флажка
cellsBlock.addEventListener('contextmenu', function(e) {
    e.preventDefault();

    if (cellsBlock.classList.contains('lose')) {
        return;
    }

    e.target.classList.toggle('miner-cell--bomb');
    if (startReset.value == 'Start') {
        start();
        checkNumberOfBombs();
    } else {
        checkNumberOfBombs();
    }
    return false;
}, false);

// Клик по старту
startReset.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    start(e);
});
