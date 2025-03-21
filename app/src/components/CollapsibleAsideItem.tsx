import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import { ChevronRight } from "lucide-react";
import type { PropsWithChildren, ReactElement } from "react";

interface CollapsibleAsideItemProps extends PropsWithChildren {
  title?: ReactElement;
  icon?: ReactElement;
  panel?: ReactElement;
}

export function CollapsibleAsideItem({ title, icon, panel }: CollapsibleAsideItemProps) {
  return (
    <BaseCollapsible.Root className="flex flex-col">
      <BaseCollapsible.Trigger className="flex items-center justify-between gap-1 rounded-lg engaged:bg-neutral-200 group -mx-2 p-2 transition-colors z-10 cursor-pointer text-neutral-700">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
        <ChevronRight size={18} className="transition-transform group-data-panel-open:rotate-90" />
      </BaseCollapsible.Trigger>
      <BaseCollapsible.Panel
        hiddenUntilFound
        className="h-(--collapsible-panel-height) transition-[height,margin,padding] data-starting-style:h-0 data-ending-style:h-0 overflow-hidden -mx-2"
      >
        <div className="flex flex-col gap-1 bg-red-300 p-2">{panel}</div>
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
}
