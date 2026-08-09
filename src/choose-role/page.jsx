
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Store, Languages } from "lucide-react";

export default function ChooseRolePage() {
  const router = useRouter();

  const [language, setLanguage] = useState("en");

  const isArabic = language === "ar";

  const content = {
    en: {
      title: "Welcome",
      subtitle: "Please choose how you want to continue",
      customer: "Customer",
      customerDesc: "Browse products and explore our store",
      owner: "Owner",
      ownerDesc: "Manage your products and store",
      language: "العربية",
    },
    ar: {
      title: "مرحباً",
      subtitle: "يرجى اختيار طريقة المتابعة",
      customer: "زبون",
      customerDesc: "تصفح المنتجات واستكشف متجرنا",
      owner: "صاحب المتجر",
      ownerDesc: "إدارة المنتجات والمتجر الخاص بك",
      language: "English",
    },
  };

  const t = content[language];

  const handleRole = (role) => {
    if (role === "customer") {
      router.push("/home");
    }

    if (role === "owner") {
      router.push("/admin/login");
    }
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f8f5f0] flex items-center justify-center px-6"
    >
      <div className="w-full max-w-4xl">

        {/* Language Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() =>
              setLanguage(language === "en" ? "ar" : "en")
            }
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       border border-[#d6c7b8]
                       bg-white text-[#5a4636]
                       hover:bg-[#f1e9df]
                       transition"
          >
            <Languages size={18} />
            {t.language}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4a3728] mb-4">
            {t.title}
          </h1>

          <p className="text-[#806d5d] text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Customer */}
          <button
            onClick={() => handleRole("customer")}
            className="group bg-white rounded-3xl p-8
                       border border-[#e4d9cd]
                       shadow-sm
                       hover:shadow-xl
                       hover:-translate-y-1
                       transition-all duration-300
                       text-center"
          >
            <div
              className="mx-auto mb-6 w-20 h-20 rounded-full
                         bg-[#f3eadf]
                         flex items-center justify-center
                         text-[#6b4f3a]
                         group-hover:bg-[#6b4f3a]
                         group-hover:text-white
                         transition"
            >
              <User size={38} />
            </div>

            <h2 className="text-2xl font-bold text-[#4a3728] mb-3">
              {t.customer}
            </h2>

            <p className="text-[#806d5d] leading-7">
              {t.customerDesc}
            </p>

            <div className="mt-6 text-[#6b4f3a] font-semibold">
              →
            </div>
          </button>

          {/* Owner */}
          <button
            onClick={() => handleRole("owner")}
            className="group bg-white rounded-3xl p-8
                       border border-[#e4d9cd]
                       shadow-sm
                       hover:shadow-xl
                       hover:-translate-y-1
                       transition-all duration-300
                       text-center"
          >
            <div
              className="mx-auto mb-6 w-20 h-20 rounded-full
                         bg-[#f3eadf]
                         flex items-center justify-center
                         text-[#6b4f3a]
                         group-hover:bg-[#6b4f3a]
                         group-hover:text-white
                         transition"
            >
              <Store size={38} />
            </div>

            <h2 className="text-2xl font-bold text-[#4a3728] mb-3">
              {t.owner}
            </h2>

            <p className="text-[#806d5d] leading-7">
              {t.ownerDesc}
            </p>

            <div className="mt-6 text-[#6b4f3a] font-semibold">
              →
            </div>
          </button>

        </div>
      </div>
    </main>
  );
}

