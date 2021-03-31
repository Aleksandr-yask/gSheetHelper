let currentMenu = [];

window.onload = function () {
    const tmpBox = document.createElement('div');
    tmpBox.innerHTML = `
    <div aria-expanded="false" aria-haspopup="true" id="srchBtn"
     aria-label="Поиск" class="docs-sheet-menu-button goog-inline-block docs-sheet-all docs-sheet-button" data-search="true" data-tooltip="Поиск по таблицам"
     role="button" style="user-select: none;" tabindex="0">
    <div class="goog-inline-block searchDownBtn" style="user-select: none;">
        <div class="goog-inline-block" style="user-select: none;">
            <div class="goog-inline-block docs-icon " style="user-select: none;">
            <svg id="btnSearchSvg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
\t viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve">
<path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23
\ts10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92
\tc0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17
\ts-17-7.626-17-17S14.61,6,23.984,6z"/>
</svg>
</div>
        </div>
    </div>
</div>
    `;
    const searchBtn = tmpBox.querySelector('#srchBtn');

    const parent = document.querySelector('.docs-sheet-add').parentElement;
    parent.appendChild(searchBtn);
    searchBtn.addEventListener('click', () => {
        const specifiedElement = document.getElementById('srchBoxDiv');
        if (!specifiedElement) {
            openSearchMenu();
        }
    });

    document.querySelector('.docs-sheet-all').dataset.search = "false";
    document.querySelector('.docs-sheet-all').addEventListener('click', function () {
        const search = document.querySelector('#srchBoxDiv');
        if (document.querySelector('.docs-sheet-all').dataset.search !== "true"
            && search) {
            document.querySelector('.docs-sheet-all').dataset.search = "true";
            const searchDev = document.createElement('div');
            searchDev.innerHTML = `
<table cellpadding="0" cellspacing="0" class="docs-findinput-container">
    <tbody>
        <tr>
            <td class="docs-findinput-input-container">
                <input id="sheetSearch" aria-label="Найти" autocomplete="off"
                       class="docs-findinput-input"
                       placeholder="Найти" spellcheck="false"
                       type="text">
            </td>
        </tr>
    </tbody>
</table>`;
            searchDev.className = 'search-sheet-input';
            search.appendChild(searchDev);
        }
    })
}

function closeSearchMenu() {
    document.getElementById('srchBoxDiv').remove();
}

function openSearchMenu() {
    currentMenu = [];
    const sheets = document.querySelectorAll('.docs-sheet-container-bar > div');
    let sheetsHtml = '';
    sheets.forEach(function (sheet) {
        if (sheet.querySelector('.docs-sheet-tab-name')) {
            sheetsHtml += `
        <div data-id="${sheet.id}" id="search_item_${sheet.id}" class="goog-menuitem sheetSearchItem" role="menuitem" style="user-select: none;">
            <div class="goog-menuitem-content">
                <div class="docs-sheet-all-sheet-menu-item-swatch" style="background: transparent;"></div>
                ${sheet.querySelector('.docs-sheet-tab-name').innerText}
            </div>
        </div>
        `;
            currentMenu.push({
                "name": sheet.querySelector('.docs-sheet-tab-name').innerText.toLocaleLowerCase(),
                "id": "search_item_" + sheet.id
            })
        }
    })

    const tmpBox = document.createElement('div');
    tmpBox.innerHTML = `
        <div id="srchBoxDiv" aria-haspopup="true" class="goog-menu goog-menu-vertical goog-menu-noaccel docs-menu-hide-mnemonics" role="menu" style="user-select: none; height: 20em; overflow: auto; visibility: visible; display: none;">
        <div style="    margin-left: 15px;
    position: relative;
    margin-right: 15px;">
            <div class="search-sheet-input">
                    <table cellpadding="0" cellspacing="0" class="docs-findinput-container">
                        <tbody>
                        <tr>
                            <td class="docs-findinput-input-container">
                                <input aria-label="Найти" autocomplete="off" class="docs-findinput-input" id="sheetSearch"
                                       placeholder="Найти" spellcheck="false" type="text">
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
        </div>
        <div style="position: relative">
            ${sheetsHtml}
        </div>
    
</div>`;
    const searchBox = tmpBox.querySelector('#srchBoxDiv');
    setTimeout(function () {
        document.querySelector('body').appendChild(searchBox);

        document.getElementById('srchBoxDiv').style.display = 'block';
        document.querySelector('#sheetSearch').focus();

        document.querySelector('#sheetSearch').addEventListener('keyup', function (e) {
            const value = this.value.trim().toLocaleLowerCase();
            if (value !== '') {
                currentMenu.forEach((item) => {
                    const foundPos = item.name.search(value);
                    if (foundPos === -1) {
                        document.getElementById(item.id).style.display = 'none';
                    } else {
                        document.getElementById(item.id).style.display = 'block';
                    }
                })
            } else {
                currentMenu.forEach((item) => {
                    document.getElementById(item.id).style.display = 'block';
                })
            }
        })

        const items = document.querySelectorAll('.sheetSearchItem');
        items.forEach(function (item) {
            item.addEventListener('click', function () {
                triggerMouseEvent(document.getElementById(item.dataset.id), "mousedown");
                triggerMouseEvent(document.getElementById(item.dataset.id), "mouseup");
                closeSearchMenu();
            })
        })
    }, 0)
}

function triggerMouseEvent(node, eventType) {
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
}

document.addEventListener('click', function (event) {
    const specifiedElement = document.getElementById('srchBoxDiv');
    if (specifiedElement) {
        const isClickInside = specifiedElement.contains(event.target);

        if (!isClickInside) {
            closeSearchMenu();
        }
    }
});

let dblClickShift = 0;
document.addEventListener('keyup', (event) => {
    const specifiedElement = document.getElementById('srchBoxDiv');
    if (event.code === 'Escape' && specifiedElement) {
        closeSearchMenu();
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        if (dblClickShift === 1) {
            if (!specifiedElement) {
                openSearchMenu();
                dblClickShift = 0;
            }
        } else {
            setTimeout(function () {
                dblClickShift = 0;
            }, 500)
        }
        dblClickShift = 1;
    }
})