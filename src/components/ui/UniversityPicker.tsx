"use client";

import { useState } from "react";
import ComboboxSelect from "@/components/ui/ComboboxSelect";
import { universities } from "@/lib/data/universities";
import { departments } from "@/lib/data/departments";
import { degreeLevels } from "@/lib/data/degree-levels";

interface UniversityPickerProps {
  defaultDegree?: string;
  defaultSchoolZh?: string;
  defaultSchoolEn?: string;
  defaultDepartment?: string;
}

const universityOptions = universities.map((u) => ({
  value: u.nameZh,
  labelZh: u.nameZh,
  labelEn: u.nameEn,
}));

const departmentOptions = departments.map((d) => ({
  value: d.nameZh,
  labelZh: d.nameZh,
  labelEn: d.nameEn,
}));

export default function UniversityPicker({
  defaultDegree = "學士",
  defaultSchoolZh = "",
  defaultSchoolEn = "",
  defaultDepartment = "",
}: UniversityPickerProps) {
  const [schoolNameEn, setSchoolNameEn] = useState(defaultSchoolEn);

  function handleSchoolChange(value: string) {
    // Look up the en name from the university list
    const found = universities.find((u) => u.nameZh === value);
    setSchoolNameEn(found?.nameEn ?? "");
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 學歷層級 */}
      <div>
        <label className="block text-white/50 text-xs mb-1.5">
          學歷層級 <span className="text-red-400">*</span>
        </label>
        <select
          name="degree_level"
          defaultValue={defaultDegree}
          required
          className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-[#07070f] text-white text-sm focus:outline-none focus:border-purple-500/50"
        >
          {degreeLevels.map((d) => (
            <option key={d.value} value={d.value}>
              {d.labelZh} ({d.labelEn})
            </option>
          ))}
        </select>
      </div>

      {/* 學校 */}
      <div className="relative">
        <ComboboxSelect
          label="學校"
          name="school_name_zh"
          options={universityOptions}
          placeholder="搜尋或輸入學校名稱"
          allowFreeInput
          defaultValue={defaultSchoolZh}
          onValueChange={handleSchoolChange}
        />
        {/* hidden input for school_name_en */}
        <input type="hidden" name="school_name_en" value={schoolNameEn} />
      </div>

      {/* 系所 */}
      <ComboboxSelect
        label="系所"
        name="department"
        options={departmentOptions}
        placeholder="搜尋或輸入系所名稱"
        allowFreeInput
        defaultValue={defaultDepartment}
      />
    </div>
  );
}
