// Store the current activity
let currentActivity = "";
let currentParticipants = "";
// Store all saved activities
const savedActivities = [];

// Login function
function login() {
  // Get the username input
  const username =
    document.getElementById("username").value.trim();
  // Get the password input
  const password =
    document.getElementById("password").value.trim();
  // Get the login message area
  const loginMessage =
    document.getElementById("login-message");
  // Simple login information
  const correctUsername = "admin";
  const correctPassword = "123";
  // Check the username and password
  if (
    username === correctUsername &&
    password === correctPassword
  ) {
    // Hide login page
    document.getElementById("login-section").style.display =
      "none";
    // Show dashboard
    document.getElementById("dashboard").style.display =
      "block";
    // Clear error message
    loginMessage.textContent = "";
  } else {
    loginMessage.textContent =
      "Incorrect username or password.";
  }
}

// Logoout function
function logout() {
  // Hide dashboard
  document.getElementById("dashboard").style.display =
    "none";
  // Show login page
  document.getElementById("login-section").style.display =
    "block";
  // Clear username
  document.getElementById("username").value = "";
  // Clear password
  document.getElementById("password").value = "";
}

/* GET RANDOM ACTIVITY */
async function getActivity() {
  // Get elements from the HTML
  const activityDisplay =
    document.getElementById("activity");
  const participantsDisplay =
    document.getElementById("participants");
  const activityMessage =
    document.getElementById("activity-message");
  const saveButton =
    document.getElementById("save-button");
  // Show loading message
  activityDisplay.textContent = "Loading...";
  participantsDisplay.textContent =
    "Suitable for how many persons: Loading...";
  activityMessage.textContent = "";
  // Disable Save while loading
  saveButton.disabled = true;

  try {
    // ADDED: stop the request if it takes too long
    const controller = new AbortController();
    const timeout = setTimeout(function () {
      controller.abort();
    }, 8000);
    console.log("Starting fetch...");
    // Fetch activity
    const response = await fetch(
      "https://random-activity-sigmo.vercel.app/api/random",
      {
        signal: controller.signal
      }
    );
    // Stop the timeout because fetch succeeded
    clearTimeout(timeout);
    console.log("Fetch finished:", response);
    // Check if the API request was successful
    if (!response.ok) {
      throw new Error("Could not get activity");
    }
    // Convert response to JavaScript object
    const data = await response.json();
    console.log("API data:", data);
    // Handle missing activity field
    currentActivity =
      data.activity ?? "Activity not available";
    // Handle missing participants field
    currentParticipants =
      data.participants ?? "Suitable for: Not known, depends on your preference.";
    // Display the activity
    activityDisplay.textContent =
      currentActivity;
    // Display participants
    participantsDisplay.textContent =
      "Suitable for how many persons: " +
      currentParticipants;
    // Enable Save button
    saveButton.disabled = false;

  } catch (error) {
    // Reset current values
    currentActivity = "";
    currentParticipants = "";
    activityDisplay.textContent =
      "Unable to load an activity.";
    participantsDisplay.textContent =
      "Suitable for how many persons: -";
    activityMessage.textContent =
      "Please try again.";
    activityMessage.className =
      "text-danger mt-3";
    console.error("API ERROR:", error);
  }
}

/* SAVE ACTIVITY */
function saveActivity() {
  const activityMessage =
    document.getElementById("activity-message");
  // Check that an activity exists
  if (currentActivity === "") {
    activityMessage.textContent =
      "Get an activity first.";
    return;
  }
  // Check whether activity was already saved
  if (savedActivities.includes(currentActivity)) {
    activityMessage.textContent =
      "You already saved this activity. Get something else.";
    activityMessage.className =
      "text-warning mt-3";
    return;
  }
  // Add activity to savedActivities array
  savedActivities.push(currentActivity);
  // Display the updated list
  displaySavedActivities();
  // Show success message
  activityMessage.textContent =
    "Activity saved!";
  activityMessage.className =
    "text-success mt-3";
}

/* DISPLAY SAVED ACTIVITIES */
function displaySavedActivities() {
  const savedList =
    document.getElementById("saved-list");
  const emptyMessage =
    document.getElementById("empty-message");
  // Clear the old list
  savedList.innerHTML = "";
  // If there are no saved activities
  if (savedActivities.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
  // Display every saved activity
  savedActivities.forEach(function (activity, index) {
    // Create a new list item
    const listItem =
      document.createElement("li");
    // Add the activity text
    listItem.textContent = activity + " ";
    // Create a Delete button
    const deleteButton =
      document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn btn-danger btn-sm";
    // Delete this activity when clicked
    deleteButton.onclick = function () {
      deleteActivity(index);
    };
    function deleteActivity(index) {
      savedActivities.splice(index, 1);
      displaySavedActivities();
    }
    // Put the Delete button inside the list item
    listItem.appendChild(deleteButton);
    // Put the list item on the page
    savedList.appendChild(listItem);
  });
}
