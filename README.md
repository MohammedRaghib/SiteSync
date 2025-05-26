# SiteSync

SiteSync is a mobile attendance and access control solution for work sites, built using [Expo](https://expo.dev) and React Native. It leverages face recognition, camera access, and role-based permissions to streamline worker check-ins and supervisor site management.

## Features

- **Face Recognition Attendance:** Workers check in and out by taking a photo; the app matches faces with registered profiles.
- **Role-Based Access:** Guards, supervisors, and other roles have tailored access to app features.
- **Supervisor Dashboard:** Supervisors can access special panels for site management and task checks.
- **Audit Logging:** Unsuccessful check-ins and unauthorized access attempts are logged for review.
- **Multi-language Support:** Switch between languages using the built-in language selector.
- **File-based Routing:** Organized, scalable navigation using Expo Router.

## Getting Started

1. **Install dependencies**
    ```bash
    npm install
    ```

2. **Start the app**
    ```bash
    npx expo start
    ```
    - Open in a [development build](https://docs.expo.dev/develop/development-builds/introduction/), [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/), [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), or [Expo Go](https://expo.dev/go).

3. **Development**
    - Edit files within the `app` directory. Each file is a screen (see [`app/`](./app/)).
    - Uses [file-based routing](https://docs.expo.dev/router/introduction).

4. **Reset project**
    ```bash
    npm run reset-project
    ```
    - Moves starter code to `app-example` and creates a blank `app` directory for fresh development.

## Project Structure

```
app/
  |_ index.jsx               # Entry screen (language switch, login)
  |_ CheckIn.jsx             # Worker check-in with face recognition
  |_ Checkout.jsx            # Worker check-out with face recognition
  |_ SupervisorPanel.jsx     # Supervisor options & navigation
  |_ SupervisorDashboard.jsx # Supervisor dashboard
  |_ SpecialReEntry.jsx      # Special re-entry logic
  |_ _layout.jsx             # App layout, navigation, theming
  |_ Language/               # Language files and switcher
  |_ ExtraLogic/             # Custom hooks (face recognition, attendance, user context)
assets/
  |_ fonts/                  # Custom fonts
scripts/
  |_ reset-project.js        # Utility to reset the project
```

## Backend Integration

- Expects a backend API for face recognition and attendance endpoints.
- API endpoints are called for:
    - Face recognition and matching
    - Logging check-in/out events
    - Audit trails for unauthorized and authorized attempts

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router guide](https://docs.expo.dev/router/introduction/)
- [React Native documentation](https://reactnative.dev/)
- [Expo community Discord](https://chat.expo.dev)
