from slacker import Slacker

slack = Slacker('xoxp-42277585554-42806528775-107139183492-83ec2cfb026f0910ef3eda534de97b91')

# Send a message to #general channel
slack.chat.post_message('#git-updates', 'Running api')

# Get users list
#response = slack.users.list()
#users = response.body['members']

# Upload a file
#slack.files.upload('hello.txt')
