# CineMatch — Panel de administración (Angular)

Frontend del **módulo administrativo** de CineMatch, *"Encuentra tu función ideal"*: gestión de películas, cines (con sus salas) y funciones de los cines de Ibagué (Cinemark, Cine Colombia y Royal Films).

Es una aplicación independiente del portal de clientes (React). Consume la API REST del backend en Spring Boot.

## Arquitectura

| Componente | Tecnología | Puerto |
| --- | --- | --- |
| **Panel de administración (este repo)** | Angular | `4200` |
| Portal de clientes | React + Vite | `5173` |
| Backend principal | Java + Spring Boot | `8081` |
| Microservicio de pagos | Python + Django | `8000` |

## Requisitos

* Node.js LTS (22 o 24)
* Angular CLI: `npm install -g @angular/cli`
* Backend Spring Boot corriendo en `http://127.0.0.1:8081`, con CORS habilitado para `http://localhost:4200`

## Ejecutar

```bash
npm install
ng serve
```

Abre `http://localhost:4200`. La URL del backend se configura en `src/environments/environment.development.ts` (desarrollo) y `src/environments/environment.ts` (producción).

Otros comandos:

```bash
ng test         # pruebas unitarias
ng build        # compilación de producción en dist/
```

## Funcionalidades

* **Inicio de sesión** de administrador, con rutas del panel protegidas por un *guard*.
* **Películas:** listar, crear, editar y eliminar.
* **Cines:** listar, crear, editar y eliminar, con administración de sus salas (2D, 3D, VIP).
* **Funciones:** listar, crear, editar y cancelar. El formato sale de la sala elegida y la hora de fin se calcula (inicio + duración de la película + 15 min de anuncios).
* **Mi perfil:** actualizar el nombre y la contraseña.

## Endpoints que consume

| Módulo | Método | Endpoint |
| --- | --- | --- |
| Auth | `POST` | `/api/auth/login` |
| Auth | `PUT` | `/api/auth/perfil` |
| Películas | `GET` `POST` | `/api/peliculas` |
| Películas | `PUT` `DELETE` | `/api/peliculas/{id}` |
| Cines | `GET` `POST` | `/api/cines` |
| Cines | `PUT` `DELETE` | `/api/cines/{id}` |
| Funciones | `GET` `POST` | `/api/funciones` |
| Funciones | `PUT` `DELETE` | `/api/funciones/{id}` |

## Estructura

```text
src/app/
├── core/            Lo que usa toda la app, sin pantalla propia
│   ├── modelos/         Interfaces TypeScript (contrato con la API)
│   ├── servicios/       Acceso a la API y sesión
│   ├── interceptores/   Token y manejo de errores HTTP
│   └── guards/          Protección de rutas
├── shared/          Piezas reutilizables (banner, spinner, modal, pipes)
└── features/        Una carpeta por sección del panel
    ├── auth/  panel/  peliculas/  cines/  funciones/  perfil/
```

Cada *feature* se carga de forma diferida (*lazy loading*) y no depende de las demás, lo que facilita mantener el panel como una aplicación separada del portal de clientes.
