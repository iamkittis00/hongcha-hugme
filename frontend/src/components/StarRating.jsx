import { FiStar } from "react-icons/fi";

export default function StarRating({ rating = 0, size = 14, className = "" }) {
  const filled = Math.round(rating);

  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          size={size}
          className={i < filled ? "text-earth-gold" : "text-hugme-border"}
          fill={i < filled ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}
