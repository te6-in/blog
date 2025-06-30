import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import { ChevronRight } from "lucide-react";
import { type PropsWithChildren, type ReactElement, useEffect, useState } from "react";

interface CollapsibleProps extends PropsWithChildren {
  classNames?: {
    root?: string;
    triggerRoot?: string;
    triggerContent?: string;
    triggerChevron?: string;
    triggerTitle?: string;
    panelContent?: string;
  };
  triggerTitle?: ReactElement;
  triggerIcon?: ReactElement;
  panelContent?: ReactElement;
  defaultOpen?: boolean;
}

export function Collapsible({
  classNames,
  triggerTitle,
  triggerIcon,
  panelContent,
  defaultOpen = false,
}: CollapsibleProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  if (!isHydrated) {
    return (
      <details className={[classNames?.root, "group"].filter(Boolean).join(" ")} open={defaultOpen}>
        <summary className={classNames?.triggerRoot}>
          <div className={classNames?.triggerContent}>
            {triggerIcon}
            <span className={classNames?.triggerTitle}>{triggerTitle}</span>
          </div>
          <ChevronRight
            size={18}
            className={[classNames?.triggerChevron, "group-open:rotate-90"]
              .filter(Boolean)
              .join(" ")}
          />
        </summary>
        <div className={classNames?.panelContent}>{panelContent}</div>
      </details>
    );
  }

  return (
    <BaseCollapsible.Root
      className={[classNames?.root, "group"].filter(Boolean).join(" ")}
      defaultOpen={defaultOpen}
    >
      <BaseCollapsible.Trigger className={classNames?.triggerRoot}>
        <div className={classNames?.triggerContent}>
          {triggerIcon}
          <span className={classNames?.triggerTitle}>{triggerTitle}</span>
        </div>
        <ChevronRight
          size={18}
          className={[classNames?.triggerChevron, "group-data-open:rotate-90"]
            .filter(Boolean)
            .join(" ")}
        />
      </BaseCollapsible.Trigger>
      <BaseCollapsible.Panel
        hiddenUntilFound
        className="h-(--collapsible-panel-height) transition-[height,margin,padding] data-starting-style:h-0 data-ending-style:h-0 overflow-hidden flex flex-col justify-end"
      >
        <div className={classNames?.panelContent}>{panelContent}</div>
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
}
