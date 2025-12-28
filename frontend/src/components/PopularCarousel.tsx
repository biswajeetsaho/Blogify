import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Stack, Card, CardMedia, CardContent,
  Avatar, CardActionArea, IconButton, Chip
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleLikeBlog } from '../redux/slices/blogSlice';
import { setSharingBlogId } from '../redux/slices/friendSlice';
import type { Blog, User } from './types';

interface PopularCarouselProps {
  blogs: Blog[];
}

const PopularCarousel = ({ blogs }: PopularCarouselProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort blogs by likesCount descending
  const sorted = [...blogs].sort((a, b) => b.likesCount - a.likesCount);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth; // Scroll by one full view
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', px: { xs: 2, md: 20 }, py: 6, bgcolor: 'background.default' }}>
      <Typography variant="h4" fontWeight={800} mb={4} color="text.primary" sx={{ textAlign: 'center' }}>
        Popular Stories
      </Typography>

      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Left Navigation Arrow */}
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: -20,
            zIndex: 10,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'grey.100' },
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            gap: 3,
            pb: 4,
            px: 1,
            '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            width: '100%'
          }}
        >
          {sorted.slice(0, 9).map((blog) => {
            const author = blog.author as unknown as User;
            const image = blog.media.find((m) => m.fileType === 'image');
            const category = blog.categories?.[0] || 'General';
            const isLiked = user && blog.likedUsers?.includes(user._id);

            const handleLikeClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (user) {
                dispatch(toggleLikeBlog(blog._id));
              }
            };

            return (
              <Card
                key={blog._id}
                sx={{
                  minWidth: { xs: '85%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
                  scrollSnapAlign: 'start',
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {image && (
                    <CardMedia
                      component="img"
                      height="220"
                      image={image.filePath.startsWith('/uploads') ? `http://localhost:3000${image.filePath}` : image.filePath}
                      alt={blog.title}
                      sx={{ filter: 'brightness(0.9)' }}
                    />
                  )}
                  {/* Category Badge - Positioned at bottom-left of image */}
                  <Chip
                    label={category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)',
                      color: 'primary.main',
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      px: 1
                    }}
                  />
                </Box>

                <CardActionArea onClick={() => navigate(`/blog/${blog._id}`)}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '3.2rem',
                        lineHeight: 1.2
                      }}
                    >
                      {blog.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={3}
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.5rem'
                      }}
                    >
                      {blog.subtitle}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light', fontSize: '1rem' }}>
                        {author?.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {author?.username || 'Writer'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={0} alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mr: 1 }}>
                          <IconButton
                            size="small"
                            onClick={handleLikeClick}
                            disabled={!user}
                            sx={{
                              color: isLiked ? 'error.main' : 'text.secondary',
                              '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' },
                              p: 0.5
                            }}
                          >
                            {isLiked ? (
                              <FavoriteIcon fontSize="small" />
                            ) : (
                              <FavoriteBorderIcon fontSize="small" />
                            )}
                          </IconButton>
                          <Typography variant="caption" fontWeight={700}>{blog.likesCount}</Typography>
                        </Stack>
                        <IconButton
                          size="small"
                          sx={{ color: 'text.secondary' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSharingBlogId(blog._id));
                          }}
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>

        {/* Right Navigation Arrow */}
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: -20,
            zIndex: 10,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'grey.100' },
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PopularCarousel;
