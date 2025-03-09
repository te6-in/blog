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
import { type PropsWithChildren, type ReactElement, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export interface TooltipProps extends PropsWithChildren {
  trigger?: ReactElement;
}

export function Tooltip({ trigger, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isMotionSafe = useMediaQuery("(prefers-reduced-motion: no-preference)");

  const { refs, floatingStyles, context } = useFloating({
    placement: "top",
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      inline(),
      offset({ mainAxis: 8 }),
      shift({ padding: 8 }),
      flip({
        padding: {
          top: 72, // 64 + 8
          left: 8,
          right: 8,
          bottom: 8,
        },
      }),
    ],
  });

  const hover = useHover(context, {
    delay: { open: 250, close: 0 },
  });
  const focus = useFocus(context);

  const role = useRole(context, { role: "tooltip" });

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
      ...(isMotionSafe && { transform: "scale(0.95)" }),
    },
    close: {
      opacity: 0,
      ...(isMotionSafe && { transform: "scale(0.95)" }),
    },
    common: ({ side }) => ({
      transformOrigin: {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left",
      }[side],
      transitionProperty: "transform, opacity",
    }),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, role]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </span>
      {isMounted && (
        <div {...getFloatingProps()} style={floatingStyles} ref={refs.setFloating}>
          <div
            style={styles}
            className="not-prose bg-white border border-neutral-200 w-64 rounded-lg shadow-xl"
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}
