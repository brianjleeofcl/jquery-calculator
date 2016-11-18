(function() {
  'use strict';

  const $screen = $('#screen')

  $('body').on('keydown', () => {
    if (event.key === 'Escape'){
      $screen.val("");
      return;
    }
    if (event.key === 'Enter'){
      const answer = calculate($screen.val());
      if (Number.isNaN(answer)){
        $screen.val("error!")
      } else {
        $screen.val(answer.toString());
      }
      return;
    }
  })

  $('.buttons').on('click', 'span', () => {
    if($(event.target).attr('id') === 'clear') {
      $screen.val("");
      return;
    }
    if($(event.target).attr('id') === 'equals') {
      const answer = calculate($screen.val());
      if (Number.isNaN(answer)){
        $screen.val("error!")
      } else {
        $screen.val(answer.toString());
      }
      return;
    }

    if ($(event.target).hasClass('operator')) {
      $screen.val($screen.val()+" ")
    }
    if (['+', '-', 'x', '÷'].includes($screen.val()[$screen.val().length - 1])) {
      $screen.val($screen.val()+" ")
    }
    $screen.val($screen.val() + $(event.target).text())
  })

  const calculate = function (string) {
    while (string.includes('(')) {
      const pths = string.match(/\(.[^\(\)]+\)/)
      const inside = pths[0].slice(1, - 1)
      const calcRes = arithmetic(inside)
      string = string.replace(pths[0],calcRes)
    }
    return arithmetic(string)
  }

  const arithmetic = function (string) {
    const arr = multDiv(string.split(' '))
    console.log(arr);
    let num = parseFloat(arr.shift(), 10)
    for (let i=0;i<arr.length; i += 2) {
      switch (arr[i]) {
        case '+':
          num += parseFloat(arr[i + 1], 10)
          break;
        case '-':
          num -= parseFloat(arr[i + 1], 10)
          break;
      }
    }
    return num;
  }

  const multDiv = function (arr) {
    let newArr = arr
    if (!newArr.includes('x')&&!newArr.includes('÷')) {
      return newArr
    }

    if (arr.indexOf('÷') > 0 && arr.indexOf('x') > 0) {
      if (arr.indexOf('÷') > arr.indexOf('x')) {
        const n = arr.indexOf('x')
        const p = arr[n - 1] * arr[n + 1]
        newArr = arr.slice(0, n-1).concat(p.toPrecision(12).toString(),...arr.slice(n+2, arr.length))
      } else {
        const n = arr.indexOf('÷')
        const p = arr[n - 1] / arr[n + 1]
        newArr = arr.slice(0, n-1).concat(p.toPrecision(12).toString(), ...arr.slice(n + 2, arr.length))
      }
    } else {
      if (arr.indexOf('x') > 0) {
        const n = arr.indexOf('x')
        const p = arr[n - 1] * arr[n + 1]
        newArr = arr.slice(0, n-1).concat(p.toPrecision(12).toString(),...arr.slice(n+2, arr.length))
      } else {
        const n = arr.indexOf('÷')
        const p = arr[n - 1] / arr[n + 1]
        newArr = arr.slice(0, n-1).concat(p.toPrecision(12).toString(), ...arr.slice(n + 2, arr.length))
      }
    }
    return multDiv(newArr)
  }


})();
