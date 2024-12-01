document.addEventListener("DOMContentLoaded", () => {
    navigateTo(window.location.hash);
});

window.addEventListener("hashchange", () => {
    navigateTo(window.location.hash);
});

function navigateTo(hash) {
    switch (hash) {
        case "#/signup":
            loadSignupPage();
            break;
        case "#/login":
            loadLoginPage();
            break;
        case "#/all-users":
            loadAllUsersPage();
            break;
        case "#/friend-requests":
            loadFriendRequestsPage();
            break;
        case "#/friend-list":
            loadFriendsPage();
            break;
        case "#/chat":
            loadChatPage();
            break;
        default:
            loadSignupPage();
            break;
    }
}

// Function to display search results
function displayUserResults(users) {
    const resultsContainer = document.getElementById("userResults");
    resultsContainer.innerHTML = '';  // Clear previous results
  
    if (users.length === 0) {
      resultsContainer.innerHTML = '<p>No user found.</p>';
    } else {
      // If only one user is found, display their email
      const user = users[0];
      resultsContainer.innerHTML = `
        <p>User found:</p>
        <p class="my-2">${user.email}</p>`;
    }
  }
  

// Render header and footer (same as before)
function renderHeader() {
    return `
        <header>
            <h1>Mo file share</h1>
            <nav>
                <a href="#/login">Login</a>  
                <a href="#/signup">Signup</a>
                <a href="#/all-users">Search Users</a> 
                <a href="#/friend-requests">Friend Request</a>
                <a href="#/friend-list">Friends</a>    
                <a href="#/chat">Chat</a>
            </nav>
        </header>`;
}

function renderFooter() {
    return `
        <footer>
            <p>&copy; Made By Eklavya</p>
        </footer>`;
}

function loadPageContent(content) {
    const app = document.getElementById("app");
    if (app) {
        app.innerHTML = renderHeader() + content + renderFooter();
    } else {
        console.error("Element with id 'app' not found.");
    }
}

function loadLoginPage() {
    const loginContent = `
<div class="wrapper" style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100%; background-color: #f5f5f5;">
    <div class="form-container" style="width: 100%; max-width: 500px; padding: 20px; background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px;">
        <div class="slide-controls" style="margin-bottom: 20px; text-align: center;">
            <label for="login" class="slide login" style="font-size: 24px; font-weight: bold; color: #333;">Login</label>
        </div>
        <div class="form-inner">
            <form class="login" id="loginForm" style="display: flex; flex-direction: column; gap: 20px;">
                <div class="field" style="margin-bottom: 15px;">
                    <input type="text" placeholder="Email Address" required id="loginEmail" style="width: 100%; padding: 15px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;">
                </div>
                <div class="field" style="margin-bottom: 15px;">
                    <input type="password" placeholder="Password" required id="loginPassword" style="width: 100%; padding: 15px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;">
                </div>
                <div class="field" style="text-align: center; color: black;">
                    <input type="submit" value="Login" style="background-color: #4CAF50; color: white; border: none; padding: 15px; font-size: 16px; border-radius: 5px; cursor: pointer; width: 100%; transition: background-color 0.3s ease;">
                </div>
            </form>
        </div>
    </div>
</div>
`;
    loadPageContent(loginContent);

    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token); // Save token for authentication
                alert(data.message);
                window.location.hash = '/all-users';
                loadAllUsersPage();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Login failed. Please try again.'+ error);
        }
    });
}


// Signup Page (redirect to All Users page on success)
function loadSignupPage() {
    const signupContent = `
<div class="wrapper" style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100%; background-color: #f5f5f5;">
    <div class="form-container" style="width: 100%; max-width: 500px; padding: 20px; background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px;">
        <div class="slide-controls" style="margin-bottom: 20px; text-align: center;">
            <label for="signup" class="slide signup" style="font-size: 24px; font-weight: bold; color: #333;">Signup</label>
            <div class="slide-tab" style="margin-top: 10px; width: 50px; height: 4px; background-color: #4CAF50; border-radius: 2px; margin-left: auto; margin-right: auto;"></div>
        </div>
        <div class="form-inner">
            <form class="signup" id="signupForm" style="display: flex; flex-direction: column; gap: 20px;">
                <div class="field" style="margin-bottom: 15px;">
                    <input type="text" placeholder="Email Address" required id="signupEmail" style="width: 100%; padding: 15px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;">
                </div>
                <div class="field" style="margin-bottom: 15px;">
                    <input type="password" placeholder="Password" required id="signupPassword" style="width: 100%; padding: 15px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;">
                </div>
                <div class="field" style="margin-bottom: 15px;">
                    <input type="password" placeholder="Confirm Password" required id="confirmPassword" style="width: 100%; padding: 15px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;">
                </div>
                <div class="field" style="text-align: center; color: black;">
                    <input type="submit" value="Signup" style="background-color: #4CAF50; color: white; border: none; padding: 15px; font-size: 16px; border-radius: 5px; cursor: pointer; width: 100%; transition: background-color 0.3s ease;">
                </div>
            </form>
        </div>
    </div>
</div>`;

    loadPageContent(signupContent);

    // Handle signup form submission
    document.getElementById("signupForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.hash = '/home';
                loadLoginPage();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Signup failed. Please try again.');
        }
    });
}

function loadAllUsersPage() {
    const allUsersContent = `
        <div class="text-center my-4" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh; width: 100%; background-color: #f5f5f5;">
            <div style="width: 100%; max-width: 600px; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
                    <input type="text" id="searchInput" placeholder="Search by name or email" class="p-2" 
                        style="width: 80%; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; margin-right: 10px;">
                    <button id="searchButton" class="p-2" 
                            style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                        Search
                    </button>
                </div>
                <div id="userResults" style="margin-top: 20px; color: #333;"></div>
            </div>
        </div>`;
    loadPageContent(allUsersContent);

    // Add event listener to the search button
    document.getElementById("searchButton").addEventListener("click", searchUsers);
}

// Function to handle the search
async function searchUsers() {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        alert("Please enter a search query.");
        return;
    }

    try {
        const response = await fetch(`/all-users?query=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();

        if (response.ok) {
            const users = data.users.map(user => `
                <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px; background-color: #f9f9f9; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 16px; color: #333;">${user.username}</span>
                    <button onclick="sendFriendRequest('${user.username}')" 
                            style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; font-size: 14px; cursor: pointer;">
                        Send Friend Request
                    </button>
                </div>
            `).join('');

            const allUsersContent = `
                <div class="text-center my-4" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh; width: 100%; background-color: #f5f5f5;">
                    <div style="width: 100%; max-width: 600px; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
                            <input type="text" id="searchInput" placeholder="Search by name or email" class="p-2" 
                                style="width: 80%; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; margin-right: 10px;">
                            <button id="searchButton" class="p-2" 
                                    style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                                Search
                            </button>
                        </div>
                        <div id="userResults" style="margin-top: 20px; color: #333;">
                            ${users || '<p style="text-align: center; color: #666;">No users found.</p>'}
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("app").innerHTML = allUsersContent;

            // Reattach the search button listener for reusability
            document.getElementById("searchButton").addEventListener("click", fetchAndDisplayUsers);
        } else {
            alert(data.message || 'Error searching for users.');
        }
    } catch (error) {
        alert('Error connecting to the server. Please try again.' + errpr);
    }
}

// Function to display search results
function displayUserResults(users) {
    const resultsContainer = document.getElementById("userResults");
    resultsContainer.innerHTML = ''; // Clear previous results

    if (users.length === 0) {
        resultsContainer.innerHTML = '<p>No user found.</p>';
    } else {
        users.forEach(user => {
            const userId = sessionStorage.getItem('userId');
            const isFollowing = user.followers && user.followers.includes(userId);  // Assuming followers are an array of userIds

            resultsContainer.innerHTML += `
                <div class="user-result my-2 p-4 border-b">
                    <p>${user.email}</p>
                    <button class="subscribe-btn p-2 ${isFollowing ? 'bg-red-500' : 'bg-blue-500'} text-white rounded" 
                            data-user-id="${user._id}">
                        ${isFollowing ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                </div>`;
        });

        // Add event listeners for subscribe/unsubscribe buttons
        const subscribeButtons = document.querySelectorAll(".subscribe-btn");
        subscribeButtons.forEach(button => {
            button.addEventListener("click", handleFollowUnfollow);
        });
    }
}
// Send Friend Request
async function sendFriendRequest(username) {
    try {
        const response = await fetch('/friend-request', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ targetUsername: username })
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert('Error sending friend request.');
    }
}

// Load Friends Page
async function loadFriendsPage() {
    try {
        const response = await fetch('/friends', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();

        if (response.ok) {
            const friends = data.friends.map(username => `
                <div>${username}</div>
            `).join('');
            loadPageContent(`
                <div>
                    <h2>Your Friends</h2>
                    ${friends || '<p>You have no friends yet.</p>'}
                </div>
            `);
        } else {
            alert(data.message || 'Error loading friends.');
        }
    } catch (error) {
        alert('Error connecting to the server.');
    }
}

// Load Friend Requests Page
async function loadFriendRequestsPage() {
    try {
        const response = await fetch('/friend-requests', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();

        if (response.ok) {
            const requestsContent = data.requests.map(request => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd;">
                    <span style="font-size: 18px; color: #333;">${request.from}</span>
                    <div>
                        <button onclick="acceptFriendRequest('${request.from}')" 
                            style="padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                            Accept
                        </button>
                        <button onclick="declineFriendRequest('${request.from}')" 
                            style="padding: 10px 15px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Decline
                        </button>
                    </div>
                </div>
            `).join('');

            const requestsPageContent = `
                <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh; width: 100%; background-color: #f5f5f5;">
                    <div style="width: 100%; max-width: 600px; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h2 style="text-align: center; font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px;">Pending Friend Requests</h2>
                        ${requestsContent || '<p style="text-align: center; color: #555;">No pending requests.</p>'}
                    </div>
                </div>
            `;

            loadPageContent(requestsPageContent);
        } else {
            alert(data.message || 'Error fetching friend requests.');
        }
    } catch (error) {
        alert('Error connecting to the server.');
    }
}


// Accept Friend Request
async function acceptFriendRequest(fromUsername) {
    try {
        const response = await fetch('/accept-friend', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fromUsername })
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            loadFriendRequestsPage(); // Refresh the list
        } else {
            alert(data.message || 'Error accepting friend request.');
        }
    } catch (error) {
        alert('Error connecting to the server.');
    }
}

// Decline Friend Request
async function declineFriendRequest(fromUsername) {
    try {
        const response = await fetch('/decline-friend', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fromUsername })
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            loadFriendRequestsPage(); // Refresh the list
        } else {
            alert(data.message || 'Error declining friend request.');
        }
    } catch (error) {
        alert('Error connecting to the server.');
    }
}

function loadChatPage() {
    const chatContent = `
        <div style="display: flex; flex-direction: column; height: 100vh;">
            <div style="padding: 10px; background-color: #007bff; color: white; text-align: center; font-size: 18px;">
                Chat with a Friend
            </div>
            <div id="friendSelector" style="padding: 10px;">
                <label for="friendList">Choose a friend to chat:</label>
                <select id="friendList" style="padding: 5px; margin-left: 10px;">
                    <option value="">Select Friend</option>
                </select>
            </div>
            <div id="chatMessages" style="flex: 1; overflow-y: auto; padding: 10px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
                <p style="text-align: center; color: #666;">No conversation yet.</p>
            </div>
            <div style="display: flex; padding: 10px; border-top: 1px solid #ddd;">
                <input id="chatInput" type="text" placeholder="Type a message..." 
                    style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-right: 10px;" />
                <button id="sendButton" style="padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">
                    Send
                </button>
            </div>
        </div>
    `;

    loadPageContent(chatContent);

    const socket = io("http://localhost:9000");
    const friendListDropdown = document.getElementById("friendList");
    const chatMessages = document.getElementById("chatMessages");

    // Fetch and populate friends
    fetch("/friends", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                data.friends.forEach(friend => {
                    const option = document.createElement("option");
                    option.value = friend;
                    option.textContent = friend;
                    friendListDropdown.appendChild(option);
                });
            } else {
                alert("Failed to load friends.");
            }
        });

    let currentRoom = null;

    // Join a chat room when friend is selected
    friendListDropdown.addEventListener("change", async () => {
        const selectedFriend = friendListDropdown.value;
        if (!selectedFriend) return;

        currentRoom = [localStorage.getItem("username"), selectedFriend].sort().join("-");

        chatMessages.innerHTML = "<p style='text-align: center; color: #666;'>Loading messages...</p>";

        // Fetch chat history
        try {
            const response = await fetch(`/chat/${selectedFriend}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await response.json();

            if (data.success) {
                chatMessages.innerHTML = ""; // Clear messages
                data.messages.forEach(({ from, message, timestamp }) => {
                    appendMessage(from, message, new Date(timestamp));
                });
            } else {
                chatMessages.innerHTML = "<p style='text-align: center; color: #666;'>No messages yet.</p>";
            }
        } catch (error) {
            chatMessages.innerHTML = "<p style='text-align: center; color: #666;'>Error loading messages.</p>";
        }

        // Join Socket.IO room
        socket.emit("joinRoom", { room: currentRoom });
    });

    // Send a message
    document.getElementById("sendButton").addEventListener("click", () => {
        sendMessage();
    });

    document.getElementById("chatInput").addEventListener("keydown", (event) => {
        if (event.key === "Enter") sendMessage();
    });

    const sendMessage = async () => {
        const message = document.getElementById("chatInput").value.trim();
        if (!message || !currentRoom) return; // Avoid sending empty messages or without a room
    
        const messagePayload = {
            room: currentRoom,
            from: localStorage.getItem("username"),
            message,
        };
    
        // Append message immediately to the chat UI
        appendMessage("You", message, new Date());
        document.getElementById("chatInput").value = ""; // Clear input field
    
        try {
            // Send the message to the backend for saving
            const response = await fetch("/save-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(messagePayload),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save message.");
            }
        } catch (error) {
            console.error("Error saving message:");
            alert("Message could not be saved. Please try again." + error);
        }
    };
    
    

    const appendMessage = (from, message, timestamp) => {
        const messageDiv = document.createElement("div");
        messageDiv.style.marginBottom = "10px";
        messageDiv.innerHTML = `
            <div style="padding: 10px; background-color: ${from === "You" ? "#d1e7dd" : "#f8d7da"}; border-radius: 5px;">
                <strong>${from}</strong>: ${message}
                <div style="font-size: 12px; text-align: right; color: #666;">${timestamp.toLocaleTimeString()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Receive messages
    socket.on("receiveMessage", ({ from, message, timestamp }) => {
        appendMessage(from, message, new Date(timestamp));
    });
}
