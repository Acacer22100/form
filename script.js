document.addEventListener("DOMContentLoaded", function () {
      // ✅ 每次載入頁面就清空表單
    document.getElementById("orderForm").reset();

    // 清空取貨地點 radio 的 clicked 標記
    document.querySelectorAll("input[name='pickupLocation']").forEach(radio => {
        radio.dataset.clicked = "false";
    });

    // 清空總金額顯示
    document.getElementById("totalCountText").innerHTML = "";

    // 限制活動日期選擇範圍 (今天 ~ 180 天內)
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let maxDate = new Date();
    maxDate.setDate(today.getDate() + 180);
  // ✅ 初始化 flatpickr：活動日、取貨日、取貨時間
const eventDatePicker = flatpickr("#eventDate", {
  dateFormat: "Y-m-d",
  minDate: "today",
  maxDate: new Date().fp_incr(180),
  onChange: function (selectedDates, dateStr, instance) {
    if (!dateStr) return;

    const eventDate = new Date(dateStr);
    const minPickupDate = new Date(eventDate);
    minPickupDate.setDate(eventDate.getDate() - 30);

    pickupDatePicker.set("minDate", minPickupDate);
    pickupDatePicker.set("maxDate", dateStr);

    updateAvailableLocations(dateStr);
  }
});

const pickupDatePicker = flatpickr("#pickupDate", {
  dateFormat: "Y-m-d"
});

flatpickr("#pickupTime", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true,
  minTime: "00:00",
  maxTime: "23:59",
  onOpen: function (selectedDates, dateStr, instance) {
    const location = document.querySelector("input[name='pickupLocation']:checked")?.value;

    if (!location) {
      // ✅ 未選擇地點 → 設定為不可選
      instance.set("minTime", null);
      instance.set("maxTime", null);
      return;
    }

    if (location === "樂華店") {
      instance.set("minTime", "16:40");
      instance.set("maxTime", "22:00");
    } else if (location === "士林店") {
      instance.set("minTime", "18:00");
      instance.set("maxTime", "22:00");
    } else if (location === "三重取貨點") {
      instance.set("minTime", "14:00");
      instance.set("maxTime", "17:30");
    } else if (location === "三重取貨點（早上）") {
      instance.set("minTime", "08:00");
      instance.set("maxTime", "09:00");
    } else {
      instance.set("minTime", "00:00");
      instance.set("maxTime", "23:59");
    }
  }
});



    let eventDateInput = document.getElementById("eventDate");
//    eventDateInput.setAttribute("min", today.toISOString().split("T")[0]);
//    eventDateInput.setAttribute("max", maxDate.toISOString().split("T")[0]);

// 🔸第 10 行：加在所有程式最上面
const locationConfig = {
  lehua: {
    blacklist: {
      dates: [],
      ranges: []
    }
  },
  shilin: {
    blacklist: {
      dates: ["2025-05-03"],
      ranges: []
    }
  },
  sanchong: {
    blacklist: {
      dates: [],
      ranges: [
        { start: "2025-03-31", end: "2025-05-02" },
        { start: "2025-05-04", end: "2025-05-24" },
        { start: "2025-05-26", end: "2026-05-24" }
      ]
    }
  },
  sanchongMorning: {
    whitelist: ["2025-05-10"]
  }
};




    // 限制活動日期 & 取貨日期輸入範圍
    eventDateInput.addEventListener("change", function () {
        setTimeout(() => {
            if (!this.value) return;
            let eventDate = parseLocalDate(this.value); // ✅ 改用 parseLocalDate
            eventDate.setHours(0, 0, 0, 0);
            if (eventDate < today || eventDate > maxDate) {
                alert("請選擇今天到 180 天內的日期");
                this.value = "";
                return;
            }
            let minPickupDate = new Date(eventDate);
            minPickupDate.setDate(eventDate.getDate() - 30);
            let pickupDateInput = document.getElementById("pickupDate");
            if (!isNaN(minPickupDate.getTime())) {
                pickupDateInput.setAttribute("min", minPickupDate.toISOString().split("T")[0]);
                pickupDateInput.setAttribute("max", this.value);
            }
            updateAvailableLocations(this.value);
        }, 1500);
    });

    let pickupDateInput = document.getElementById("pickupDate");
    pickupDateInput.addEventListener("change", function () {
        setTimeout(() => {
            if (!this.value) return;

            // 🔸 原有的驗證
            let selectedDate = parseLocalDate(this.value);
            selectedDate.setHours(0, 0, 0, 0);
            let eventDate = new Date(eventDateInput.value);
            eventDate.setHours(0, 0, 0, 0);
            let minPickupDate = new Date(eventDate);
            minPickupDate.setDate(eventDate.getDate() - 30);
            if (selectedDate < minPickupDate || selectedDate > eventDate) {
                alert("請選擇活動日期前 30 天到活動當天的日期");
                this.value = "";
            }

            // ✅ 更新取貨地點（處理早上場）
            updateAvailableLocations(eventDateInput.value);


            // ✅ 強制刷新取貨時間 flatpickr 的限制
            let pickupTimeFlatpickr = document.querySelector("#pickupTime")._flatpickr;
            if (pickupTimeFlatpickr) {
                pickupTimeFlatpickr.setDate(pickupTimeFlatpickr.input.value, true); // 再套用一次 onOpen 裡的時間限制
            }
        }, 500);
    });
    // ✅ 強制刷新取貨時間 flatpickr 的限制
    let pickupTimeFlatpickr =     document.querySelector("#pickupTime")._flatpickr;
    if (pickupTimeFlatpickr) {
      pickupTimeFlatpickr.setDate(pickupTimeFlatpickr.input.value,     true);
    }


    // **限制聯絡電話只能輸入數字**
    let phoneNumberInput = document.getElementById("phoneNumber");
    phoneNumberInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ""); // 移除非數字字符
    });

    // **取貨地點可取消選取**
// 監聽取貨地點變更
document.querySelectorAll(".pickup-option input[type='radio']").forEach(radio => {
    radio.addEventListener("click", function () {
        // 直接清除 clicked 標記，只記錄目前選的
        document.querySelectorAll("input[name='pickupLocation']").forEach(r => {
            r.dataset.clicked = "false";
        });
        this.dataset.clicked = "true";

        const pickupTimeInput = document.getElementById("pickupTime");
        const selectedTime = pickupTimeInput.value;

        if (selectedTime) {
            const isValid = validatePickupTime(this.value, selectedTime, true);
            if (!isValid) {
                alert(getPickupNotification(this.value));
                pickupTimeInput.value = "";
            }
            pickupTimeInput.dataset.valid = isValid ? "true" : "false";
        }
    });
});

// **取貨時間檢查函數**
function validatePickupTime(location, time, checkOnly = false, inputElement = null) {
    let isValid = true;

    if (location === "樂華店" && (time < "16:40" || time > "22:00")) {
        isValid = false;
    } else if (location === "士林店" && (time < "18:00" || time > "22:00")) {
        isValid = false;
    } else if (location === "三重取貨點" && (time < "14:00" || time > "17:30")) {
        isValid = false;
    } else if (location === "三重取貨點（早上）" && (time < "08:00" || time > "09:00")) {
        isValid = false;
    }

    if (!isValid && !checkOnly) {
        alert(getPickupNotification(location));
        if (inputElement) inputElement.value = ""; // ✅ 清空指定的輸入框
    }

    return isValid;
}



// **根據取貨地點顯示不同的通知**
function getPickupNotification(location) {
    if (location === "樂華店") {
        return "樂華店取貨時間為 16:40 - 22:00喔！";
    } else if (location === "士林店") {
        return "士林店取貨時間為 18:00 - 22:00喔！";
    } else if (location === "三重取貨點") {
        return "三重取貨點取貨時間為 14:00 - 17:30喔！";
    } else if (location === "三重取貨點（早上）") {
        return "三重取貨點（早上）取貨時間為 08:00 - 09:00喔！";
    }
    return "請選擇正確的取貨地點。";
}


// 🔸第 130 行左右
function updateAvailableLocations(selectedDateStr) {
  const selectedDate = new Date(selectedDateStr);

  const locations = {
    lehua: document.getElementById("optionLehua"),
    shilin: document.getElementById("optionShilin"),
    sanchong: document.getElementById("optionSanchong"),
    sanchongMorning: document.getElementById("optionSanchongMorning")
  };

  Object.keys(locations).forEach(key => {
    const el = locations[key];

    // ✅ 特殊處理三重早上：只在白名單且活動日＝取貨日才顯示
if (key === "sanchongMorning") {
  const pickupDateStr = document.getElementById("pickupDate").value;
  const eventDateStr = document.getElementById("eventDate").value;
  const whiteList = locationConfig.sanchongMorning.whitelist;

  // ✅ 預設隱藏
  let shouldShow = false;

  if (
    pickupDateStr &&
    eventDateStr &&
    pickupDateStr === eventDateStr &&
    whiteList.includes(pickupDateStr)
  ) {
    shouldShow = true;
  }

  // 強制先隱藏，避免沒日期時還顯示
  el.style.display = shouldShow ? "flex" : "none";
  return;
}



    // 其他一般地點 → 判斷黑名單邏輯
    const { blacklist } = locationConfig[key];
    let shouldHide = false;

    if (blacklist.dates.includes(selectedDateStr)) {
      shouldHide = true;
    }

    if (!shouldHide && blacklist.ranges.length > 0) {
      for (let range of blacklist.ranges) {
        const start = new Date(range.start);
        const end = new Date(range.end);
        if (selectedDate >= start && selectedDate <= end) {
          shouldHide = true;
          break;
        }
      }
    }

    el.style.display = shouldHide ? "none" : "flex";
  });
}




    // **取貨時間限制**
    let pickupTimeInput = document.getElementById("pickupTime");
    pickupTimeInput.setAttribute("step", "60");

pickupTimeInput.addEventListener("blur", function () {
    const selectedTime = this.value;
    const selectedLocation = document.querySelector(".pickup-option input[type='radio']:checked");
    if (!selectedLocation) return;

    const isValid = validatePickupTime(selectedLocation.value, selectedTime, false, this);

    // ✅ 新增這一行：標記合法狀態
    this.dataset.valid = isValid ? "true" : "false";
});




  
    // 限制統一編號只能輸入數字
    document.getElementById("invoiceNumber").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });

    // 限制所有口味輸入框只能輸入數字
    document.querySelectorAll(".flavor-item input[type='text']").forEach(input => {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
            calculateTotal();
        });
    });

function getOrderDetails() {
    const flavorData = [
        { name: "12元口味 - 多多", id: "qtyDuoDuo" },
        { name: "12元口味 - 葡萄", id: "qtyGrape" },
        { name: "12元口味 - 荔枝", id: "qtyLychee" },
        { name: "12元口味 - 百香果", id: "qtyPassionFruit" },
        { name: "12元口味 - 草莓", id: "qtyStrawberry" },
        { name: "15元口味 - 蘋果", id: "qtyApple" },
        { name: "15元口味 - 鳳梨", id: "qtyPineapple" },
        { name: "15元口味 - 柳橙", id: "qtyOrange" },
        { name: "15元口味 - 水蜜桃", id: "qtyPeach" },
        { name: "15元口味 - 芒果", id: "qtyMango" }
    ];

    let orderDetails = "";
    let totalCount = 0;
    let totalPrice = 0;
    let fifteenYuanTotal = 0;

    flavorData.forEach(flavor => {
        let quantity = parseInt(document.getElementById(flavor.id)?.value) || 0;
        if (quantity > 0) {
            orderDetails += `${flavor.name}：${quantity} 枝\n`;
            totalCount += quantity;
            totalPrice += flavor.name.includes("12元") ? quantity * 12 : quantity * 15;

            if (flavor.name.includes("15元")) {
                fifteenYuanTotal += quantity;
            }
        }
    });

    return { orderDetails, totalCount, totalPrice, fifteenYuanTotal };
}

  
document.getElementById("orderForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // ✅ 必填欄位驗證（顯示缺漏欄位名稱）
    let requiredFields = [
        { id: "customerName", label: "訂購人姓名" },
        { id: "phoneNumber", label: "聯絡電話" },
        { id: "eventDate", label: "活動日期" },
        { id: "pickupDate", label: "取貨日期" },
        { id: "pickupTime", label: "取貨時間" }
    ];

    let missingFields = [];

    requiredFields.forEach(field => {
        let input = document.getElementById(field.id);
        if (!input || !input.value.trim()) {
            missingFields.push(field.label);
            if (input) input.style.border = "2px solid red";
        } else {
            input.style.border = "";
        }
    });

    let pickupLocationElement = document.querySelector("input[name='pickupLocation']:checked");
    if (!pickupLocationElement) {
        missingFields.push("取貨地點");
    }

    if (missingFields.length > 0) {
        alert("請填寫以下欄位：\n\n" + missingFields.join("\n"));
        return;
    }

    // 標記已選地點（避免 radio 被取消）
    pickupLocationElement.dataset.clicked = "true";

    // ✅ 取值
    const customerName = document.getElementById("customerName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const orderUnit = document.getElementById("orderUnit").value.trim();
    const eventDate = document.getElementById("eventDate").value.trim();
    const invoiceTitle = document.getElementById("invoiceTitle").value.trim();
    const invoiceNumber = document.getElementById("invoiceNumber").value.trim();
    const pickupLocation = pickupLocationElement.value;
    const pickupDate = document.getElementById("pickupDate").value.trim();
    const pickupTime = document.getElementById("pickupTime").value.trim();

    // ✅ 再次嚴格檢查時間
    const pickupTimeInput = document.getElementById("pickupTime");

    // 再次驗證合法時間（萬一 blur 沒觸發）
    const isValidTime = validatePickupTime(pickupLocation, pickupTime, false, pickupTimeInput);
    pickupTimeInput.dataset.valid = isValidTime ? "true" : "false";

    if (pickupTimeInput.dataset.valid !== "true") {
        alert("請確認您輸入的取貨時間是否正確喔！");
        pickupTimeInput.focus();
        return;
    }


    // ✅【取貨日區間驗證】
    const pickupDateObj = parseLocalDate(pickupDate);
    const eventDateObj = parseLocalDate(eventDate);
    const minPickupDate = new Date(eventDateObj);
    minPickupDate.setDate(eventDateObj.getDate() - 30);
    if (pickupDateObj < minPickupDate || pickupDateObj > eventDateObj) {
        alert("請選擇活動日期前 30 天到活動當天的日期");
        return;
    }

    // ✅ 訂購內容
    const { orderDetails, totalCount, totalPrice, fifteenYuanTotal } = getOrderDetails();
    const calculatedCount = Math.ceil(totalCount / 1.1);
    const bonusCount = Math.floor(calculatedCount / 10);
    const adjustedPrice = totalPrice - bonusCount * 12;

    // ✅ 買十送一數量驗證
    if ((calculatedCount + bonusCount) !== totalCount) {
        const diff = (calculatedCount + bonusCount) - totalCount;
        alert(`若要購買 ${calculatedCount} 枝，贈送 ${bonusCount} 枝。請再挑選 ${diff} 枝。`);
        return;
    }

    // ✅ 確認訊息組合
    let confirmationMessage = `請確認您的訂單資訊：\n\n\n`;
    confirmationMessage += `📌 訂購人姓名：${customerName}\n\n`;
    confirmationMessage += `📞 聯絡電話：${phoneNumber}\n\n`;
    confirmationMessage += `🏫 訂購單位：${orderUnit}\n\n`;
    confirmationMessage += `📅 活動日期：${eventDate}\n\n`;
    if (invoiceTitle) confirmationMessage += `🧾 收據抬頭：${invoiceTitle}\n\n`;
    if (invoiceNumber) confirmationMessage += `💳 統一編號：${invoiceNumber}\n\n`;
    confirmationMessage += `✮✯✮✯✮✯✮\n\n`;
    confirmationMessage += `🏬 取貨地點：${pickupLocation}\n\n`;
    confirmationMessage += `🏬 取貨日期：${pickupDate}\n\n`;
    confirmationMessage += `⏰ 取貨時間：${pickupTime}\n\n`;
    confirmationMessage += `--\n`;
    confirmationMessage += `🛒 訂購內容：\n${orderDetails}\n\n`;
    confirmationMessage += `🔢 總枝數：${totalCount} 枝，共 ${adjustedPrice} 元。\n\n`;
    confirmationMessage += `    ⤷ 訂購 ${calculatedCount} 枝 + 贈送 ${bonusCount} 枝。\n`;
    if (fifteenYuanTotal > 0) {
        confirmationMessage += `    ⤷ 贈送口味為 12 元口味。\n`;
    }

    // ✅ 彈出視窗
    let confirmBox = document.createElement("div");
    confirmBox.style = `
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        width: 90%; max-width: 500px;
        max-height: 80vh; overflow-y: auto;
        z-index: 1000; text-align: left;
    `;

    let messageText = document.createElement("p");
    messageText.style = "font-size: 16px; white-space: pre-line;";
    messageText.textContent = confirmationMessage;

    let buttonContainer = document.createElement("div");
    buttonContainer.style = "display: flex; justify-content: space-between; margin-top: 20px;";

    let cancelButton = document.createElement("button");
    cancelButton.textContent = "返回";
    cancelButton.style = "background: #ccc; color: #000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;";
    cancelButton.onclick = () => {
        document.body.removeChild(confirmBox);
        document.body.removeChild(overlay);
    };

    let submitButton = document.createElement("button");
    submitButton.textContent = "送出";
    submitButton.style = "background: #ff6600; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;";
    submitButton.onclick = () => {
        document.body.removeChild(confirmBox);
        document.body.removeChild(overlay);

        const formData = new FormData();
        formData.append("entry.153434121", customerName);
        formData.append("entry.1286553898", phoneNumber);
        formData.append("entry.29286919", orderUnit);
        formData.append("entry.1406293128", invoiceTitle);
        formData.append("entry.307667347", invoiceNumber);
        formData.append("entry.2132577574", eventDate);
        formData.append("entry.969880587", pickupLocation);
        formData.append("entry.355577760", pickupDate);
        formData.append("entry.1822166015", pickupTime);

        // 各口味
        formData.append("entry.316562737", document.getElementById("qtyDuoDuo").value || "0");
        formData.append("entry.2045995529", document.getElementById("qtyGrape").value || "0");
        formData.append("entry.632518397", document.getElementById("qtyLychee").value || "0");
        formData.append("entry.1388020976", document.getElementById("qtyPassionFruit").value || "0");
        formData.append("entry.1942859558", document.getElementById("qtyStrawberry").value || "0");
        formData.append("entry.761436590", document.getElementById("qtyApple").value || "0");
        formData.append("entry.454770086", document.getElementById("qtyPineapple").value || "0");
        formData.append("entry.1676199734", document.getElementById("qtyOrange").value || "0");
        formData.append("entry.1154026181", document.getElementById("qtyPeach").value || "0");
        formData.append("entry.236488691", document.getElementById("qtyMango").value || "0");
        formData.append("entry.1110750172", document.getElementById("qtyStrawberryDuoDuo")?.value || "0");

        console.log("🚀 送出前的 formData 項目：");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSe6tzVbIUYkpADid6OwhxLitHyK4GgzQJMRHvLdwnNZA60mZg/formResponse", {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        document.getElementById("orderForm").reset();
        document.querySelectorAll("input[name='pickupLocation']").forEach(radio => {
            radio.dataset.clicked = "false";
        });
        calculateTotal();

        alert(`非常感謝您的填寫，再麻煩您通知負責人員您已完成填單，以確認您的訂單與付訂，尚未付訂前皆未完成訂購程序喔^^
若已超過服務時間(10:00-22:00)，則翌日處理，謝謝您^^

※請注意再與服務人員確認且付訂前，此筆訂單尚未成立。`);
    };

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(submitButton);
    confirmBox.appendChild(messageText);
    confirmBox.appendChild(buttonContainer);

    const overlay = document.createElement("div");
    overlay.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 999;";
    document.body.appendChild(overlay);
    document.body.appendChild(confirmBox);
});



    function calculateTotal() {
        let twelveYuanTotal = 0;
        let fifteenYuanTotal = 0;

        const twelveYuanIds = ["qtyDuoDuo", "qtyGrape", "qtyLychee", "qtyPassionFruit", "qtyStrawberry"];
        const fifteenYuanIds = ["qtyApple", "qtyPineapple", "qtyOrange", "qtyPeach", "qtyMango"];

        twelveYuanIds.forEach(id => {
            let qty = parseInt(document.getElementById(id).value) || 0;
            twelveYuanTotal += qty;
        });

        fifteenYuanIds.forEach(id => {
            let qty = parseInt(document.getElementById(id).value) || 0;
            fifteenYuanTotal += qty;
        });

        let totalCount = twelveYuanTotal + fifteenYuanTotal;
        let calculatedCount = Math.ceil(totalCount / 1.1);
        let bonusCount = Math.floor(calculatedCount / 10);
        let isValid = (calculatedCount + bonusCount) === totalCount;
        let hasInput = totalCount > 0;
        let totalPrice = twelveYuanTotal * 12 + fifteenYuanTotal * 15 - bonusCount * 12;

        let displayText = `<div class="total-summary">`;

        if (totalCount > 0) {
            displayText += `<div class="total-row">總枝數: ${totalCount} 枝。</div>`;
            displayText += `<br>`;
        }

        if (!isValid) {
            let suggestedBuy = calculatedCount;
            let suggestedBonus = Math.floor(suggestedBuy / 10);
            let difference = (suggestedBuy + suggestedBonus) - totalCount;
            displayText += `<div class="total-row error-text">
                若要購買 ${suggestedBuy} 枝，贈送 ${suggestedBonus} 枝。請再挑選 ${difference} 枝。
            </div>`;
            document.getElementById("totalCountText").innerHTML = displayText;
            return;
        }

        if (hasInput) {
          displayText += `<div class="total-sub" style="color: red; font-weight: bold; margin: 0;">
            ⤷ 訂購 ${calculatedCount} 枝 + 贈送 ${bonusCount} 枝。
          </div>`;
        }

        if (fifteenYuanTotal > 0) {
          displayText += `<div class="total-sub" style="color: red; font-weight: bold; margin: 0;">
            ⤷ 贈送口味為 12 元口味，若要贈送15元須補3元差價喔。
          </div>`;
        }


        if (totalCount > 0) {
            displayText += `<div class="total-row">總金額: ${totalPrice} 元。</div>`;

        }

        displayText += `</div>`;

        document.getElementById("totalCountText").innerHTML = displayText;
    }

    calculateTotal();
});

// **所有口味的 ID 對照表**
// 12元口味
// - qtyDuoDuo      (多多)
// - qtyGrape       (葡萄)
// - qtyLychee      (荔枝)
// - qtyPassionFruit (百香果)
// - qtyStrawberry  (草莓)

// 15元口味
// - qtyApple       (蘋果)
// - qtyPineapple   (鳳梨)
// - qtyOrange      (柳橙)
// - qtyPeach       (水蜜桃)
// - qtyMango       (芒果)

// **設定未開放的口味 (請在陣列中加入欲關閉的口味 ID)**
const disabledFlavors = ["qtyMango"]; // 例如：不開放「荔枝」與「水蜜桃」

// **監聽所有口味輸入框**
document.querySelectorAll(".flavor-item input[type='text']").forEach(input => {
    input.addEventListener("input", function () {
        let flavorId = this.id; // 取得該輸入框的 ID
        let flavorName = this.parentElement.querySelector("label").textContent; // 取得對應的口味名稱
        let value = this.value.trim(); // 取得輸入框的值

        // **檢查該口味是否為未開放口味**
        if (disabledFlavors.includes(flavorId) && value !== "" && value !== "0") {
            alert(`目前尚未開放 ${flavorName} 訂購喔!!`); // 顯示警告
            this.value = ""; // **清空該輸入框**
        }

    });
});

//隱藏使用none,顯示為flex
//document.getElementById("optionSanchong").style.display = "none";
//document.getElementById("optionLehua").style.display = "flex";
//document.getElementById("optionShilin").style.display = "flex";

["optionLehua", "optionShilin", "optionSanchong", "optionSanchongMorning"].forEach(id => {
    document.getElementById(id).style.display = "none";
});

function parseLocalDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // 月份從 0 開始
}

// ✅ 控制發票區塊顯示與隱藏
document.getElementById("showInvoiceInfo").addEventListener("change", function () {
    const invoiceSection = document.getElementById("invoiceSection");
    invoiceSection.style.display = this.checked ? "flex" : "none";

    if (!this.checked) {
        // 🔸取消勾選時，清空欄位
        document.getElementById("invoiceTitle").value = "";
        document.getElementById("invoiceNumber").value = "";
    }
});
