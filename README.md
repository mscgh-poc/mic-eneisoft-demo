# mic-eneisoft-demo

Microservicio de demo Node.js/Express para la ponencia ENEISOFT XVI - Pipeline DevSecOps.

## Arquitectura de pipeline

```
mic-eneisoft-demo (caller workflows)
  └── mscgh-poc/devsecops-templates (reusable workflows)
        └── mscgh-poc/github-actions (composite actions)
```

## Modelo de ramas

| Rama | Propósito | Despliegue |
|---|---|---|
| `feature/*` | Desarrollo de features | - |
| `develop` | Integración | dev (automático) |
| `main` | Producción | prod (manual approval) |

## Flujo

1. Developer crea `feature/xxx` desde `develop`
2. PR `feature/xxx` → `develop`: CI + GHAS analysis
3. Merge a `develop`: CI + Deploy a dev
4. PR `develop` → `main`: requiere aprobación de `approvers`
5. Merge a `main`: CI + Deploy a prod (con approval del environment)

## Desarrollo local

```bash
npm install
npm run dev    # Hot reload
npm test       # Tests
```
