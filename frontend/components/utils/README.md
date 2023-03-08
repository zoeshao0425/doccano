## utils

This folder contains utility components that can be used across the application. 
The following is a brief description of each file:

# ActionMenu.vue
This component creates a dropdown menu button that can be used to perform various actions. 
It accepts two props: text and items. 
The text prop specifies the text that should be displayed on the button, 
while the items prop is an array of objects that represent the items in the dropdown menu. 
Each object should have the following properties: event, icon, and title. 
The event property is the name of the event that should be emitted when the item is clicked, 
icon is the icon to be displayed next to the item, and title is the text to be displayed 
for the item.

# BaseCard.vue
This component creates a card that can be used to display information and perform actions. 
It accepts four props: title, cancelText, agreeText, and disabled. 
The title prop specifies the title of the card, while the cancelText and agreeText props 
specify the text to be displayed on the cancel and agree buttons respectively. 
The disabled prop disables the agree button if set to true. 
The component emits two events: cancel and agree, which are triggered when the cancel 
and agree buttons are clicked respectively.

# ConfirmForm.vue
This component creates a confirmation dialog box that can be used to confirm an action. 
It accepts six props: title, message, items, itemKey, buttonTrueText, and buttonFalseText. 
The title prop specifies the title of the confirmation dialog, while the message prop 
specifies the message to be displayed in the dialog. The items prop is an array of 
objects that represent the items to be displayed in the dialog. 
The itemKey prop specifies the key of the object that should be displayed as the item. 
The buttonTrueText and buttonFalseText props specify the text to be displayed on the 
confirm and cancel buttons respectively. The component emits two events: ok and cancel, 
which are triggered when the confirm and cancel buttons are clicked respectively.