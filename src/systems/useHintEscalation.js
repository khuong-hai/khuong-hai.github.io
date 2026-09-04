import { useState, useCallback } from 'react';

// Trả về { wrongCount, hintLevel, registerWrong, reset }
// hintLevel: 0 = chưa cần hỗ trợ, 1 = hiện gợi ý chữ (Lumi), 2 = hỗ trợ trực quan (highlight đáp án đúng)
export function useHintEscalation() {
  const [wrongCount, setWrongCount] = useState(0);

  const registerWrong = useCallback(() => {
    setWrongCount((c) => c + 1);
  }, []);

  const reset = useCallback(() => setWrongCount(0), []);

  // Sai lần 1: chỉ thử lại, chưa gợi ý. Sai lần 2: gợi ý chữ. Sai lần 3+: hỗ trợ trực quan.
  const hintLevel = wrongCount >= 3 ? 2 : wrongCount >= 2 ? 1 : 0;

  return { wrongCount, hintLevel, registerWrong, reset };
}
