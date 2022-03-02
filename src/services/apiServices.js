import axios from 'axios';

export const searchDestination = async () => {
  var options = {
    method: 'GET',
    url: 'https://hotels-com-provider.p.rapidapi.com/v1/destinations/search',
    params: { query: 'miami beach', currency: 'USD', locale: 'en_US' },
    headers: {
      'x-rapidapi-host': 'hotels-com-provider.p.rapidapi.com',
      'x-rapidapi-key': '941b34aaf0mshcb297e061f0c463p13bb36jsnf2f6388c3c1c',
    },
  };

  let results = [];

  await axios(options)
    .then(function (response) {
      try {
        if (response.data.suggestions[2].entities) {
          results = response.data.suggestions[2].entities;
        }
      } catch (e) {}
    })
    .catch(function (error) {
      //   console.error(error);
    });

  return results;
};
