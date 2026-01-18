import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { type ReactElement, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export interface TooltipProps {
  trigger?: ReactElement;
  popup?: ReactElement;
}

export function Tooltip({ trigger, popup }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isMotionSafe = useMediaQuery("(prefers-reduced-motion: no-preference)");

  const { refs, floatingStyles, context } = useFloating({
    placement: "top",
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      inline(),
      offset({
        mainAxis: 8,
        crossAxis: -8,
      }),
      shift({ padding: 8 }),
      flip({ padding: 8 }),
    ],
  });

  const hover = useHover(context, {
    delay: { open: 200, close: 0 },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  const role = useRole(context, { role: "tooltip" });

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: {
      open: 250,
      close: 200,
    },
    initial: {
      boxShadow: "none",
      opacity: 0,
      ...(isMotionSafe && { transform: "scale(0.95)" }),
    },
    open: ({ side }) => ({
      boxShadow: {
        top: "0 -8px 25px -5px rgb(0 0 0 / 0.15), 0 -2px 10px -6px rgb(0 0 0 / 0.15)",
        bottom: "0 8px 25px -5px rgb(0 0 0 / 0.15), 0 2px 10px -6px rgb(0 0 0 / 0.15)",
        left: "-8px 0 25px -5px rgb(0 0 0 / 0.15), -2px 0 10px -6px rgb(0 0 0 / 0.15)",
        right: "8px 0 25px -5px rgb(0 0 0 / 0.15), 2px 0 10px -6px rgb(0 0 0 / 0.15)",
      }[side],
      opacity: 1,
      ...(isMotionSafe && { transform: "scale(1)" }),
    }),
    close: {
      boxShadow: "none",
      opacity: 0,
      ...(isMotionSafe && { transform: "scale(0.90)" }),
    },
    common: ({ side }) => ({
      transformOrigin: {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left",
      }[side],
    }),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </span>
      {isMounted && (
        <div
          {...getFloatingProps()}
          style={floatingStyles}
          className="pointer-events-none"
          ref={refs.setFloating}
        >
          <div
            style={styles}
            className="not-prose bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 w-64 rounded-xl transition-all"
          >
            {popup}
          </div>
        </div>
      )}
    </>
  );
}
