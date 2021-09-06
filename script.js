window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const main = document.querySelector('.main'),
        selectCities = document.getElementById('select-cities'),
        closeButton = document.querySelector('.close-button'),
        dropdownListsListDefault = document.querySelector('.dropdown-lists__list--default'),
        dropdownListsListSelect = document.querySelector('.dropdown-lists__list--select'),
        dropdownListsListAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
        button = document.querySelector('.button'),
        label = document.querySelector('.label');

        button.style.pointerEvents = 'none';
        dropdownListsListDefault.style.display = 'none';

    const getDataResponse = () => {
        return fetch('./db_cities.json');
    };

    const whatStatus = (response) => {
        if (response.status !== 200) {
            throw new Error('Network not connect');
        } else {
            return response.text();
        }
    };

    const getData = (response) => {
        const data = JSON.parse(response);
        return data;
    };

    const creatList = (data, lenguage, list, country) => {
        let obj = data[lenguage];
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
            const objSity = obj[i].cities.sort(sort);
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
                    cityBlock.classList.add('dropdown-lists__line');
                    cityBlock.innerHTML = `
                        <div class="dropdown-lists__city">${data[i].cities[j].name}</div>
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

    const listHandler = (data) => {

        const dropdownListsCol = dropdownListsListSelect.querySelector('.dropdown-lists__col');

        creatList(data, 'RU', 'default');
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
                    dropdownListsListDefault.style.display = 'block';
                    dropdownListsListSelect.style.display = 'none';
                    dropdownListsListAutocomplete.style.display = 'none';
                    dropdownListsCol.innerHTML = '';
                } else {
                    dropdownListsListDefault.style.display = 'none';
                    creatList(data, 'RU', 'select', 
                    target.children[0] ? target.children[0].textContent : target.textContent);
                    dropdownListsListSelect.style.display = 'block';    
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
                        for (let i =0; i < data.RU.length; i++) {
                            for (let j = 0; j < data.RU[i].cities.length; j++) {
                                if (data.RU[i].cities[j].name === selectCities.value) {
                                    button.href = data.RU[i].cities[j].link;
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
                        for (let i =0; i < data.RU.length; i++) {
                            for (let j = 0; j < data.RU[i].cities.length; j++) {
                                if (data.RU[i].cities[j].name === selectCities.value) {
                                    button.href = data.RU[i].cities[j].link;
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
            dropdownAuto(data.RU, event.target.value);
            if (event.target.value === '') {
                dropdownListsListAutocomplete.style.display = 'none'; 
                dropdownListsListDefault.style.display = 'block';
                button.style.pointerEvents = 'none';
            }
        });
    };

    getDataResponse()
    .then(whatStatus)
    .then(getData)
    .then(listHandler)
    .catch((error => console.warn(error)));
});