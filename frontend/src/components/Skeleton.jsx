/**
 * กล่อง placeholder ระหว่างรอข้อมูลจาก API
 *
 * รูปทรงของแต่ละ skeleton จงใจให้ตรงกับของจริงที่จะมาแทนที่ (ขนาด ระยะห่าง จำนวนบรรทัด)
 * เพื่อไม่ให้หน้าเว็บกระตุกตอนข้อมูลมาถึง
 */

export function SkeletonBox({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} aria-hidden="true" />;
}

/** การ์ดสินค้าในหน้า Products และ Home */
export function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-xl border border-hugme-border p-4 flex flex-col justify-between shadow-xs">
      <div>
        <SkeletonBox className="w-full h-44 mb-3" />
        <SkeletonBox className="h-4 w-3/4 mb-2" />
        <SkeletonBox className="h-3 w-1/2 mb-3" />
        <div className="flex justify-between items-center mb-3">
          <SkeletonBox className="h-5 w-16" />
          <SkeletonBox className="h-3 w-20" />
        </div>
      </div>
      <SkeletonBox className="w-full h-9 rounded-lg" />
    </div>
  );
}

/** ตารางการ์ดสินค้า */
export function SkeletonProductGrid({ count = 6, className = "" }) {
  return (
    <div className={className} role="status" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

/** หน้ารายละเอียดสินค้า: แกลเลอรีซ้าย + ข้อมูลขวา */
export function SkeletonProductDetail() {
  return (
    <div role="status" aria-busy="true">
      <div className="flex items-center gap-2 mb-6">
        <SkeletonBox className="h-3 w-16" />
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-3 w-24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
        <div className="flex flex-col gap-4">
          <SkeletonBox className="w-full h-80 sm:h-96 rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <SkeletonBox key={i} className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SkeletonBox className="h-8 w-2/3" />
          <SkeletonBox className="h-4 w-1/2" />
          <SkeletonBox className="h-3 w-40" />
          <SkeletonBox className="h-9 w-32" />
          <div className="flex flex-col gap-2">
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-2/3" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonBox key={i} className="h-9 w-24" />
            ))}
          </div>
          <SkeletonBox className="h-10 w-32" />
          <div className="flex gap-3 mt-2">
            <SkeletonBox className="h-12 flex-1" />
            <SkeletonBox className="h-12 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** รายการรีวิว */
export function SkeletonReviewList({ count = 3 }) {
  return (
    <div className="flex flex-col gap-4" role="status" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white rounded-xl border border-hugme-border p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <SkeletonBox className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <SkeletonBox className="h-3.5 w-28" />
                <SkeletonBox className="h-2.5 w-20" />
              </div>
            </div>
            <SkeletonBox className="h-3 w-20" />
          </div>
          <SkeletonBox className="h-3 w-full" />
          <SkeletonBox className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}
