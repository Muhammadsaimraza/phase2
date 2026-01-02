/**
 * Framer Motion Animation Variants
 *
 * Centralized animation definitions for consistent motion throughout the app.
 * All animations respect prefers-reduced-motion via the useReducedMotion hook.
 */

import { Variants, Transition } from "framer-motion";

// ===================
// TRANSITION PRESETS
// ===================

export const transitions = {
  /** Quick transition for micro-interactions */
  fast: {
    duration: 0.15,
    ease: "easeOut",
  } as Transition,

  /** Standard transition for most animations */
  default: {
    duration: 0.2,
    ease: "easeOut",
  } as Transition,

  /** Smooth transition for larger movements */
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,

  /** Bouncy transition for playful interactions */
  bounce: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  } as Transition,

  /** Gentle spring for natural movement */
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  } as Transition,

  /** Slow transition for emphasis */
  slow: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,
};

// ===================
// PAGE TRANSITIONS
// ===================

/** Fade transition for page changes */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

/** Page transition config */
export const pageTransition = {
  duration: 0.3,
  ease: "easeOut",
};

/** Slide up transition for page changes */
export const pageSlideVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// ===================
// LIST ANIMATIONS
// ===================

/** Container for staggered list animations */
export const listVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/** Individual list item animation */
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: transitions.fast,
  },
};

/** Vertical list item animation */
export const listItemVerticalVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

// ===================
// COMPONENT ANIMATIONS
// ===================

/** Fade in/out animation */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

/** Scale animation for modals, popovers */
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

/** Slide up animation for toasts, bottom sheets */
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: transitions.fast,
  },
};

/** Slide down animation for dropdowns */
export const slideDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

/** Slide in from right for sidebars, drawers */
export const slideRightVariants: Variants = {
  hidden: {
    x: "100%",
  },
  visible: {
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    x: "100%",
    transition: transitions.default,
  },
};

/** Slide in from left */
export const slideLeftVariants: Variants = {
  hidden: {
    x: "-100%",
  },
  visible: {
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    x: "-100%",
    transition: transitions.default,
  },
};

// ===================
// BUTTON ANIMATIONS
// ===================

/** Button tap animation (legacy export) */
export const buttonTap = { scale: 0.97 };

/** Button hover animation (legacy export) */
export const buttonHover = { scale: 1.02 };

/** Button tap animation variants */
export const buttonTapVariants: Variants = {
  tap: {
    scale: 0.97,
  },
};

/** Button hover animation variants */
export const buttonHoverVariants: Variants = {
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
  },
};

/** Icon button animation */
export const iconButtonVariants: Variants = {
  hover: {
    scale: 1.1,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.9,
  },
};

// ===================
// CARD ANIMATIONS
// ===================

/** Card hover effect (legacy export) */
export const cardHover = {
  y: -2,
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  transition: { duration: 0.2 },
};

/** Card hover effect variants */
export const cardHoverVariants: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  },
  hover: {
    y: -2,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    transition: transitions.default,
  },
};

/** Card entrance animation */
export const cardEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smooth,
  },
};

// ===================
// MODAL ANIMATIONS
// ===================

/** Modal backdrop animation (legacy export) */
export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Modal content animation (legacy export) */
export const modalContentVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

/** Modal backdrop animation */
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      delay: 0.1,
    },
  },
};

/** Modal content animation */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.15,
    },
  },
};

// ===================
// CHECKBOX ANIMATIONS
// ===================

/** Checkbox check animation */
export const checkboxVariants: Variants = {
  unchecked: {
    scale: 1,
  },
  checked: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.3,
      times: [0, 0.5, 1],
    },
  },
};

/** Checkmark path animation */
export const checkmarkVariants: Variants = {
  unchecked: {
    pathLength: 0,
    opacity: 0,
  },
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 0.2,
        delay: 0.1,
      },
      opacity: {
        duration: 0.1,
      },
    },
  },
};

// ===================
// TOAST ANIMATIONS
// ===================

/** Toast entrance animation */
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: transitions.fast,
  },
};

// ===================
// ACCORDION ANIMATIONS
// ===================

/** Accordion content animation */
export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.1 },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
};

/** Accordion arrow rotation */
export const accordionArrowVariants: Variants = {
  collapsed: {
    rotate: 0,
  },
  expanded: {
    rotate: 180,
    transition: transitions.default,
  },
};

// ===================
// SKELETON ANIMATIONS
// ===================

/** Skeleton pulse animation */
export const skeletonVariants: Variants = {
  initial: {
    opacity: 0.5,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

// ===================
// TOOLTIP ANIMATIONS
// ===================

/** Tooltip animation */
export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// ===================
// POPOVER ANIMATIONS
// ===================

/** Popover animation */
export const popoverVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

// ===================
// UTILITY FUNCTIONS
// ===================

/**
 * Creates stagger children configuration
 */
export const staggerChildren = (
  stagger: number = 0.05,
  delayChildren: number = 0
) => ({
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

/**
 * Creates a delayed variant
 */
export const withDelay = (variants: Variants, delay: number): Variants => {
  const result: Variants = {};
  for (const key in variants) {
    const variant = variants[key];
    if (typeof variant === "object" && variant !== null) {
      result[key] = {
        ...variant,
        transition: {
          ...(typeof variant.transition === "object" ? variant.transition : {}),
          delay,
        },
      };
    } else {
      result[key] = variant;
    }
  }
  return result;
};

// ===================
// REDUCED MOTION VARIANTS
// ===================

/**
 * Variants that respect reduced motion preference
 * Use these when you want motion to be completely disabled for a11y
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
