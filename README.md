# Sistema Help Desk de TI

Sistema web integral de mesa de ayuda (**Help Desk**) diseñado para la gestión de incidencias técnicas en 
el departamento de TI. La plataforma facilita la creación de tickets, asignación de agentes técnicos, seguimiento de estados
en tiempo real, gestión de inventario de repuestos y cierre automatizado con encuestas de satisfacción.

---

Funcionalidades Principales

* **Gestión de Tickets y Casos:** Creación de solicitudes con niveles de prioridad (Alta, Media, Baja), tipificación de incidencias y estado del ticket en tiempo real.
* **Asignación y Seguimiento:** Asignación de técnicos/agentes a los casos reportados con registro en un historial de cambios.
* **Control de Usuarios y Empleados:** Gestión de personal clasificado por departamento, puesto y roles (`USUARIO`, `AGENTE`, `SUPERVISOR`, `ADMIN`).
* **Inventario y Solicitud de Repuestos:** Registro de repuestos (stock, precio) asociados a la resolución de los tickets.
* **Automatización por Triggers:**
  * Cálculo automático de la fecha de cierre y tiempo total de resolución al marcar un ticket como `Cerrado`.
  * Actualización en cascada del estado actual del caso según la última interacción en el historial.
* **Módulo de Calidad:** Encuestas de satisfacción post-resolución y centro de notificaciones internas.

---

Arquitectura y Tecnologías

El proyecto utiliza una arquitectura de 3 capas claramente dividida en la estructura del repositorio:

* **Base de Datos (DB):** Oracle Database / PL-SQL (Tablas, Triggers y Scripts de datos).
* **Backend:** Node.js, Express.js y Sequelize ORM (JavaScript ES6).
* **Frontend:** React, TypeScript, Vite y CSS3.

---
