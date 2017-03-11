git clone https://github.com/jonamata/p-online.git /home/pi/p-server_temp -b server
rm -rf /home/pi/p-server
mkdir /home/pi/p-server
mv -v /home/pi/p-server_temp/* /home/pi/p-server/
rm -rf /home/pi/p-server_temp
cd /home/pi/p-server/
npm install --production
echo Update finished
echo
echo
echo
exit