const axios = require('axios');

const url = 'http://localhost:3000/identify';
const payload1 = {
  email: 'a@email.com',
  phoneNumber: '1',
};
const payload2 = {
  email: 'a@email.com',
  phoneNumber: '12',
};
const payload3 = {
  email: 'ab@email.com',
  phoneNumber: '12',
};
const payload4 = {
  email: 'abc@email.com',
  phoneNumber: '123',
};
const payload5 = {
  email: 'abcd@email.com',
  phoneNumber: '1234',
};
const payload6 = {
  email: 'abcd@email.com',
  phoneNumber: '123',
};
const payload7 = {
  email: 'abcd@email.com',
  phoneNumber: null,
};
const payload8 = {
  email: '',
  phoneNumber: '12',
};

const headers = {
  'Content-Type': 'application/json',
};

axios
  .post(url, payload1, { headers })
  .then((response) => {
    console.log(response.data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  })
  .then(() => axios.post(url, payload2, { headers }))
  .then((response) => {
    console.log(response.data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  })
  .then(() => axios.post(url, payload3, { headers }))
  .then((response) => {
    console.log(response.data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  })
  .then(() => axios.post(url, payload4, { headers }))
  .then((response) => {
    console.log(response.data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  })
  .then(() => axios.post(url, payload5, { headers }))
  .then((response) => {
    console.log(response.data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  })
  .then(() => axios.post(url, payload6, { headers }))
  .then((response) => {
    console.log(response.data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  })
  .then(() => axios.post(url, payload7, { headers }))
  .then((response) => {
    console.log(response.data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  })
  .then(() => axios.post(url, payload8, { headers }))
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error('An error occurred:', error.message);
  });