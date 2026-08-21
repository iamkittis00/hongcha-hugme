import { useState } from "react";

export default function ProductImage({ src, alt, placeholder, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`bg-hugme-image flex items-center justify-center text-content-muted text-xs font-medium ${className}`}>
        {placeholder}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
