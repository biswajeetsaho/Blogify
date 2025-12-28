const { User } = require("../utils/connection");

/*
  RELATIONSHIP LOGIC:
  - friends: both IDs in each other's friends array.
  - sentFriendRequests: ID in sender's sent array.
  - receivedFriendRequests: ID in recipient's received array.
*/

// Get users who are NOT friends and NOT in pending requests
const getRecommendationsService = async (userId) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) throw new Error("User not found");

  const excludeIds = [
    userId,
    ...currentUser.friends,
    ...currentUser.sentFriendRequests,
    ...currentUser.receivedFriendRequests
  ];

  // Fetch up to 10 users not in the exclude list
  const users = await User.find({ _id: { $nin: excludeIds } })
    .select("username _id email")
    .limit(10);

  return users;
};

const getFriendsService = async (userId) => {
  const user = await User.findById(userId).populate("friends", "username _id email");
  if (!user) throw new Error("User not found");
  return user.friends;
};

const getRequestsService = async (userId) => {
  const user = await User.findById(userId)
    .populate("sentFriendRequests", "username _id email")
    .populate("receivedFriendRequests", "username _id email");
  if (!user) throw new Error("User not found");

  return {
    sent: user.sentFriendRequests,
    received: user.receivedFriendRequests
  };
};

const sendRequestService = async (requesterId, recipientId) => {
  if (requesterId === recipientId) throw new Error("Cannot add yourself");

  const requester = await User.findById(requesterId);
  const recipient = await User.findById(recipientId);

  if (!requester || !recipient) throw new Error("User not found");

  // Check if already friends
  if (requester.friends.includes(recipientId)) {
    throw new Error("Already friends");
  }

  // Check if already sent
  if (requester.sentFriendRequests.includes(recipientId)) {
    throw new Error("Request already sent");
  }

  // Check if recipient already sent to us (then just accept?)
  // For simplicity, strict flow: if they sent to us, we should accept THAT request, not send new.
  if (requester.receivedFriendRequests.includes(recipientId)) {
    return acceptRequestService(requesterId, recipientId);
  }

  // Update Arrays
  requester.sentFriendRequests.push(recipientId);
  recipient.receivedFriendRequests.push(requesterId);

  await requester.save();
  await recipient.save();

  return { message: "Request sent" };
};

const acceptRequestService = async (userId, requesterId) => {
  const user = await User.findById(userId);
  const requester = await User.findById(requesterId);

  if (!user || !requester) throw new Error("User not found");

  // Verify request exists
  if (!user.receivedFriendRequests.includes(requesterId)) {
    throw new Error("No request found from this user");
  }

  // Add to friends
  user.friends.push(requesterId);
  requester.friends.push(userId);

  // Remove from requests
  user.receivedFriendRequests = user.receivedFriendRequests.filter(id => id.toString() !== requesterId);
  requester.sentFriendRequests = requester.sentFriendRequests.filter(id => id.toString() !== userId);

  await user.save();
  await requester.save();

  return { message: "Friend added" };
};

const rejectRequestService = async (userId, targetId) => {
  // Can be used to Cancel sent request OR Reject received request
  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!user || !target) throw new Error("User not found");

  // Case 1: Cancel Sent
  if (user.sentFriendRequests.includes(targetId)) {
    user.sentFriendRequests = user.sentFriendRequests.filter(id => id.toString() !== targetId);
    target.receivedFriendRequests = target.receivedFriendRequests.filter(id => id.toString() !== userId);
  }
  // Case 2: Reject Received
  else if (user.receivedFriendRequests.includes(targetId)) {
    user.receivedFriendRequests = user.receivedFriendRequests.filter(id => id.toString() !== targetId);
    target.sentFriendRequests = target.sentFriendRequests.filter(id => id.toString() !== userId);
  }
  // Case 3: Remove Friend (Unfriend) - Optional, but good to have
  else if (user.friends.includes(targetId)) {
    user.friends = user.friends.filter(id => id.toString() !== targetId);
    target.friends = target.friends.filter(id => id.toString() !== userId);
  }
  else {
    throw new Error("No relationship found to cancel/reject");
  }

  await user.save();
  await target.save();

  return { message: "Relationship updated" };
};

module.exports = {
  getRecommendationsService,
  getFriendsService,
  getRequestsService,
  sendRequestService,
  acceptRequestService,
  rejectRequestService
};
