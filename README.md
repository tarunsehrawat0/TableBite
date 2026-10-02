# TableBite

TableBite is a QR table-ordering capstone: a customer scans a table code, browses the menu, builds a cart, chooses a simulated payment method, and follows the kitchen status live. The kitchen page advances orders from `confirmed` to `received`, `preparing`, and `ready`.

## 1. Local prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (optional, for the full stack)

SQLite is embedded in the API, so PostgreSQL is not required. The database file is controlled by `DB_PATH` and defaults to an in-memory database for tests.

## 2. Run the backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm test
npm start
```

The API is available at `http://localhost:3000`. Check `GET /health` and `GET /api/menu`.

## 3. Generate table QR codes

```powershell
cd backend
npm run generate:qrs
```

This creates QR images for tables 1-10 in `frontend/qr-codes/`. For phones on the same Wi-Fi, generate with your computer's LAN address:

```powershell
$env:QR_BASE_URL="http://192.168.31.46:8080"
npm run generate:qrs
docker compose up --build -d frontend
```

Replace `192.168.31.46` with the host address on the restaurant Wi-Fi. A phone cannot use `localhost`; it must use a reachable LAN or deployed HTTPS address.

## 4. Run the frontend

```powershell
docker compose up --build
```

Open `http://localhost:8080/?table=7` for the customer flow and `http://localhost:8080/kitchen.html` for the kitchen dashboard. The default local admin key is `dev-admin-key`; set `ADMIN_KEY` before `docker compose up` for a real deployment.

## 5. API contract

- `GET /health`
- `GET /api/menu`
- `POST /api/orders` with `table_no`, `items`, `total`, and `payment_method`
- `GET /api/orders` for the kitchen queue
- `GET /api/orders/:id` for customer polling
- `PATCH /api/orders/:id/status` with `x-admin-key`
- `GET /metrics` for Prometheus

## 6. Containers and Kubernetes

```powershell
docker build -t YOUR_USER/tablebite-backend:latest backend
docker build -t YOUR_USER/tablebite-frontend:latest frontend
docker push YOUR_USER/tablebite-backend:latest
docker push YOUR_USER/tablebite-frontend:latest
kubectl create namespace tablebite
kubectl apply -f k8s/
```

The backend intentionally has one replica and `Recreate` strategy because SQLite is single-writer. The frontend uses two replicas and `RollingUpdate`, making rollout and rollback demonstrations safe on the stateless UI:

```powershell
kubectl rollout status deployment/tablebite-frontend -n tablebite
kubectl rollout undo deployment/tablebite-frontend -n tablebite
```

## 7. Jenkins and security

The `Jenkinsfile` runs npm tests with coverage, SonarQube, Docker builds, Trivy vulnerability scans, and Docker Hub pushes. Configure Jenkins credentials named `dockerhub-repository` and `dockerhub-credentials`, plus a SonarQube installation named `sonarqube`.

## 8. Infrastructure and Git exercises

- `ansible/`: prepares an Ubuntu host with Docker.
- `terraform/`: contains the AWS infrastructure entry point and EC2 module.
- `argocd/app.yaml`: points Argo CD at the `k8s/` manifests.
- `git-setup.sh`: creates the branch exercise and prints a reproducible merge-conflict exercise.

Never commit `backend/.env`, database files, credentials, or Terraform state.