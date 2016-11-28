(function() {
  'use strict';

  const $screen = $('#screen');

  const reduceArray = function(arr, num, prod) {
    let newArr = arr.slice(0, num - 1);

    newArr = newArr.concat(prod.toPrecision(12));
    newArr = newArr.concat(...arr.slice(num + 2, arr.length));

    return newArr;
  };

  const multiply = function(arr) {
    const num = arr.indexOf('x');
    const prod = arr[num - 1] * arr[num + 1];

    return reduceArray(arr, num, prod);
  };

  const divide = function(arr) {
    const num = arr.indexOf('÷');
    const prod = arr[num - 1] / arr[num + 1];

    return reduceArray(arr, num, prod);
  };

  const multDiv = function(arr) {
    let newArr = arr;

    if (!newArr.includes('x') && !newArr.includes('÷')) {
      return newArr;
    }

    if (arr.indexOf('÷') > 0 && arr.indexOf('x') > 0) {
      if (arr.indexOf('÷') > arr.indexOf('x')) {
        newArr = multiply(arr);
      } else {
        newArr = divide(arr);
      }
    }
    else if (arr.indexOf('x') > 0) {
      newArr = multiply(arr);
    }
    else {
      newArr = divide(arr);
    }

    return multDiv(newArr);
  };

  const arithmetic = function(string) {
    const arr = multDiv(string.split(' '));
    let num = parseFloat(arr.shift(), 10);

    for (let i = 0; i < arr.length; i += 2) {
      switch (arr[i]) {
        case '+':
          num += parseFloat(arr[i + 1], 10);
          break;
        case '-':
          num -= parseFloat(arr[i + 1], 10);
          break;
        default:
      }
    }

    return num;
  };

  const validate = function(string) {
    string = string.replace('/', '÷');
    string = string.replace(/(\S)(\()/g, '$1 $2');
    string = string.replace(/(\))(\S)/g, '$1 $2');
    string = string.replace(/(\()(\s+)/g, '$1');
    string = string.replace(/(\s+)(\))/g, '$2');
    string = string.replace(/(\S)([+\-x÷])/g, '$1 $2');
    string = string.replace(/([+\-x÷])(\S)/g, '$1 $2');
    string = string.replace(/(\)|\d)(\s)(\(|\d)/g, '$1 x $3');

    return string;
  };

  const calculate = function(string) {
    string = validate(string);

    while (string.includes('(')) {
      const pths = string.match(/\([^\(\)]+\)/);
      const inside = pths[0].slice(1, -1);
      const calcRes = arithmetic(inside);

      string = string.replace(pths[0], calcRes);
    }

    return arithmetic(string);
  };

  $('body').on('keydown', () => {
    if (event.which === 27) {
      $screen.val('');

      return;
    }
    if (event.which === 13) {
      const answer = calculate($screen.val());

      if (Number.isNaN(answer)) {
        $screen.val('error!');
      } else {
        $screen.val(answer.toString());
      }

      return;
    }
  });

  $('.buttons').on('click', 'span', () => {
    if ($(event.target).attr('id') === 'clear') {
      $screen.val('');

      return;
    }
    if ($(event.target).attr('id') === 'equals') {
      const answer = calculate($screen.val());

      if (Number.isNaN(answer)) {
        $screen.val('error!');
      } else {
        $screen.val(answer.toString());
      }

      return;
    }
    if ($(event.target).attr('id') === 'neg') {
      if ($screen.val().match(/\d+(?=\D)*$/) !== null) {
        const newVal = $screen.val().replace(/(\d+(?=\D)*$)/, '-$1');

        $screen.val(newVal);

        return;
      }
    }
    if ($screen.val().endsWith('±')) {
      $screen.val($screen.val().replace('±', '-'));
    }
    $screen.val($screen.val() + $(event.target).text());
  });
})();
