/**
 * Shared UI Layer (FSD)
 *
 * Reusable UI components without business logic.
 * Examples: Button, Card, Input, Modal, Typography
 *
 * Rules:
 * - Can import from: shared/lib only
 * - Must be presentation-only (no business logic)
 */

// Badge
export { Badge, badgeVariants, type BadgeProps } from './badge';

// Button
export { Button, buttonVariants } from './button';

// Card
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './card';

// Input
export { Input } from './input';

// Dialog
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog';
