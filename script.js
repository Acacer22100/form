/* === 保持原有背景與樣式 === */
body {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    background: url(https://i.imgur.com/xrJlJVC.jpeg) no-repeat center top;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
}

/* 主要容器樣式 */
.booking-form-w3layouts {
    box-sizing: border-box;
    padding: 3em;
    background: rgba(255, 255, 255, 0.65);
    width: 65%;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* 🔹 訂購單標題 */
.sub-heading-agileits {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    color: #333;
    margin-bottom: 20px;
}

/* 🔹 訂購內容說明 */
.sub-heading-agileits + p {
    text-align: left;
    font-size: 16px;
    color: #666;
    margin-bottom: 15px;
}

/* 🔹 訂購單圖片 */
.order-title-image {
    display: block;
    margin-left: 0;
    max-width: 60%;
    height: auto;
    margin-bottom: 25px;
}

/* 🔹 讓所有輸入框雙行排列（桌機版雙欄，手機版單欄） */
.main-flex-w3ls-sectns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 15px;
}

/* 訂購人資訊的標籤靠左，確保標籤和輸入框能夠自適應 */
.form-w3-agile-text1, .form-w3-agile-text2 {
    flex: 1 1 48%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start; /* 讓標題和輸入框靠左 */
    width: 100%;
}

/* 讓標籤佔滿整行，避免影響輸入框 */
.form-w3-agile-text1 label,
.form-w3-agile-text2 label {
    font-size: 18px;
    color: #444;
    font-weight: bold;
    width: 100%;
    text-align: left;
    margin-bottom: 5px; /* 讓輸入框與標籤有適當間隔 */
}


/* 🔹 讓輸入框填滿剩餘空間 */
.form-w3-agile-text1 input,
.form-w3-agile-text1 select,
.form-w3-agile-text2 input,
.form-w3-agile-text2 select {
    width: 100%;  /* 讓輸入框填滿可用空間 */
    min-width: 150px; /* 避免過小 */
    max-width: 100%; /* 讓它不超過父容器 */
    flex-grow: 1; /* 讓輸入框能夠隨著父容器變化 */
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.95);
    box-sizing: border-box; /* 確保 padding 不影響寬度 */
}
/* 取貨地點區塊 */

.pickup-location-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
}

/* 多個選項包裹容器 */
.pickup-options-wrapper {
    display: flex;
    flex-wrap: wrap; /* ✅ 關鍵：讓選項能自動換行 */
    justify-content: space-between;
    gap: 20px;
}

/* 每個取貨選項 - 在大螢幕一排最多兩個 */
.pickup-option {
    box-sizing: border-box;
    width: 100%;
    flex: 1 1 calc(50% - 10px); /* 每排最多兩個 */
    max-width: calc(50% - 10px);
    overflow: hidden; /* 防止內容撐爆 */
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    background: rgba(255, 255, 255, 0.95);

}




/* 內部內容排版 */
.pickup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 門市圖片（大螢幕較大，小螢幕自適應） */
.pickup-option img {
    width: 100%;           /* 填滿容器 */
    max-width: 250px;      /* 不超過 250px */
    height: auto;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    transition: width 0.3s ease-in-out;
}



/* 門市資訊 */
.pickup-info {
    display: flex;
    flex-direction: column;
    text-align: center;
}

/* 門市名稱 */
.store-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
}

/* 門市地址 */
.store-address {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

/* 取貨時間 */
.store-time {
    font-size: 14px;
    color: #444;
}

/* 當選擇時，讓外框變色，表示已選 */
.pickup-option input[type="radio"] {
    display: none;
}

.pickup-option input[type="radio"]:checked + .pickup-content img {
    border: 3px solid #ff6600;
}

.pickup-option input[type="radio"]:checked + .pickup-content .store-name {
    color: #ff6600;
}

/* 滑鼠懸停時，增加外框變化 */
.pickup-option:hover {
    border-color: #ff6600;
}

/* 🔹 響應式調整（當螢幕小於 768px 時變為上下排列 & 縮小圖片） */
@media (max-width: 768px) {
    .pickup-options-wrapper {
        flex-direction: column;
        align-items: center;
    }

    .pickup-option {
        width: 100%;
        max-width: 350px;
    }

    .pickup-option img {
        width: 150px;  /* 小螢幕圖片較小 */
    }
}

/* 🔹 讓取貨日期與取貨時間同行 */
.main-flex-w3ls-sectns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 15px;
}

/* 讓取貨日期與取貨時間各占 50% */
.form-w3-agile-text1, .form-w3-agile-text2 {
    flex: 1 1 48%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

/* 🔹 口味輸入區塊 - 預設單欄（手機版） */
.flavor-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* 🔹 讓每個口味輸入框靠左 */
.flavor-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

/* 🔹 標題靠左對齊 */
.flavor-item label {
    font-size: 14px;
    color: #444;
    font-weight: bold;
    min-width: 120px;
    text-align: left;
    margin-right: 10px;
}

/* 🔹 讓輸入框填滿剩餘空間 */
.flavor-item input {
    flex-grow: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.95);
    width: 100%;
    min-width: 50px;
}

/* 🔹 讓桌機版變成雙欄 */
@media (min-width: 768px) {
    .flavor-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
}

/* 🔹 讓 "草莓多多" 與上方保持間隔 */
.strawberry-duoduo {
    margin-top: 15px;
}

/* 🔹 讓 "草莓多多" 的輸入框可輸入文字 */
#qtyStrawberryDuoDuo {
    flex-grow: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.95);
    width: 100%;
    color: #333;
}

/* 🔹 讓提交按鈕靠左 */
input[type="submit"] {
    display: block;
    margin: 20px 0 20px 0;
    padding: 12px 20px;
    font-size: 18px;
    font-weight: bold;
    background-color: #ff6600;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

input[type="submit"]:hover {
    background-color: #e65c00;
}

/* 🔹 響應式設計（當螢幕小於 768px 時，維持單行顯示） */
@media (max-width: 768px) {
    .booking-form-w3layouts {
        width: 85%;
    }

    .main-flex-w3ls-sectns {
        flex-direction: column;
        align-items: flex-start;
    }

    .form-w3-agile-text1, .form-w3-agile-text2 {
        flex-basis: 100%;
        width: 100%;
    }

    .form-w3-agile-text1 input,
    .form-w3-agile-text2 input {
        width: 100%; /* 在小螢幕上填滿父容器 */
        min-width: 150px; /* 避免過小 */
    }
}

/* 響應式設計：當螢幕小於 768px 時，維持單列但按照指定順序排列 */
@media (max-width: 768px) {
    .flavor-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .total-summary {
        text-align: left;
        font-size: 18px;
        font-weight: bold;
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: left;
        padding: 10px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
}



/* 計算主要區塊 */
.total-row {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 25px;

}

/* 縮排的次要資訊 */
.total-sub {
    font-size: 20px;
    font-weight: normal;
    color: #666;
    margin-left: 20px;
    margin: 0;
    line-height: 1.4;
}

/* 當計算不符時的提示 */
.total-row.error-text {
    color: red;
    font-size: 20px;
    font-weight: bold;
}

/* 讓 "訂購單位" 說明字體較小 */
.input-description {
    font-size: 12px;
    color: #666;
    margin-top: 3px;
    display: block;
}

/* 讓 "請在各口味..." 字體大小與口味標籤一致 */
.flavor-description {
    font-size: 14px;
    font-weight: bold;
    color: #444;
    margin-bottom: 10px;
}

/* 讓「取貨地點」與其他標題一致 */
.pickup-location-container label {
    font-size: 16px;
    font-weight: bold;
    color: #444;
}
/* 讓 "取貨地點：" 與 "訂購人姓名：" 一致 */
.pickup-location-container p {
    font-size: 18px; /* 確保與其他標籤一致 */
    font-weight: bold;
    color: #444;
    margin-bottom: 10px;
}

/* 響應式設計：當螢幕小於 768px 時，維持單列但按照指定順序排列 */
@media (max-width: 768px) {
    .flavor-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    /* 設定排序順序 */
    .flavor-item:nth-child(1) { order: 1; }  /* 12元 - 多多 */
    .flavor-item:nth-child(3) { order: 2; }  /* 12元 - 葡萄 */
    .flavor-item:nth-child(5) { order: 3; }  /* 12元 - 荔枝 */
    .flavor-item:nth-child(7) { order: 4; }  /* 12元 - 百香果 */
    .flavor-item:nth-child(9) { order: 5; }  /* 12元 - 草莓 */
    .flavor-item:nth-child(2) { order: 6; }  /* 15元 - 蘋果 */
    .flavor-item:nth-child(4) { order: 7; }  /* 15元 - 鳳梨 */
    .flavor-item:nth-child(6) { order: 8; }  /* 15元 - 柳橙 */
    .flavor-item:nth-child(8) { order: 9; }  /* 15元 - 水蜜桃 */
    .flavor-item:nth-child(10) { order: 10; } /* 15元 - 芒果 */
}

/* 只放大訂購單標題 */
#main-title {
    font-size: 36px;  /* 放大字體 */
    font-weight: 900; /* 加粗 */
    text-align: left; /* 置中（可選） */
    color: #333; /* 保持原本顏色 */
    line-height: 1.5;
    margin-bottom: 25px;
}



@media (max-width: 768px) {
  .total-summary {
    font-size: 2px;
    display: block;
    padding: 5px;
    line-height: 1;
  }

  .total-row {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
  }

  .total-row strong {
    font-size: 18px;
  }

  .total-sub {
    font-size: 14px;
    margin-left: 1em;
  }

.total-row.error-text {
    font-size: 16px;
  }
}
@media (max-width: 768px) {
  .responsive-pickup-group {
    display: flex;
    flex-direction: column;
  }

  .pickup-date {
    order: 1;
  }

  .pickup-location {
    order: 2;
  }

  .pickup-time {
    order: 3;
  }
}
