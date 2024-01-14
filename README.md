# NYT Crossword Fullscreen - Browser Add-On/Extension

Adds a full-screen mode button to the New York Times crossword puzzle interface.

Adds the following keyboard shortcuts:
| Shortcut | Description |
| -- | -- |
| `left shift` | Toggle pencil |
| `ctrl`+`left shift` | Toggle pause |

Firefox Add-On: [[link]](https://addons.mozilla.org/en-US/firefox/addon/nyt-crossword-fullscreen/)  
Chrome/Edge Extension: [[link]](https://chrome.google.com/webstore/detail/nyt-crossword-fullscreen/lpnihcgnplcjdlfmdlejbpcnehidmfon)

## Installation Instructions
### Firefox: As Temporary Add In
Copy `manifest.v3.json` to `package/manifest.json`; you can then load that as a
[temporary extension](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).

Regular Firefox doesn't permit permanently loading non-signed extensions ([see
here](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox)).

## Changelog

### iankp/nyt-crossword-fullscreen fixes
- Fixed a bug where the extension would not execute if loaded after the page
- Added feature to toggle pencil status
- Added feature to toggle pause status
  - right now this is assigned to `ctrl` + `ShiftLeft`; a better shortcut could
    be selected, but it would need to be made to work cross platform and be
    layout-agnostic
- Removed feature that disabled tooltip on the board (was broken; no
  `#boardTitle`)

### 1.7

- Fixed a bug where NYT changed the page and it broke
- Switched to using the browser runtime to retrieve images instead of hosting them

### 1.6

- Added fullscreen button to the modal

### 1.5

- Removed the header in full-screen mode, because duh

### 1.4

- Fixed rebus code not initializing at the right time
- Centered rebus text

### 1.3

- Fixed glitchy rebus UI when in full-screen mode

### 1.2

- Made full-screen mode adapt on window resize
- Removed the annoying tooltip on the puzzle grid
- Removed an unused file

### 1.1

- Fixed an issue where it was broken and I forgot to fix it

### 1.0

- Initial upload
