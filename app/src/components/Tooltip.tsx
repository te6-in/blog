import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
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
    delay: { open: 250, close: 0 },
  });
  const focus = useFocus(context);

  const role = useRole(context, { role: "tooltip" });

  const { isMounted, styles } = useTransitionStyles(context, {
    // 250 is the default
    // duration: 250,
    initial: {
      boxShadow: "none",
      opacity: 0,
      ...(isMotionSafe && { transform: "scale(0.9)" }),
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
      ...(isMotionSafe && { transform: "scale(0.9)" }),
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

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, role]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </span>
      {isMounted && (
        <div
          {...getFloatingProps()}
          style={floatingStyles}
          className="transition-transform pointer-events-none"
          ref={refs.setFloating}
        >
          <div
            style={styles}
            className="not-prose bg-white border border-neutral-200 w-64 rounded-lg transition-all"
          >
            {popup}
          </div>
        </div>
      )}
    </>
  );
}
