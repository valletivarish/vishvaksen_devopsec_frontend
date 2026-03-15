/**
 * ConfirmDialog component.
 *
 * A modal overlay that asks the user to confirm a destructive action
 * (e.g. deleting a record).  Renders nothing when `isOpen` is false.
 *
 * Props:
 *   isOpen    - Whether the dialog is visible.
 *   title     - Heading text displayed at the top.
 *   message   - Body text explaining the consequences.
 *   onConfirm - Callback executed when the user clicks "Confirm".
 *   onCancel  - Callback executed when the user clicks "Cancel" or
 *               clicks the backdrop.
 */

const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    /* Semi-transparent backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      {/* Dialog card -- stop click propagation so clicking inside does not close */}
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
