
### Your skins in the Minecraft launcher are stored in Base64. This is a simple Node.js script to extract them and turn them back into PNG files.

To extract your skins, simply clone this repository, open the folder, and run this script in any terminal:
```
npm run start
```

Note:\
Because I use Windows, this script is untested on Mac OS and is not supported on Linux due to there being multiple ways to install the game and therefore multiple places where the game could be installed.\
\
If you're on Mac OS and the script doesn't work, then please open an issue containing your OS version and where your Minecraft installation folder is located.\
\
If you're on Linux and would like to contribute, then please open an issue containing what distro you're using, how you installed the game (AUR, .deb, snap, etc.), and where your Minecraft installation folder is located.

This script uses modified code from helensy's [base64-to-image package](https://www.npmjs.com/package/base64-to-image).