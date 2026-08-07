import {
  createContext,
  useContext,
  useState
} from "react";


const BridalListContext = createContext();


export function BridalListProvider({children}){


const [list,setList]=useState(
  JSON.parse(
    localStorage.getItem("bridalList")
  ) || []
);



function addToList(product){


const exists = list.find(
(item)=>item.id===product.id
);


if(!exists){

const updated=[
 ...list,
 product
];


setList(updated);


localStorage.setItem(
"bridalList",
JSON.stringify(updated)
);

}

}



function removeFromList(id){


const updated=list.filter(
(item)=>item.id!==id
);


setList(updated);


localStorage.setItem(
"bridalList",
JSON.stringify(updated)
);


}



return(

<BridalListContext.Provider

value={{
list,
addToList,
removeFromList
}}

>

{children}

</BridalListContext.Provider>


);


}



export function useBridalList(){

return useContext(BridalListContext);

}