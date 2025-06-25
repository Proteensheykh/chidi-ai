# CHIDI Design System - Style Guide

## Color Palette

### Primary Colors
**Primary White** - #FFFFFF (Clean backgrounds and content surfaces)
**Primary Deep Blue** - #1A2332 (Primary brand color for buttons, navigation, and emphasis)

### Secondary Colors
**Secondary Blue Light** - #4A90A4 (Hover states and secondary interactive elements)
**Secondary Blue Pale** - #E8F4F8 (Backgrounds, selected states, and highlights)

### Accent Colors
**Accent Teal** - #00B4A6 (Success actions, confirmations, and positive feedback)
**Accent Purple** - #6366F1 (Important actions, notifications, and CTA elements)

### Functional Colors
**Success Green** - #10B981 (Success states, completed tasks, and positive indicators)
**Error Red** - #EF4444 (Errors, warnings, and destructive actions)
**Warning Orange** - #F59E0B (Alerts, pending states, and attention-required items)
**Neutral Gray** - #6B7280 (Secondary text, placeholders, and disabled states)
**Dark Gray** - #1F2937 (Primary text and high-contrast elements)

### Background Colors
**Background Pure White** - #FFFFFF (Cards, modals, and content containers)
**Background Light** - #F9FAFB (App background and subtle section separators)
**Background Dark** - #111827 (Dark mode primary background)
**Background Card** - #F8FAFC (Elevated content areas and form backgrounds)

## Typography

### Font Family
**Primary Font:** Inter (Web primary)
**Alternative Font:** SF Pro Text (iOS) / Roboto (Android fallback)

### Font Weights
**Regular:** 400
**Medium:** 500
**Semibold:** 600
**Bold:** 700
**Extrabold:** 800

### Text Styles

#### Headings
**H1:** 32px/40px, Bold, Letter spacing -0.3px
*Used for main page titles and primary headings*

**H2:** 28px/36px, Bold, Letter spacing -0.2px
*Used for section headers and dashboard titles*

**H3:** 24px/32px, Semibold, Letter spacing -0.1px
*Used for card titles and subsection headers*

**H4:** 20px/28px, Semibold, Letter spacing 0px
*Used for component headers and important labels*

#### Body Text
**Body Large:** 18px/28px, Regular, Letter spacing 0px
*Primary reading text for conversation content and descriptions*

**Body:** 16px/24px, Regular, Letter spacing 0px
*Standard text for most UI elements and general content*

**Body Small:** 14px/20px, Regular, Letter spacing 0.1px
*Secondary information, metadata, and supporting text*

#### Special Text
**Caption:** 12px/16px, Medium, Letter spacing 0.3px
*Timestamps, labels, and micro-copy*

**Button Text:** 16px/24px, Medium, Letter spacing 0.2px
*All button and interactive element text*

**Link Text:** 16px/24px, Medium, Letter spacing 0px, Accent Purple
*Clickable text and navigation elements*

## Component Styling

### Buttons

#### Primary Button
- **Background:** Primary Deep Blue (#1A2332)
- **Text:** White (#FFFFFF)
- **Height:** 48dp
- **Corner Radius:** 8dp
- **Padding:** 20dp horizontal, 12dp vertical
- **Hover State:** Background darkens to #0F1419

#### Secondary Button
- **Border:** 2dp Primary Deep Blue (#1A2332)
- **Text:** Primary Deep Blue (#1A2332)
- **Background:** Transparent
- **Height:** 48dp
- **Corner Radius:** 8dp
- **Padding:** 20dp horizontal, 12dp vertical
- **Hover State:** Background Secondary Blue Pale (#E8F4F8)

#### Accent Button
- **Background:** Accent Purple (#6366F1)
- **Text:** White (#FFFFFF)
- **Height:** 48dp
- **Corner Radius:** 8dp
- **Padding:** 20dp horizontal, 12dp vertical
- **Hover State:** Background darkens to #4F46E5

#### Text Button
- **Text:** Accent Purple (#6366F1)
- **Background:** None
- **Height:** 40dp
- **Padding:** 12dp horizontal
- **Hover State:** Background Secondary Blue Pale (#E8F4F8)

### Cards

#### Standard Card
- **Background:** White (#FFFFFF)
- **Shadow:** Y-offset 4dp, Blur 12dp, Opacity 6%
- **Corner Radius:** 12dp
- **Padding:** 20dp
- **Border:** 1dp solid #F1F5F9

#### Elevated Card
- **Background:** White (#FFFFFF)
- **Shadow:** Y-offset 8dp, Blur 24dp, Opacity 8%
- **Corner Radius:** 16dp
- **Padding:** 24dp
- **Border:** None

#### Conversation Card
- **Background:** Background Card (#F8FAFC)
- **Corner Radius:** 16dp
- **Padding:** 16dp
- **Border:** 1dp solid #E2E8F0

### Input Fields

#### Standard Input
- **Height:** 56dp
- **Corner Radius:** 8dp
- **Border:** 1.5dp Neutral Gray (#6B7280)
- **Active Border:** 2dp Accent Purple (#6366F1)
- **Background:** White (#FFFFFF)
- **Text:** Dark Gray (#1F2937)
- **Placeholder:** Neutral Gray (#6B7280)
- **Padding:** 16dp horizontal, 16dp vertical

#### Large Text Area
- **Min Height:** 120dp
- **Corner Radius:** 12dp
- **Border:** 1.5dp Neutral Gray (#6B7280)
- **Active Border:** 2dp Accent Purple (#6366F1)
- **Background:** White (#FFFFFF)
- **Padding:** 16dp

#### Search Input
- **Height:** 48dp
- **Corner Radius:** 24dp
- **Border:** 1dp #E2E8F0
- **Background:** Background Light (#F9FAFB)
- **Icon:** Leading search icon in Neutral Gray

### Icons

#### Size Standards
- **Micro Icons:** 16dp x 16dp (inline text icons)
- **Small Icons:** 20dp x 20dp (form elements, secondary actions)
- **Standard Icons:** 24dp x 24dp (primary interface icons)
- **Large Icons:** 32dp x 32dp (feature icons, status indicators)
- **Hero Icons:** 48dp x 48dp (onboarding, empty states)

#### Color Usage
- **Primary Interactive:** Primary Deep Blue (#1A2332)
- **Secondary/Inactive:** Neutral Gray (#6B7280)
- **Success States:** Success Green (#10B981)
- **Warning States:** Warning Orange (#F59E0B)
- **Error States:** Error Red (#EF4444)

## Spacing System

### Base Unit: 4dp

- **2dp** - Micro spacing (icon-to-text, tight element relationships)
- **4dp** - Minimal spacing (form field internal padding)
- **8dp** - Small spacing (related element groups)
- **12dp** - Default spacing (paragraph spacing, form field gaps)
- **16dp** - Medium spacing (component internal padding)
- **20dp** - Standard spacing (card padding, section spacing)
- **24dp** - Large spacing (major component separation)
- **32dp** - Extra large spacing (section dividers)
- **48dp** - Maximum spacing (page margins, major layout sections)

## Motion & Animation

### Transition Timing
- **Micro-interactions:** 150ms, Ease-out
- **Standard Transitions:** 250ms, Ease-in-out
- **Component Animations:** 300ms, Custom cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Page Transitions:** 400ms, Custom cubic-bezier(0.2, 0.8, 0.2, 1)
- **Loading States:** 600ms, Linear infinite

### Animation Patterns
- **Button Hover:** Scale 1.02, 150ms ease-out
- **Card Hover:** Translate Y -2dp, Shadow intensity +20%, 200ms ease-out
- **Modal Entry:** Scale from 0.95 to 1.0, Opacity 0 to 1, 300ms ease-out
- **Notification Slide:** Translate X from 100% to 0%, 350ms ease-out

## Conversational UI Elements

### Chat Bubbles
#### User Message
- **Background:** Accent Purple (#6366F1)
- **Text:** White (#FFFFFF)
- **Corner Radius:** 18dp 18dp 4dp 18dp
- **Padding:** 12dp 16dp
- **Max Width:** 70% of container

#### AI Response
- **Background:** Background Card (#F8FAFC)
- **Text:** Dark Gray (#1F2937)
- **Border:** 1dp solid #E2E8F0
- **Corner Radius:** 18dp 18dp 18dp 4dp
- **Padding:** 12dp 16dp
- **Max Width:** 85% of container

#### System Message
- **Background:** Secondary Blue Pale (#E8F4F8)
- **Text:** Primary Deep Blue (#1A2332)
- **Corner Radius:** 8dp
- **Padding:** 8dp 12dp
- **Text Size:** Body Small (14px)
- **Alignment:** Center

## Dark Mode Variants

### Background Adaptation
- **Primary Background:** Background Dark (#111827)
- **Card Background:** #1F2937
- **Elevated Surface:** #374151

### Color Adjustments
- **Primary Blue:** Lightened to #3B82F6 for better contrast
- **Text Primary:** #F9FAFB
- **Text Secondary:** #D1D5DB
- **Border Colors:** #374151
- **Input Backgrounds:** #1F2937

### Component Adaptations
- **Cards:** Darker backgrounds with subtle borders
- **Buttons:** Adjusted contrast ratios for accessibility
- **Inputs:** Dark backgrounds with light borders
- **Shadows:** Reduced opacity, shifted to highlights instead

## Accessibility Standards

### Contrast Ratios
- **Normal Text:** Minimum 4.5:1
- **Large Text:** Minimum 3:1
- **Interactive Elements:** Minimum 4.5:1
- **Focus Indicators:** Minimum 3:1

### Focus Management
- **Focus Ring:** 2dp solid Accent Purple (#6366F1)
- **Focus Ring Offset:** 2dp
- **Keyboard Navigation:** Logical tab order maintained
- **Skip Links:** Available for screen readers

### Touch Targets
- **Minimum Size:** 44dp x 44dp
- **Recommended Size:** 48dp x 48dp
- **Spacing:** Minimum 8dp between interactive elements