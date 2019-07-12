
 const prototype =  {
    version: 4,
    title: "",
    shortTitle: "",
    date: "1/06/2019",
    headColor: "rgba(155, 244, 66, 0.77)",
    new: [
      "",
      "",
    ],
    next: [""]
  }

const config = [
  {
    version: 4.9,
    title: "Color codeblocks and create multiple channels!",
    shortTitle: "",
    date: "12/07/2019",
    headColor: "rgba(190, 40, 40, 0.77)",
    new: [
      "You can now color your code (thanks bree!) by typing: <div style='background: #00000066; border-radius: 5px; padding: 5px;'>```js<br>    console.log('Hello World!');<br>```</div>",
      "A new server settings option has been added that allows you to delete your server, create new channels and rename your channels. More future will be added in the future! ",
      "The 'Recents' tab should now flash red when you get a notification.",
      "Friends and Recents tabs position will be saved when visiting the site."
    ],
    fix: ['Fixed a bug where, when you are on the changelog or the server browser tab, the notifications get dismissed.'],
    next: ["more server settings"],
  },
  {
    version: 4.8,
    title: "Server Members Status and new Logo!",
    shortTitle: "Server Members Status and new Logo!",
    date: "08/07/2019",
    headColor: "rgba(0, 156, 170, 0.77)",
    new: [
      "Nertivia has a new cat logo! (Thanks to Fullipsp for the design!)",
      "You can now see online status of server members!",
      "You can now click on links that start with 'http'",
    ],
    fix: ['Fixed a bug where when creating a server, a reload is required to show yourself in the server members list.'],
    next: ["Create multiple channels in a server."],
    msg: `You might be wondering, where did the official Nertivia server go? Well, I accidentally deleted it :/ sorry. Here's the new one though! <a style="color: #00b6ff;" href="http://nertivia.supertiger.tk/invites/Db3p5n">http://nertivia.supertiger.tk/invites/Db3p5n</a>`
  },
  {
    version: 4.7,
    title: "Bug fixes",
    shortTitle: "Bug fixes",
    date: "24/06/2019",
    headColor: "rgba(3, 70, 115, 0.77)",
    new: [
      "Emoji character limit expanded to 30 characters!"
    ],
    fix: [
      "Fixed a bug with the notification where it wouldn't dismiss on changing tabs.",
      "Fixed a bug where unopened dms wouldn't show notifications on the tabs.",
      "Fixed emoji character limit bypass.",
      "Emojis can now be inserted in firefox!",
    ],
    next: ["Online status for server members list."]
  },
  {
    version: 4.6,
    title: "Server Members list and bug fixes",
    shortTitle: "Server Members list and bug fixes",
    date: "21/06/2019",
    headColor: "rgba(0, 102, 170, 0.77)",
    new: [
      "Server members are now shown!",
      "Adjusted some padding with the tabs."
    ],
    fix: [
      "Fixed a vulnerability where after leaving a server, you could still send messages.",
    ],
    next: ["Online status for server members list."]
  },
  {
    version: 4.5,
    title: "Server bug fixes",
    shortTitle: "Server bug fixes",
    date: "03/06/2019",
    headColor: "rgba(3, 70, 115, 0.77)",
    new: [
      "Notifications for servers has been added."
    ],
    fix: [
      "Fixed notification bug where server notification are shown in dms.",
      "When switching from server to direct message tab (and vice versa), the channels should now be separated.",
      'You can now only create 30 invites per server.'
    ],
  },
  {
    version: 4,
    title: "Make your own servers! (Alpha)",
    shortTitle: "Servers (Alpha)",
    date: "23/05/2019",
    headColor: "rgb(0, 102, 170, 0.77)",
    new: [
      "You can now make servers! Note that this is in alpha stage which means that it's not complete and there could be a ton of bugs everywhere :c get reporting!",
      "Adjusted padding in some areas.",
    ],
    next: ["Members list for servers"],
    msg:
    `
<div style='color: red;'>
  Please note that this update could be unstable and could involve of resetting the database.
</div>Join the official Nertivia server by clicking

<a style="
color: #27a3ff;
" href='https://nertivia.supertiger.tk/invites/8SSrCF'>here</a>`
  },
  {
    version: 3,
    title: "Page Re-designs",
    shortTitle: "Page Re-designs",
    date: "28/04/2019",
    headColor: "rgba(155, 244, 66, 0.77)",
    new: [
      "Home page has been re-designed and has some cool animations.",
      "New login and register pages.",
      "Padding and margin adjusted and small design changes throughout the app.",
      "Added Oceania to the survey list."
    ],
    fix: [
      'Fixed bugs with appearance settings not correctly working.'
    ],
    next: ["Servers (If nothing else distracts me -_-)"]
  },
  {
    version: 1.5,
    title: "New Notification Sound",
    shortTitle: "Notification Sound",
    date: "22/04/2019",
    headColor: "rgba(16, 0, 154, 0.77)",
    new: [
      "Do not disturb should now mute notification sounds.",
      "New notification sound has been added."
    ],
    fix: [
      "Clicking 'Send Message' should close the user panel.",
      "Online status and notifications were not showing correctly."
    ]
  },
  {
    version: 1,
    title: "Profile Panel",
    shortTitle: "Profile Panel",
    date: "21/04/2019",
    headColor: "rgba(39, 14, 204, 0.77)",
    new: [
      "Tabs have been added at the top of the screen.",
      "Added an option to display your messages on the right and other messages to the left.",
      "Added users information page which allows you to block (Block not implemented yet), End friendship, message someone and view their information.",
      "Replaced 'Sending' and 'Sent' with icons.",
      "Added a survey option to display your hobbies and age in your profile page."
    ],
    fix: ["Some formatting issues with custom emojis have been fixed."],
    next: ["Make your own servers"]
  },
  {
    title: "Custom emojis!",
    shortTitle: "Custom emojis!",
    date: "29/03/2019",
    headColor: "rgba(255, 48, 48, 0.77)",
    new: [
      "You can now add your own emojis for free.",
      "User status in the top bar to easily view if someone is still online or, if you're talking to a wall on the phone.",
      "Switching dms should be faster now."
    ],
    next: ["Servers", "View an users information page"]
  },
  {
    title: "Emoji tabs and recent emojis",
    shortTitle: "Emoji tabs and recent emojis",
    date: "22/03/2019",
    headColor: "rgba(244, 169, 65, 0.77)",
    new: ["Tabs in emoji panel", "Recent Emojis now show in the emoji panel"],
    fix: ["Emoji panel closes when clicking outside the panel."],
    next: ["Custom emojis"]
  },
  {
    title: "Emojis :D",
    shortTitle: "Emojis",
    date: "20/03/2019",
    headColor: "rgba(17, 153, 69, 0.77)",
    new: [
      "Emoji suggestions in chat when typing in any emoji :ok_hand:",
      "Emoji picker",
      "Removed planned features from changelog"
    ],
    next: [
      "make tabs in emoji panel",
      "Make it so that emoji panel closes when clicking outside the panel.",
      "Custom emojis for freeeee!"
    ]
  },
  {
    title: "Upload anything!",
    shortTitle: "Upload anything!",
    date: "08/03/2019",
    headColor: "rgba(38, 139, 255, 0.77)",
    new: [
      "You can now upload any kind of files to friends. (Google drive required)",
      "Shift + enter should expand the text area.",
      "Made some design changes to the home page panel."
    ],
    fix: [
      "Improved performance by using Redis in more places.",
      "Small bugs fixed around some places."
    ],
    next: ["Servers or emojis."]
  },
  {
    title: "Notifications are finally here!",
    shortTitle: "Notifications",
    date: "18/02/2019",
    new: [
      "When you get a notification, you will now be notified by the red flashing Indicator.",
      "When you get a new friend request, you will notified by a sound.",
      "Added a new Recents tab to easily see who messaged you last.",
      "Adjusted the padding and size in some places such as the friends list.",
      "Messages can now be formated (e.g. **Hello**)"
    ],
    fix: [
      "Performance improvements were made in some places.",
      'Yesterday is now spelt with a capital "Y" in the timestamp.'
    ],
    next: ["Uploading images or any files."]
  },
  {
    title: "Typing Indicator",
    shortTitle: "Typing Indicator",
    date: "08/02/2019",
    new: [
      "See who's typing with the new typing indicator!",
      "Online and offline friends now have their own category.",
      "Timestamps for each message."
    ],
    fix: [
      "Some bugs with the message list scrolling.",
      "Added some margin and padding to some places."
    ],
    next: ["Message notifications."]
  },
  {
    title: "Avatar",
    shortTitle: "Avatar",
    date: "29/01/2019",
    new: [
      "Settings page has been added.",
      "You can now set your own profile picture from the settings page.",
      "You can now logout within the app."
    ],
    next: ["Typing status."]
  },
  {
    title: "Message limit, Chat message changes",
    shortTitle: "Message limit",
    date: "25/01/2019",
    new: ["Changed the design of messages slightly and changed the font size."],
    fix: ["Messages now have a limit of 5000 characters."],
    next: ["I have decided to add profile pictures in the next update."]
  },

  {
    title: "ReeeeCaptcha :D",
    shortTitle: "ReCaptcha",
    date: "23/01/2019",
    new: [
      "Added reCaptcha to our login and register so our website is safe from any spam accounts that could be created by bots."
    ],
    next: ["Typing status or maybe profile pictures (haven't decided yet)"]
  },
  {
    title: "Online status and fixes",
    shortTitle: "Online status and fixes",
    date: "22/01/2019",
    new: [
      "See if your friends are online, away, busy, looking to play or offline.",
      "Planned features and the latest change now shows in app."
    ],
    fix: [
      "Messages will no longer show twice when sending.",
      "Adjusted padding on some places.",
      "Message font is now much smaller."
    ]
  },
  {
    title: "Send and receive messages (experimental)",
    shortTitle: "Send and receive messages",
    date: "14/01/2019",
    new: ["You can now send messages to your friends!"],
    next: [
      "improving the new messaging functionality and adding typing indicators, online statuses."
    ]
  },

  {
    title: "Public change log, Accept friends",
    shortTitle: "Public change log, Accept friends",
    date: "09/01/2019",
    new: [
      "Added a change log so you can see how much progress is being made to Nertivia.",
      "Adding friends, denying requests, accepting requests is now possible."
    ],
    next: ["Ability to send messages."]
  },

  {
    title: "Issues fixed",
    shortTitle: "Issues fixed",
    date: "04/01/2019",
    msg: "Tweaks have been made to the website here and there."
  },

  {
    title: "Compatibility",
    date: "31/12/2018",
    msg:
      "Website is now compatible for viewing on mobile, tablet and desktop devices."
  }
];

export default config;
