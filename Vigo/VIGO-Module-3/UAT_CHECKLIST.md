# Module 3: Rider App UAT Checklist

## Authentication
- [ ] Rider can enter phone number and password on `/login`.
- [ ] System returns JWT token and stores it in `localStorage`.
- [ ] Unauthorized users are automatically redirected to `/login`.

## Dashboard & Order Assignment
- [ ] Active orders are dynamically fetched from `GET /orders/active` using the Bearer token.
- [ ] The dashboard displays real order IDs, fees, and customer names from `vgf_orders`.

## Status Updates
- [ ] Rider can update the status of an order via `PUT /orders/{id}/status`.
- [ ] Valid statuses restrict transitions to: `Assigned`, `ACCEPTED`, `PICKED_UP`, `DELIVERED`, `CANCELLED`.