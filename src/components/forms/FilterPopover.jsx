import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const FilterPopover = ({
  anchorRef,
  isOpen,
  title,
  options = [],
  selectedValues = [],
  onToggle,
  onClose,
  onReset,
  applyVisible = false,
  onApply,
}) => {
  const panelRef = useRef(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute left-0 right-0 top-[54px] z-[1000] bg-white rounded-md shadow-xl border border-gray-200"
    >
      <div className="p-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-8">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-[#618de6] text-sky-600 focus:ring-sky-500 "
                checked={selectedValues.includes(opt.value)}
                onChange={() => onToggle?.(opt.value)}
              />
              <span className="text-gray-800">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t bg-white rounded-b-md">
        <div className="flex items-center gap-3">
          {applyVisible ? (
            <button
              type="button"
              onClick={onApply}
              className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white rounded-md"
            >
              {t("filterForm__filterButton")}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md"
            >
              {t("close")}
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-sky-700 hover:text-sky-800"
          >
            {t("reset")}
          </button>
        </div>
        <div />
      </div>
    </div>
  );
};

export default FilterPopover;
