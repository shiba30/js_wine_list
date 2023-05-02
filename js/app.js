document.addEventListener("DOMContentLoaded", function () {
    const wineTypes = document.querySelectorAll('input[name="wine-type"]');
    const wineList = document.getElementById("wine-list");

    const getWineInfo = async (wineTypes) => {
        try {
            const res = await fetch(`https://api.sampleapis.com/wines/${wineTypes}`);
            if (!res.ok) {
                // 200以外ある
                throw new Error(res.statusText);
            }
            return res.json();
        } catch (error) {
            console.log(error);
        }
    }

    const loadWine = async () => {
        const checkedWineTypes = document.querySelector('input[name="wine-type"]:checked').value;
        const label = document.querySelector('label[for="label"]');
        label.textContent = `【SELECT ${checkedWineTypes.toUpperCase()}】`
        const loading = document.getElementById("loading");
        loading.innerHTML = `
                <div style="border-top-color: transparent" class="animate-spin h-56 w-56 border-4 border-blue-500 rounded-full"></div>
            `;
        wineList.innerHTML = '';  // ラジオボタン更新によってwineListを初期化する
        const wineInfoList = await getWineInfo(checkedWineTypes);
        displayWine(wineInfoList);
        loading.innerHTML = '';  // ローディング画面を非表示
    }

    const displayWine = async (wineInfoList) => {
        for (const wineInfo of wineInfoList) {
            // display star
            let ratingAverage = '';
            for (let i = 1; i <= parseInt(wineInfo.rating.average, 10); i++) {
                ratingAverage += '⭐️'
            }
            const wineItem = document.createElement('div');
            wineItem.className = 'wine-item';
            wineItem.style.width = 'calc(33% - 10px)';
            wineItem.innerHTML = `
                    <ul class="flex mb-6 flex-col text-xs">
                        <li class="mb-6 mr-4 w-20"><img src="${wineInfo.image}" class="h-36" onerror="this.onerror=null; this.src='image/noimage.png';"</li>
                        <li>
                            <ul>
                                <li>【Name】<br> ${wineInfo.wine}</li>
                                <li>【Winery】<br> ${wineInfo.winery}</li>
                                <li>【Location】<br> ${wineInfo.location}</li>
                                <li>【Star】 ${ratingAverage}</li>
                                <li>【Reviews】 ${(wineInfo.rating.reviews).split(' ')[0]}</li>
                            </ul>
                        </li>
                    </ul>
                `;
            wineList.appendChild(wineItem)
        }
    }

    wineTypes.forEach((radio) => {
        // ラジオボタンの更新処理
        radio.addEventListener('change', () => {
            loadWine();
        });
    });

    // 初回処理
    loadWine();
});
