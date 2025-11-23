import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadAPI } from "../services/uploadService";

const ImageUpload = ({ onImagesChange, maxImages = 5 }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    // Kiểm tra số lượng ảnh
    if (images.length + files.length > maxImages) {
      toast.warn(`Tối đa ${maxImages} ảnh được phép`);
      return;
    }

    // Kiểm tra kích thước file
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (let file of files) {
      if (file.size > maxSize) {
        toast.warn(`${file.name} vượt quá 5MB`);
        return;
      }
    }

    try {
      setUploading(true);

      // Tạo preview
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);

      // Tải lên ảnh
      const response = await uploadAPI.uploadImages(files);

      if (response.thành_công) {
        const uploadedImages = response.dữ_liệu.map((img) => ({
          url: img.url || img,
          filename: img.filename || "ảnh",
        }));

        const newImages = [...images, ...uploadedImages];
        setImages(newImages);
        onImagesChange(newImages.map((img) => img.url));
        toast.success(`Tải lên ${files.length} ảnh thành công`);
      } else {
        toast.error(response.tin_nhan || "Lỗi tải lên ảnh");
      }
    } catch (error) {
      toast.error("Lỗi khi tải lên ảnh");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages.map((img) => img.url));
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-bold mb-4">
        Hình ảnh ({images.length}/{maxImages})
      </label>

      {/* Upload Area */}
      <div className="mb-4">
        <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-blue-600 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 font-medium">
              {uploading ? "Đang tải lên..." : "Kéo thả hoặc nhấp để chọn ảnh"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF tối đa 5MB mỗi file
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative group">
              <img
                src={preview}
                alt={`Preview ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {idx + 1}/{maxImages}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
