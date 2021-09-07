window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const main = document.querySelector('.main'),
        selectCities = document.getElementById('select-cities'),
        closeButton = document.querySelector('.close-button'),
        dropdownListsListDefault = document.querySelector('.dropdown-lists__list--default'),
        dropdownListsListSelect = document.querySelector('.dropdown-lists__list--select'),
        dropdownListsListAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
        button = document.querySelector('.button'),
        inputCities = document.querySelector('.input-cities'),
        label = document.querySelector('.label');

        button.style.pointerEvents = 'none';
        dropdownListsListDefault.style.display = 'none';

    let cookieLocation;
    const takeLocation = () => {
        cookieLocation = document.cookie.slice(9, );

        if (!cookieLocation) {
            localStorage.clear();
            const promt = prompt('Ввидите локаль - RU EN DE');
            document.cookie = `locatoin=${promt}`;
        }

        cookieLocation = document.cookie.slice(9, );
    };

    takeLocation();

    
    const spiner = () => {
        inputCities.style.display = 'none';
        const style = document.createElement('style');
        style.innerHTML = `
                body {
                min-height: 100vh;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                align-content: space-around;
                }
                section {
                flex: 1 1 25%;  
                }
                .spiner {
                    top: 40vh;
                    position: absolute;
                }
                .sk-rotating-plane {
                width: 4em;
                height: 4em;
                margin: auto;
                background-color:  #337ab7;
                animation: sk-rotating-plane 1.2s infinite ease-in-out;
                }
                @keyframes sk-rotating-plane {
                0% {
                    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
                }
                50% {
                    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
                }
                100% {
                    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
                }
                }
        `;
        document.head.append(style);
        const spinerDiv = document.createElement('div');
        spinerDiv.classList.add('spiner');
        spinerDiv.classList.add('sk-rotating-plane');
        document.body.prepend(spinerDiv);
    };
    

    const getDataResponse = () => {
            return fetch(`./db_cities.json`);
    };

    const whatStatus = (response) => {
        if (response.status !== 200) {
            throw new Error('Network not connect');
        } else {
            return response.text();
        }
    };

    const getData = (response) => {
        inputCities.style.display = 'block';
        const spinerDiv = document.querySelector('.spiner');
        spinerDiv.parentNode.removeChild(spinerDiv);
        const data = JSON.parse(response);
        localStorage.setItem('data', JSON.stringify(data[cookieLocation]));

        return data[cookieLocation];
    };

    const creatList = (data, list, country) => {
        let obj = data;

        if (cookieLocation === 'RU') {
            obj.unshift(...obj.splice(0, 1));
        }
        if (cookieLocation === 'DE') {
            obj.unshift(...obj.splice(1, 1));
        }
        if (cookieLocation === 'EN') {
            obj.unshift(...obj.splice(2, 1));
        }


        if (country) {
            obj = obj.filter(elem => elem.country === country);
        }
        let selectList;
        if (list === 'default') {
            selectList = dropdownListsListDefault;
        }
        if (list === 'select') {
            selectList = dropdownListsListSelect;
        }

        const dropdownListsCol = selectList.querySelector('.dropdown-lists__col');

        const sort = (a, b) => +a.count < +b.count ? 1 : -1;

        for (let i = 0; i < obj.length; i++) {
            const countryBlock = document.createElement('div');
            countryBlock.classList.add('dropdown-lists__countryBlock');
            dropdownListsCol.append(countryBlock);
            const countryBlockTotalLine = document.createElement('div');
            countryBlockTotalLine.classList.add('dropdown-lists__total-line');
            countryBlockTotalLine.innerHTML = `
                <div class="dropdown-lists__country">${obj[i].country}</div>
                <div class="dropdown-lists__count">${obj[i].count}</div>
            `;
            countryBlock.append(countryBlockTotalLine);
            // const objSity = obj[i].cities.sort(sort);
            for (let j = 0; j < obj[i].cities.length; j++) {
                const cityBlock = document.createElement('div');
                cityBlock.classList.add('dropdown-lists__line');
                cityBlock.innerHTML = `
                    <div class="dropdown-lists__city">${obj[i].cities[j].name}</div>
                    <div class="dropdown-lists__count">${obj[i].cities[j].count}</div>
                `;
                countryBlock.append(cityBlock);
                if (list === 'default' && j === 2) {
                    break;
                }
            }
        }
    };

    const dropdownAuto = (data, elem) => {
        const dropdownListsCol = dropdownListsListAutocomplete.querySelector('.dropdown-lists__col');
        dropdownListsCol.innerHTML = '';
        let regExp = new RegExp(`^${elem}.*`, 'i');
        let flag = true;
        for (let i =0; i < data.length; i++) {
            for (let j = 0; j < data[i].cities.length; j++) {
                if (regExp.test(data[i].cities[j].name)) {
                    flag = false;
                    const cityBlock = document.createElement('div');
                    let string = data[i].cities[j].name;
                    let stringLength = elem.length;
                    string = string.slice(0, stringLength).bold() + string.slice(stringLength, );
                    cityBlock.classList.add('dropdown-lists__line');
                    cityBlock.innerHTML = `
                        <div class="dropdown-lists__city">${string}</div>
                        <div class="dropdown-lists__count">${data[i].cities[j].count}</div>
                    `;
                    dropdownListsCol.append(cityBlock);
                } 
            }
        }
        if (flag) {
            const cityBlock = document.createElement('div');
            cityBlock.classList.add('dropdown-lists__line');
            cityBlock.innerHTML = `
                <div class="dropdown-lists__city">Ничего не найдено</div>
            `;
            dropdownListsCol.append(cityBlock);
        }
    };

    const listAnimationLeft = () => {
        let count = 0;
        const dropdown = document.querySelector('.dropdown');
        dropdown.style.position = 'relative';
        dropdownListsListSelect.style.display = 'block';
        dropdownListsListSelect.style.transform = 'translateX(200px)'
        const interval = setInterval(() => {
            count += 10;
            dropdownListsListDefault.style.transform = `translateX(-${count}px)`;
            dropdownListsListSelect.style.transform = `translateX(${400 - count}px)`;
            if (count === 400) {
                dropdownListsListDefault.style.display = 'none';
                dropdownListsListDefault.style.transform = `translateX(0px)`;
                clearInterval(interval);
            }
        }, 10)
    };

    const listAnimationRight = () => {
        let count = 0;
        const dropdown = document.querySelector('.dropdown');
        dropdown.style.position = 'relative';
        button.style.pointerEvents = 'none';
        dropdownListsListDefault.style.display = 'block';
        dropdownListsListDefault.style.transform = 'translateX(-400px)'
        const interval = setInterval(() => {
            count += 10;
            dropdownListsListSelect.style.transform = `translateX(${count}px)`;
            dropdownListsListDefault.style.transform = `translateX(-${400 - count}px)`;
            if (count === 400) {
                dropdownListsListSelect.style.display = 'none';
                clearInterval(interval);
            }
        }, 10)
    };

    const listHandler = (data) => {

        const dropdownListsCol = dropdownListsListSelect.querySelector('.dropdown-lists__col');

        creatList(data, 'default');
        main.addEventListener('click', (event) => {

            let target = event.target;
            
            if (target.id === 'select-cities') {
                dropdownListsListDefault.style.display = 'block';
                if (dropdownListsListSelect.style.display === 'block') {
                    dropdownListsListDefault.style.display = 'none';
                    dropdownListsListAutocomplete.style.display = 'none';
                }
            }
            if (target === closeButton) {
                dropdownListsListDefault.style.display = 'none';
                dropdownListsListSelect.style.display = 'none';
                dropdownListsListAutocomplete.style.display = 'none';
                dropdownListsCol.innerHTML = '';
                selectCities.value = '';
                label.style.display = 'block';
                closeButton.style.display = 'none';
                button.style.pointerEvents = 'none';
            }
            if (target.classList.contains('dropdown-lists__total-line') || 
            target.parentNode.classList.contains('dropdown-lists__total-line')) {

                if (dropdownListsListDefault.style.display === 'none') {
                    listAnimationRight();
                    dropdownListsListAutocomplete.style.display = 'none';
                    dropdownListsCol.innerHTML = '';
                } else {
                    listAnimationLeft();
                    creatList(data, 'select', 
                    target.children[0] ? target.children[0].textContent : target.textContent); 
                }
            }
            if (target.classList.contains('dropdown-lists__line') || 
            target.parentNode.classList.contains('dropdown-lists__line') ||
            target.classList.contains('dropdown-lists__total-line') || 
            target.parentNode.classList.contains('dropdown-lists__total-line')) {
                selectCities.value = '';
                if (target.parentNode.classList.contains('dropdown-lists__line') ||
                target.parentNode.classList.contains('dropdown-lists__total-line')) {
                    selectCities.value = target.parentNode.children[0].textContent;
                    if (target.parentNode.classList.contains('dropdown-lists__line')) {
                        for (let i =0; i < data.length; i++) {
                            for (let j = 0; j < data[i].cities.length; j++) {
                                if (data[i].cities[j].name === selectCities.value) {
                                    button.href = data[i].cities[j].link;
                                    button.style.pointerEvents = 'auto';
                                }
                            }
                        }
                    }
                }
                if (target.classList.contains('dropdown-lists__line') ||
                target.classList.contains('dropdown-lists__total-line')) {
                    selectCities.value = target.children[0].textContent;
                    if (target.classList.contains('dropdown-lists__line')) {
                        for (let i =0; i < data.length; i++) {
                            for (let j = 0; j < data[i].cities.length; j++) {
                                if (data[i].cities[j].name === selectCities.value) {
                                    button.href = data[i].cities[j].link;
                                    button.style.pointerEvents = 'auto';
                                }
                            }
                        }
                    }
                }
                closeButton.style.display = 'block';
                label.style.display = 'none';
            }
        });

        selectCities.addEventListener('input', (event) => {
            dropdownListsListDefault.style.display = 'none';
            dropdownListsListSelect.style.display = 'none';
            dropdownListsCol.innerHTML = '';
            dropdownListsListAutocomplete.style.display = 'block'; 
            dropdownAuto(data, event.target.value);
            if (event.target.value === '') {
                dropdownListsListAutocomplete.style.display = 'none'; 
                dropdownListsListDefault.style.display = 'block';
                button.style.pointerEvents = 'none';
            }
        });
    };

    let dataStorage = JSON.parse(localStorage.getItem('data'));

    if (dataStorage) {
        listHandler(dataStorage);
    } else {
        spiner();
        getDataResponse()
            .then(whatStatus)
            .then(getData)
            .then(listHandler)
            .catch((error => console.warn(error)));
    }

    
});