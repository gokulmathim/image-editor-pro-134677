import React from "react";

const SIDEBAR_WIDTH = "w-80"; // 320px
const sidebarSectionCls = "mb-6";
const sectionTitleCls = "uppercase text-[12px] tracking-wider text-gray-400 mb-2 font-semibold";

function ToolButton({
  label,
  onClick,
  icon,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-2 py-2 px-5 w-full rounded-lg text-left hover:bg-[#f5f8ff] transition 
        border border-transparent font-medium ${disabled ? "opacity-40 pointer-events-none" : ""}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      tabIndex={0}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

interface EditorSidebarProps {
  onCrop: () => void;
  onResize: () => void;
  onRotate: () => void;
  onFilter: (filter: string) => void;
  onAdjustment: (type: "brightness" | "contrast", delta: number) => void;
  disableTools: boolean;
}

export default function EditorSidebar({
  onCrop,
  onResize,
  onRotate,
  onFilter,
  onAdjustment,
  disableTools,
}: EditorSidebarProps) {
  // Simple minimal icons (emojis for demo), for real app use SVGs
  return (
    <aside
      className={`bg-white/95 border-r ${SIDEBAR_WIDTH} min-h-0 flex-shrink-0 flex flex-col px-4 py-8 shadow-sm z-10`}
      style={{ minWidth: 256 }}
    >
      <div className="flex-grow">
        {/* Section: Edit Tools */}
        <div className={sidebarSectionCls}>
          <div className={sectionTitleCls}>Edit</div>
          <ToolButton
            label="Crop"
            onClick={() => onCrop && onCrop()}
            icon={<span>✂️</span>}
            disabled={disableTools}
          />
          <ToolButton
            label="Resize"
            onClick={() => onResize && onResize()}
            icon={<span>↔️</span>}
            disabled={disableTools}
          />
          <ToolButton
            label="Rotate"
            onClick={() => onRotate && onRotate()}
            icon={<span>🔄</span>}
            disabled={disableTools}
          />
        </div>
        {/* Section: Filters */}
        <div className={sidebarSectionCls}>
          <div className={sectionTitleCls}>Filters</div>
          {/* Example filter buttons; can be extended */}
          <ToolButton
            label="Grayscale"
            onClick={() => onFilter && onFilter("grayscale")}
            icon={<span>🖤</span>}
            disabled={disableTools}
          />
          <ToolButton
            label="Sepia"
            onClick={() => onFilter && onFilter("sepia")}
            icon={<span>🌅</span>}
            disabled={disableTools}
          />
        </div>
        {/* Section: Adjustments */}
        <div className={sidebarSectionCls}>
          <div className={sectionTitleCls}>Adjustments</div>
          <ToolButton
            label="Brightness +"
            onClick={() => onAdjustment && onAdjustment("brightness", 0.1)}
            icon={<span>🌞</span>}
            disabled={disableTools}
          />
          <ToolButton
            label="Brightness -"
            onClick={() => onAdjustment && onAdjustment("brightness", -0.1)}
            icon={<span>🌚</span>}
            disabled={disableTools}
          />
          <ToolButton
            label="Contrast +"
            onClick={() => onAdjustment && onAdjustment("contrast", 0.1)}
            icon={<span>🔆</span>}
            disabled={disableTools}
          />
          <ToolButton
            label="Contrast -"
            onClick={() => onAdjustment && onAdjustment("contrast", -0.1)}
            icon={<span>🔅</span>}
            disabled={disableTools}
          />
        </div>
      </div>
    </aside>
  );
}
