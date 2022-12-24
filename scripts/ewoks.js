import { check, sleep, group } from "k6";
import { Trend } from 'k6/metrics';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.3/index.js';


// trends to hold information about requests based on tags
const errors = new Trend('errors');

// session object
const session = new Httpx({
  baseURL: 'http://httpbin.test.k6.io',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 20000
});

function checkResponse(response, check, name) {
  if (!check) {
    // couldn't make point from sample: max key length exceeded: 519029 > 65535 - InfluxDB validation
    const responseBody = JSON.stringify(response.body).slice(0, 5000)
    const requestBody = JSON.stringify(response.request.body).slice(0, 500)
    errors.add(1, {
      name: name,
      error_code: response.error_code,
      response_headers: JSON.stringify(response.headers),
      response_cookies: JSON.stringify(response.cookies),
      response_status: response.status,
      response_body: responseBody,
      request_headers: JSON.stringify(response.request.headers),
      request_cookies: JSON.stringify(response.request.cookies),
      request_method: response.request.method,
      request_body: requestBody
    })
  }
}

export default function () {
  let name
  let response
  let status

  group('get 407 status', function() {
    name = '/status/<status>'
    response = session.get("/status/407", null, {
      tags: { name: name }
    });
    status = check(response, {
      'status is 407': (r) => r.status === 407
    })
    checkResponse(response, status, name)
  })
};
