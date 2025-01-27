import { ArchiveMinus } from "iconsax-react";
import { LoaderCircle } from "lucide-react";

export interface BookmarkButtonProps {
  isBookmarked: boolean;
  handleBookmark: (e?: any) => void;
  loading: boolean;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  handleBookmark,
  loading,
}) => {
  const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
     e.stopPropagation(); // Prevent event from bubbling up to the parent link
     if (!loading) {
       handleBookmark(e);
     }
   };

  return (
    <span
      onClick={!loading ? handleClick : undefined}
      className={`inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border text-main-100 ${isBookmarked ? "border-[#3365E3]" : "border-[#7697ec84]"} active:scale-75 ${
        loading ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {loading ? (
        <LoaderCircle size={24} color="#3365E3" className="animate-spin" />
      ) : (
        <ArchiveMinus
          size={24}
          variant={isBookmarked ? "Bold" : "Outline"}
          color={isBookmarked ? "#3365E3" : "currentColor"}
        />
      )}
    </span>
  );
};
