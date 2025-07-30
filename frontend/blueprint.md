**Overview:** Implement an event listener for the `DonationReceived` event emitted by the smart contract. When the event is detected, display a success alert to the user confirming the donation.

**Steps:**

1. Import necessary components (`Alert`, `CheckIcon`) from Material UI.
2. Add state to manage the visibility of the success alert.
3. In the `useEffect` hook where the contract and account are available, add an event listener for the `DonationReceived` event on the contract instance.
4. The event listener callback function should update the state to display the success alert and potentially hide the modal.
5. Include the `AlertEvent` component in the DonatePage JSX, passing the `showAlert` state and the desired message as props.
6. Remove the `setTimeout` in `handleConfirmTransaction` that hides the modal, as the modal will be hidden when the event is received.
7. Add necessary dependencies to the `useEffect` hook.
8. Modify the `handleConfirmTransaction` function to not hide the modal on success, but wait for the event listener to handle it.
9. Update the `AlertEvent` component to automatically show the alert when the `message` prop changes and hide after a few seconds with a fancy animation.
10. Position the alert at the top center of the page using fixed and absolute positioning.
11. In the `DonatePage`, remove the `showAlert` state and its related logic, and instead pass the donation confirmation message directly to the `AlertEvent` component when the `DonationReceived` event is triggered.
