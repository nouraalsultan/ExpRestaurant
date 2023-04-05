$(document).ready(function () {
  if (localStorage.getItem("theme") === "theme-1") {
    localStorage.setItem("theme", "theme-1");
    document.documentElement.className = "theme-1";
  } else if (localStorage.getItem("theme") === "theme-2") {
    localStorage.setItem("theme", "theme-2");
    document.documentElement.className = "theme-2";
  }

  $("#theme-1").click(function () {
    $("#theme-2").removeClass("active");
    $("#theme-1").addClass("active");
    localStorage.setItem("theme", "theme-1");
    document.documentElement.className = "theme-1";
  });

  $("#theme-2").click(function () {
    $("#theme-1").removeClass("active");
    $("#theme-2").addClass("active");
    localStorage.setItem("theme", "theme-2");
    document.documentElement.className = "theme-2";
  });

 

$(".table").click(function () {
  var table_num = $(this).attr("id").replace("table_", "");
  validateReservation(table_num);
});

  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).includes("reservation_")) {
      var table_nam = localStorage.key(i).replace("reservation_", "");

      $(".tables .under-box").each(function () {
        if ($(this).text() == table_nam) {
          $(this).parent().find(".box").addClass("reserved-box");
        }
      });

      $("#reservation .table-num  option[value='" + table_nam + "']").each(
        function () {
          $(this).remove();
        }
      );
    }
  }

});

function validateReservation(table_num) {
  var $date = $("#reservation .date :input");
  var $people = $("#reservation .people :input");
  //var $table_num = $("#reservation .table-num :input");
  var $time = $("#reservation .time :input");
  var $cname = $("#reservation .cname :input");
  var $cphone = $("#reservation .cphone :input");
  var bR = document.getElementById("check_button");

  if ($date.val() == "") {
    alert("Date is required.");
    return false;
  }

  if ($people.val() == "") {
    alert("People number is required.");
    return false;
  }
  if ($people.val()>8) {
    alert("People number must be less than 8.");
    return false;
  }

  if ($time.val() == "") {
    alert("Time is required.");
    return false;
  }

  if ($cname.val() == "") {
    alert("Customer name is required.");
    return false;
  }
  if ($cphone.val()=="") {
    alert("Phone number required.");
    return false;
  }
  if ($cphone.val().length>10 || $cphone.val().length<10) {
    alert("Enter a valid phone number, 10 NUMBERS ONLY.");
    return false;
  }

  if (!validateName($cname.val())) {
    alert("Name not valid.");
    return false;
  }

  if (!validatePhone($cphone.val())) {
    alert("Phone not valid.");
    return false;
  }

  var is_available = $("#table_" + table_num).find("span").text();

  if (is_available == "NO") {
    alert("This table is not available.");
    alert("---Costumer information---\n" + "Name: " + $cname.val() + "\nPhone Number: " + $cphone.val() + "\nNumber of people: " + $people.val() + "\nDate: " + $date.val() + "\nTime:" +$time.val());
    return false;
  }

  var tablesCapacity = [4, 10, 4, 4, 8, 2];

  if ($people.val() > tablesCapacity[table_num - 1]) {
    alert("The select table capacity is smaller than people number \n you need to get a table suit for " + $people.val() + " people or more.");
    return false;
  }
bR.onclick = function (){
  alert("your reservation has been confirmed.");
  var userData = [
    $date.val(),
    $people.val(),
    table_num,
    $time.val(),
    $cname.val(),
    $cphone.val(),
  ];

  localStorage.setItem(
    "reservation_" + table_num,
    JSON.stringify(userData)
  );

  $("#table_" + table_num).find("span").text("NO");
  $("#table_" + table_num).addClass("reserved_table");

  $("input").val("");
  
}
  if (!confirm("the table you selected is available.")) {
    return false;
  } 

  
  
}

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
}

function evaluate(id, val) {
  var new_evaluate = [0, 0];
  var old_evaluate = JSON.parse(localStorage.getItem("evaluate_" + id));
  if (old_evaluate) {
    var count = parseInt(old_evaluate[0]) + 1;
    var sum = parseInt(old_evaluate[1]) + parseInt(val);
    var avg = sum / count;

    new_evaluate = [count, avg];
  } else {
    new_evaluate = [1, val];
  }

  localStorage.setItem("evaluate_" + id, JSON.stringify(new_evaluate));
}

function validateName(name) {
  if (name.match("^[a-zA-Z]{3,16}$")) {
    return true;
  } else {
    return false;
  }
}

function validatePhone(txtPhone) {
  var filter =
    /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
  if (filter.test(txtPhone)) {
    return true;
  } else {
    return false;
  }
}

function sortCat(cat, items, idx) {
  var sorted = $(items).sort(function (a, b) {
    return ascending[idx] ==
      parseFloat($(a).children("td").eq(2).html().replace("SAR", "")) <
        parseFloat($(b).children("td").eq(2).html().replace("SAR", ""))
      ? 1
      : -1;
  });
  ascending[idx] = ascending[idx] ? false : true;

  $(items).each(function () {
    $(this).remove();
  });

  $(cat).after(sorted);
}

function getInvoice() {
  var $order_table = $(".order-table table tbody");
  var $table_num = $(".table-number-div :input");

  if (!$table_num.val()) {
    alert("No table selected.");
    return false;
  }

  var order = [];

  var mainCourse = getMeals(".mainCourse");
  var appetizer = getMeals(".appetizer");
  var drinks = getMeals(".drinks");

  if (mainCourse.length > 0) order.push(["mainCourse", mainCourse]);

  if (appetizer.length > 0) order.push(["appetizer", appetizer]);

  if (drinks.length > 0) order.push(["drinks", drinks]);

  if (order.length == 0) {
    alert("Please select an item to order");
    return false;
  }

  localStorage.setItem("order_" + $table_num.val(), JSON.stringify(order));

  $(".table-number-div option[value='" + $table_num.val() + "']").each(
    function () {
      $(this).remove();
    }
  );

  $(".quantity-text").text("0");

 

  getInvoiceData();
}

function printOrder(e) {
  var invoice = $(e).closest(".order-invoice");
      $(e).remove();

      var newWin = window.open("", "Print-Window");

      newWin.document.open();

      newWin.document.write(
        '<html><body onload="window.print()">' +
          invoice.html() +
          "</body></html>"
      );

      newWin.document.close();

      setTimeout(function () {
        newWin.close();
      }, 10);

      localStorage.removeItem(invoice.attr("id"));
      localStorage.removeItem(
        invoice.attr("id").replace("order_", "reservation_")
      );

      $(".table-number-div option[value='" + invoice.attr("id").replace("order_", "") + "']").each(
        function () {
          $(this).remove();
        }
      );

      invoice.remove();
}

function getMeals(mealCat) {
  $order_table = $(".order-table table tbody");
  var meals = [];

  $order_table.find(mealCat).each(function () {
    var mealName = $(this).find(".meal-name").html();
    var quantity = $(this).find(".quantity-text").html();
    var price = parseFloat(
      $(this).children("td").eq(2).html().replace("SAR", "")
    );

    if (quantity > 0) meals.push([mealName, quantity, price]);
  });

  return meals;
}

function getInvoiceData() {
  var order = [];
  var total = 0;
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.includes("order_")) {
      var order = JSON.parse(localStorage.getItem(key));
      var table_nam = key.replace("order_", "");

      order_invoice = $(
        '<div class="order-invoice" id="order_' + table_nam + '"></div>'
      );
      title = $('<h2 class="title-2">Invoice Table (' + table_nam + ")</h2>");
      order_table = $(
        '<div class="order-table"><table><thead><tr><th>Meal name</th><th>Quantity</th><th>Price</th></tr></thead><tbody></tbody></table></div>'
      );

      mael_name_txt = $('<div class="meal-name">dd</div>');
      quantity_txt = $('<div class="quantity-text">1</div>');
      price_txt = $("<td></td>");

      for (var j = 0; j < order.length; j++) {
        var cat = order[j][0];

        for (var k = 0; k < order[j][1].length; k++) {
          mael_name = order[j][1][k][0];
          quantity = order[j][1][k][1];
          price = order[j][1][k][2];

          mael_name_txt.text(mael_name);
          quantity_txt.text(quantity);
          price_txt.text("SAR " + price + ".00");

          total += parseInt(quantity) * parseInt(price);

          tr = $(
            '<tr><td><div class="meal">' +
              mael_name_txt.html() +
              '</div></td><td><div class="quantity">' +
              quantity_txt.html() +
              "</div></td><td>" +
              price_txt.html() +
              "</td></tr>"
          );

          tr.appendTo(order_table.find("tbody"));
        }
      }

      if (total > 0) {
        under_table = $(
          '<div class="under-table"><div class="total-cost"><span class="total-cost-label">Total Cost : </span><span class="total-cost-number">SAR ' +
            total +
            '.00</span></div><div class="print" onclick="printOrder(this)">  <p class="print-word">Print</p>  <img src="imgs/icons/print.png" alt="print.png" /></div></div>'
        );

        title.appendTo(order_invoice);
        order_table.appendTo(order_invoice);
        under_table.appendTo(order_invoice);
        order_invoice.appendTo("#invoices");

        $(".table-number-div option[value='" + table_nam + "']").each(
          function () {
            $(this).remove();
          }
        );
      }
    }
  }
}
