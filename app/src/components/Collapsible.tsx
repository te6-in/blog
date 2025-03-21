import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import { ChevronRight } from "lucide-react";

export function Collapsible() {
  return (
    <BaseCollapsible.Root className="flex flex-col w-full">
      <BaseCollapsible.Trigger className="flex items-center justify-between gap-1 rounded-lg hover:bg-neutral-200 group -m-2 p-2 transition-colors">
        <span>Recovery keys</span>
        <ChevronRight size={18} className="transition-transform group-data-panel-open:rotate-90" />
      </BaseCollapsible.Trigger>
      <BaseCollapsible.Panel
        hiddenUntilFound
        className="h-(--collapsible-panel-height) transition-[height] data-starting-style:h-0 data-ending-style:h-0 overflow-hidden"
      >
        <div className="flex flex-col pt-4">
          <div>alien-bean-pasta</div>
          <div>wild-irish-burrito</div>
          <div>horse-battery-staple</div>
        </div>
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
}
