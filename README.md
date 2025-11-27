# 🦸 ComicVerse - HeroesVillanos

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![Angular](https://img.shields.io/badge/Angular-20.0.0-red.svg)
![Ionic](https://img.shields.io/badge/Ionic-8.0.0-3880ff.svg)
![Capacitor](https://img.shields.io/badge/Capacitor-7.4.4-119EFF.svg)

**ComicVerse** es una aplicación móvil desarrollada con Ionic y Angular que permite explorar, descubrir y gestionar información detallada sobre héroes y villanos del universo de los cómics. La aplicación consume datos de la [Superhero API](https://superheroapi.com/) para ofrecer una experiencia completa e interactiva.

## 📱 Características Principales

### 🔍 **Explorar (Explore)**
- **Catálogo completo**: Navega por una extensa base de datos de personajes de cómics
- **Búsqueda inteligente**: Busca personajes por nombre con resultados ordenados por relevancia
- **Filtros avanzados**: 
  - Filtro por universo (DC, Marvel, etc.)
  - Filtro por afiliación (Héroe, Villano, Neutral)
  - Filtro por poder principal
- **Ordenamiento**: Ordena personajes por:
  - Rating de poder (ascendente/descendente)
  - Orden alfabético (A-Z / Z-A)
- **Scroll infinito**: Carga progresiva de personajes para una experiencia fluida
- **Vista aleatoria**: Descubre nuevos personajes con cada visita

### ⭐ **Favoritos (Favorites)**
- **Colección personal**: Guarda tus personajes favoritos para acceso rápido
- **Gestión fácil**: Añade o elimina favoritos con un solo toque
- **Estadísticas**: Visualiza el conteo de favoritos por afiliación
- **Persistencia local**: Tus favoritos se guardan localmente en el dispositivo

### 📊 **Detalles del Personaje**
- **Información completa**: 
  - Biografía y aliases
  - Primera aparición
  - Lugar de nacimiento
  - Ocupación y base de operaciones
  - Afiliaciones grupales
  - Relaciones familiares
- **Power Stats detallados**: 
  - Inteligencia
  - Fuerza
  - Velocidad
  - Durabilidad
  - Poder
  - Combate
- **Imágenes de alta calidad**: Visualiza personajes con imágenes en alta resolución

### ⚙️ **Configuración (Settings)**
- **Modo oscuro**: Alterna entre tema claro y oscuro
- **Gestión de datos**: Limpia todos los favoritos con un solo clic
- **Información de la app**: Versión y detalles de la aplicación

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Angular](https://angular.io/) 20.0.0
- **UI Framework**: [Ionic](https://ionicframework.com/) 8.0.0
- **Mobile Runtime**: [Capacitor](https://capacitorjs.com/) 7.4.4
- **Lenguaje**: TypeScript 5.9.0
- **API Externa**: [Superhero API](https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/)
- **Almacenamiento Local**: Capacitor Filesystem API

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Angular CLI](https://angular.io/cli) (se instala automáticamente con npm)
- [Ionic CLI](https://ionicframework.com/docs/cli) (opcional, pero recomendado)
- [Android Studio](https://developer.android.com/studio) (para desarrollo Android)
- [Java JDK](https://www.oracle.com/java/technologies/downloads/) (requerido para Android)

## 🚀 Instalación

1. **Clona el repositorio**:
```bash
git clone <url-del-repositorio>
cd HeroesVillanos
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Verifica la instalación**:
```bash
npm start
```

La aplicación se abrirá en `http://localhost:4200` en tu navegador.

## ⚙️ Configuración

### Variables de Entorno

La aplicación utiliza la API de Superhero API. La configuración se encuentra en:

```
src/environments/environment.ts
```

Por defecto, la aplicación está configurada para usar:
- **Base URL**: `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/`
- **Endpoint de personajes**: `all.json`
- **Endpoint de detalles**: `id/{id}.json`

No se requiere configuración adicional para comenzar a usar la aplicación.

## 📖 Uso

### Desarrollo Web

Para ejecutar la aplicación en modo desarrollo:

```bash
npm start
```

O usando Angular CLI directamente:

```bash
ng serve
```

### Construcción para Producción

Para generar una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `www/`.

### Desarrollo Android

Para sincronizar los cambios con la plataforma Android:

```bash
npx cap sync android
```

Para abrir el proyecto en Android Studio:

```bash
npx cap open android
```

**Proceso completo para ver cambios en el emulador de Android:**

1. Realiza tus cambios en el código fuente
2. Compila la aplicación:
   ```bash
   npm run build
   ```
3. Sincroniza con Capacitor:
   ```bash
   npx cap sync android
   ```
4. Abre Android Studio y reconstruye el proyecto:
   - `Build` → `Rebuild Project`
5. Ejecuta la aplicación en el emulador:
   - Haz clic en el botón "Run" (▶️) o presiona `Shift + F10`

## 📁 Estructura del Proyecto

```
HeroesVillanos/
├── android/                 # Proyecto nativo de Android
│   ├── app/
│   └── build.gradle
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/    # Servicios principales
│   │   │       ├── api.ts
│   │   │       ├── characters.ts
│   │   │       └── data-persistence.service.ts
│   │   ├── models/          # Modelos de datos
│   │   │   ├── character.model.ts
│   │   │   ├── details.model.ts
│   │   │   └── powerstats.model.ts
│   │   ├── pages/           # Páginas de la aplicación
│   │   │   ├── explore/     # Página de exploración
│   │   │   ├── favorites/   # Página de favoritos
│   │   │   ├── settings/    # Página de configuración
│   │   │   ├── character-details/  # Detalles del personaje
│   │   │   └── tabs/        # Navegación por pestañas
│   │   └── shared/          # Módulos compartidos
│   ├── assets/             # Recursos estáticos
│   │   └── data/           # Datos JSON locales
│   └── environments/       # Configuración de entornos
├── www/                    # Archivos compilados (generados)
├── angular.json            # Configuración de Angular
├── capacitor.config.ts     # Configuración de Capacitor
├── ionic.config.json       # Configuración de Ionic
└── package.json           # Dependencias del proyecto
```

## 🧪 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run watch` - Compila en modo watch para desarrollo
- `npm test` - Ejecuta las pruebas unitarias
- `npm run lint` - Ejecuta el linter para verificar el código

## 🎨 Características de UI/UX

- **Diseño responsive**: Adaptado para diferentes tamaños de pantalla
- **Navegación intuitiva**: Sistema de pestañas para acceso rápido
- **Animaciones fluidas**: Transiciones suaves entre pantallas
- **Feedback visual**: Indicadores de carga y notificaciones toast
- **Modo oscuro**: Soporte completo para tema oscuro/claro

## 🔧 Servicios Principales

### Characters Service
Maneja la comunicación con la API externa para obtener personajes y sus detalles.

### Data Persistence Service
Gestiona el almacenamiento local de favoritos y configuraciones usando Capacitor Filesystem.

### API Service
Servicio base para realizar llamadas HTTP a la API externa.

## 📱 Plataformas Soportadas

- ✅ **Web** (PWA)
- ✅ **Android** (nativo)
- 🔄 **iOS** (compatible con Capacitor, requiere configuración adicional)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como parte del proyecto final de curso.

## 🙏 Agradecimientos

- [Superhero API](https://superheroapi.com/) por proporcionar los datos de los personajes
- [Ionic Framework](https://ionicframework.com/) por el excelente framework de UI
- [Angular](https://angular.io/) por el robusto framework de desarrollo
- [Capacitor](https://capacitorjs.com/) por la plataforma de runtime móvil

---

**¡Disfruta explorando el universo de los cómics con ComicVerse! 🦸‍♂️🦹‍♀️**


