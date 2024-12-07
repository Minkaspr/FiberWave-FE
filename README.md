# Fiberwave Frontend 🌐

Fiberwave es una aplicación diseñada para gestionar suscripciones de servicios de Internet. Este repositorio contiene la interfaz de usuario desarrollada con **Angular 18**, **TailwindCSS**, y componentes adicionales de **Flowbite** para un diseño moderno y responsive. También se utilizan herramientas como **ApexCharts** para la visualización de datos y un **DatePicker** para facilitar la selección de fechas.

---

## 🛠️ Funcionalidades Implementadas

### General
- **Landing Page**: 
  - Secciones informativas con navegación integrada hacia las interfaces de registro e inicio de sesión.
  - Diseño responsivo y atractivo utilizando **TailwindCSS** y **Flowbite**.

- **Autenticación**: 
  - Formularios de **inicio de sesión** y **registro** con validaciones en los campos.
  - Soporte para sesión persistente mediante **Refresh Tokens**, configurable con un checkbox que permite mantener activa la sesión incluso tras cerrar el navegador.

---

### Dashboard
El dashboard cuenta con dos secciones principales:

1. **Tablero de Control**:
   - Visualización rápida de datos mediante:
     - **Gráficos dinámicos** generados con **ApexCharts**.
     - **Tarjetas informativas** para estadísticas clave.

2. **Gestión de Usuarios**:
   - Tabla de usuarios registrados con las siguientes características:
     - Columnas: Nombre, Apellido, Correo, Rol, Estado, Fecha de Registro.
     - Funcionalidades:
       - **Búsqueda** por nombre, apellido o correo.
       - **Organización** de filas en orden ascendente/descendente por cualquier columna.
       - **Filtros** por rol y estado de la cuenta.
       - **Paginación** para manejar grandes volúmenes de datos.

   - **En desarrollo**:
     - Interacción con la API para:
       - Crear usuarios mediante un modal con un flujo por pasos.
       - Actualizar y eliminar usuarios desde la tabla.

3. **Perfil de Usuario**:
   - Visualización y edición de datos del usuario autenticado.
   - Función para cerrar sesión de forma segura.

---

## 🚀 Tecnologías Utilizadas

- **Framework**: Angular 18
- **Estilos**: TailwindCSS, Flowbite
- **Gráficos**: ApexCharts
- **Componentes adicionales**: DatePicker
- **Comunicación con la API**:
  - Servicios de Angular para manejar las solicitudes al backend.
  - Manejo de rutas para una navegación fluida entre las diferentes vistas.

---

## 📝 Próximas Mejoras

- [ ] Consumir los endpoints de la API para:
  - [ ] Actualizar usuarios.
  - [ ] Eliminar usuarios.
  - [ ] Crear nuevos usuarios (finalización del diseño de modal por pasos).

- [ ] Completar validaciones en modales para formularios de creación y edición.

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
1. Asegúrate de tener instalados:
   - [Node.js](https://nodejs.org/) (versión recomendada: 18 o superior).
   - [Angular CLI](https://angular.io/cli) (versión compatible con Angular 18).
2. Clona el repositorio en tu máquina local:
    ```bash
      https://github.com/Minkaspr/FiberWave-FE.git
    ```
3. Instala las dependencias del proyecto:
    ```bash
      npm install
    ```

### Configuración de Entornos

El proyecto utiliza dos configuraciones de entorno en el directorio `src/environments/` para separar los valores de desarrollo y producción:

1. **Archivo de desarrollo (`environment.development.ts`)**:
    ```typescript
    export const environment = {
      production: false,
      API_DOMAIN: 'http://localhost:3000',
      API_PREFIX: '/api'
    };
    ```

2. **Archivo de producción (`environment.ts`)**:
    ```typescript
    export const environment = {
      production: true,
      API_DOMAIN: '',
      API_PREFIX: ''
    };
    ```

### Levantar el Servidor de Desarrollo
Para iniciar el servidor de Angular, ejecuta el siguiente comando:
    ```bash
      ng serve -o
    ```
    Esto abrirá automáticamente la aplicación en tu navegador predeterminado en http://localhost:4200.

---

## 📚 Más Información

Para conocer más sobre el proyecto y su desarrollo, consulta la [documentación completa aquí](https://spiral-math-ce8.notion.site/FiberWave-11a5180ecce9809ab7b0c1f4b99123b8?pvs=73).

---

## 💻 Comandos Útiles
Angular CLI incluye comandos para generar componentes, directivas, servicios y más. Algunos ejemplos son:

### Generar un componente:
```bash
ng generate component nombre-del-componente
```
### Otros comandos disponibles:
- Directiva: `ng generate directive nombre-de-la-directiva`
- Pipe: `ng generate pipe nombre-del-pipe`
- Servicio: `ng generate service nombre-del-servicio`
- Clase: `ng generate class nombre-de-la-clase`
- Guardia: `ng generate guard nombre-de-la-guardia`
- Módulo: `ng generate module nombre-del-modulo`

  *`ng generate directive|pipe|service|class|guard|interface|enum|module`*

### Opciones adicionales:
- `--inline-template`: Permite incluir el código HTML del componente directamente en el archivo TypeScript del componente.

- `--inline-style`: Permite incluir los estilos CSS del componente directamente en el archivo TypeScript del componente.

- `--skip-tests`: Evita la generación del archivo de pruebas (spec) para el componente.

- `--routing`: Añade un archivo de enrutamiento al crear un nuevo módulo.

> [!TIP]
> ```bash
> ng g c nombre-del-componente --skip-tests
> ```
> ```bash
> ng generate c nombre-del-componente --inline-template --inline-style --skip-tests
> ```
