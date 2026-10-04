import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // 10 virtual users
  duration: '30s', // run for 30 seconds
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

export default function () {
  const baseUrl = 'http://127.0.0.1:8000';

  // Test the reports summary endpoint
  const summaryRes = http.get(`${baseUrl}/reports-summary`);
  check(summaryRes, {
    'Summary status is 200': (r) => r.status === 200,
  });

  // Test the chart data endpoint
  const chartRes = http.get(`${baseUrl}/chart-data`);
  check(chartRes, {
    'Chart status is 200': (r) => r.status === 200,
  });

  sleep(1);
}