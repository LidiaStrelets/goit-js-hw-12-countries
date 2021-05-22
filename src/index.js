import debounce from 'lodash.debounce';
import './sass/main.scss';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import fetchCountries from './js/fetchCountries.js';
import listTpl from './templates/countries-list.hbs';
import countryTpl from './templates/specificCountry.hbs';

const { error } = require('@pnotify/core');
const { defaults } = require('@pnotify/core');

defaults.type = 'error';
defaults.sticker = false;
defaults.delay = 3000;

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
        const tooManyMatches = error({
          text: 'Too many matches found! Please, enter a more specific query!',
        });
      } else if (2 <= data.length && data.length <= 10) {
        markUp = listTpl(data);
        refs.container.innerHTML = markUp;
      } else {
        markUp = countryTpl(...data);
        refs.container.innerHTML = markUp;
      }
    })
    .catch(e => {
      const tooManyMatches = error({
        text: 'Please, enter the correct country name!',
      });
    })
    .finally(() => {
      refs.form.reset();
    });
}
