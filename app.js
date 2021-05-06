// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePersentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatMoney = function (too, type) {
    too = "" + too;
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;

    for (var i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 === 0) y = y + ",";
      count++;
    }
    var z = y.split("").reverse().join("");

    // substr – string-с string-г салгаж авч устгадаг.
    if (z[0] === ",") z = z.substr(1, z.length - 1);
    if (type === "inc") z = "+ " + z;
    else z = "- " + z;

    return z;
  };

  return {
    displayDate: function () {
      var unuudur = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        unuudur.getFullYear() + " оны " + unuudur.getMonth() + " сарын ";
    },

    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, function (el) {
        // toggle
        el.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },

    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        // String-г тоо руу хөрвүүлэгч parseInt("1235")=>1235
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    displayPersentage: function (allPercentages) {
      // Зарлагын Nodelist-г олох
      var elements = document.querySelectorAll(
        DOMstrings.expensePersentageLabel
      );

      // Элемэнт болгоны хувьд зарлагын хувийг массиваас авч оруулах
      nodeListForEach(elements, function (el, index) {
        el.textContent = allPercentages[index];
      });
    },

    getDOMstrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      // list
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      // list-g Massiv bolgoj xorvuulex
      var fieldsArr = Array.prototype.slice.call(fields);

      /* ForEach - 
        for (var i = 0; i < fieldsArr.length; i++) {
        fieldsArr[i].value = "";
      */
      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });

      // focus -
      fieldsArr[0].focus();
    },

    tusviigUzuulex: function (tusuv) {
      var type;
      if (tusuv.tusuv > 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(
        tusuv.totalExp,
        "exp"
      );
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi;
      }
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function (item, type) {
      //Оолого зарлагын элементийг агуулсан html-г бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$Description$$</div><div class="right clearfix"><div class="item__value">$$Value$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expensesList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$Description$$</div><div class="right clearfix"><div class="item__value">$$Value$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Тэр HTML дотроо орлого зарлагын утгуудыг Replace  ашиглан өөрчилж өгнө.
      html = html.replace("%id%", item.id);
      html = html.replace("$$Description$$", item.description);
      html = html.replace("$$Value$$", formatMoney(item.value, type));
      // Бэлтгэсэн HTML-ээ Dom-руу хийж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

// Санхүүтэй ажиллах контроллер
var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };

  Expense.prototype.getPersentage = function () {
    return this.percentage;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    items: {
      inc: [],
      exp: [],
    },

    totals: {
      inc: 0,
      exp: 0,
    },

    tusuv: 0,
    huvi: 0,
  };

  return {
    tusuvTootsooloh: function () {
      // Нийт орлогын нийлбэрийг тооцоолно
      calculateTotal("inc");
      // Нийт зарлагын нийлбэрийг тооцоолно
      calculateTotal("exp");
      // Төсвийг шинээр тооцоолно.
      data.tusuv = data.totals.inc - data.totals.exp;
      // Орлого, зарлагын хувийг тооцоолно.
      if (data.totals.inc > 0) {
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else data.huvi = 0;
    },

    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },

    getPersentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPersentage();
      });

      return allPercentages;
    },

    tusviigAvax: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });

      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },

    addItem: function (type, desc, val) {
      var item, id;
      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },

    seeData: function () {
      return data;
    },
  };
})();

// Програмын холбогч контроллер
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    // 1. Оруулах өгөгдлийг дэлгэцнээс олж авна.
    var input = uiController.getInput();

    if (input.description !== "" && input.value !== "") {
      // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );
      // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана.
      uiController.addListItem(item, input.type);
      uiController.clearFields();

      // Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ.
      updateTusuv();
    }
  };

  var updateTusuv = function () {
    //   4. Төсвийг тооцоолно.
    financeController.tusuvTootsooloh();

    //   5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
    var tusuv = financeController.tusviigAvax();

    // 6.Төсвийн тооцоон дэлгэцэнд гаргана.
    uiController.tusviigUzuulex(tusuv);

    // 7.
    financeController.calculatePercentages();

    // 8. Элемэнтүүдийн хувийг хүлээж авна
    var allPercentages = financeController.getPersentages();
    // 9. Эдгээр хувийг дэлгэцэнд харуулна.
    uiController.displayPersentage(allPercentages);
  };

  var setupEventListeners = function () {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    // Keyboard-с enter товчийг дарахад өгөгдлийг оруулах товчийг дарсантай адил үйлдэл хийдэг болгоё. Ингэхдээ keyboard-ний товч бүр өөрийг нь илэрхийлэх KeyCode-той байдаг. Enter товч нь 13 гэсэн кодтой байдаг.
    document.addEventListener("keypress", function (event) {
      //   дээр үеийн browser-уудад энэ нь event.which гэж ажилладаг
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        // html-с тухайн элемэнтийн parent элемэнтийг гаргаж олж авах - parentNode
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          // inc-2 -н 2-г салгах
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);

          // console.log(type + " ===> " + itemId);

          // 1. Санхүүгийн модулиас type, id ашиглаад устгана.
          financeController.deleteItem(type, itemId);

          // 2. Дэлгэц дээрээс энэ элемэнтийг устгана.
          uiController.deleteListItem(id);

          // 3. Үлдэгдэл тооцоог шинэчилж харуулна.
          updateTusuv();
        }
      });
  };
  return {
    init: function () {
      console.log("Application started ...");
      uiController.displayDate();
      uiController.tusviigUzuulex({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
