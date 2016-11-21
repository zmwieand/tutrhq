#!/usr/bin/python
import os
import subprocess
import time
import json
import time
import datetime

from slackclient import SlackClient
from pprint import pprint

BOT_NAME = 'flash'

SLACK_CLIENT = SlackClient('xoxb-107739676214-mZ3opxqt3I6Qiw36EEX6zrTz')
BOT_ID = 'U35MRKW6A'
ICON_URL = "http://www.clipartkid.com/images/330/flash-gordon-logo-png-pDtuh6-clipart.png"
AT_BOT = "<@" + BOT_ID + ">"


def slack_commands_list(command, channel, user):
    if command == 'update the fucking server':
        print 'updating the server.'
        SLACK_CLIENT.api_call("chat.postMessage", channel=channel, text="updating it bruh.", username = BOT_NAME, icon_url=ICON_URL);
        os.system("/home/tutr/updateServer.sh")
        SLACK_CLIENT.api_call("chat.postMessage", channel=channel, text="calm the fuck down, its done", username = BOT_NAME, icon_url=ICON_URL);
        SLACK_CLIENT.api_call("chat.postMessage", channel=channel, text="check: https://tutrhq.com", username = BOT_NAME, icon_url=ICON_URL);

def parse_slack_output(slack_rtm_output):
    """
        The Slack Real Time Messaging API is an events firehose.
        this parsing function returns None if there is no messages being sent,
        returns true, the chat message, the channel, and the user if the message
        was directed at the bot, and false with the rest of the return values if it
        is just a message.
    """
    output_list = slack_rtm_output
    if output_list and len(output_list) > 0:
        for output in output_list:
            if output and 'text' in output and AT_BOT in output['text']:
                # return true, and all data info after
               output['text'] = output['text'].split(AT_BOT)[1].strip().lower()
               return True, output

            if output and 'text' in output:
               # return false and all data info
               return False, output

    return None, None

def main():
    READ_WEBSOCKET_DELAY = 1 # 1 second delay between reading from firehose
    if SLACK_CLIENT.rtm_connect():

        while True:
            at_bot, message_stats = parse_slack_output(SLACK_CLIENT.rtm_read())
            if at_bot != None and 'user' in message_stats:
                channel = message_stats['channel']
                command = message_stats['text']
                user = message_stats['user']
                ts = message_stats['ts']
                if at_bot:
                    slack_commands_list(command, channel, user)
            time.sleep(READ_WEBSOCKET_DELAY)
    else:
        print("Connection failed. Invalid Slack token or bot ID?")


if __name__ == "__main__":
    main()
