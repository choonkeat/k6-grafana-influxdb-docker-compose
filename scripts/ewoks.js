import http from 'k6/http';
import { check, sleep } from "k6";
import { Trend } from 'k6/metrics';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.3/index.js';


// trends to hold information about requests based on tags
const errors = new Trend('errors');
const httpRequests = new Trend('httpRequests')

// standard options
export let options = {
  stages: [
      { duration: "5s", target: 1 },
      // { duration: "10s", target: 5 },
      // { duration: "5s", target: 0 }
  ]
};

// user session (Http Request Defaults)
const session = new Httpx({
  baseURL: 'https://test-api.k6.io',
  headers: {
    'User-Agent': 'My custom user agent',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 20000
});

function checkResponse(resp, check, endpoint) {
  resp.body = 'ds'
  console.log(resp)
  if (!check) {
    // couldn't make point from sample: max key length exceeded: 519029 > 65535 - InfluxDB validation
    const respBody = JSON.stringify(resp.body).slice(0, 5000)
    errors.add(1, {
      endpoint: endpoint,
      status: resp.status,
      error_code: resp.error_code,
      body: respBody
    })
    httpRequests.add(1, {
      endpoint: endpoint,
    })
  } else {
    httpRequests.add(1, {
      endpoint: endpoint,
    })
  }
}

export default function () {
  
  const resp = session.get("/", null, {
    tags: { endpoint: '/test2' }
  });
  const status = check(resp, {
    'status is 2001': (r) => r.status === 201
  })
  checkResponse(resp, status, '/test')
  sleep(0.2)
};
