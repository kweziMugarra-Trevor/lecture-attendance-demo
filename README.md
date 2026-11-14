# LectureTrack — local attendance demo

A beginner-friendly demonstration, not a production attendance or identity system. It runs on your Windows laptop and lets phones on the **same Wi-Fi** open a student form. It does not publish or automatically host anything on the internet.

## Before starting

- Install Python 3 from https://www.python.org/downloads/ if needed (during installation select **Add Python to PATH**). You need internet to install the Python packages the first time. The app itself does not need internet after installation.
- Use **fictional test names and numbers only**. This demo uses HTTP, not HTTPS: names, numbers, PINs and even the admin link may be visible to someone monitoring or controlling the network. The SQLite database and exported CSV are not encrypted either. Do not use this for sensitive or real student data without a proper security and privacy review, consent/notice and institutional approval.
- Anyone with the private admin link has full coordinator access to the app, including attendance lists and CSV. Never show or send that link to students. Keep your laptop and browser private. The student QR and student link are safe to display, but their PIN can be shared.

## First-time setup on Windows

1. Extract the ZIP: right-click it, select **Extract All**, and open the extracted `attendance-demo` folder. Do not run it from inside the ZIP.
2. Click the folder address bar, type `cmd`, and press Enter. This opens Command Prompt in that folder.
3. Enter these commands one at a time:

   ```bat
   py -m venv .venv
   .venv\Scripts\activate
   python -m pip install -r requirements.txt
   python app.py
   ```

   If `py` is not recognised, install Python and reopen Command Prompt. If package installation fails, check your internet connection. If Windows says it cannot find `app.py`, make sure the Command Prompt is in the extracted folder.
4. Leave that Command Prompt window open. It prints a **private admin link**, such as `http://127.0.0.1:5000/admin/<random-secret>`. Copy the complete actual link from your own window and open it in the laptop browser. The example is not a working link. The secret is random and changes whenever the app restarts; there are no default login credentials. Never publish the link or share your screen with the address bar visible.
5. If Windows Defender Firewall asks, allow Python on **private networks** for this test (do not enable public networks). The app intentionally listens on **0.0.0.0**, meaning all network interfaces, so local phones can reach it. It may also be reachable by others on those networks: use only a trusted private network, and stop the app after the demo. If you do not want to allow this network access, do not run the demo. Firewall rules and network isolation still apply.

## Make and run a session

1. Connect the laptop and student phones to the **same private Wi-Fi**. Some school/guest Wi-Fi networks prevent devices from communicating even when on the same Wi-Fi; a suitable private hotspot or another network may be needed.
2. On the admin page enter course/programme, unit and code, lecturer and coordinator, date, semester, and lecture start and end times (same day, end later than start). The app calculates the day and year from the date.
3. Create the session. Display the QR and the changing six-digit code **without showing the browser address bar or private admin URL**. The QR contains the student-only link, not the admin secret. Alternatively, share only the **STUDENT LINK** shown under the QR. The code refreshes every 60 seconds; if it expires while a student is typing, they should use the newest one.
4. Each student scans the QR with their phone's normal camera/QR reader, or types the student link into their phone browser. They enter a fictional name, number and the current code. No student password, location permission, or ongoing camera surveillance is required. The app does not receive camera video.
5. For someone without a smartphone, the coordinator enters their name and number in **Manual entry**. The same duplicate check applies.
6. The coordinator reloads the session page to see the updated list and can export it with **Export CSV**. Optional lecturer/coordinator acknowledgment fields accept typed names or notes; **these are not legally verified signatures**. If handwritten signatures are required, print the exported CSV and sign on paper.
7. Select **Close attendance** when done. This stops both phone and manual entries permanently for that session in this demo. Other sessions remain separate.

The student number is checked case-insensitively with spaces ignored within a session; another session can use the same number. Values that could be interpreted as spreadsheet formulas are prefixed in exports.

## Connecting phones / troubleshooting

- The laptop admin URL uses `127.0.0.1` only on the laptop. A phone's `127.0.0.1` points to the phone itself. The student QR must instead use your **laptop's Wi-Fi IPv4 address**, for example `http://192.168.1.12:5000/join/...` (your actual address will differ).
- The app attempts to detect this address and prints it at startup. VPNs, multiple adapters or unusual networks can make it choose the wrong one. In a separate Command Prompt, run `ipconfig`, find **IPv4 Address** under your connected Wi-Fi adapter, and compare it with the student link. If it differs or wasn't detected, stop the app with Ctrl+C and set the address before restarting:

   ```bat
   set ATTENDANCE_HOST=192.168.1.12
   python app.py
   ```

   Replace the example with your actual laptop Wi-Fi IPv4 address. Then use the new admin link, open the session again and display the new QR. The setting affects only this Command Prompt window. Do not set it to `127.0.0.1` or `0.0.0.0`.
- Keep the laptop awake and `python app.py` running. Check the phone is on the same Wi-Fi, not mobile data or a guest network that blocks device-to-device traffic. Confirm the firewall allows private-network access. Disable a VPN temporarily if it is interfering. Reload the coordinator page if the current PIN stops refreshing.
- If port 5000 is already in use, stop the other app or set another port before starting: `set ATTENDANCE_PORT=5001` then `python app.py`. The generated links use that port.

## Restart, storage and removal

For later use, open Command Prompt in the extracted folder and run:

```bat
.venv\Scripts\activate
python app.py
```

Use the **new** admin link printed after each restart; older admin links and previous PINs will no longer work. Sessions and entries persist in the local `attendance.sqlite3` file next to `app.py`; only the admin secret and PIN signing key change on restart. Stop the app with Ctrl+C. To reset demo data, first stop the app, then delete `attendance.sqlite3` (this permanently removes all saved sessions). Store, share, and delete any CSV exports responsibly; deleting the database does not delete exported files.

Optional advanced configuration: `ATTENDANCE_HOST` sets the advertised LAN IPv4 address, `ATTENDANCE_PORT` changes the listening port (default 5000), and `ATTENDANCE_DB` sets the SQLite file path (default `attendance.sqlite3` in this folder). The server always binds `0.0.0.0`; `ATTENDANCE_HOST` changes the QR address, not the bind address. No secret needs to be configured or stored.

## Important limits

A QR and short-lived PIN can be relayed to someone elsewhere, and names/numbers can be entered by someone else. This is **not proof of presence or identity**. Basic rate limiting and a private random admin URL are not a complete security solution. The built-in Flask development server is not production-ready, has no HTTPS, and a user who learns the admin URL can manage data. Do not expose it to the public internet. No geolocation, continuous camera monitoring, or student password is used. Review privacy, retention, access controls and university policy before considering any real deployment.
