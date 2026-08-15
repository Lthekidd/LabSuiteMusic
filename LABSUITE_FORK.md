# YTmusic hardened fork

YTmusic is a GPL-3.0-only derivative of YTMDesktop, maintained as a
separate companion process for the MIT-licensed LabSuite application.

## Source baseline

- Upstream project: `https://github.com/ytmdesktop/ytmdesktop`
- Upstream release: `v2.0.11`
- Upstream commit: `3d49f521344879492f0d9f250f4e3b21720b24b9`
- LabSuite security profile: `labsuite-hardened-v1`

The original copyright notices and GPL license are retained. Changes in this
fork are also distributed under GPL-3.0-only.

## Security boundary

- The Companion API listens only on `127.0.0.1:9863`.
- Browser-originated requests and unexpected Host headers are rejected.
- Every state and control endpoint requires a user-approved, encrypted token.
- The loopback companion starts by default; authorization still requires an
  explicit, time-limited approval in the YTmusic authorization window.
- The app has no runtime auto-updater and no upstream update-feed fallback.
- Google/YouTube runs in a sandboxed, context-isolated persistent partition.
- Node integration, downloads, insecure content, and all permissions except
  fullscreen are denied for the YouTube Music view.
- Packaged cookies use Electron's encrypted-cookie fuse and the Windows user
  profile's OS-backed encryption.
- Production developer tools and renderer-console persistence are disabled.

These controls prevent the upstream maintainers from delivering code or
accessing the local browser profile. As with every desktop web wrapper, code
inside a build has technical control over its own session, so builds must come
from reviewed source and a controlled release pipeline.

## Build and verification

```powershell
corepack yarn install
corepack yarn verify:security
corepack yarn lint
corepack yarn package --platform win32 --arch x64
```

Do not use the upstream Winget package when testing the LabSuite integration;
it does not advertise the hardened security profile and LabSuite rejects it.
