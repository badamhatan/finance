// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {})();

// Санхүүтэй ажиллах контроллер
var financeController = (function () {})();

// Програмын холбогч контроллер
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    console.log("өгөгдөл оруула хэсэг");
  };
  document.querySelector(".add__btn").addEventListener("click", function () {
    ctrlAddItem();
    // 1. Оруулах өгөгдлийг дэлгэцнээс олж авна.
    // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
    // 2. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана.
    //   4. Төсвийг тооцоолно.
    //   5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
  });
  // Keyboard-с enter товчийг дарахад өгөгдлийг оруулах товчийг дарсантай адил үйлдэл хийдэг болгоё. Ингэхдээ keyboard-ний товч бүр өөрийг нь илэрхийлэх KeyCode-той байдаг. Enter товч нь 13 гэсэн кодтой байдаг.

  document.addEventListener("keypress", function (event) {
    //   дээр үеийн browser-уудад энэ нь event.which гэж ажилладаг
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(uiController, financeController);
