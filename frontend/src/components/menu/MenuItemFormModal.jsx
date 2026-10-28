import Modal from "../ui/Modal";
import MenuItemForm from "./MenuItemForm";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
} from "../../hooks/useMenuMutations";

export default function MenuItemFormModal({
  open,
  onClose,
  initial, // undefined → create mode
}) {
  const create = useCreateMenuItem();
  const update = useUpdateMenuItem();
  const isEditing = !!initial;
  const mutation = isEditing ? update : create;

  const handleSubmit = async (values) => {
    if (isEditing) {
      await update.mutateAsync({ id: initial._id, ...values });
    } else {
      await create.mutateAsync(values);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Menu Item" : "Add Menu Item"}
      size="lg"
    >
      <MenuItemForm
        initial={initial}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={mutation.isPending}
      />
    </Modal>
  );
}