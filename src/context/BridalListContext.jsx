import {
  createContext,
  useContext,
  useState,
} from "react";

const BridalListContext = createContext();

export function BridalListProvider({ children }) {

  const [list, setList] = useState(() => {
    try {
      const savedList =
        localStorage.getItem("bridalList");

      return savedList
        ? JSON.parse(savedList)
        : [];
    } catch (error) {
      console.error(
        "Could not load bridal list:",
        error
      );

      return [];
    }
  });


  function addToList(product) {

    const exists = list.some(
      (item) => item.id === product.id
    );

    if (exists) {
      return;
    }

    const updated = [
      ...list,
      product,
    ];

    setList(updated);

    localStorage.setItem(
      "bridalList",
      JSON.stringify(updated)
    );
  }


  function removeFromList(id) {

    const updated = list.filter(
      (item) => item.id !== id
    );

    setList(updated);

    localStorage.setItem(
      "bridalList",
      JSON.stringify(updated)
    );
  }


  return (
    <BridalListContext.Provider
      value={{
        list,
        addToList,
        removeFromList,
      }}
    >
      {children}
    </BridalListContext.Provider>
  );
}


export function useBridalList() {
  return useContext(BridalListContext);
}