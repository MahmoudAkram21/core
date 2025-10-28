// Install Axios: npm install axios

import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://192.168.1.66:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
})