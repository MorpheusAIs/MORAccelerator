# 3D Animated Header Component

This documentation provides details about the animated geometric header component added to the MOR Accelerator project.

## Overview

The animated header component adds a visually stunning 3D animation to the homepage, featuring a rotating torus knot geometry with modern styling and text overlay. This creates a more engaging and professional user experience for visitors.

## Components Created

### 1. `GeometricShapes.tsx`

A Three.js-powered component that renders an animated 3D torus knot geometry with the following features:

- Smooth auto-rotation animation
- Customizable colors and dimensions
- Proper lighting setup (ambient and directional lights)
- Transparent background for seamless integration with the page
- WebGL renderer with anti-aliasing
- Client-side only rendering to prevent hydration errors

### 2. `AnimatedHeader.tsx`

A higher-level component that combines the 3D geometric animation with styled text overlay:

- Positions text content over the 3D animation
- Uses Framer Motion for smooth text animations
- Handles proper z-indexing for content layering
- Provides gradient overlay for better text readability
- Ensures responsive behavior

### 3. `GeometricShapes.module.css`

CSS module file providing styling for the animation container and positioning elements.

## Implementation Details

### Dependencies Added
- Three.js: 3D graphics library for WebGL rendering
- @types/three: TypeScript type definitions for Three.js

### Integration Method
The component is integrated into the homepage using Next.js dynamic imports to ensure client-side only rendering:

```tsx
const AnimatedHeader = dynamic(
  () => import('../components/animation/AnimatedHeader'),
  { ssr: false }
);
```

### Key Features

1. **Client-Side Rendering**: Components are wrapped with a `ClientOnly` component to prevent hydration errors

2. **Performance Optimization**:
   - Proper cleanup of WebGL contexts and animation loops
   - Event listener cleanup on component unmount
   - Optimization of render cycles

3. **Customization Options**:
   - Color customization matches the MOR Accelerator brand
   - Sizing flexibility for different layouts
   - Text overlay customization
   - Animation speed control

## Usage

To use the animated header in other parts of the application:

```tsx
import dynamic from 'next/dynamic';

const AnimatedHeader = dynamic(
  () => import('../components/animation/AnimatedHeader'),
  { ssr: false }
);

// In your component
<AnimatedHeader 
  title="Your Title Here"
  subtitle="Optional subtitle content here" 
  height={400}
  width={800}
  shapeColor="#00FF84"
/>
```

## Customization Options

The `AnimatedHeader` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | (required) | Main title text |
| subtitle | string | undefined | Optional subtitle text |
| height | number | 400 | Height of the animation container |
| width | number | 800 | Maximum width of the animation container |
| shapeColor | string | '#00FF84' | Color of the 3D geometry |
| titleColor | string | 'white' | Color of the title text |
| subtitleColor | string | '#f0f0f0' | Color of the subtitle text |
| className | string | undefined | Additional CSS classes |

The underlying `GeometricShapes` component provides even more customization options:

- `wireframe`: Show the geometry as wireframe
- `rotation`: Enable/disable rotation
- `backgroundColor`: Background color (or 'transparent')
- `autoRotate`: Enable/disable auto-rotation
- `enableZoom`: Allow zooming with the mouse wheel
- `enablePan`: Allow panning with mouse drag

## Browser Compatibility

- The component uses standard WebGL APIs supported in all modern browsers
- Falls back gracefully in browsers without WebGL support
- Requires JavaScript to be enabled
