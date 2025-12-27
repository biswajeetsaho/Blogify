import { Box, Chip, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type  { Category } from './types';

interface CategorySliderProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const CategorySlider = ({ categories, selected, onSelect }: CategorySliderProps) => (
  <Box sx={{ overflowX: 'auto', py:2, px: 20, bgcolor: 'background.paper' }}>
    <Stack direction="row" spacing={1}>
      <Chip
        icon={<AddIcon />}
        label="All Category"
        color="primary"
        clickable
        onClick={() => onSelect(null)}
        variant={selected === null ? 'filled' : 'outlined'}
      />
      {categories.map((cat) => (
        <Chip
          key={cat._id}
          label={cat.name}
          clickable
          color={selected === cat._id ? 'primary' : 'default'}
          onClick={() => onSelect(cat._id)}
          variant={selected === cat._id ? 'filled' : 'outlined'}
        />
      ))}
    </Stack>
  </Box>
);

export default CategorySlider;
