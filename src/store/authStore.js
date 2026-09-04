import { create } from 'zustand';

const STORAGE_KEY = 'numeria_auth_v1';

// Tách riêng khỏi gameStore (numeria_save_v1) vì đây là dữ liệu định danh
// thiết bị/tài khoản, không phải tiến độ chơi game.

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persist(state) {
  const toSave = {
    parentAccount: state.parentAccount,
    parentPin: state.parentPin,
    studentPin: state.studentPin,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    /* ignore quota errors for demo */
  }
}

const saved = loadAuth();

export const useAuthStore = create((set, get) => ({
  // Demo chưa có backend thật — tài khoản/mật khẩu chỉ lưu local (mock),
  // không có mã hoá/validate email thật. Đủ để chạy được luồng UI.
  parentAccount: saved?.parentAccount || null, // { emailOrPhone, password }
  parentPin: saved?.parentPin || null, // string 4 chữ số
  studentPin: saved?.studentPin || null, // string 4 chữ số

  signupParent(emailOrPhone, password) {
    set({ parentAccount: { emailOrPhone, password } });
    persist(get());
  },

  setParentPin(pin) {
    set({ parentPin: pin });
    persist(get());
  },

  setStudentPin(pin) {
    set({ studentPin: pin });
    persist(get());
  },

  verifyParentPin(pin) {
    return get().parentPin === pin;
  },

  // Quên Parent PIN: không có "cấp trên" nào khác xác nhận hộ (khác Student
  // PIN reset dùng Parent PIN) — xác thực lại bằng chính email/mật khẩu đã
  // đăng ký trước khi cho đặt PIN mới.
  verifyParentAccount(emailOrPhone, password) {
    const acc = get().parentAccount;
    return Boolean(acc && acc.emailOrPhone === emailOrPhone.trim() && acc.password === password);
  },

  verifyStudentPin(pin) {
    return get().studentPin === pin;
  },
}));

// DEVICE_STATE = READY khi đã có đủ tài khoản + 2 mã PIN (spec mục 3.1).
export function selectDeviceReady(s) {
  return Boolean(s.parentAccount && s.parentPin && s.studentPin);
}
