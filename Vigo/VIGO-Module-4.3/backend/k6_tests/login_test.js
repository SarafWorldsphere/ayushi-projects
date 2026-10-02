import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 1,          // 1 virtual user
    iterations: 1,   // Runs the test once
};

export default function () {
    const url = 'http://127.0.0.1:8001/customers/login';
    
    const payload = JSON.stringify({
        email: "testuser@example.com",
        phone: "+919876543210"
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
    });

    sleep(1);
}