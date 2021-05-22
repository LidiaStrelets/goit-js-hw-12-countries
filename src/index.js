import debounce from 'lodash.debounce';
import './sass/main.scss';
import fetchCountries from './js/fetchCountries.js';
import listTpl from './templates/countries-list.hbs';
import countryTpl from './templates/specificCountry.hbs';

const refs = {
  input: document.querySelector('#filter'),
  form: document.querySelector('.js-form'),
  container: document.querySelector('.js-container'),
};
let markUp = null;
refs.input.addEventListener('input', debounce(handleInput, 500));

function handleInput(event) {
  const query = event.target.value;

  fetchCountries(query)
    .then(data => {
      if (data.length > 10) {
        alert('Too many matches found! Please, enter a more specific query!');
      } else if (2 <= data.length && data.length <= 10) {
        markUp = listTpl(data);
        refs.container.innerHTML = markUp;
      } else {
        markUp = countryTpl(...data);
        refs.container.innerHTML = markUp;
      }
    })
    .catch(error => {
      alert(error);
    })
    .finally(() => {
      refs.form.reset();
    });
}
