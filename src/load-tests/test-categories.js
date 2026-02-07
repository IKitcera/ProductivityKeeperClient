import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 1000 }, // Ramp up to 50 users
    { duration: '30s', target: 1200 }, // Stay at 100 users
    { duration: '1s', target: 0 }, // Ramp down
  ],
};

export default function () {
  const token1Request = http.post('http://localhost:65070/token?username=kitceraivanka@gmail.com&password=ik');
  let token = JSON.parse(token1Request.body)?.accessToken;
  let params = {
    headers: { Authorization: `Bearer ${token}` },
  };

  let res = http.get('http://localhost:65070/api/Category', params);
  check(res, {
    'Status is 200': (r) => r.status === 200,
    'Response is not empty': (r) => r.body.length > 0,
    'Response time < 5000ms': (r) => r.timings.duration < 5000,
  });

  sleep(Math.random() * 3);
}
