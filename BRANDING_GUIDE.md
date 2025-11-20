# KaamHeru Branding Guide

## 🎨 Color Palette

### Primary Colors - Professional Blue
Our primary color palette represents trust, reliability, and professionalism.

- **Primary Blue**: `#1976d2` - Main brand color for CTAs, headers, and important elements
- **Light Blue**: `#42a5f5` - Hover states and secondary actions  
- **Dark Blue**: `#1565c0` - Pressed states and emphasis

### Secondary Colors - Professional Gray
Gray tones provide balance and sophistication to our design.

- **Medium Gray**: `#757575` - Secondary text and less prominent elements
- **Light Gray**: `#f5f5f5` - Backgrounds and subtle dividers
- **Dark Gray**: `#212121` - Primary text and high-contrast elements

### Background Colors
Clean backgrounds ensure readability and focus.

- **Default Background**: `#f5f5f5` - Light gray for main app background
- **Paper Background**: `#ffffff` - White for cards, forms, and content areas

### Status Colors
Clear visual indicators for different states.

- **Success**: `#2e7d32` - Completed projects, successful actions
- **Warning**: `#ed6c02` - Delayed projects, caution states
- **Error**: `#d32f2f` - Failed actions, errors, cancelled projects
- **Info**: `#0288d1` - Information messages, in-progress states

## 🏗️ Typography

### Font Family
**Roboto** - Clean, modern, and highly readable

- Primary: `"Roboto", "Helvetica", "Arial", sans-serif`

### Font Hierarchy

#### Headings
- **H1**: 2.5rem, Weight 500, Primary Blue
- **H2**: 2rem, Weight 500, Primary Blue  
- **H3**: 1.75rem, Weight 500, Primary Blue
- **H4**: 1.5rem, Weight 500, Dark Gray
- **H5**: 1.25rem, Weight 500, Dark Gray
- **H6**: 1rem, Weight 500, Dark Gray

#### Body Text
- **Body 1**: 1rem, Line Height 1.6, Dark Gray
- **Body 2**: 0.875rem, Line Height 1.5, Medium Gray

#### Buttons
- No text transformation
- Weight 500
- Consistent sizing across all button types

## 🎯 Component Styling

### Buttons
- **Border Radius**: 8px
- **Padding**: 8px 16px
- **Contained**: Blue gradient background
- **Outlined**: Blue border, transparent background
- **Hover**: Subtle shadow effect

### Cards
- **Border Radius**: 12px
- **Shadow**: 0 2px 8px rgba(0, 0, 0, 0.1)
- **Border**: 1px solid #e0e0e0
- **Hover**: Enhanced shadow effect

### Form Fields
- **Border Radius**: 8px
- **Focus**: Blue border, 2px width
- **Hover**: Light blue border

### Navigation
- **App Bar**: White background, light shadow
- **Drawer**: White background, right border
- **List Items**: 8px border radius, subtle hover effect

## 🏛️ Role-Based Colors

Different user roles have distinct colors for easy identification:

- **Public Users**: Primary Blue `#1976d2`
- **Contractors**: Warning Orange `#ed6c02`
- **Admin**: Error Red `#d32f2f`

## 🗺️ Municipality Colors

Each municipality has a unique color for visual differentiation:

- **Bharatpur**: Primary Blue `#1976d2`
- **Ratnanagar**: Success Green `#2e7d32`
- **Kawasoti**: Warning Orange `#ed6c02`
- **Gaindakot**: Purple `#7b1fa2`
- **Madhyabindu**: Info Blue `#0288d1`

## 📊 Project Status Colors

Visual indicators for project lifecycle:

- **Planned**: Medium Gray `#757575`
- **In Progress**: Primary Blue `#1976d2`
- **Delayed**: Warning Orange `#ed6c02`
- **Completed**: Success Green `#2e7d32`
- **Cancelled**: Error Red `#d32f2f`

## 🎨 Logo Usage

### Logo Variants
- **Full Logo**: Icon + "KaamHeru" text with Nepali subtitle
- **Icon Only**: "के" character in blue gradient box

### Logo Sizes
- **Small**: 32px height
- **Medium**: 40px height (default)
- **Large**: 48px height

### Logo Colors
- **Icon**: Blue gradient (`#1976d2` to `#42a5f5`)
- **Text**: Primary blue for "KaamHeru"
- **Subtitle**: Medium gray for "कामहेरू"

## 🌈 Gradients

Professional gradients for enhanced visual appeal:

- **Primary**: `linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)`
- **Secondary**: `linear-gradient(135deg, #546e7a 0%, #78909c 100%)`
- **Success**: `linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)`
- **Warning**: `linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)`
- **Error**: `linear-gradient(135deg, #d32f2f 0%, #f44336 100%)`

## 📐 Spacing & Layout

### Grid System
- **Container Max Width**: 1200px
- **Gutter**: 16px
- **Margins**: 8px, 16px, 24px, 32px

### Component Spacing
- **Card Padding**: 16px
- **Button Padding**: 8px 16px
- **Form Field Margin**: 16px
- **Section Margin**: 24px

## 🎭 Interactive States

### Hover Effects
- **Buttons**: Subtle shadow, slight color shift
- **Cards**: Enhanced shadow
- **List Items**: Light blue background
- **Links**: Blue color with underline

### Focus States
- **Form Fields**: Blue border, 2px width
- **Buttons**: Outline ring
- **Interactive Elements**: Visible focus indicator

### Active States
- **Buttons**: Darker background, pressed appearance
- **Navigation**: Selected state with blue background

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 0px - 599px
- **Tablet**: 600px - 899px  
- **Desktop**: 900px - 1199px
- **Large Desktop**: 1200px+

### Mobile Considerations
- Larger touch targets (minimum 44px)
- Simplified navigation
- Stacked layouts
- Optimized form fields

## 🚫 Usage Guidelines

### Do's
- ✅ Use primary blue for main CTAs
- ✅ Maintain consistent spacing
- ✅ Use appropriate colors for status indicators
- ✅ Keep text readable with proper contrast
- ✅ Use gradients sparingly for emphasis

### Don'ts
- ❌ Don't use multiple primary colors together
- ❌ Don't override theme colors arbitrarily
- ❌ Don't use bright colors for large backgrounds
- ❌ Don't mix different font families
- ❌ Don't use shadows excessively

## 🛠️ Implementation

### Using Colors in Code
```javascript
import { useKaamHeruColors } from '../utils/colorUtils';

const MyComponent = () => {
  const { getProjectStatus, getRoleColor } = useKaamHeruColors();
  
  return (
    <Box sx={{ color: getProjectStatus('completed') }}>
      Completed Project
    </Box>
  );
};
```

### Custom Theme Usage
```javascript
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Button 
      sx={{ 
        background: theme.palette.gradients.primary,
        color: theme.palette.primary.contrastText 
      }}
    >
      Primary Action
    </Button>
  );
};
```

## 📋 Asset Requirements

### Logo Files
- SVG format for scalability
- PNG fallbacks for older browsers
- Multiple sizes: 32px, 40px, 48px, 64px

### Icon Guidelines
- Material Design Icons consistency
- 24px standard size
- Blue primary color with gray alternatives

### Image Specifications
- WebP format for better compression
- Responsive images with srcset
- Proper alt text for accessibility

---

This branding guide ensures consistency across all KaamHeru interfaces while maintaining a professional, trustworthy appearance that reflects the importance of municipal transparency and accountability.
