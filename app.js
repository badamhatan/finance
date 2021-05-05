// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        // String-г тоо руу хөрвүүлэгч parseInt("1235")=>1235
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
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

    addListItem: function (item, type) {
      //Оолого зарлагын элементийг агуулсан html-г бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">$$Description$$</div><div class="right clearfix"><div class="item__value">$$Value$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expensesList;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">$$Description$$</div><div class="right clearfix"><div class="item__value">$$Value$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion - ios - close - outline"></i></button></div></div></div>';
      }
      // Тэр HTML дотроо орлого зарлагын утгуудыг Replace  ашиглан өөрчилж өгнө.
      html = html.replace("%id%", item.id);
      html = html.replace("$$Description$$", item.description);
      html = html.replace("$$Value$$", item.value);
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
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    tusviigAvax: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
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

      //   4. Төсвийг тооцоолно.
      financeController.tusuvTootsooloh();

      //   5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
      var tusuv = financeController.tusviigAvax();

      // 6.Төсвийн тооцоон дэлгэцэнд гаргана.
      console.log(tusuv);
    }
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
  };
  return {
    init: function () {
      console.log("Application started ...");
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
