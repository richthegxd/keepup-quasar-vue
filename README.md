# KeepUp Quasar project
KeepUp is a learning project that partly copies the basic idea from **[Google Keep](https://www.google.ru/keep/).**


## Technologies used
- **[Firebase](https://firebase.google.com/).**
- **[Quasar Framework](https://quasar.dev/).**
- **[Pinia](https://pinia.vuejs.org/).**
- **[Vue Grid Layout](https://github.com/jbaysolutions/vue-grid-layout).**

## Application Features
- **Creating** notes
- **Adding pictures, backgrounds, reminders for notes**
- Search for notes
- **Editing** notes
- **Creating categories** for notes
- **Data export/Import**
- Saving uploaded images in **Firebase Storage**
- Different types of **note display**
- **Free movement** of notes in the container
- Switching themes (light, dark)

# How to use

## Firebase Configuration
1. Create Firebase Web Project
2. Copy configuration
3. Import configuration in ``` src/config/firebase/index.js ```

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```
