let points = 0;

// 30 тестовых каналов
let channels = [
    { name: "crypto_news" }, { name: "tech_world" }, { name: "daily_quotes" },
    { name: "music_hits" }, { name: "movie_trailers" }, { name: "game_updates" },
    { name: "science_daily" }, { name: "fitness_tips" }, { name: "travel_world" },
    { name: "foodies" }, { name: "fashion_trends" }, { name: "art_gallery" },
    { name: "history_facts" }, { name: "tech_reviews" }, { name: "programming_tips" },
    { name: "daily_news" }, { name: "startup_news" }, { name: "marketing_hacks" },
    { name: "crypto_alerts" }, { name: "nature_photos" }, { name: "language_learning" },
    { name: "books_daily" }, { name: "life_hacks" }, { name: "tech_events" },
    { name: "sports_updates" }, { name: "fun_memes" }, { name: "pet_lovers" },
    { name: "design_inspo" }, { name: "AI_news" }, { name: "web_dev_tips" }
];

let subscribedChannels = [];
let openedChannels = new Set();

const pointsEl = document.getElementById("points");
const channelsEl = document.getElementById("channels");
const addBtn = document.getElementById("addBtn");
const findBtn = document.getElementById("findBtn");

const earnTab = document.getElementById("earnTab");
const shopTab = document.getElementById("shopTab");
const earnContainer = document.getElementById("earnContainer");
const shopContainer = document.getElementById("shopContainer");

// Обновление баланса с подсветкой
function updatePoints() {
    pointsEl.innerText = points + " pts";
    pointsEl.classList.add("highlight");
    setTimeout(() => pointsEl.classList.remove("highlight"), 300);

    if (points < 200) {
        addBtn.disabled = true;
        addBtn.classList.add("disabled");
        addBtn.innerText = "Add Channel (200 pts)";
    } else {
        addBtn.disabled = false;
        addBtn.classList.remove("disabled");
        addBtn.innerText = "Add Channel";
    }
}

// Render каналов
function renderChannels() {
    channelsEl.innerHTML = "";
    channels.forEach((c, i) => {
        let div = document.createElement("div");
        div.className = "channel";
        let doneDisabled = subscribedChannels.includes(c.name) ? "disabled" : "";
        div.innerHTML = `
            <div class="channel-name">@${c.name}</div>
            <div>
                <button class="subscribe" onclick="openChannel('${c.name}', ${i})">Open</button>
                <button class="subscribe ${doneDisabled}" onclick="subscribe(${i}, this)" ${doneDisabled}>Done</button>
            </div>
        `;
        channelsEl.appendChild(div);
    });
}

// Открытие канала
function openChannel(name, index) {
    window.open("https://t.me/" + name, "_blank");
    openedChannels.add(name);
    const channelDiv = channelsEl.children[index];
    const doneBtn = channelDiv.querySelectorAll("button.subscribe")[1];
    if (!subscribedChannels.includes(name)) doneBtn.classList.remove("disabled");
}

// Начисление очков за канал с анимацией
function subscribe(i, button) {
    const channelName = channels[i].name;
    if (subscribedChannels.includes(channelName)) return alert("❌ Already received points!");
    if (!openedChannels.has(channelName)) return alert("❌ Open the channel first!");

    points += 5;
    subscribedChannels.push(channelName);
    updatePoints();

    button.disabled = true;
    button.classList.add("disabled");

    // Плавающий +5
    const floating = document.createElement("div");
    floating.className = "floating-points";
    floating.innerText = "+5";
    const rect = button.getBoundingClientRect();
    floating.style.left = rect.left + window.scrollX + "px";
    floating.style.top = rect.top + window.scrollY - 20 + "px";
    document.body.appendChild(floating);
    setTimeout(() => document.body.removeChild(floating), 1000);
}

// Find / Add
findBtn.onclick = () => renderChannels();
addBtn.onclick = () => {
    if (points < 200) return alert("❌ Need 200 pts to add channel!");
    let name = prompt("Enter channel username without @");
    if (!name) return;
    channels.push({ name });
    points -= 200;
    updatePoints();
    alert("✅ Channel added! 200 pts deducted.");
    renderChannels();
};

// Вкладки Earn / Shop
earnTab.onclick = () => {
    earnTab.classList.add("active");
    shopTab.classList.remove("active");
    earnContainer.style.display = "block";
    shopContainer.style.display = "none";
};
shopTab.onclick = () => {
    shopTab.classList.add("active");
    earnTab.classList.remove("active");
    shopContainer.style.display = "flex";
    earnContainer.style.display = "none";
};

// Магазин - покупка очков с анимацией
document.querySelectorAll(".shop-card").forEach(card => {
    const btn = card.querySelector(".buy-btn");
    btn.onclick = () => {
        let pts = parseInt(card.dataset.points);
        points += pts;
        updatePoints();

        // Анимация карточки
        card.classList.add("active");
        setTimeout(() => card.classList.remove("active"), 200);

        // Плавающий индикатор
        const floating = document.createElement("div");
        floating.className = "floating-points";
        floating.innerText = `+${pts}`;
        const rect = btn.getBoundingClientRect();
        floating.style.left = rect.left + window.scrollX + "px";
        floating.style.top = rect.top + window.scrollY - 20 + "px";
        document.body.appendChild(floating);
        setTimeout(() => document.body.removeChild(floating), 1000);

        // alert можно оставить или убрать
        // alert(`✅ You bought ${pts} points!`);
    };
});

// Инициализация
updatePoints();