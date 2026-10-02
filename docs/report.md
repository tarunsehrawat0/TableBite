# TableBite capstone report

## Objective

Provide a low-friction restaurant ordering flow that starts at a table QR code and ends with a visible kitchen status.

## Implementation

- Vanilla HTML, CSS, and JavaScript keep the customer UI portable and easy to serve.
- Express exposes menu, order, status, health, and Prometheus metrics endpoints.
- better-sqlite3 keeps local development free of a separate database service.
- Jest and Supertest cover health, menu, order creation, and admin authorization.
- Docker Compose runs the API with a persistent SQLite volume and nginx frontend.
- Kubernetes uses one Recreate backend replica and a rolling frontend deployment.

## Operational demonstrations

1. Run `npm test` before building images.
2. Generate ten table QR codes with `npm run generate:qrs`.
3. Use `kubectl rollout status` and `kubectl rollout undo` on the frontend deployment.
4. Run `kubectl logs` against the backend and inspect `/metrics` for order volume.
5. Use the Jenkinsfile to test, scan, build, and publish versioned images.

## Security notes

The admin key is read from an environment variable and is never committed. Production deployments should replace the example Kubernetes secret, restrict ingress to trusted networks, use TLS, and use a managed database if the API must scale beyond one writer.
