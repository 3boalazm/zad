# ZAD API Runtime Service

## Status

ZAD API is deployed as a persistent systemd service.

## Service

`zad-api.service`

## Runtime Path

`/opt/codeandcanvas/apps/zad/api`

## Source Path

`/opt/codeandcanvas/apps/zad/source/api`

## Internal API URL

`http://127.0.0.1:4010`

## API Prefix

`/api/v1`

## Current Runtime Version

- Version: `0.6.0`
- Sprint: `Z6`

## Health Checks

```bash
curl http://127.0.0.1:4010/health/live
curl http://127.0.0.1:4010/health/ready
curl http://127.0.0.1:4010/api/v1
```

Expected:

- `/health/live` returns `200`
- `/health/ready` returns `200` with `db: ok`
- `/api/v1` returns `sprint: Z6` and `version: 0.6.0`

## Service Commands

```bash
sudo systemctl status zad-api --no-pager -l
sudo systemctl restart zad-api
sudo journalctl -u zad-api -n 100 --no-pager
```

## Systemd Configuration

Important values:

```text
WorkingDirectory=/opt/codeandcanvas/apps/zad/api
EnvironmentFile=/opt/codeandcanvas/apps/zad/api/.env
Environment=PORT=4010
ExecStart=/usr/bin/node dist/server.js
```

## Deployment Note

Source changes are committed under `/opt/codeandcanvas/apps/zad/source/api`.

Runtime is updated by syncing source API into `/opt/codeandcanvas/apps/zad/api` while preserving `.env`, `node_modules`, and runtime logs.
