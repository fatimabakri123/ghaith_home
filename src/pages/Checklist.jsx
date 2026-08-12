import { useLanguage } from "../context/LanguageContext";
import { useBridalList } from "../context/BridalListContext";

function Checklist() {
  const { language } = useLanguage();

  const {
    list,
    removeFromList,
  } = useBridalList();

  const total = list.reduce(
    (sum, product) =>
      sum + Number(product.price || 0),
    0
  );

  return (
    <main className="checklist-page">

      <div className="checklist-header">

        <h1>
          {language === "en"
            ? "My Bridal Checklist"
            : "قائمة تجهيز العروس"}
        </h1>

        <p>
          {language === "en"
            ? "Prepare your dream home step by step."
            : "جهزي بيت أحلامك خطوة بخطوة."}
        </p>

      </div>

      {list.length === 0 ? (

        <div className="empty-list">

          <h2>💍</h2>

          <p>
            {language === "en"
              ? "Your list is empty."
              : "قائمتك فارغة."}
          </p>

        </div>

      ) : (

        <>

          <div className="checklist-products">

            {list.map((product) => {

              const productName =
                language === "en"
                  ? product.name_en
                  : product.name_ar;

              return (
                <div
                  className="checklist-item"
                  key={product.id}
                >

                  <img
                    src={product.image_url}
                    alt={productName}
                  />

                  <div className="checklist-info">

                    <h3>
                      {productName}
                    </h3>

                    <p>
                      ${product.price}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeFromList(product.id)
                    }
                  >
                    ✕
                  </button>

                </div>
              );
            })}

          </div>

          <div className="checklist-summary">

            <h2>
              {language === "en"
                ? "Estimated Total"
                : "المجموع التقريبي"}
            </h2>

            <h1>
              ${total.toFixed(2)}
            </h1>

<button
  className="request-button"
  onClick={() => {
    const phoneNumber = "96171523197"; 

    const message =
      language === "en"
        ? `Hello! I would like to request the following bridal items:

${list
  .map(
    (product) => `🛍️ ${product.name_en}
💰 Price: $${product.price}
🖼️ Image: ${product.image_url}`
  )
  .join("\n\n")}

💵 Estimated Total: $${total.toFixed(2)}`
        : `مرحباً! أريد طلب المنتجات التالية:

${list
  .map(
    (product) => `🛍️ ${product.name_ar}
💰 السعر: $${product.price}
🖼️ الصورة: ${product.image_url}`
  )
  .join("\n\n")}

💵 المجموع التقريبي: $${total.toFixed(2)}`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }}
>
  {language === "en"
    ? "Send Request To Store"
    : "إرسال الطلب للمحل"}
</button>

          </div>

        </>

      )}

    </main>
  );
}

export default Checklist;