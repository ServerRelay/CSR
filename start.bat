@echo off
:begin
node irc.js
timeout 10
echo resuming CSR...
goto begin