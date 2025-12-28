import { useEffect } from 'react';
import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchRecommendations, fetchRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../redux/slices/friendSlice';
import UserCard from './UserCard';

const PeopleCarousel = () => {
    const dispatch = useAppDispatch();
    const { recommendations, sentRequests, receivedRequests, loading } = useAppSelector((state) => state.friends);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchRecommendations());
            dispatch(fetchRequests());
        }
    }, [dispatch, user]);

    if (!user) return null;

    // We show recommendations. 
    // ALSO, if we want to show 'requests' here, we could mix them? 
    // User asked: "donot show the person thouse are my friend of my" -> handled by backend recommendations.
    // "show accept the request" -> implicit: if they are in receivedRequests.
    // Backend recommendations EXCLUDES pending requests. 
    // So we should merge: [ReceivedRequests] + [Recommendations]
    // Ideally we show pending received requests first.

    // NOTE: recommendations from backend already excludes sent/received/friends.

    const handleAdd = (id: string) => {
        dispatch(sendFriendRequest(id));
    };

    const handleCancel = (id: string) => {
        dispatch(rejectFriendRequest(id)); // reject works for cancel too
    };

    const handleAccept = (id: string) => {
        dispatch(acceptFriendRequest(id));
    };


    return (
        <Box sx={{ mt: 6, mb: 10 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                People You May Know
            </Typography>

            {loading && recommendations.length === 0 ? (
                <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
                <Stack direction="row" spacing={3} sx={{ overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { display: 'none' } }}>

                    {/* 1. Received Requests (Show Accept) */}
                    {receivedRequests.map(u => (
                        <Box key={u._id}>
                            <UserCard
                                user={u}
                                actionType="accept"
                                onAction={() => handleAccept(u._id)}
                            />
                        </Box>
                    ))}

                    {/* 2. Sent Requests (Show Cancel - if we want to show them here? Usually separate, but user said 'place of add show cancel') */}
                    {/* If the recommendations list contained them, we would change button. 
                    But getRecommendationsService EXCLUDES sent requests. 
                    So we should append SentRequests here if we want to see them?
                    User said: "when i send friend request in the place of add to friend show cancel friend"
                    Implying they should be visible. 
                */}
                    {sentRequests.map(u => (
                        <Box key={u._id}>
                            <UserCard
                                user={u}
                                actionType="cancel"
                                onAction={() => handleCancel(u._id)}
                            />
                        </Box>
                    ))}


                    {/* 3. Recommendations (Show Add) */}
                    {recommendations.map(u => (
                        <Box key={u._id}>
                            <UserCard
                                user={u}
                                actionType="add"
                                onAction={() => handleAdd(u._id)}
                            />
                        </Box>
                    ))}

                    {recommendations.length === 0 && sentRequests.length === 0 && receivedRequests.length === 0 && (
                        <Typography color="text.secondary">No recommendations available right now.</Typography>
                    )}
                </Stack>
            )}
        </Box>
    );
};

export default PeopleCarousel;
