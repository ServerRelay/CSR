# Permissions Explained

These permissions are mostly used by the bot and will be explained why/what they do

* *Administrator* - adds up all the following permissions into one.
* *Manage Webhooks* - used for creating,editing webhooks, sending messages from webhooks.

## I connected the bot but my server is not receiving messages

there are 3 things you probably did wrong:
1. you input the wrong password - check that you didnt leave any extra spaces/line breaks<br>i.e.<br>c-connect #channel private <br>passcode<br>c-connect #channel private  passcode  <br>:x: these are incorrect
2. missing permissions - check that the bot has the necessary permissions to read messages, get webhooks, send messages through webhooks, create webhooks if there arent any webhooks
3. you receive `:x: failed: could not find any webhooks belonging to this guild` -  this means that the bot could not create/find the webhooks that are supposed to be created, check that the bot has the ***Manage Webhooks*** permission, if it does and still outputs that error try running c-connect again.