import { Avatar, Box, Button, Card, Typography } from '@mui/material';
import { PersonAdd, PersonRemove, Check } from '@mui/icons-material';

interface User {
    _id: string;
    username: string;
    email: string;
}

interface UserCardProps {
    user: User;
    actionType?: 'add' | 'cancel' | 'accept'; // default 'add'
    onAction: () => void;
    disabled?: boolean;
}

const UserCard = ({ user, actionType = 'add', onAction, disabled }: UserCardProps) => {

    let ButtonIcon = PersonAdd;
    let buttonText = "Add Friend";
    let buttonColor: "primary" | "error" | "success" = "primary";

    if (actionType === 'cancel') {
        ButtonIcon = PersonRemove;
        buttonText = "Cancel Request";
        buttonColor = "error";
    } else if (actionType === 'accept') {
        ButtonIcon = Check;
        buttonText = "Accept Request";
        buttonColor = "success";
    }

    return (
        <Card sx={{
            width: 160,
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            borderRadius: 4,
            boxShadow: 2,
            transition: '0.3s',
            '&:hover': { translateY: -4, boxShadow: 6 }
        }}>
            <Avatar sx={{ width: 64, height: 64, mb: 2, bgcolor: 'primary.light', fontSize: '1.5rem' }}>
                {user.username?.[0]?.toUpperCase()}
            </Avatar>

            <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ maxWidth: '100%' }}>
                {user.username}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Button
                variant={actionType === 'cancel' ? "outlined" : "contained"}
                color={buttonColor}
                size="small"
                startIcon={<ButtonIcon fontSize="small" />}
                onClick={(e) => {
                    e.stopPropagation();
                    onAction();
                }}
                disabled={disabled}
                sx={{
                    textTransform: 'none',
                    borderRadius: 10,
                    fontSize: '0.75rem',
                    width: '100%',
                    mt: 1
                }}
            >
                {buttonText}
            </Button>
        </Card>
    );
};

export default UserCard;
