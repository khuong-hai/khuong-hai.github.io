import { useEffect, useRef, useState } from 'react';

// Ảnh nền phủ kín khung chứa, nhưng LUÔN đảm bảo vùng quan trọng — theo
// chiều dọc [minCriticalY, maxCriticalY] (logo/tiêu đề trên + nội dung cuối
// dưới) VÀ theo chiều ngang [minCriticalX, maxCriticalX] (nội dung ngoài
// cùng trái/phải, vd đảo/số ở rìa) — không bao giờ bị crop mất, dù màn hình
// rộng (PC ngang, dễ crop dọc) hay cao (điện thoại dọc, dễ crop ngang rất
// nặng — có màn chỉ còn thấy ~40% bề rộng ảnh nếu không chặn). Nếu cover
// chuẩn phải cắt sâu vào vùng cần giữ, tự động thu nhỏ ảnh bớt — chấp nhận
// hở nhẹ nền ở 2 cạnh còn lại thay vì mất nội dung.
export function useSmartCoverFit(imgAspect, criticalYRange = [0, 100], criticalXRange = [0, 100]) {
  const ref = useRef(null);
  const [containerAR, setContainerAR] = useState(imgAspect);

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') return;
    const el = ref.current;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setContainerAR(width / height);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [minCritY, maxCritY] = criticalYRange;
  const neededVisibleYPct = Math.min(100, Math.max(1, maxCritY - minCritY));
  const [minCritX, maxCritX] = criticalXRange;
  const neededVisibleXPct = Math.min(100, Math.max(1, maxCritX - minCritX));

  let fit;
  if (containerAR > imgAspect) {
    // Cover chuẩn (khớp theo chiều rộng) sẽ crop dọc.
    const coverVisiblePct = (imgAspect / containerAR) * 100;
    if (coverVisiblePct >= neededVisibleYPct) {
      const maxOffset = 100 - coverVisiblePct;
      const critMid = (minCritY + maxCritY) / 2;
      const offset = Math.min(maxOffset, Math.max(0, critMid - coverVisiblePct / 2));
      fit = {
        axis: 'y',
        offset,
        visiblePct: coverVisiblePct,
        imgStyle: {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `50% ${maxOffset > 0 ? (offset / maxOffset) * 100 : 50}%`,
        },
      };
    } else {
      // Không đủ — thu nhỏ ảnh để hiện đúng % cần, hở nền 2 bên.
      const visiblePct = neededVisibleYPct;
      const maxOffset = 100 - visiblePct;
      const critMid = (minCritY + maxCritY) / 2;
      const offset = Math.min(maxOffset, Math.max(0, critMid - visiblePct / 2));
      const heightPct = (100 / visiblePct) * 100;
      const widthPct = (heightPct * imgAspect) / containerAR;
      const topPct = -((offset / 100) * heightPct);
      fit = {
        axis: 'y',
        offset,
        visiblePct,
        imgStyle: {
          position: 'absolute',
          left: '50%',
          top: `${topPct}%`,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          maxWidth: 'none',
          transform: 'translateX(-50%)',
        },
      };
    }
  } else {
    // Khung cao hơn ảnh → cover fill theo chiều cao sẽ crop ngang — trên
    // điện thoại dọc mức crop này có thể RẤT nặng (chỉ còn ~40% bề rộng),
    // nên cũng cần cùng cơ chế bảo vệ như trục dọc ở nhánh trên.
    const coverVisiblePct = (containerAR / imgAspect) * 100;
    if (coverVisiblePct >= neededVisibleXPct) {
      const maxOffset = 100 - coverVisiblePct;
      const critMid = (minCritX + maxCritX) / 2;
      const offset = Math.min(maxOffset, Math.max(0, critMid - coverVisiblePct / 2));
      fit = {
        axis: 'x',
        offset,
        visiblePct: coverVisiblePct,
        imgStyle: {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${maxOffset > 0 ? (offset / maxOffset) * 100 : 50}% 50%`,
        },
      };
    } else {
      // Không đủ — thu nhỏ ảnh để hiện đúng % cần, hở nền trên/dưới.
      const visiblePct = neededVisibleXPct;
      const maxOffset = 100 - visiblePct;
      const critMid = (minCritX + maxCritX) / 2;
      const offset = Math.min(maxOffset, Math.max(0, critMid - visiblePct / 2));
      const widthPct = (100 / visiblePct) * 100;
      const heightPct = (widthPct * containerAR) / imgAspect;
      const leftPct = -((offset / 100) * widthPct);
      fit = {
        axis: 'x',
        offset,
        visiblePct,
        imgStyle: {
          position: 'absolute',
          top: '50%',
          left: `${leftPct}%`,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
          maxHeight: 'none',
          transform: 'translateY(-50%)',
        },
      };
    }
  }

  return { ref, fit };
}

// clampSafe = true: ép điểm luôn nằm trong vùng nhìn thấy — dùng cho hotspot
// BẮT BUỘC phải bấm được (không được mất khỏi màn hình khi bị crop). Vì giờ
// criticalXRange/criticalYRange đã giữ nội dung quan trọng luôn trong khung
// nhìn thấy, clamp ở đây gần như không còn phải "kẹp" lệch vị trí nữa (chỉ
// còn là lưới an toàn cho trường hợp cực đoan).
export function toSmartCoverPoint(x, y, fit, clampSafe) {
  let sx = x;
  let sy = y;
  if (fit.axis === 'y') {
    sy = ((y - fit.offset) / fit.visiblePct) * 100;
  } else {
    sx = ((x - fit.offset) / fit.visiblePct) * 100;
  }
  const offscreen = sx < -5 || sx > 105 || sy < -5 || sy > 105;
  if (clampSafe) {
    sx = Math.min(90, Math.max(10, sx));
    sy = Math.min(88, Math.max(12, sy));
  }
  return { x: sx, y: sy, offscreen };
}
