import React, { useState } from "react";
import { createMBP } from "../../api/mbpApi";
import Modal from "./Modal";

interface AddMBPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}


const CATEGORIES = [
  "Office Supplies",
  "Edu Equipment",
  "Health & Safety",
  "Sport Equipment",
  "Other Categories",
];

const AddMBPModal: React.FC<AddMBPModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    overallQuantity: 0,
    minQuantity: 0,
    expiryDate: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.category ||
      formData.overallQuantity <= 0 ||
      formData.minQuantity <= 0
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createMBP(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to create MBP. Please try again.");
      console.error("Error creating MBP:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Quantity") ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New MBP"
      maxWidth="max-w-lg"
    >
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overall Quantity *
            </label>
            <input
              type="number"
              name="overallQuantity"
              value={formData.overallQuantity}
              onChange={handleChange}
              min="1"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Quantity *
            </label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              min="1"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create MBP"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMBPModal;
