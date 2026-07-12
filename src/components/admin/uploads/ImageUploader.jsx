import { useRef, useState } from "react";
import Swal from "sweetalert2";

let uploadImage = null;

// Only import storage service if you enable it later
try {
  uploadImage = (await import("../../../services/storageService"))
    .uploadImage;
} catch {
  // Storage disabled
}

export default function ImageUploader({
  value = [],
  onChange,
  folder = "products",
  enableUpload = false,
}) {
  const inputRef = useRef();

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  async function upload(files) {
    if (!enableUpload) {
      return Swal.fire({
        icon: "info",
        title: "Firebase Storage Disabled",
        text: "Paste image URLs for now. You can enable uploads later.",
      });
    }

    if (!files.length) return;

    setUploading(true);

    try {
      const uploaded = [];

      for (const file of files) {
        const url = await uploadImage(file, folder);
        uploaded.push(url);
      }

      onChange([...value, ...uploaded]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err.message,
      });
    } finally {
      setUploading(false);
    }
  }

  function addUrl() {
    const url = imageUrl.trim();

    if (!url) return;

    if (!/^https?:\/\//i.test(url)) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid URL",
        text: "Please enter a valid image URL.",
      });
    }

    onChange([...value, url]);
    setImageUrl("");
  }

  function remove(index) {
    const images = [...value];
    images.splice(index, 1);
    onChange(images);
  }

  return (
    <div className="space-y-6">

      {/* Upload Area */}
      <div
        onClick={() =>
          enableUpload && inputRef.current.click()
        }
        className={`rounded-xl border-2 border-dashed p-8 text-center ${
          enableUpload
            ? "cursor-pointer hover:border-yellow-500"
            : "opacity-60 cursor-not-allowed"
        }`}
      >
        {enableUpload ? (
          uploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <p className="font-semibold">
                Click to upload images
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP
              </p>
            </>
          )
        ) : (
          <>
            <p className="font-semibold">
              Firebase Storage Disabled
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Use image URLs below.
            </p>
          </>
        )}
      </div>

      <input
        hidden
        multiple
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={(e) =>
          upload([...e.target.files])
        }
      />

      {/* Image URL */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-4 py-3"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) =>
            setImageUrl(e.target.value)
          }
        />

        <button
          type="button"
          onClick={addUrl}
          className="btn-gold px-5 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <div
              key={index}
              className="relative"
            >
              <img
                src={image}
                alt=""
                className="h-40 w-full rounded-lg object-cover border"
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-600 text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}