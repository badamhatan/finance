// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
  };
  var x = 1;
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },

    getDOMstrings: function () {
      return DOMstrings;
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

  var data = {
    allItems: {
      inc=[],
      expense:[]      
    }

    totals: {
      inc:0,
      exp:0
    }
  }
})();

// Програмын холбогч контроллер
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    // 1. Оруулах өгөгдлийг дэлгэцнээс олж авна.
    console.log(uiController.getInput());
    // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
    // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана.
    //   4. Төсвийг тооцоолно.
    //   5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
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
