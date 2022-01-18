/* Сапёр 9*9 клеток, 10 мин */

let tablo = document.querySelector('#tablo'); // Табло с оставшимися минами
let startReset = document.getElementById('reset'); // Кнопка начала-сброса
let cellsBlock = document.getElementById('miner-body'); // Отец всех полей с возможными минами
let cells = document.getElementsByClassName('miner-cell'); // Множество всех полей с возможными минами
// let arrWithRandomMines = []; // Массив с ячейками, содержащими мины
let timer = document.getElementById("timer"); // Input с таймером
let timerId; // ID таймера
let tempRand; // Дополнительная переменная для создания массива с минами
// let minesObj = {}; // Объект для связи мин с ячейками, для их проверки
let numberOfMines;
let tempMines = 0;
let placeDescr; // 1 - left top corner, 2 - rtc, 3 - left bottom corner, 4 - rbc,
                // 5 - left vertical line, 6 - right vertical line,
                // 7 - top horizontal line, 8 - bottom hrizontal line,
                // 9 - center;

const minesCount = 10; // Количество мин
const minCell = 1;     // от 1 ячейки
const maxCell = 81;    // до 81 ячейки
const maxX = 9;
const maxY = 9;


// // Таймер в хедере
// function startTimer() {
//     timer.value++;

//     if (timer.value<10) {
//         timer.value = ''+0+0+timer.value;
//     }
//     if ((timer.value>=10) && (timer.value<100)) {
//         timer.value = ''+0+timer.value;
//     }
//     document.getElementById("timer").setAttribute('value',  timer.value);
// }

// // Если попался на мину
// function loser(target,cellID) {
//     target.classList.add('miner-cell--error');
//     console.log('Бабах! Ячейка с миной = ', cellID);
//     timer.value = '000';
//     clearInterval(timerId);
//     startReset.value = 'Start';
//     // arrWithRandomMines = [];
//     cellsBlock.classList.add('lose');
//     // подсветка всех полей с минами
//     for (key in minesObj) {
//         if (minesObj[key].mine == true) {
//             let loserCell = document.querySelector('.miner-cell[data-id="' + key +'"]');
//             loserCell.classList.add('miner-cell--error');
//         }
//     }
// }

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

// // Создание массива с минами
// function randomMines(min, max, quantity, check) {
//     // Создание рандомного числа от мин до макс включая
//     if (check == true) {
//         return [2,3,4,34,25,75,8,11,72,74]; // для проверок
//     } else {
//         function rand() {
//             return min - 0.5 + Math.random() * (max - min + 1);
//         }
//         // Проверка на то, чтобы не было одинаковых рандомных чисел
//         function checkTheSameRand() {
//             tempRand = Math.round(rand());
//             if (arrWithRandomMines.includes(tempRand)) {
//                 checkTheSameRand();
//             }
//             return tempRand;
//         }

//         for (let i=0; i<quantity; i++) {
//             arrWithRandomMines[i] = checkTheSameRand();
//         }
//         return arrWithRandomMines;
//     }

// }

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
// function minesObjFn(arrWithRandomMines,maxX,maxY) {
//     minesObj = {};
//     let x = 1;
//     let y = 1;
//     let dataId = 1;
//     // создание пустого объекта ячеек
//     // задание значения place объекта с минами, для обозначения, где находится выбранная ячейка
//     for (var i=1; i<=maxX*maxY; i++) {
//         let place;
//         // 1
//         if (i == '1') {
//             place = 'leftTopCorner';
//         }
//         // 2-8
//         else if ((i>1) && (i<maxX)) {
//             place = 'topHorizontalLine';
//         }
//         // 9
//         else if (i == maxX) {
//             place = 'rightTopCorner';
//         }
//         // 18,27,36 .. 72
//         else if ((i % maxX == 0) && (i != maxX) && (i != maxX*maxY)) {
//             place = 'rightVerticalLine';
//         }
//         // 10,19,28,37
//         else if (((i-1) % maxX == 0) && (i != maxX*maxY - (maxX-1))) {
//             place = 'leftVerticalLine';
//         }
//         // 73
//         else if (i == maxX*maxY - (maxX-1)) {
//             place = 'leftBottomCorner';
//         }
//         // 74-80
//         else if ((i> maxX*maxY - (maxX-1)) && (i<maxX*maxY)) {
//             place = 'bottomHorizontalLine';
//         }
//         // 81
//         else if (i == maxX*maxY) {
//             place = 'rightBottomCorner';
//         }
//         else {
//             place = 'center';
//         }

//         minesObj[i] = {"x": x, "y":y, mine: false, place: place, isCellCheck: false, isSiblingCheck: false, dataId: i};
//         x++;
//         if (x == 10) {
//             y++;
//             x = 1;
//         }
//     }

//     // добавление мин
//     for (var el in minesObj) {
//         if (arrWithRandomMines.includes(parseInt(el))) {
//             minesObj[el].mine = true;
//         }
//     }

//     return minesObj;
// }

//
function isBombFn(target) {
    if (target == true) {return true;} else {return false;}
}
    // let siblingsObj = {
    //     1: {"x": x-1,"y":y-1,mine:'',id:'',isCellCheck: false},
    //     2: {"x": x  ,"y":y-1,mine:'',id:'',isCellCheck: false},
    //     3: {"x": x+1,"y":y-1,mine:'',id:'',isCellCheck: false},
    //     4: {"x": x-1,"y":y  ,mine:'',id:'',isCellCheck: false},
    //     5: {"x": x+1,"y":y  ,mine:'',id:'',isCellCheck: false},
    //     6: {"x": x-1,"y":y+1,mine:'',id:'',isCellCheck: false},
    //     7: {"x": x  ,"y":y+1,mine:'',id:'',isCellCheck: false},
    //     8: {"x": x+1,"y":y+1,mine:'',id:'',isCellCheck: false}
    // };
    // let x = minesObj[cellID].x;
    // let y = minesObj[cellID].y;
    // siblingsObj = {
    //     cell1: {"x": x+1,"y":y  ,mine:isBombFn(minesObj[`${cellID1}`].mine),id:'',isCellCheck: false},
    //     cell2: {"x": x  ,"y":y+1,mine:isBombFn(minesObj[`${cellID2}`].mine),id:'',isCellCheck: false},
    //     cell3: {"x": x+1,"y":y+1,mine:isBombFn(minesObj[`${cellID3}`].mine),id:'',isCellCheck: false}
    // };

// Проверки пустых ячеек
function checkCell(target, minesObj, siblCheck) {
    let count = 0;
    let cellID = parseInt(target.getAttribute('data-id'));

    function checkSiblings(minesObj, cellID) {
        if ( minesObj[cellID].place == 'leftTopCorner') {
            checkSibling(1, cellID);
            minesObj[cellID].isSiblingCheck = true;
        }
        if ( minesObj[cellID].place == 'rightTopCorner') {
            checkSibling(2, cellID);
            minesObj[cellID].isSiblingCheck = true;
        }
        if ( minesObj[cellID].place == 'leftBottomCorner') {
            checkSibling(3, cellID);
            minesObj[cellID].isSiblingCheck = true;
        }
        if ( minesObj[cellID].place == 'rightBottomCorner') {
            checkSibling(4, cellID);
            minesObj[cellID].isSiblingCheck = true;
        }
        if ( minesObj[cellID].place == 'leftVerticalLine') {
            checkSibling(5, cellID);
            minesObj[cellID].isSiblingCheck = true;
        }
        if ( minesObj[cellID].place == 'rightVerticalLine') {
            checkSibling(6, cellID);
            minesObj[cellID].isSiblingCheck = true;
        }
        if ( minesObj[cellID].place == 'topHorizontalLine') {
            checkSibling(7, cellID);
            minesObj[cellID].isSiblingCheck = true;
        }
        if ( minesObj[cellID].place == 'bottomHorizontalLine') {
            checkSibling(8, cellID);
            minesObj[cellID].isSiblingCheck = true;
        }
        if ( minesObj[cellID].place == 'center') {
            checkSibling(9, cellID); // 9 по умолчанию центр
            minesObj[cellID].isSiblingCheck = true;
        }
        return count;
    }

    function checkSibling(placeDescr, cellID) {
        let targetObj = {};
        let cellSiblObj = {
            cellID1 : cellID-maxX-1,
            cellID2 : cellID-maxX,
            cellID3 : cellID-maxX+1,
            cellID4 : cellID-1,
            cellID5 : cellID+1,
            cellID6 : cellID+maxX-1,
            cellID7 : cellID+maxX,
            cellID8 : cellID+maxX+1,
        };

        // Создаём объекты соседей в зависимости от положения кликнутой ячейки
        switch (placeDescr) {
            case 1:
                delete cellSiblObj.cellID1;
                delete cellSiblObj.cellID2;
                delete cellSiblObj.cellID3;
                delete cellSiblObj.cellID4;
                delete cellSiblObj.cellID6;
                break;
            case 2:
                delete cellSiblObj.cellID1;
                delete cellSiblObj.cellID2;
                delete cellSiblObj.cellID3;
                delete cellSiblObj.cellID5;
                delete cellSiblObj.cellID8;
                break;
            case 3:
                delete cellSiblObj.cellID1;
                delete cellSiblObj.cellID4;
                delete cellSiblObj.cellID6;
                delete cellSiblObj.cellID7;
                delete cellSiblObj.cellID8;
                break;
            case 4:
                delete cellSiblObj.cellID3;
                delete cellSiblObj.cellID5;
                delete cellSiblObj.cellID6;
                delete cellSiblObj.cellID7;
                delete cellSiblObj.cellID8;
                break;
            case 5:
                delete cellSiblObj.cellID1;
                delete cellSiblObj.cellID4;
                delete cellSiblObj.cellID6;
                break;
            case 6:
                delete cellSiblObj.cellID3;
                delete cellSiblObj.cellID5;
                delete cellSiblObj.cellID8;
                break;
            case 7:
                delete cellSiblObj.cellID1;
                delete cellSiblObj.cellID2;
                delete cellSiblObj.cellID3;
                break;
            case 8:
                delete cellSiblObj.cellID6;
                delete cellSiblObj.cellID7;
                delete cellSiblObj.cellID8;
                break;
        }

        for (let prop in cellSiblObj) {
            if (cellSiblObj.hasOwnProperty(prop)) {
                targetObj[prop] = document.querySelector(`div[data-id="${cellSiblObj[prop]}"]`);
                if (isBombFn(minesObj[`${cellSiblObj[prop]}`].mine)) {
                    count++;
                }
                checkCell(targetObj[prop], minesObj, true);
            }
        }

        return placeDescr;
    }
    let checkLeft = false, checkRight = false, checkTop = true, checkBottom = true;
    function checkMinesInSiblings(placeDescr, cellID) {
        console.log(Math.floor(cellID/maxX) * maxX + maxX);
        console.log('placeDescr',placeDescr);
        console.log('cellID',cellID);

        // проверка вправо
            for (let i = cellID + 1; i <= Math.floor(cellID/maxX) * maxX + maxX; i++) {
                console.log('i', i);
                // текущая проверяемая ячейка
                // let currentCell = document.querySelector('.miner-cell[data-id="' + i +'"]');
                // если перешли за левую границу
                // if (i <= Math.floor(cellID/maxX) * maxX) return;
    
                // if (minesObj[i].mine == false ) {
                    // currentCell.classList.add('miner-cell--free');
                    // checkCell(currentCell, minesObj, false);
                // } else {
                    // запустить проверку ячейки
                    // return
                // }
            }
        

        // проверка влево
        for (let i = cellID-1; i >= Math.floor(cellID/maxX) * maxX; i--) {
            // текущая проверяемая ячейка
            let currentCell = document.querySelector('.miner-cell[data-id="' + i +'"]');
            // если перешли за левую границу
            if (i <= Math.floor(cellID/maxX) * maxX) return;

            if (minesObj[i].mine == false ) {
                currentCell.classList.add('miner-cell--free');
                checkCell(currentCell, minesObj, false);
            } else {
                return
            }
        }
    }

    // function realClickOnCell(target, minesObj) {
    //     console.log(minesObj);
    //     // проверка на мину
    //     if (cellID == null) {
    //         return;
    //     }

    //     let isBomb = isBombFn(minesObj[`${cellID}`].mine);
    //     // если в ячейке бомба - проиграли
    //     if (isBomb) {
    //         loser(target,cellID);
    //         return;
    //     } else {
    //         // иначе проверяем ячейки вокруг текущей
    //         checkSiblings(minesObj, cellID);
    //         // если рядом есть мины, отменяем поиск и ставим в ячейку количество мин рядом
    //         if (count > 0) {
    //             target.innerText = count;
    //         } else {
    //             // поиск, если рядом нет мин
    //             console.log('Начало поиска рядом');
    //             checkMinesInSiblings(minesObj[cellID].place, cellID);
    //         }
    //         target.classList.add('miner-cell--free');
    //         return count;
    //     }
    // }

    // Если первый клик по ячейке
    if (siblCheck) {
        if (minesObj[cellID].isCellCheck == true) {
            return;
        }
        // checkSiblings(minesObj, cellID);
        // pseudoClickOnSiblings(target, minesObj,count);
    } else {
        realClickOnCell(target, minesObj);
    }
}

// // Очистка поля
// function clearField() {
//     for (var cell in cells) {
//         if (cells.hasOwnProperty(cell)) {
//             cells[cell].classList.remove("miner-cell--bomb");
//             cells[cell].innerHTML = '';
//         }
//     }
// }

// Функция запуска игры
function start() {
    // cellsBlock.classList.remove('lose');
    // clearField();

    if (startReset.value == 'Start') {
        timerId = setInterval(() => startTimer(), 1000);
        startReset.value = 'Reset';
        arrWithRandomMines = randomMines(minCell, maxCell, minesCount, true); // Создание массива с минами
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

    // if (e.target.classList.contains('miner-body')) {
    //     return;
    // } // *****************

    // if (cellsBlock.classList.contains('lose')) {
    //     return;
    // } // *****************

    // if (startReset.value == 'Start') {
    //     start();
    //     // checkMine(e.target, arrWithRandomMines);
    //     checkCell(e.target, minesObj, false); // проверка ячейки и возврат количества мин рядом

    //     // if ((numberOfMines == null) || (numberOfMines == 0)) {
    //     //     e.target.innerHTML = '';
    //     // } else {
    //     //     e.target.innerHTML = numberOfMines;
    //     // }
    // } else {

    //     // checkMine(e.target, arrWithRandomMines);
    //     checkCell(e.target, minesObj, false); // проверка ячейки и возврат количества мин рядом

    //     // if ((numberOfMines == null) || (numberOfMines == 0)) {
    //     //     e.target.innerHTML = '';
    //     // } else {
    //     //     e.target.innerHTML = numberOfMines;
    //     // }
    // }
    // console.log(e.target);
});

// // Правый клик по ячейке - установка флажка
// cellsBlock.addEventListener('contextmenu', function(e) {
//     e.preventDefault();

//     if (cellsBlock.classList.contains('lose')) {
//         return;
//     }

//     e.target.classList.toggle('miner-cell--bomb');
//     if (startReset.value == 'Start') {
//         start();
//         checkNumberOfBombs();
//     } else {
//         checkNumberOfBombs();
//     }
//     return false;
// }, false);

// Клик по старту
// startReset.addEventListener('click', function(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     start(e);
// });