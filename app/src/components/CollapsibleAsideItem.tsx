import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import { ChevronRight } from "lucide-react";
import { type PropsWithChildren, type ReactElement, useEffect, useState } from "react";

const CLASSNAMES = {
  root: "flex flex-col -mx-2 group justify-start",
  triggerRoot:
    "flex items-center justify-between gap-1 rounded-lg p-2 engaged:bg-black/5 backdrop-blur-none engaged:backdrop-blur-sm transition-all z-10 cursor-pointer text-neutral-700 sticky top-2",
  triggerContent: "flex items-center gap-2",
  triggerChevron: "transition-transform flex-none",
  triggerTitle: "font-semibold",
};

interface CollapsibleAsideItemProps extends PropsWithChildren {
  triggerTitle?: ReactElement;
  triggerIcon?: ReactElement;
  panelContent?: ReactElement;
  defaultOpen?: boolean;
}

export function CollapsibleAsideItem({
  triggerTitle,
  triggerIcon,
  panelContent,
  defaultOpen = false,
}: CollapsibleAsideItemProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  if (!isHydrated) {
    return (
      <details className={CLASSNAMES.root} open={defaultOpen}>
        <summary className={CLASSNAMES.triggerRoot}>
          <div className={CLASSNAMES.triggerContent}>
            {triggerIcon}
            <span className={CLASSNAMES.triggerTitle}>{triggerTitle}</span>
          </div>
          <ChevronRight size={18} className={`${CLASSNAMES.triggerChevron} group-open:rotate-90`} />
        </summary>
        <PanelContent>{panelContent}</PanelContent>
      </details>
    );
  }

  return (
    <BaseCollapsible.Root className={CLASSNAMES.root} defaultOpen={defaultOpen}>
      <BaseCollapsible.Trigger className={CLASSNAMES.triggerRoot}>
        <div className={CLASSNAMES.triggerContent}>
          {triggerIcon}
          <span className={CLASSNAMES.triggerTitle}>{triggerTitle}</span>
        </div>
        <ChevronRight
          size={18}
          className={`${CLASSNAMES.triggerChevron} group-data-open:rotate-90`}
        />
      </BaseCollapsible.Trigger>
      <BaseCollapsible.Panel
        hiddenUntilFound
        className="h-(--collapsible-panel-height) transition-[height,margin,padding] data-starting-style:h-0 data-ending-style:h-0 overflow-hidden flex flex-col justify-end"
      >
        <PanelContent>{panelContent}</PanelContent>
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
}

function PanelContent({ children }: PropsWithChildren) {
  return (
    <div className="flex gap-3 mt-1">
      <div className="w-0.5 rounded-full bg-neutral-200 ms-4.5 flex-none" />
      <div className="flex flex-wrap gap-2 py-1.5">{children}</div>
    </div>
  );
}
