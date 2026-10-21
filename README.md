PERSONAL ORGANISER - ON-DEVICE EDITION
======================================

Personal-Organiser.html is the whole app in one file (layout, styles, scripts and icons).
No Google account, no internet connection and no server database are needed. Tasks are
saved in the browser on the device you use, and are not shared between devices.
To move tasks to another device: Settings > Export backup, then Import backup there.

USING IT
- On a computer: double-click Personal-Organiser.html. It opens in your browser and works
  offline. Keep the file in the same place: your tasks belong to that file location and
  that browser.
- To install it as an app (own window/icon, home screen on phones), it must be opened
  from a secure https:// web address. Upload BOTH files to the same folder on any static
  web host (for example a Replit Static deployment, GitHub Pages or Netlify):
    Personal-Organiser.html  - the app
    sw.js                    - the offline helper (lets the installed app open with no internet)
  Open the address once while online, then install:
    Chrome / Edge (Windows, Mac, Android): Install icon in the address bar, or the
      "Install app" button in the app.
    Safari on iPhone / iPad: Share > Add to Home Screen.
    Safari on Mac: File > Add to Dock.
    Firefox on Android: menu > Install / Add app to Home screen.
    Firefox on computers cannot install web apps; use it as a normal page.
  Already installed it? Upload sw.js, then open the app once while online. No need to
  reinstall. Settings > Install on this device shows "Offline mode is on" when it works.

OFFLINE AND UPDATES
- After the first online visit, the installed app opens without an internet connection.
- When you upload a new version of Personal-Organiser.html, the app downloads it in the
  background next time it is online and shows it on the following launch.
- Your tasks are stored separately in the browser and are never lost by updating.
- Reminders pop up while the app is open.

CUSTOM REPEATS
- Schedule Type "Custom repeat": first day, days in a row, repeat every N days/weeks/months,
  optional end date. Example: first day a Friday, 3 days in a row, every 2 weeks.
- To change or remove one day, select it on the calendar. Restore removed days from
  "Edit all days" (Changed days list).

EDITING THE APP (for developers)
Sources are in src/. Run "python3 build.py" to rebuild Personal-Organiser.html.
