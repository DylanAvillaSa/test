import { create } from "zustand";

export const useFormDataStore = create((set) => ({
  data: [],

  addData: (dataFromComp) =>
    set((state) => ({ data: [...state.data, dataFromComp] })),

  editData: (form_edit_data) =>
    set((state) => ({ data: [...state.data, form_edit_data] })),

  delData: (specificData) =>
    set((state) => ({ ...state.data, data: specificData })),
}));
