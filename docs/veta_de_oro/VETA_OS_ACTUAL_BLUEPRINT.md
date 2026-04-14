# VETA OS MASTER BLUEPRINT (v3.0) — CONSTITUCIÓN INDRA

Este documento es la Única Fuente de Verdad (SSOT) para el sistema Veta de Oro. Todo desarrollo debe cumplir con las leyes aquí descritas bajo pena de inconsistencia técnica.

---

## 🏛️ REGLA I: LA ANTIGRAVEDAD (3 CAPAS)
El sistema está dividido en tres reinos soberanos e independientes:
1.  **LA MATERIA (Raw Data):** Reside en Silos físicos (Google Sheets vía Indra Core).
2.  **EL ESPÍRITU (Lógica):** Definida en Bridges y Esquemas. El frontend NO calcula lógica de negocio pesada.
3.  **LA FORMA (Satélites):** El ERP y la Web son Caparazones Vacíos que resuenan con el esquema.

## 🔗 REGLA II: SINCERIDAD DE IDENTIDAD
- Los IDs de los recursos provienen de la Forja (Indra).
- Se programa contra **Aliases** de esquemas, permitiendo la migración de bases de datos sin tocar código UI.

## ⚡ REGLA III: CERO-HARDCODING
- La `CORE_URL` se descubre mediante Handshake.
- Los tokens se gestionan vía Keychain.
- Toda configuración de entorno debe ser inyectada, nunca escrita en piedra.

---

## 🛰️ PROTOCOLO DE TRANSMISIÓN (IndraBridge v1.5)
Se ha implementado el **SDK oficial de Indra** para toda comunicación:
- **Resiliencia:** Motor de reintentos automático con espera exponencial.
- **Concurrencia:** Semáforo de 5 hilos para evitar bloqueos en Google Apps Script.
- **Bypass CORS:** Uso mandatorio de `text/plain` para transmisiones soberanas.

## 🛠️ FLUJO DE TRABAJO PARA AGENTES
1.  **DEFINICIÓN:** Crea el esquema en `03-system-infra/core/schemas/`.
2.  **IMPRESIÓN:** Sincroniza el ADN en la Torre de Control (Veta.OS Infra).
3.  **IGNICIÓN:** Crea el Silo físico en Indra (Google Drive).
4.  **HIDRATACIÓN:** Usa los `data-indra-slot` en el Satélite para proyectar la materia.

**"Un Satélite no programa sus datos, solo los proyecta."**
