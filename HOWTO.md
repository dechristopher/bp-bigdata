# Install Instructions

updates => `sudo apt update && sudo apt -y upgrade`

curl => `sudo apt install curl`

buld-essential & libssl-dev => `sudo apt install build-essential libssl-dev`

nodejs => `curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh`

nodejs => `sudo chmod +x install_nvm.sh`

nodejs => `bash install_nvm.sh`

## THEN LOGOUT and LOG BACK IN

nodejs => `nvm install 9.6.1`

pip => `sudo apt install python-pip`

... then install all pip modules you may need: `sudo pip install [package name]`
- numpy
- scipy
- pandas
- sklearn