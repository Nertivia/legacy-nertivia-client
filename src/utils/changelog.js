const config = [
  {
    version: 1,
    title: 'Make your own guild',
    shortTitle: 'Make your guild',
    date: '31/03/2019',
    headColor: "rgba(39, 14, 204, 0.77)",
    new: [
      'You can now make your own guild.',
      "Tabs have been added at the top of the screen.",
      "Added users information page which allows you to block, End friendship or message someone.",
    ],
    fix: ["Some formatting issues with custom emojis have been fixed."],
    next: ['link previews.']
  },
  {
    title: 'Custom emojis!',
    shortTitle: 'Custom emojis!',
    date: '29/03/2019',
    headColor: "rgba(255, 48, 48, 0.77)",
    new: [
      'You can now add your own emojis for free.',
      "User status in the top bar to easily view if someone is still online or, if you're talking to a wall on the phone.",
      'Switching dms should be faster now.'
    ],
    next: ['Servers', 'View an users information page']
  },
  {
    title: 'Emoji tabs and recent emojis',
    shortTitle: 'Emoji tabs and recent emojis',
    date: '22/03/2019',
    headColor: "rgba(244, 169, 65, 0.77)",
    new: [
      'Tabs in emoji panel',
      'Recent Emojis now show in the emoji panel'
    ],
    fix: [
      'Emoji panel closes when clicking outside the panel.',
    ],
    next: ['Custom emojis']
  },
  {
    title: 'Emojis :D',
    shortTitle: 'Emojis',
    date: '20/03/2019',
    headColor: "rgba(17, 153, 69, 0.77)",
    new: [
      'Emoji suggestions in chat when typing in any emoji :ok_hand:',
      'Emoji picker',
      'Removed planned features from changelog'
    ],
    next: [
      'make tabs in emoji panel',
      'Make it so that emoji panel closes when clicking outside the panel.',
      'Custom emojis for freeeee!',
    ]
  },
  {
    title: 'Upload anything!',
    shortTitle: 'Upload anything!',
    date: '08/03/2019',
    headColor: "rgba(38, 139, 255, 0.77)",
    new: [
      'You can now upload any kind of files to friends. (Google drive required)',
      'Shift + enter should expand the text area.',
      'Made some design changes to the home page panel.'
    ],
    fix: [
      'Improved performance by using Redis in more places.',
      'Small bugs fixed around some places.'
    ],
    next: [
      'Servers or emojis.',
    ]
  },
  {
    title: 'Notifications are finally here!',
    shortTitle: 'Notifications',
    date: '18/02/2019',
    new: [
      'When you get a notification, you will now be notified by the red flashing Indicator.',
      'When you get a new friend request, you will notified by a sound.',
      'Added a new Recents tab to easily see who messaged you last.',
      'Adjusted the padding and size in some places such as the friends list.',
      'Messages can now be formated (e.g. **Hello**)'
    ],
    fix: [
      'Performance improvements were made in some places.',
      'Yesterday is now spelt with a capital "Y" in the timestamp.'
    ],
    next: [
      'Uploading images or any files.',
    ]
  },
  {
    title: 'Typing Indicator',
    shortTitle: 'Typing Indicator',
    date: '08/02/2019',
    new: [
      'See who\'s typing with the new typing indicator!',
      'Online and offline friends now have their own category.',
      'Timestamps for each message.'
    ],
    fix: [
      'Some bugs with the message list scrolling.',
      'Added some margin and padding to some places.'
    ],
    next: [
      'Message notifications.',
    ]
  },
  {
    title: 'Avatar',
    shortTitle: 'Avatar',
    date: '29/01/2019',
    new: [
      'Settings page has been added.',
      'You can now set your own profile picture from the settings page.',
      'You can now logout within the app.'
    ],
    next: [
      'Typing status.',
    ]
  },
  {
    title: 'Message limit, Chat message changes',
    shortTitle: 'Message limit',
    date: '25/01/2019',
    new: [
      'Changed the design of messages slightly and changed the font size.'
    ],
    fix: [
      'Messages now have a limit of 5000 characters.',
    ],
    next: [
      'I have decided to add profile pictures in the next update.',
    ]
  },

  {
    title: 'ReeeeCaptcha :D',
    shortTitle: 'ReCaptcha',
    date: '23/01/2019',
    new: [
      'Added reCaptcha to our login and register so our website is safe from any spam accounts that could be created by bots.',
    ],
    next: [
      'Typing status or maybe profile pictures (haven\'t decided yet)',
    ]
  },
  {
    
    title: 'Online status and fixes',
    shortTitle: 'Online status and fixes',
    date: '22/01/2019',
    new: [
      'See if your friends are online, away, busy, looking to play or offline.',
      'Planned features and the latest change now shows in app.'
    ],
    fix: [
      'Messages will no longer show twice when sending.',
      'Adjusted padding on some places.',
      'Message font is now much smaller.'
    ]
  },
  {
    
    title: 'Send and receive messages (experimental)',
    shortTitle: 'Send and receive messages',
    date: '14/01/2019',
    new: [
      'You can now send messages to your friends!',
    ],
    next: [
      'improving the new messaging functionality and adding typing indicators, online statuses.',
    ]
  },

  {
    title: 'Public change log, Accept friends',
    shortTitle: 'Public change log, Accept friends',
    date: '09/01/2019',
    new: [
      'Added a change log so you can see how much progress is being made to Nertivia.',
      'Adding friends, denying requests, accepting requests is now possible.'
    ],
    next: [
      'Ability to send messages.',
    ]
  },

  {
    title: 'Issues fixed',
    shortTitle: 'Issues fixed',
    date: '04/01/2019',
    msg: 'Tweaks have been made to the website here and there.'
  },
  
  {
    title: 'Compatibility',
    date: '31/12/2018',
    msg: 'Website is now compatible for viewing on mobile, tablet and desktop devices.'
  }
]


export default config;